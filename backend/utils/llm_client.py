import json
import os
import time
from groq import Groq
from typing import Dict, Any, Optional, List

# Optimized for Llama 3.3 and latest Groq models
MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-70b-8192",
    "llama3-8b-8192"
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
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=current_model,
                temperature=0.2,
                max_tokens=1000,
                response_format={"type": "json_object"}
            )
            
            content = completion.choices[0].message.content
            # Pre-clean known issues like code fences
            from backend.utils.json_cleaner import strip_code_fences
            content = strip_code_fences(content)
            return json.loads(content)
        except Exception as e:
            # Check for rate limit or specific decommission errors
            error_msg = str(e)
            print(f"[LLM Fallback] Model {current_model} failed: {error_msg}. Trying next...")
            
            # If it's a rate limit or decommissioning error, move to next model immediately
            return await self.generate_json_response(system_prompt, user_prompt, model_idx + 1)

import asyncio
async def safe_llm_call(coro, timeout=15):
    """Executes an LLM call with a strict timeout and fallback."""
    try:
        return await asyncio.wait_for(coro, timeout)
    except asyncio.TimeoutError:
        print("[LLM Timeout] Call exceeded 15s. Using fallback.")
        return {"fallback": True}
    except Exception as e:
        print(f"[LLM Error] {str(e)}")
        return {"fallback": True}

# Global instance for easy access
_client: Optional[LLMClient] = None

def get_llm_client(api_key: str) -> LLMClient:
    global _client
    if _client is None:
        _client = LLMClient(api_key)
    return _client
