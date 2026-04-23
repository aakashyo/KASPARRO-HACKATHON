from backend.utils.llm_client import LLMClient
from backend.utils.prompts import get_persona_query_prompt, PERSONAS
import json
import asyncio
from typing import List

class QuerySimulator:
    def __init__(self, client: LLMClient):
        self.client = client

    async def simulate(self, query: str, products: List[dict]):
        products_minimal = [
            {
                "id": p.get("id"),
                "title": p.get("title"),
                "description": p.get("original_data", {}).get("description", ""),
                "price": p.get("original_data", {}).get("price", "0.00"),
                "ai_perception": p.get("ai_perception", {}).get("summary", "")
            }
            for p in products
        ]
        
        products_json = json.dumps(products_minimal)
        
        async def run_persona(persona_key: str):
            prompts = get_persona_query_prompt(persona_key, query, products_json)
            try:
                res = await self.client.generate_json_response(prompts["system"], prompts["user"])
                res["persona"] = PERSONAS[persona_key]["name"]
                res["persona_key"] = persona_key
                return res
            except Exception as e:
                print(f"[QuerySimulator] {persona_key} failed: {e}")
                return {
                    "persona": PERSONAS[persona_key]["name"],
                    "persona_key": persona_key,
                    "ranked_results": [],
                    "rejected_products": []
                }

        # Run 3 personas concurrently
        tasks = [run_persona(key) for key in PERSONAS.keys()]
        results = await asyncio.gather(*tasks)
        
        # Merge results or return per persona
        return {"personas": results}
