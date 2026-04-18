# AI RepOptimizer: Perception Intelligence Engine

The first production-grade, high-performance intelligence engine optimizing Shopify stores for the Agentic Web.

## The Problem
E-commerce is shifting from traditional keyword search to Agentic AI Shopping. Users now ask LLMs (like ChatGPT, Perplexity, or Google Search) for highly specific product recommendations based on complex use-cases.

Most Shopify stores are invisible to these agents because their data is ambiguous, incomplete, or unstructured. AI RepOptimizer bridges the gap between merchant intent and AI perception.

---

## ⚡ Production-Grade Performance

This system has been upgraded for ultra-low latency and zero-failure reliability:

| Feature | Technology | Impact |
| :--- | :--- | :--- |
| **Super Audit Engine** | LLM Consolidation | **66% Latency Reduction**. Combines 3 stages into ONE single round-trip. |
| **Zero-Failure Pipeline** | Recursive Sanitization | Eliminates runtime crashes with recursive JSON flattening and schema defaults. |
| **Instant Diagnostic** | Rule-Based Scanner | Instant catalog sweep identifies low-hanging fruit before AI even starts. |
| **SSE Streaming** | Server-Sent Events | Real-time progressive UI updates showing product-by-product analysis. |
| **Hybrid Fallbacks** | Model Fallback Chain | Automatically switches to lighter models (Llama 8B) if main 70B models lag. |

---

## 🧠 Key Features

| Component | Description | Benefit |
| :--- | :--- | :--- |
| **Merchant Intent** | Extracts the deep category, target user, and use-case from raw data. | Establishes the "Source of Truth". |
| **Perception Simulation** | Simulates a strict AI Shopping Agent to see how it perceives your store. | Identifies semantic misinterpretations. |
| **Intelligence Gaps** | Multi-layered detection of missing attributes and confidence-drop reasons. | High-precision triage for data fixes. |
| **Neural Fixes** | Generates AI-optimized descriptions, structured tags, and FAQ suggestions. | Maximum alignment for LLM reasoning. |
| **Query Simulator** | Interactive sandbox to test how AI agents rank products for real-life queries. | Real-world validation of fixes. |

---

## 🛠️ Tech Stack

- **Backend**: Python / FastAPI (High-performance orchestration).
- **AI Inference**: Groq (Llama 3.3 70B & 8B) for 500ms+ inference speeds.
- **Frontend**: Next.js 14 / React (Glassmorphic, high-engagement dashboard).
- **Reliability**: Pydantic 2.x for strict but resilient data validation with recursive sanitization.
- **Data Fetch**: Shopify GraphQL Admin API.

---

## 🏗️ Intelligence Pipeline

1. **Shopify Ingestion**: Fetching live inventory, policies, and pages.
2. **Instant Scan**: Rule-based engine identifies high-severity gaps immediately.
3. **Super Audit**: Priority results sent to Llama 3 for consolidated Deep Intelligence.
4. **Sanitization**: Recursive processing cleans LLM noise, nested lists, and markdown.
5. **Streaming delivery**: Pushing updates to the UI via Server-Sent Events.
6. **Query Validation**: Verifying performance in the Live Simulation Sandbox.

---

## 🚀 Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Update GROQ_API_KEY, SHOPIFY_STORE_URL, and SHOPIFY_ADMIN_TOKEN in .env
python -m backend.main
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Update NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

---

## 📝 Developer Notes
- **Zero-Failure Policy**: The backend is designed with a defensive sanitization layer (`json_cleaner.py`) that prevents Pydantic validation crashes.
- **Concurrency**: The pipeline automatically adjusts concurrency based on catalog size to respect rate limits while maintaining maximum speed.
- **Caching**: Intelligent hash-based caching ensures repeat audits for the same products are instant.

---

## License
Distributed under the MIT License.
