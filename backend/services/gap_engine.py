from backend.utils.llm_client import LLMClient
from backend.utils.prompts import get_gap_prompt
import json

class GapEngine:
    def __init__(self, client: LLMClient):
        self.client = client

    async def analyze(self, intent: dict, perception: dict):
        prompts = get_gap_prompt(json.dumps(intent), json.dumps(perception))
        return await self.client.generate_json_response(prompts["system"], prompts["user"])
