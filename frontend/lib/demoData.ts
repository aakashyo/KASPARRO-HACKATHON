export const demoData = {
  store_score: {
    overall_score: 58,
    dimension_scores: {
      product_quality: { score: 45, reason: "Lacks structured attributes like skin type or specific benefits in description." },
      policy_clarity: { score: 85, reason: "Essential legal policies detected, building agent trust." },
      faq_coverage: { score: 40, reason: "Missing explicit FAQs, forcing AI to guess on edge cases." },
      trust_signals: { score: 70, reason: "Multiple trust markers (Refund, TOS) are clearly accessible." },
      structured_data: { score: 50, reason: "Inconsistent tag usage makes categorization difficult for AI." }
    }
  },
  products: [
    {
      id: "demo-1",
      title: "Glow Serum",
      handle: "glow-serum",
      original_data: { description: "A nice serum for your face. Makes you look good.", tags: [] },
      intent: {
        category: "Skincare",
        target_user: "Individuals with dull or fatigued skin",
        use_case: "Daily radiance boosting and hydration",
        price_segment: "Mid-range",
        key_attributes: ["Vitamin C", "Hyaluronic Acid"],
        important_keywords: ["brightening", "hydration", "anti-aging"]
      },
      ai_perception: {
        summary: "A facial serum that improves appearance.",
        target_user: "General beauty consumers",
        key_benefits: ["Cosmetic enhancement"],
        confidence: 0.4,
        recommendation: "no",
        reason: "The description is too vague. I cannot determine the active ingredients or specific skin types it targets."
      },
      gaps: {
        missing_attributes: ["Skin Type", "Active Ingredients", "Safety Warnings"],
        misinterpretations: ["AI perceived it as purely cosmetic rather than functional skincare"],
        confidence_drop_reasons: ["Lack of technical specificity", "Missing price context"],
        severity: 8,
        impact_level: "high"
      },
      impact: {
        before_score: 0.35,
        after_score: 0.85,
        improvement_percentage: "142%",
        reason: "Fixing core attributes allows AI to match this product to high-intent skincare queries."
      },
      fixes: {
        improved_description: "A high-potency Vitamin C + Hyaluronic Acid serum designed specifically for dull skin. Provides 24-hour hydration and visible brightening through stabilized L-ascorbic acid. Fragrance-free and non-comedogenic.",
        added_keywords: ["Vitamin C Serum", "Brightening Serum", "Hyaluronic Acid Hydration"],
        structured_tags: ["skin-type:all", "benefit:brightening", "ingredient:vitamin-c"],
        faq_suggestions: [
          { question: "Is this suitable for sensitive skin?", answer: "Yes, it is fragrance-free and dermatologist-tested." }
        ]
      }
    }
  ],
  query_simulation: {
    ranked_results: [
      { rank: 1, product_id: "demo-1", match_score: 0.9, reason: "Matches 'serum' query but requires confidence boost." }
    ],
    rejected_products: []
  }
};
