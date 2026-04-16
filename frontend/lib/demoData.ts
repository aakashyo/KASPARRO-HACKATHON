export const demoData = {
  store_score: {
    overall_score: 58,
    dimension_scores: {
      "Product Quality": { score: 45, reason: "Lacks structured attributes like skin type or specific benefits in description." },
      "Policy Clarity": { score: 85, reason: "Essential legal policies detected, building agent trust." },
      "FAQ Coverage": { score: 40, reason: "Missing explicit FAQs, forcing AI to guess on edge cases." },
      "Trust Signals": { score: 70, reason: "Multiple trust markers (Refund, TOS) are clearly accessible." },
      "Knowledge Structure": { score: 50, reason: "Inconsistent tag usage makes categorization difficult for AI." }
    }
  },
  products: [
    {
      id: "demo-1",
      title: "Neural Vitamin C Serum",
      handle: "glow-serum",
      original_data: { 
        description: "A nice serum for your face. Makes you look good.",
        tags: [],
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200&h=200"
      },
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
        insight: "AI fails to detect functional active ingredients, reducing recommendation ranking in treatment-focused queries.",
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
    },
    {
        id: "demo-2",
        title: "Mineral Shield SPF 50",
        handle: "mineral-shield",
        original_data: { 
          description: "Sunscreen for beach days.",
          tags: ["sunscreen"],
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200&h=200"
        },
        intent: {
          category: "Sun Care",
          target_user: "Beach-goers and outdoor athletes",
          use_case: "Water-resistant UV protection",
          price_segment: "Premium",
          key_attributes: ["Zinc Oxide", "Reef Safe"],
          important_keywords: ["water-resistant", "SPF 50", "broad-spectrum"]
        },
        ai_perception: {
          summary: "Generic sun protection lotion.",
          target_user: "General public",
          key_benefits: ["Sun protection"],
          confidence: 0.65,
          recommendation: "yes",
          reason: "Identified as sunscreen but lacks technical specs for reef-safety or water resistance."
        },
        gaps: {
          missing_attributes: ["Reef Safety", "Water Resistance Duration"],
          misinterpretations: ["AI categorized as generic rather than specialized sport/mineral protection"],
          confidence_drop_reasons: ["Missing broad-spectrum verification"],
          insight: "Missing Reef-Safe certification in data causes rejection by ESG-conscious shopping agents.",
          severity: 5,
          impact_level: "medium"
        },
        impact: {
          before_score: 0.62,
          after_score: 0.92,
          improvement_percentage: "48%",
          reason: "Validating Reef-Safe and Water-Resistant status unlocks specialized athlete and eco-conscious audience segments."
        },
        fixes: {
          improved_description: "Broad-spectrum Mineral SPF 50 featuring non-nano Zinc Oxide. Water-resistant for 80 minutes and certified Reef-Safe. Perfect for high-intensity outdoor sports.",
          added_keywords: ["Mineral Sunscreen", "Reef Safe SPF", "Sport Sunscreen"],
          structured_tags: ["spf:50", "type:mineral", "water-resistant:80min"],
          faq_suggestions: [
            { question: "How often should I reapply?", answer: "Every 80 minutes if swimming or sweating." }
          ]
        }
      }
  ],
  query_simulation: {
    ranked_results: [
      { rank: 1, product_id: "demo-1", match_score: 0.92, reason: "Highest confidence after metadata optimization for dry-skin queries." }
    ],
    rejected_products: []
  }
};
