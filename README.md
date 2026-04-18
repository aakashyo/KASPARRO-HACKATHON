# AI RepOptimizer: Perception Intelligence Engine

Welcome to **AI RepOptimizer**, the first production-grade, high-performance intelligence engine designed specifically to optimize Shopify stores for the **Agentic Web**.

---

## 🛑 The Core Problem: Why Your Store is Invisible to AI

E-commerce is undergoing a massive shift. Users are moving away from traditional keyword search bars and are instead adopting **Agentic AI Shopping**. Customers now ask Large Language Models (LLMs) like ChatGPT, Perplexity, or Google's AI Overviews for highly specific product recommendations based on complex use-cases (e.g., *"Find me a lightweight running shoe for flat feet under $100 that comes in blue"*).

**Standard SEO is no longer enough.** Most Shopify stores are completely invisible to these AI shopping agents because their product data is optimized for human eyes and traditional search algorithms. To an AI, the data often appears ambiguous, incomplete, or unstructured. If the AI cannot confidently parse a product's exact specifications, materials, and target audience, it will simply skip recommending it.

## 💡 The Solution: Bridging the Perception Gap

**AI RepOptimizer** bridges the gap between merchant intent and AI perception. It acts as an intelligence layer that reads your store's data exactly how an AI shopping agent would, identifies critical knowledge gaps, and automatically generates structured, optimized data that ensures maximum visibility in the AI era.

---

## ⚙️ How It Works (The Intelligence Pipeline)

The system runs a high-performance, multi-layered audit on your entire Shopify catalog in real-time:

1. **Shopify Data Ingestion**: The system continuously fetches live inventory, product descriptions, policies, and meta-data directly from your Shopify Admin via GraphQL.
2. **Instant Rule-Based Scan**: A high-speed, rule-based engine instantly sweeps the catalog to identify high-severity, low-hanging gaps (e.g., missing descriptions, unstructured tags) before the AI even activates.
3. **Super Audit Engine**: The core product data is sent to a consolidated LLM engine (powered by Llama 3). This single deep-audit round-trip acts as the "AI Perception Simulator," reading your product to determine how an LLM would interpret its features and potential use-cases.
4. **Resilient Sanitization**: The raw AI response undergoes rigorous, recursive JSON parsing. It actively cleans up markdown, nested lists, and LLM noise to ensure mathematically sound data payloads.
5. **Real-Time Streaming**: As each product is analyzed, the diagnostics and recommended fixes are pushed directly to your dashboard in real-time using Server-Sent Events (SSE).
6. **Live Query Simulation**: A built-in sandbox allows you to run hypothetical customer queries against your newly optimized data to prove that the AI will now recommend your product.

---

## 🎯 Key Features & Dashboard Overview

When you log into the AI RepOptimizer, you'll be greeted by an interactive dashboard that provides deep insights:

| Feature Area | What it Tells You | Why it Matters |
| :--- | :--- | :--- |
| **Merchant Intent vs. AI Perception** | Compares what the store *thinks* it is selling vs. what the *AI thinks* the store is selling. | Exposes semantic misinterpretations that kill product visibility. |
| **The AI Confidence Score** | A detailed score (0-100) reflecting how confidently an AI can recommend this product. | Gives you a tangible metric to track optimization progress. |
| **Intelligence Gaps & Triage** | Highlights exact missing attributes (e.g., "Missing Material Type," "Ambiguous Sizing"). | Tells you exactly what data you need to add to your Shopify backend. |
| **Actionable Neural Fixes** | Auto-generates AI-optimized product copy, structured tags, and FAQ suggestions. | Provides copy-and-paste solutions to immediately boost your AI score. |
| **The Query Simulator Sandbox** | An interactive chat interface to test how AI agents rank your store's products. | Validates that your fixes actually work in a real-world shopping scenario. |

---

## 🏗️ Under the Hood (Tech & Architecture)

The platform is built for **Ultra-Low Latency** and **Zero-Failure Reliability**.

- **Backend Integration**: Built with Python and FastAPI, handling concurrent data flow and AI orchestration.
- **AI Inference Engine**: Powered by Groq, utilizing massive open-source models (Llama 3.3 70B & 8B). Groq's dedicated LPU processors guarantee 500ms+ inference speeds per query, cutting traditional LLM wait times by 90%.
- **Frontend Dashboard**: Constructed with Next.js 14 and React. Features a visually stunning, premium glassmorphic UI with dynamic charting (Recharts) and real-time streaming capabilities.
- **Fail-Safe Validation Layer**: Empleys Pydantic 2.x for strict data schemas. If the LLM hallucinates an invalid JSON structure, the internal `json_cleaner.py` and hybrid fallback chains instantly intervene to rewrite the schema without failing the user request.
- **High-Concurrency Rate Limiting**: The backend automatically adjusts processing concurrency based on your catalog size to respect rate limits, while hash-based caching ensures repeat audits on unchanged products are absolutely instantaneous.

---

## 🚀 Step-by-Step Installation & Setup

Getting the project running locally takes less than 5 minutes. 

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Python** (version 3.10 or higher)
- **Node.js** (version 18 or higher)
- A highly capable IDE (e.g., VS Code)
- A free **Groq API Key** (Get one at [console.groq.com](https://console.groq.com))
- A **Shopify Custom App Admin Token** (Must have read access to products/inventory)

### 2. Backend Setup (The Engine)

Open your terminal, ensure you are in the root directory of the project, and run:

```bash
# 1. Install all backend Python dependencies
pip install -r backend/requirements.txt

# 2. Copy the environment template
cp backend/.env.example backend/.env
```

Open `backend/.env` in your editor and configure the variables:
- `GROQ_API_KEY`: Paste your primary Groq Token here.
- `GROQ_KEYS`: (Optional) Paste multiple comma-separated keys here if you want to enable automatic key rotation for massive catalogs.
- `SHOPIFY_STORE_URL`: Your store's URL (e.g., `your-store.myshopify.com`).
- `SHOPIFY_ADMIN_TOKEN`: Your Shopify Admin API access token (starts with `shpat_...`).

```bash
# 3. Start the Python FastApi Server
# IMPORTANT: Run this from the project root!
python -m backend.main
```
*The backend should now be listening on `http://localhost:8000`.*

### 3. Frontend Setup (The Dashboard)

Open a **new terminal tab**, navigate into the frontend folder, and run:

```bash
# 1. Move into the frontend directory
cd frontend

# 2. Copy the environment template
cp .env.local.example .env.local
```

Ensure the `.env.local` file contains `NEXT_PUBLIC_API_URL=http://localhost:8000`.

```bash
# 3. Install packages
npm install

# 4. Start the development server
npm run dev
```
*The frontend should now be running on `http://localhost:3000`. Open this in your browser to view the application!*

---

## ❓ FAQ & Troubleshooting

**Q: The dashboard says "Failed to fetch data". What happened?**
A: Ensure that both your frontend (`npm run dev`) and backend (`python -m backend.main`) servers are running simultaneously. Check the backend terminal for specific error logs—usually, this is caused by an invalid Groq API key or an expired Shopify Admin Token.

**Q: The audit takes a long time for a large store.**
A: The system automatically throttles its concurrency to prevent hitting the strict Rate Limits imposed by LLM providers. For incredibly large stores, the Deep AI audit will securely process items sequentially.

---

### License
Distributed under the MIT License.
