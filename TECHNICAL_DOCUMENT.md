# Technical Document: AI RepOptimizer

**Perception Intelligence Engine for Shopify Catalogs**
*Hackathon Submission — Technical Documentation*

---

## System Overview

AI RepOptimizer is an end-to-end catalog intelligence system for Shopify merchants. It ingests live store data, analyzes product listings for structural and semantic weaknesses, generates policy-validated improvement recommendations, and provides a review-first interface for pushing approved changes back into the store.

The system is designed around a specific technical premise: improving AI-commerce readiness is not a copywriting problem that can be solved by prompting a language model with product descriptions. It requires a structured pipeline that separates deterministic catalog inspection from semantic reasoning, validates generated content against policy constraints, and supports controlled merchant action rather than autonomous publishing.

The result is a hybrid architecture combining a FastAPI backend, a Next.js frontend dashboard, and a multi-stage AI pipeline — built as a working prototype capable of demonstrating the full workflow end to end.

---

## Technical Objectives

- Ingest real Shopify store data including products, store policies, and page content
- Run consistent, fast structural analysis across entire product catalogs before any LLM call
- Perform deeper semantic analysis of product intent, recommendation fitness, and discoverability gaps using an LLM audit layer
- Validate AI-generated recommendations against the store's own policy context before surfacing them to the merchant
- Score and prioritize products to help merchants act on the highest-impact issues first
- Simulate how different AI shopper query patterns interact with catalog data
- Present results through a dashboard that supports review-first content improvement
- Enable selective or bulk push-back of approved fixes to Shopify

---

## Architecture Overview

The system uses a separated frontend and backend architecture with a clearly defined API boundary.

```
Shopify Store
     │
     ▼
[Backend: Python / FastAPI]
     │
     ├── Credential Validation
     ├── Catalog Ingestion (products, policies, pages)
     ├── Deterministic Quick Scan
     ├── LLM-Based Deep Audit (concurrent, limited parallelism)
     ├── Policy Guardrail Validation
     ├── Scoring and Prioritization
     ├── Query Simulation (multi-persona)
     ├── FAQ/Page Content Generation
     └── Push-Back to Shopify
          │
          ▼ (streamed responses + REST)
[Frontend: Next.js / React]
     │
     ├── Landing / Marketing pages
     ├── Store Login Flow
     ├── Audit Dashboard
     ├── Product Issue and Fix Review
     ├── Query Simulation Display
     ├── FAQ Preview
     └── Push Action Controls
```

The backend owns all integration, analysis, and AI logic. The frontend is responsible for presenting results and handling merchant review and action decisions. This boundary keeps the analysis pipeline independently testable and the UI cleanly decoupled from inference timing concerns.

---

## Component Breakdown

### Backend Services

| Module | Responsibility |
|---|---|
| `shopify_client.py` | Authenticates with Shopify and retrieves products, policies, and pages |
| `fast_scan.py` | Deterministic rule-based structural scan across all products |
| `analyzer.py` | Orchestrates product-level analysis combining quick scan and deep audit |
| `pipeline.py` | Manages full analysis run including concurrency control and progress streaming |
| `gap_engine.py` | Identifies and classifies catalog gaps based on scan and audit outputs |
| `intent_extractor.py` | Extracts or infers product intent signals to support semantic analysis |
| `ai_simulator.py` | Executes LLM-based perception analysis per product |
| `query_simulator.py` | Simulates ranked product outcomes for different AI shopper personas |
| `impact_estimator.py` | Estimates the relative discoverability impact of detected gaps |

### Backend Utilities

| Module | Responsibility |
|---|---|
| `llm_client.py` | Manages LLM API interactions, handles response extraction |
| `policy_guardrail.py` | Validates generated recommendations against store policy content |
| `prompts.py` | Centralized prompt definitions for audit and generation tasks |
| `json_cleaner.py` | Sanitizes and parses LLM JSON outputs safely |

### Frontend Routes

| Route | Purpose |
|---|---|
| `/` | Marketing landing page with store connect form and demo mode entry |
| `/login` | Secure store authentication and credential validation flow |
| `/dashboard` | Core audit experience: readiness scores, product issues, fixes, simulations |
| `/about`, `/platform`, `/pricing` | Supporting marketing and product pages |

Key frontend modules include `MarketingShell.tsx` for shared layout, `api.ts` for typed backend communication, `demoData.ts` for offline exploration, and `globals.css` for the visual system.

---

## Data Flow

The end-to-end data flow proceeds through the following stages:

**1. Credential Validation**
The merchant provides a Shopify store URL and admin API token. The backend calls `validate-credentials`, which attempts a Shopify product retrieval to confirm access. On success, it returns a sanitized store URL. On failure, the error is returned before any catalog fetch is attempted.

**2. Catalog Ingestion**
Once credentials are validated, the `/analyze` endpoint triggers the pipeline. The `shopify_client` module retrieves the full product catalog, store policy documents, and existing page content. All three data types are passed through the pipeline as context for downstream analysis.

**3. Deterministic Quick Scan**
Before any LLM call, `fast_scan.py` evaluates every product against a rule-based checklist. This pass is fast, consistent, and cheap. It checks for detectable structural gaps — weak descriptions, missing tags, absent material or ingredient data, unclear use-case language, missing size or dimension information, and absent trust indicators. It uses keyword and pattern matching to identify what is and is not present in the catalog data.

Outputs from the quick scan include a `quick_score`, a `severity` classification (`CRITICAL`, `WARNING`, or `OPTIMIZED`), a `basic_gap` summary, a list of `structural_gaps`, detected attribute presence, and a priority ranking. This output feeds directly into the deeper audit stage and also provides immediate value for fast triage before LLM processing completes.

**4. Deep AI Audit**
Products are then passed through the LLM-based audit layer managed by `ai_simulator.py`. The audit prompt evaluates each product across five structured dimensions: intent clarity, AI perception quality, identified gaps, likely discoverability impact, and concrete fix recommendations. Recommended fixes include improved descriptions, additional keywords, structured tag suggestions, and FAQ-style content prompts. Audits run concurrently across products with controlled parallelism to balance throughput and rate limit exposure.

**5. Policy Guardrail Validation**
Before any generated recommendation is surfaced to the frontend, it passes through `policy_guardrail.py`. This module compares the generated content against the store's fetched policy documents, checking for claims that conflict with stated return, shipping, warranty, or subscription policies. Outputs include an `is_safe` flag, a list of `flags`, checked claims, and the policy source used for validation. Recommendations that fail the guardrail are suppressed or marked for review rather than passed through silently.

**6. Scoring and Prioritization**
`gap_engine.py` and `impact_estimator.py` combine quick scan and deep audit results into product-level and store-level readiness scores. Products are ranked by severity and estimated impact to help merchants prioritize without reviewing every listing equally.

**7. Query Simulation**
`query_simulator.py` models how different AI shopper personas might rank catalog products. The current personas are budget-oriented, specification-oriented, and gift-oriented. Each simulation produces a ranked list of products and a set of rejected products, giving merchants a practical view of which listings are competitive under different query contexts.

**8. Dashboard Delivery and Push-Back**
Results are streamed back to the frontend progressively during analysis rather than delivered as a single batch response. The merchant reviews issues, improvements, and simulations through the dashboard, then selectively approves and pushes fixes back via `/push-fixes`, `/push-bulk`, `/preview-faq-page`, and `/push-faq-page` endpoints.

---

## Backend Design

The backend is built with **Python and FastAPI**. The main entrypoint is `backend/main.py`.

Key design decisions:

**Streaming responses over batch delivery.** The `/analyze` endpoint streams progress updates back to the frontend as products are processed. This avoids long waits on large catalogs and gives the merchant real-time feedback during analysis.

**Concurrency-limited LLM execution.** Deep audits run concurrently but with a controlled parallelism cap. This prevents uncontrolled API rate limit exposure while still significantly reducing total audit time on larger catalogs compared to fully sequential execution.

**Separation of deterministic and AI stages.** The quick scan is always executed before any LLM call. This means even if the AI layer fails or is slow, the structural scan output is already available and useful. It also makes the deterministic layer independently testable without any inference dependency.

**Policy context as first-class input.** Store policies and pages are fetched during ingestion and passed into the guardrail layer explicitly. The guardrail is not a generic safety filter — it reasons against the actual merchant's stated policies.

**In-memory caching.** The current implementation uses in-memory caching for analysis results within a session. This is an intentional hackathon-scale shortcut that allows re-querying results without re-fetching Shopify data during a single session.

---

## Frontend Design

The frontend is built with **Next.js 14 / React**. It is responsible for all user interaction, display logic, and push-back action triggers. It does not perform any analysis directly.

The visual system uses a multi-font typographic stack (DM Sans, Fraunces, JetBrains Mono, Manrope, Syne) and an ivory/white design language intended to communicate clarity and product-grade quality rather than generic AI SaaS aesthetics.

The dashboard presents:
- A store-level readiness score and radar-style dimensions covering Product Quality, Policy Clarity, FAQ Coverage, Trust Signals, and Structured Data
- Product cards with severity labels, issue summaries, before/after improvement previews, and tag/keyword recommendations
- Query simulation results showing ranked and rejected products per persona
- FAQ preview content and push controls

The demo mode (`demoData.ts`) provides a fully offline exploration path using representative sample products from a skincare catalog, allowing judges and prospects to experience the full dashboard without a live Shopify connection.

---

## AI and Inference Design

The AI layer is intentionally scoped to tasks where rule-based logic is insufficient:

- **Semantic product intent analysis** — determining whether a product description communicates clear use-case, target user, and benefit signals that an AI shopping agent could reason over
- **Perception gap identification** — identifying what a product listing implies versus what it fails to communicate
- **Natural language fix generation** — producing improved descriptions, keyword sets, and FAQ prompts grounded in catalog context
- **Query persona simulation** — reasoning about how different buyer intents would match against catalog data

The audit prompt is structured to return output across five defined dimensions (intent, perception, gaps, impact, fixes) in a consistent JSON schema. `json_cleaner.py` handles sanitization of LLM responses before parsing, which is necessary in practice due to inconsistent fence and whitespace behavior in raw completions.

The hybrid architecture — deterministic first, LLM second — is a deliberate tradeoff. Pure LLM pipelines are harder to make consistent, more expensive to run across large catalogs, and harder to debug. The deterministic layer provides a reliable, inspectable baseline. The LLM layer adds the semantic depth that rules cannot provide. Together they produce output that is both credible and nuanced.

---

## Guardrails and Validation

The policy guardrail layer is one of the more distinctive technical elements of the project. Most content generation tools either apply no guardrails or use generic safety filters that have no knowledge of the merchant's actual policies.

The implementation here fetches real policy documents from the Shopify store and passes them as context when validating generated recommendations. The guardrail checks for content that could conflict with stated return windows, shipping commitments, warranty terms, or subscription-related claims. Outputs are structured: a boolean `is_safe` flag, a list of specific flags, the claims checked, and the policy source.

This matters for the review-first workflow. Merchants are more likely to trust and act on recommendations when they can see that generated content has been checked against their own stated policies rather than against a generic ruleset.

---

## Key API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/validate-credentials` | POST | Validates Shopify URL and admin token |
| `/analyze` | POST | Runs full catalog analysis pipeline, streams results |
| `/query` | POST | Runs query simulation for specified personas |
| `/push-fixes` | POST | Pushes selected product-level fixes to Shopify |
| `/push-bulk` | POST | Pushes approved fixes across multiple products |
| `/preview-faq-page` | POST | Generates FAQ discovery page preview |
| `/push-faq-page` | POST | Pushes FAQ content page to Shopify |
| `/config` | GET | Returns current environment configuration |

All write-back endpoints require explicit merchant action. No endpoint autonomously modifies the Shopify store without a direct request from the frontend user session.

---

## Performance and Scalability Considerations

The current implementation is built for hackathon-scale demonstration on typical Shopify catalogs of tens to low hundreds of products. Key considerations at this scale:

- **Streaming** makes large catalog runs feel responsive regardless of total processing time
- **Concurrency limiting** on LLM calls prevents rate limit failures on larger catalogs without sacrificing all parallelism
- **Quick scan first** means structural results are visible to the merchant before deep audits complete, enabling partial early action
- **In-memory caching** reduces redundant Shopify API calls during a single session

For production-scale deployment, the following would be required but are explicitly out of scope for this prototype:
- Persistent data storage (database layer replacing in-memory cache)
- Job queue architecture for long-running catalog analyses (e.g., Celery, background task workers)
- Rate limit management across concurrent multi-tenant sessions
- CORS configuration hardened for production origins
- Secure credential storage and session management beyond prototype-grade token handling

---

## Limitations

These limitations are acknowledged as intentional scope decisions for a hackathon prototype rather than oversights:

- **In-memory only.** No durable persistence. Analysis results do not survive server restarts and cannot be retrieved across sessions without re-running the pipeline.
- **Broad CORS configuration.** The current implementation uses permissive CORS for development convenience. This is not suitable for production deployment.
- **Token handling.** Shopify admin tokens are passed through the request flow without the hardened credential management a production system would require.
- **AI scoring is directional.** Readiness scores and severity classifications reflect structured heuristics and LLM interpretation. They are useful signals for prioritization, not guaranteed representations of how any specific external AI system will rank products.
- **Output quality is catalog-dependent.** Thin, inaccurate, or inconsistently formatted source catalog data limits the quality of analysis and recommendations. The system can identify gaps but cannot fabricate accurate product attributes that do not exist.
- **Shopify-only.** Multi-platform catalog support (WooCommerce, BigCommerce, etc.) is not implemented.
- **Single-tenant architecture.** The current implementation does not include multi-store or agency-oriented session management.

---

## Future Improvements

Near-term engineering priorities for a production version:

- **Persistent data layer** — replace in-memory cache with a database-backed store to support session recovery, historical tracking, and multi-user access
- **Async job queue** — decouple catalog ingestion and analysis from synchronous request cycles to support larger catalogs reliably
- **Hardened credential and session management** — proper OAuth or token vault integration for Shopify credentials
- **Multi-store support** — tenant-scoped data isolation and agency-oriented dashboard views
- **Rollback support** — version-controlled push-back with the ability to revert pushed changes
- **Expanded platform connectors** — catalog ingestion adapters for WooCommerce, BigCommerce, and other platforms
- **Vertical schema packs** — category-specific attribute schemas for beauty, wellness, electronics, apparel, and home goods to improve quick scan precision in each vertical
- **Historical readiness tracking** — store catalog score over time as an ongoing merchant signal

Longer-term product-engineering work includes A/B experimentation on AI-facing product messaging and deeper benchmarking against external catalog performance signals.

---

## Conclusion

AI RepOptimizer is a purpose-built catalog intelligence pipeline, not a general-purpose AI tool. Its engineering is organized around a real merchant workflow: connect a store, run a structured analysis, review actionable recommendations, and push approved changes back. Each layer of the system — deterministic scan, LLM audit, policy guardrail, scoring, simulation, and push-back — has a defined responsibility and a clear rationale for existing separately rather than as part of an undifferentiated prompt chain.

The prototype demonstrates that AI-commerce readiness can be treated as an engineering problem with a structured solution. The current implementation is honest about its hackathon-scale constraints, but the architecture reflects how a production system would be designed — modular, staged, review-gated, and grounded in real store data rather than hypothetical inputs.
