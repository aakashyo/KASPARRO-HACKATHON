import httpx
from typing import Dict, List, Any
import os

class ShopifyClient:
    def __init__(self, store_url: str, access_token: str):
        self.store_url = store_url.rstrip("/")
        self.access_token = access_token
        self.headers = {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json"
        }

    async def fetch_products(self) -> List[Dict[str, Any]]:
        query = """
        {
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
                description
                tags
                vendor
                variants(first: 1) {
                  edges {
                    node {
                      price
                    }
                  }
                }
              }
            }
          }
        }
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.store_url}/admin/api/2024-01/graphql.json",
                json={"query": query},
                headers=self.headers
            )
            data = response.json()
            if "errors" in data:
                raise Exception(f"Shopify GraphQL Error: {data['errors']}")
            
            products = []
            for edge in data["data"]["products"]["edges"]:
                node = edge["node"]
                products.append({
                    "id": node["id"],
                    "title": node["title"],
                    "handle": node["handle"],
                    "description": node["description"],
                    "tags": node["tags"],
                    "vendor": node["vendor"],
                    "price": node["variants"]["edges"][0]["node"]["price"] if node["variants"]["edges"] else "0.00"
                })
            return products

    async def fetch_pages(self) -> List[Dict[str, Any]]:
        query = """
        {
          pages(first: 10) {
            edges {
              node {
                id
                title
                body
                handle
              }
            }
          }
        }
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.store_url}/admin/api/2024-01/graphql.json",
                json={"query": query},
                headers=self.headers
            )
            data = response.json()
            if "errors" in data:
                return []
            
            pages = []
            for edge in data["data"]["pages"]["edges"]:
                node = edge["node"]
                pages.append({
                    "title": node["title"],
                    "content": node["body"]
                })
            return pages

    async def fetch_policies(self) -> List[Dict[str, Any]]:
        # REST API for policies
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.store_url}/admin/api/2024-01/policies.json",
                    headers=self.headers
                )
                data = response.json()
                return data.get("policies", [])
            except:
                return []
