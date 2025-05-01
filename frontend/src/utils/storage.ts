// This file contains functions to save and load chat history from local storage.
export const loadHistory = () => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("chatHistory");
    return data ? JSON.parse(data) : [];
  };
  
  export const saveHistory = (history: Array<{ role: string; content: string }[]>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("chatHistory", JSON.stringify(history));
  };
  
