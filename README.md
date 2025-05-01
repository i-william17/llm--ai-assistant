# AI Assistant (OpenAI) Documentation>>>

This is a full-stack AI-powered assistant app using FastAPI and Next.js, connected to OpenAI's GPT models.

## Features
- Prompt submission and response
- Chat history stored in local storage
- Responsive UI using TailwindCSS
- LLM API integration

## Technologies
- Frontend: Next.js + TailwindCSS
- Backend: FastAPI
- LLM: OpenAI (gpt-4o-mini)

### ENVIRONMENT VARIABLES
OPENAI_API_KEY

//I have revoked this API Key you can test with another key. Good luck.

## Setup Instructions

### Frontend
cd frontend
npm install
npm run dev


### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload #Starting the server

### SAMPLE PROMPTS
API Endpoint

POST `/query`

**Request Body:**
```json
{
  "prompt": "Your prompt here"
}


request >>>>

{
  "prompt": "What is the capital of Kenya?"
}

then response >>>

{
  "detail": "The capital of Kenya is Nairobi. It is the largest city in the country and serves as its political, economic, and cultural hub. Nairobi is known as the 'Green City in the Sun' due to its mild climate and numerous parks and green spaces. It is also home to many international organizations, including the United Nations Office at Nairobi, and attractions like the Nairobi National Park, which lies just outside the city center."
}

### Enhancements You Can Add

- Add user authentication
- Store chat history in a database
- Use session-based memory (e.g., per-user chat context)
- Add Markdown rendering support