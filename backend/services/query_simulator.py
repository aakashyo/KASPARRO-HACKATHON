from backend.utils.llm_client import LLMClient
from backend.utils.prompts import get_query_prompt
import json
from typing import List

class QuerySimulator:
    def __init__(self, client: LLMClient):
        self.client = client

    async def simulate(self, query: str, products: List[dict]):
        # Extract minimal product info for ranking to save tokens/complexity
        products_minimal = [
            {
                "id": p.get("id"),
                "title": p.get("title"),
                "description": p.get("original_data", {}).get("description", ""),
                "ai_perception": p.get("ai_perception", {}).get("summary", "")
            }
            for p in products
        ]
        
        prompts = get_query_prompt(query, json.dumps(products_minimal))
        return await self.client.generate_json_response(prompts["system"], prompts["user"])
