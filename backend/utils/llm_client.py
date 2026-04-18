import json
import os
import asyncio
from itertools import cycle
from groq import Groq
from typing import Dict, Any, Optional, List

# Optimized for Llama 3.1 8B Instant
MODELS = {
    "default": "llama-3.1-8b-instant",
    "deep": "llama-3.1-8b-instant"
}

# Fetch multiple keys from environment
raw_keys = os.getenv("GROQ_KEYS", os.getenv("GROQ_API_KEY", ""))
GROQ_KEYS = [k.strip() for k in raw_keys.split(",") if k.strip()]
key_cycle = cycle(GROQ_KEYS) if GROQ_KEYS else None

def get_next_key():
    if not key_cycle:
        return None
    return next(key_cycle)

async def safe_llm_call(prompt_data: Dict[str, str], task_type="default") -> Dict[str, Any]:
    """
    High-performance LLM call wrapper with multi-key rotation and strict timeout.
    Returns structured fallback on failure.
    """
    system_prompt = prompt_data.get("system", "")
    user_prompt = prompt_data.get("user", "")
    
    for attempt in range(len(GROQ_KEYS) or 1):
        api_key = get_next_key()
        if not api_key:
            break
            
        try:
            client = Groq(api_key=api_key)
            model = MODELS.get(task_type, MODELS["default"])
            
            completion = await asyncio.wait_for(
                asyncio.to_thread(
                    client.chat.completions.create,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    model=model,
                    temperature=0.1, # Lower temp for better JSON consistency
                    max_tokens=600, # Optimized limit to balance structure completeness and reduced latency
                    response_format={"type": "json_object"}
                ),
                timeout=30 # Increased to 30s for consolidated 3-in-1 task
            )
            
            content = completion.choices[0].message.content
            from backend.utils.json_cleaner import strip_code_fences, safe_json_parse
            return safe_json_parse(strip_code_fences(content))
            
        except asyncio.TimeoutError:
            print(f"[LLM TIMEOUT] Key {api_key[:10]}... timed out after 30s.")
            continue
        except Exception as e:
            print(f"[LLM KEY ERROR] Key {api_key[:10]}... failed: {str(e)}")
            continue

    # Final Fallback
    print("[LLM FATAL] All keys failed or timed out.")
    return {"fallback": True}

class LLMClient:
    """Legacy wrapper for backward compatibility if needed."""
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def generate_json_response(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        return await safe_llm_call({"system": system_prompt, "user": user_prompt})

def get_llm_client(api_key: str) -> LLMClient:
    return LLMClient(api_key)
