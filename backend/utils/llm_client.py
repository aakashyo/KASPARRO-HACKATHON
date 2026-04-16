import json
import os
from groq import Groq
from typing import Dict, Any, Optional

class LLMClient:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"

    async def generate_json_response(self, system_prompt: str, user_prompt: str, retry: bool = True) -> Dict[str, Any]:
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=self.model,
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            
            content = completion.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            if retry:
                # One-time retry with a strict nudge
                return await self.generate_json_response(
                    system_prompt, 
                    user_prompt + "\n\nCRITICAL: Return ONLY valid JSON. No conversational filler.", 
                    retry=False
                )
            raise Exception(f"Failed to generate valid JSON from LLM: {str(e)}")

# Global instance for easy access
_client: Optional[LLMClient] = None

def get_llm_client(api_key: str) -> LLMClient:
    global _client
    if _client is None:
        _client = LLMClient(api_key)
    return _client
