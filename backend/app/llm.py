from openai import OpenAI
import os
from dotenv import load_dotenv
import logging

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
logger = logging.getLogger(__name__)

def get_llm_response(question: str) -> str:
    try:
        # Prepare the chat messages
        messages = [
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": question}
        ]

        # Request chat completion from gpt-4o-mini
        response = client.chat.completions.create(
            model="gpt-4o-mini",  #GPT-4 model
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )

        # Return the assistant's response
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Error in get_llm_response: {e}")
        raise Exception(f"Failed to get response from OpenAI: {e}")
