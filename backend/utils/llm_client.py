import json
import os
import time
from groq import Groq
from typing import Dict, Any, Optional, List

MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768"
]

class LLMClient:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)
        self.current_model_idx = 0

    async def generate_json_response(self, system_prompt: str, user_prompt: str, model_idx: int = 0) -> Dict[str, Any]:
        if model_idx >= len(MODELS):
            raise Exception("All LLM fallback models failed.")
            
        current_model = MODELS[model_idx]
        try:
            # We use synchronous call in Groq but we can wrap it if needed. 
            # For simplicity in this hackathon, we'll stick to the current pattern.
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=current_model,
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            
            content = completion.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"[LLM Fallback] Model {current_model} failed: {str(e)}. Trying next...")
            # Automatically try next model
            return await self.generate_json_response(system_prompt, user_prompt, model_idx + 1)

# Global instance for easy access
_client: Optional[LLMClient] = None

def get_llm_client(api_key: str) -> LLMClient:
    global _client
    if _client is None:
        _client = LLMClient(api_key)
    return _client
