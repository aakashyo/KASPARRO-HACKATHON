# AI RepOptimizer: Perception Intelligence Engine

The first real-time intelligence engine optimizing Shopify stores for the Agentic Web.

## The Problem
E-commerce is shifting from traditional keyword search to Agentic AI Shopping. Users now ask LLMs for highly specific product recommendations based on complex use-cases.

Most Shopify stores are invisible to these agents because their data is ambiguous, incomplete, or unstructured. AI RepOptimizer bridges the gap between merchant intent and AI perception.

---

## Key Features

| Feature | Description | Impact |
| :--- | :--- | :--- |
| Merchant Intent Extraction | Understands the deep context behind raw product titles and tags. | Establishes the Source of Truth. |
| AI Perception Simulation | Simulates a strict AI Shopping Agent to see how it perceives your store. | Identifies misinterpretations. |
| Intelligence Gap Engine | Detects missing attributes and semantic confusions in real-time. | Triage severity of data gaps. |
| Neural Fix Strategy | Generates optimized descriptions and structured tags tailored for LLMs. | Improves ranking in AI searches. |
| Query Simulator | An interactive sandbox to test how AI ranks products for natural queries. | Real-world validation of fixes. |

---

## Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| Backend | Python / FastAPI | High-performance orchestration & API. |
| AI Inference | Groq (Llama 3.3 70B) | Deep analysis and reasoning at speed. |
| Frontend | Next.js 14 / React | Professional, glassmorphic dashboard. |
| Styling | Tailwind CSS / Framer Motion | Premium UI animations and light mode. |
| Data Fetch | Shopify GraphQL Admin API | Real-time store data ingestion. |

---

## Intelligence Pipeline
1. Shopify Store Data
2. Intent Extractor
3. AI Simulation
4. Gap Analysis Engine
5. Impact Estimator
6. Neural Fix Generator
7. Optimized Storefront
8. Query Simulator Validation

---

## Installation and Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key
- Shopify Development Store + Admin API Token

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Create .env and add:
# GROQ_API_KEY=your_key
# SHOPIFY_STORE_URL=your_store
# SHOPIFY_ADMIN_TOKEN=your_token
python -m backend.main
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure
- backend/ (Intelligence Modules, LLM Client, Pydantic Models)
- frontend/ (Dashboard, Query Simulator, Product Cards)
- .gitignore (Excludes sensitive environment files)

## License
Distributed under the MIT License.
