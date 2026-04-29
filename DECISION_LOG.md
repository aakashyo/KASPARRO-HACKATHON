# Decision Log

This log documents the key product and engineering decisions made during the build of AI RepOptimizer — the reasoning behind each choice, and the tradeoffs we accepted. Given the hackathon context, several decisions reflect practical constraints as much as ideal design.

### 1. Build on Shopify First

**Context:** The product needed a real commerce integration to be credible. A generic file-upload or paste-your-catalog approach would have made the demo feel hypothetical.

**Decision:** Connect directly to Shopify using a store URL and admin API token, fetching real products, policies, and pages.

**Why we chose it:** Shopify is the dominant platform for the D2C merchants this product targets. Building against a live store API made the workflow concrete and grounded in actual catalog data rather than sample inputs.

**Tradeoff:** The product is Shopify-specific for now. Multi-platform support would require additional ingestion adapters that were out of scope for this build.

**Outcome:** The Shopify integration works end to end — credential validation, catalog fetch, and push-back all operate against real store data, which meaningfully improves the realism of the demo.

### 2. Frame the Problem Around AI Discoverability, Not SEO

**Context:** The obvious positioning for a catalog improvement tool is SEO optimization. That framing already has well-known competitors and a familiar mental model.

**Decision:** Focus explicitly on AI shopping agent readiness — how reasoning models interpret product intent, suitability, and confidence — rather than keyword ranking.

**Why we chose it:** AI shopping systems need different catalog signals than traditional search. Structured attributes, use-case clarity, trust signals, and intent language matter more than keyword density. This framing is more accurate to the actual problem and more defensible as a product.

**Tradeoff:** AI discoverability is harder to explain and harder to validate than a familiar SEO score. Merchants may need more context to understand why it matters.

**Outcome:** The product has a clearer and more novel positioning. The demo materials lean into this framing consistently, which makes the differentiation legible to judges without requiring a side-by-side SEO comparison.

### 3. Use a Hybrid Architecture: Deterministic Scan + LLM Audit

**Context:** A pure LLM pipeline — feeding product descriptions into a prompt and asking for improvements — would have been faster to build but harder to make consistent or trustworthy at scale.

**Decision:** Run a deterministic rule-based quick scan before any LLM call, then pass structured gap findings into a deeper AI audit layer.

**Why we chose it:** The deterministic layer catches structural issues (missing tags, thin descriptions, absent size data) consistently and cheaply across the full catalog. The LLM layer adds semantic reasoning about intent clarity and recommendation fitness that rules alone cannot detect. The two layers complement rather than duplicate each other.

**Tradeoff:** More implementation complexity than a single prompt chain, with two failure modes to manage and two output formats to reconcile.

**Outcome:** The hybrid approach produces more reliable and interpretable results. Quick scan outputs are available immediately and feed the deeper audit, delivering partial value before LLM processing completes.

### 4. Add Policy-Aware Guardrails on Generated Recommendations

**Context:** LLMs generating product copy can produce confident-sounding claims that conflict with a merchant's stated return policy, shipping terms, or warranty commitments — a real trust and compliance risk in e-commerce.

**Decision:** Validate all generated recommendations against the store's fetched policy documents before surfacing them to the merchant, flagging content that implies unsupported claims around returns, shipping, warranties, or subscriptions.

**Why we chose it:** Checking against the merchant's actual policies — not a generic safety filter — is more precise and more useful. A recommendation engine that silently generates policy-conflicting copy is a liability, not a feature.

**Tradeoff:** Extra validation complexity and slightly narrower generation freedom, since some useful but policy-adjacent language gets flagged conservatively.

**Outcome:** The guardrail layer produces structured outputs (`is_safe`, `flags`, `policy_source`) that feed into the review UI. Merchants can see what was checked and why, which builds trust in the recommendations that pass through.

### 5. Build a Review-First Workflow Instead of Auto-Publishing

**Context:** The easiest version of a push-back feature would automatically apply all suggested improvements to the Shopify store — and also be the least safe and least credible version.

**Decision:** All fix suggestions go through a merchant review step. Pushing changes to Shopify requires explicit approval, either per product or as a bulk action the merchant initiates.

**Why we chose it:** Product content, brand voice, and policy sensitivity still require human judgment. An auto-publisher that silently rewrites store listings would undermine merchant trust and create brand risk. The review-first model is also more honest about what AI-generated improvements are: suggestions, not ground truth.

**Tradeoff:** Slower than full automation. Some merchants might prefer an auto-apply mode for lower-risk fields like tags or keywords.

**Outcome:** The dashboard supports selective fix approval and bulk push actions with a clear separation between analysis and action — making the product feel trustworthy rather than opaque.

### 6. Simulate Multiple AI Shopper Personas

**Context:** A single readiness score can obscure the fact that the same product may perform very differently depending on what a shopper is actually asking for.

**Decision:** Implement a query simulation layer that models how three distinct personas — budget-oriented, specification-oriented, and gift-oriented — would rank catalog products.

**Why we chose it:** Catalog quality is contextual, not absolute. A product with strong spec data might rank well for a techspec query but poorly as a gift recommendation. This makes the product's insight more nuanced and actionable than a composite score alone.

**Tradeoff:** Adds complexity to both the backend simulation logic and the frontend display. Three persona outputs are more to present and explain than one.

**Outcome:** The query simulation view is one of the more distinctive elements of the dashboard, giving merchants a concrete way to understand which products are competitive under different discovery contexts.

### 7. Include Demo Mode for Reliable Presentation

**Context:** Requiring live Shopify credentials would create friction for judges and introduce dependency on external API availability during the demo.

**Decision:** Build a fully functional demo mode using an expanded sample catalog — six products across skincare, fitness, footwear, home office, and food — that runs the complete workflow without a live store connection.

**Why we chose it:** Hackathon demos need to be reliable. A live API call that fails mid-presentation is a significant risk. Demo mode also lets anyone explore the full product experience without needing a Shopify account.

**Tradeoff:** Maintaining a parallel demo data path alongside the live workflow adds scope, and sample data has to be representative enough to make the demo feel realistic rather than toy-like.

**Outcome:** Demo mode works end to end and covers all major product flows. The expanded catalog makes the dashboard feel populated and the simulation results feel meaningful.

### 8. Treat Frontend Design as a Product Requirement

**Context:** A working backend with a rough frontend would demonstrate that the system functions, but not that the product is usable or trustworthy.

**Decision:** Invest in the landing page, login flow, and dashboard design as core parts of the product experience — including typography, layout, data visualization, motion, and before/after improvement presentation.

**Why we chose it:** The product's value depends on whether merchants can read and act on the insights it surfaces. A cluttered or generic UI makes recommendations feel less credible regardless of their quality. For a hackathon, the demo experience is the product.

**Tradeoff:** Time spent on UI polish is time not spent on additional backend features. Some engineering depth was traded for presentation quality.

**Outcome:** The dashboard communicates readiness scores, severity levels, and fix previews in a way that feels actionable rather than raw. The landing page frames the product clearly for judges evaluating it cold.

### 9. Accept Prototype-Scale Infrastructure Tradeoffs

**Context:** Building production-grade infrastructure — persistent storage, job queues, hardened auth, scoped CORS — would have consumed a significant share of build time without improving the core product demonstration.

**Decision:** Use in-memory caching, permissive CORS for development convenience, and a straightforward Render deployment. Acknowledge these as deliberate prototype shortcuts rather than pretend they are production choices.

**Why we chose it:** The goal was a complete, working, end-to-end demo. Operational hardening is important for production but does not change what the product does or how well it demonstrates the core idea.

**Tradeoff:** The current implementation is not production-ready in every operational detail. In-memory state does not survive restarts, and the auth flow is hackathon-grade rather than vault-managed.

**Outcome:** The prototype runs reliably end to end and demonstrates the full workflow without gaps. The infrastructure limitations are documented honestly in the technical document and do not affect the product demo.

---

Taken together, these decisions reflect a consistent priority: build something real, keep it honest, and make every layer of the product — from ingestion to analysis to dashboard to push-back — work as a coherent whole rather than a collection of disconnected features.
