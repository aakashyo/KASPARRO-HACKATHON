import httpx
from typing import Dict, List, Any
import os

class ShopifyClient:
    def __init__(self, store_url: str, access_token: str):
        # Normalize URL
        url = store_url.strip().rstrip("/")
        if not url.startswith("http"):
            url = f"https://{url}"
        
        # Ensure .myshopify.com is present if it looks like a shopify subdomain
        if ".myshopify.com" not in url and "http" in url and "." not in url.split("//")[1]:
             url = f"{url}.myshopify.com"
             
        self.store_url = url
        self.access_token = access_token
        self.headers = {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json"
        }
        # Ignore host-level proxy settings for Shopify calls. This environment can
        # have a broken local proxy configured, which prevents direct HTTPS access.
        self.client_kwargs = {
            "timeout": 30.0,
            "trust_env": False,
        }

    async def _graphql(self, query: str, variables: Dict[str, Any] | None = None) -> Dict[str, Any]:
        async with httpx.AsyncClient(**self.client_kwargs) as client:
            response = await client.post(
                f"{self.store_url}/admin/api/2024-01/graphql.json",
                json={"query": query, "variables": variables or {}},
                headers=self.headers
            )
            response.raise_for_status()
            data = response.json()

        if "errors" in data:
            raise Exception(f"Shopify GraphQL Error: {data['errors']}")

        return data

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
        data = await self._graphql(query)
        
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
        try:
            data = await self._graphql(query)
        except Exception:
            return []
        
        pages = []
        for edge in data["data"]["pages"]["edges"]:
            node = edge["node"]
            pages.append({
                "id": node["id"],
                "title": node["title"],
                "handle": node["handle"],
                "content": node["body"]
            })
        return pages

    async def fetch_policies(self) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient(**self.client_kwargs) as client:
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
                "tags": tags
            }
        }
        data = await self._graphql(mutation, variables)
        user_errors = data.get("data", {}).get("productUpdate", {}).get("userErrors", [])
        if user_errors:
            raise Exception(f"Shopify userErrors: {user_errors}")
        return data.get("data", {}).get("productUpdate", {}).get("product", {})

    async def upsert_page(self, title: str, content_html: str, handle: str) -> Dict[str, Any]:
        existing_page = next((page for page in await self.fetch_pages() if page.get("handle") == handle), None)

        if existing_page:
            mutation = """
            mutation pageUpdate($id: ID!, $page: PageUpdateInput!) {
              pageUpdate(id: $id, page: $page) {
                page {
                  id
                  title
                  handle
                }
                userErrors {
                  field
                  message
                }
              }
            }
            """
            variables = {
                "id": existing_page["id"],
                "page": {
                    "title": title,
                    "body": content_html,
                    "handle": handle
                }
            }
            data = await self._graphql(mutation, variables)
            user_errors = data.get("data", {}).get("pageUpdate", {}).get("userErrors", [])
            if user_errors:
                return {"success": False, "error": user_errors}
            return {"success": True, "page": data["data"]["pageUpdate"]["page"], "mode": "updated"}

        mutation = """
        mutation pageCreate($page: PageCreateInput!) {
          pageCreate(page: $page) {
            page {
              id
              title
              handle
            }
            userErrors {
              field
              message
            }
          }
        }
        """
        variables = {
            "page": {
                "title": title,
                "body": content_html,
                "handle": handle
            }
        }
        data = await self._graphql(mutation, variables)
        user_errors = data.get("data", {}).get("pageCreate", {}).get("userErrors", [])
        if user_errors:
            return {"success": False, "error": user_errors}
        
        return {"success": True, "page": data["data"]["pageCreate"]["page"], "mode": "created"}
