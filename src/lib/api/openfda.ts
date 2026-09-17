export interface OpenFdaEvidence {
  ingredient: string;
  drugInteractionsText: string | null;
  sourceUrl: string;
  retrievedAt: string;
}

export async function fetchOpenFdaInteractions(ingredient: string): Promise<OpenFdaEvidence> {
  const cleanIngredient = ingredient.trim();
  const retrievedAt = new Date().toISOString().split('T')[0];
  const queryUrl = `https://api.fda.gov/drug/label.json?search=drug_interactions:"${encodeURIComponent(cleanIngredient)}"&limit=1`;

  try {
    const res = await fetch(queryUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return {
        ingredient: cleanIngredient,
        drugInteractionsText: null,
        sourceUrl: `https://api.fda.gov/drug/label.json?search=drug_interactions:"${encodeURIComponent(cleanIngredient)}"`,
        retrievedAt,
      };
    }

    const data = await res.json();
    const result = data?.results?.[0];
    const interactions = result?.drug_interactions?.[0] || null;

    return {
      ingredient: cleanIngredient,
      drugInteractionsText: interactions ? interactions.substring(0, 800) : null,
      sourceUrl: `https://api.fda.gov/drug/label.json?search=drug_interactions:"${encodeURIComponent(cleanIngredient)}"`,
      retrievedAt,
    };
  } catch (err) {
    console.warn(`openFDA search failed for ${cleanIngredient}:`, err);
    return {
      ingredient: cleanIngredient,
      drugInteractionsText: null,
      sourceUrl: `https://api.fda.gov/drug/label.json?search=drug_interactions:"${encodeURIComponent(cleanIngredient)}"`,
      retrievedAt,
    };
  }
}
