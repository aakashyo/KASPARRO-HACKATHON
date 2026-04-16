from backend.utils.llm_client import LLMClient
from backend.utils.prompts import get_ai_simulator_prompt, get_fix_prompt
import json

class AISimulator:
    def __init__(self, client: LLMClient):
        self.client = client

    async def simulate_perception(self, product_data: dict):
        prompts = get_ai_simulator_prompt(
            product_data.get("title", ""),
            product_data.get("description", ""),
            ", ".join(product_data.get("tags", [])) if isinstance(product_data.get("tags"), list) else str(product_data.get("tags", ""))
        )
        return await self.client.generate_json_response(prompts["system"], prompts["user"])

    async def generate_optimized_fixes(self, product_data: dict, gap_analysis: dict):
        prompts = get_fix_prompt(
            product_data.get("title", ""),
            product_data.get("description", ""),
            json.dumps(gap_analysis)
        )
        return await self.client.generate_json_response(prompts["system"], prompts["user"])
