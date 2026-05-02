# AI RepOptimizer

AI RepOptimizer is a Shopify-focused commerce intelligence tool built for the Anthropic Hackathon. It helps merchants understand how AI shopping systems interpret their product catalog, identify discoverability gaps, and generate safer, more structured improvements that make products easier for AI-driven commerce systems to recommend.

## What Problem It Solves

Traditional SEO is no longer enough for stores that want to appear in AI-assisted shopping flows. Product catalogs are often written for human browsing and keyword search, but not for reasoning-based systems that need clear intent, structured attributes, trust signals, and policy-aligned context.

AI RepOptimizer is designed to close that gap. It audits a Shopify catalog through the lens of AI perception, highlights weak or missing signals, and turns those findings into actionable recommendations that merchants can review before pushing back into their store.

## What the Product Does

- Connects to a Shopify store using store URL and admin token
- Fetches product, policy, and page data from the storefront
- Runs a deterministic quick scan for structural catalog gaps
- Runs a deeper AI audit for intent clarity, recommendation fitness, and discoverability issues
- Validates generated recommendations against policy-sensitive areas such as shipping, returns, warranties, and subscriptions
- Simulates how different AI shopper personas may rank products
- Presents findings in a dashboard with issues, fixes, and review-first actions
- Supports FAQ preview and push-back workflows for store improvements

## Core Features

| Feature | Description |
| --- | --- |
| Shopify catalog ingestion | Pulls live products, policies, and pages from a Shopify store |
| Deterministic quick scan | Detects missing descriptions, tags, use-case language, size data, trust signals, and more |
| Deep AI audit | Evaluates how an AI shopping assistant may interpret each product |
| Policy guardrails | Flags risky generated claims against actual store policy context |
| Multi-persona simulation | Tests products against budget, tech-spec, and gift-style shopper intent |
| Review-first workflow | Keeps merchants in control before anything is pushed back to Shopify |
| Demo mode | Allows full product walkthrough without requiring live store credentials |

## How It Works

1. The user connects a Shopify store or enters demo mode.
2. The backend validates credentials and fetches catalog, policy, and page data.
3. A deterministic scan finds structural catalog weaknesses quickly.
4. A deeper AI audit analyzes intent, perception, gaps, impact, and fix opportunities.
5. Generated fixes are checked against store policy context.
6. Results are streamed to the frontend dashboard for review.
7. The merchant reviews product issues, simulations, and suggested improvements.
8. Approved changes can be previewed and pushed back into Shopify.

## Architecture Overview

### Frontend

- Next.js 14 and React
- Landing page, login flow, marketing pages, and audit dashboard
- Review-first UI for issue inspection, fix approval, and simulation output

### Backend

- Python and FastAPI
- Shopify integration, catalog ingestion, quick scan pipeline, deep audit orchestration, scoring, guardrails, and push-back endpoints
- Server-Sent Events (SSE) for progressive analysis updates

### Intelligence Layer

- Deterministic rules for consistent structural checks
- LLM-based analysis for semantic reasoning and recommendation quality
- Hybrid architecture chosen to balance reliability, speed, and intelligence

## Technology Stack

- Frontend: Next.js, React, TypeScript
- Styling/UI: custom design system, motion-driven dashboard UI
- Backend: Python, FastAPI
- AI inference: Groq + Llama
- Validation: Pydantic
- Data source: Shopify Admin API
- Charts/visualization: Recharts
- Deployment: Render

## Repository Structure

```text
backend/                      FastAPI backend, analysis services, Shopify integration
frontend/                     Next.js frontend and dashboard
PRODUCT_DOCUMENT.md           Product-focused submission document
TECHNICAL_DOCUMENT.md         Technical architecture and engineering document
CONTRIBUTION_NOTE.md          Team contribution breakdown
DECISION_LOG.md               Key product and engineering tradeoffs
README.md                     Project overview and setup guide
render.yaml                   Deployment configuration
```

## Submission Documents

- [Product Document](./PRODUCT_DOCUMENT.md)
- [Technical Document](./TECHNICAL_DOCUMENT.md)
- [Contribution Note](./CONTRIBUTION_NOTE.md)
- [Decision Log](./DECISION_LOG.md)

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Groq API key
- A Shopify Admin API token with appropriate read/write scopes

### Backend Setup

1. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

2. Create environment configuration:

```bash
copy backend\.env.example backend\.env
```

3. Add the required values to `backend/.env`:

- `GROQ_API_KEY`
- `SHOPIFY_STORE_URL`
- `SHOPIFY_ADMIN_TOKEN`

4. Start the backend:

```bash
python -m backend.main
```

### Frontend Setup

1. Move into the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create frontend environment configuration if needed:

```bash
copy .env.local.example .env.local
```

4. Start the frontend:

```bash
npm run dev
```

5. Open the app at:

```text
http://localhost:3000
```

## Demo Flow

The recommended demo flow is:

1. Open the landing page
2. Use demo mode or connect a Shopify store
3. Run the audit
4. Review store readiness metrics and product severity states
5. Explore issue summaries and generated fixes
6. Use multi-persona query simulation
7. Preview FAQ or improvement outputs
8. Review push-back actions

## Product Walkthrough

The screenshot set below gives a quick visual walkthrough of the product experience:

- [Landing page](./docs/screenshots/Screenshot%202026-05-02%20195034.png)
- [Store connect / login flow](./docs/screenshots/Screenshot%202026-05-02%20195225.png)
- [Dashboard overview](./docs/screenshots/Screenshot%202026-05-02%20195238.png)
- [Product audit and issue review](./docs/screenshots/Screenshot%202026-05-02%20195255.png)
- [AI readiness metrics and analysis panels](./docs/screenshots/Screenshot%202026-05-02%20195330.png)
- [Fix recommendation flow](./docs/screenshots/Screenshot%202026-05-02%20195350.png)
- [Simulation / deeper dashboard state](./docs/screenshots/Screenshot%202026-05-02%20195710.png)
- [Final workflow state](./docs/screenshots/Screenshot%202026-05-02%20195736.png)

## Current Prototype Scope

This project is a working end-to-end prototype built under hackathon constraints. It intentionally favors a complete and reviewable workflow over production-hard infrastructure.

Current prototype shortcuts include:

- in-memory caching instead of a durable persistence layer
- broad CORS configuration for development convenience
- simplified credential and deployment flows
- Shopify-first platform scope rather than multi-platform support

## Why This Project Is Different

This is not a generic chatbot or a simple SEO rewrite tool. AI RepOptimizer is designed as a workflow product with:

- real Shopify ingestion
- deterministic catalog inspection
- deeper AI perception analysis
- policy-aware validation
- multi-persona query simulation
- review-first merchant control
- push-back capability into the storefront

## Early Signal

The repository saw 1,076 clones from 320 unique cloners in the first two weeks, providing an early signal of organic interest in the project and its problem framing.

## License

Distributed under the MIT License.
