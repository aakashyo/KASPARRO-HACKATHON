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
          products(first: 250) {
            edges {
              node {
                id
                title
                handle
                description
                tags
                vendor
                featuredImage {
                  url
                }
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
                    "image": node["featuredImage"]["url"] if node.get("featuredImage") else None,
                    "price": node["variants"]["edges"][0]["node"]["price"] if node["variants"]["edges"] else "0.00"
                })
            return products

    async def fetch_pages(self) -> List[Dict[str, Any]]:
        query = """
        {
          pages(first: 250) {
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

    async def update_product(self, product_id: str, description: str, tags: List[str]) -> Dict[str, Any]:
        clean_id = product_id if product_id.startswith("gid://") else f"gid://shopify/Product/{product_id}"
        tags_str = ", ".join(tags)
        mutation = """
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              descriptionHtml
              tags
            }
            userErrors {
              field
              message
            }
          }
        }
        """
        variables = {
            "input": {
                "id": clean_id,
                "descriptionHtml": description,
                "tags": tags_str
            }
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.store_url}/admin/api/2024-01/graphql.json",
                json={"query": mutation, "variables": variables},
                headers=self.headers
            )
            data = response.json()
            if "errors" in data:
                raise Exception(f"Shopify mutation error: {data['errors']}")
            user_errors = data.get("data", {}).get("productUpdate", {}).get("userErrors", [])
            if user_errors:
                raise Exception(f"Shopify userErrors: {user_errors}")
            return data.get("data", {}).get("productUpdate", {}).get("product", {})
