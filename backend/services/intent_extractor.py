from backend.utils.llm_client import LLMClient
from backend.utils.prompts import get_intent_extraction_prompt
import json

class IntentExtractor:
    def __init__(self, client: LLMClient):
        self.client = client

    async def extract(self, product_data: dict):
        prompts = get_intent_extraction_prompt(
            product_data.get("title", ""),
            product_data.get("description", ""),
            ", ".join(product_data.get("tags", [])) if isinstance(product_data.get("tags"), list) else str(product_data.get("tags", ""))
        )
        return await self.client.generate_json_response(prompts["system"], prompts["user"])
