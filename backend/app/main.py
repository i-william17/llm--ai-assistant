from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .llm import get_llm_response

# Define a request model for the prompt
class PromptRequest(BaseModel):
    prompt: str

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware configuration to allow the frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this if you deploy to a different URL
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_credentials=True,
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "LLM Backend"}

@app.post("/query")
def query_llm(request: PromptRequest):
    try:
        # Call the LLM function to get a response
        answer = get_llm_response(request.prompt)
        return {"answer": answer}
    except Exception as e:
        # Log the error or handle specific exceptions as needed
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
