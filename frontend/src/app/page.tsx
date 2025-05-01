"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiSend, FiLoader, FiAlertCircle } from "react-icons/fi";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: string; content: string }>>([]);
  const [history, setHistory] = useState<Array<{ role: string; content: string }[]>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (err) {
        console.warn("Failed to parse chat history.");
      }
    }
  }, []);

  const saveHistory = (history: Array<{ role: string; content: string }[]>) => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  };

  const askLLM = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    const userMessage = { role: "user", content: trimmedPrompt };
    const updatedConversation = [...conversation, userMessage];

    setConversation(updatedConversation);
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/query", { prompt: trimmedPrompt });
      if (res.data?.answer) {
        const aiMessage = { role: "ai", content: res.data.answer };
        const newConversation = [...updatedConversation, aiMessage];
        setConversation(newConversation);
        const updatedHistory = [...history, newConversation];
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
      } else {
        const errorMessage = { role: "error", content: "No response from backend" };
        setConversation((prev) => [...prev, errorMessage]);
        setError("No response from backend.");
      }
    } catch (err) {
      const errorMessage = { role: "error", content: "Failed to get a response from the LLM." };
      setConversation((prev) => [...prev, errorMessage]);
      setError("Failed to get a response from the LLM.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askLLM();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSelectHistory = (index: number) => {
    setConversation(history[index]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 border-r p-4 overflow-y-auto shadow-md flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-indigo-700">Chat History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No previous conversations.</p>
        ) : (
          <ul className="space-y-2 mb-4 flex-1">
            {history.map((conv, idx) => (
              <li
                key={idx}
                className="text-sm p-2 bg-indigo-100 hover:bg-indigo-200 rounded cursor-pointer"
                onClick={() => handleSelectHistory(idx)}
              >
                {conv[0]?.content.slice(0, 30) || "Untitled"}
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-auto text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          onClick={() => {
            setHistory([]);
            setConversation([]);
            localStorage.removeItem("chatHistory");
          }}
        >
          Clear History
        </button>
      </div>


      {/* Chat Box */}
      <div className="flex-1 flex flex-col p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-full overflow-hidden flex flex-col flex-1">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="bg-white/20 p-2 rounded-full">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </span>
              AI Assistant
            </h1>
            <p className="text-indigo-100 mt-1">Ask me anything and I'll help</p>
          </div>

          {/* Conversation */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-4">
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="mt-4 text-lg">Start a conversation</p>
                <p className="text-sm">Type your question below</p>
              </div>
            ) : (
              conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : msg.role === "error"
                        ? "bg-red-100 text-red-800 rounded-bl-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <FiLoader className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 bg-gray-50">
            {error && (
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}
            <div className="relative">
              <textarea
                className="text-black w-full border rounded-xl p-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Type your message..."
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className={`absolute right-4 bottom-4 p-2 rounded-full ${loading || !prompt.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                  } transition-colors`}
                onClick={askLLM}
                disabled={loading || !prompt.trim()}
              >
                {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Press Shift+Enter for new line. Enter to send.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
