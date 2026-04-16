from backend.utils.llm_client import LLMClient
from backend.utils.prompts import get_impact_prompt
import json

class ImpactEstimator:
    def __init__(self, client: LLMClient):
        self.client = client

    async def estimate(self, gaps: dict):
        prompts = get_impact_prompt(json.dumps(gaps))
        return await self.client.generate_json_response(prompts["system"], prompts["user"])
