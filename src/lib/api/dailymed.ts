export interface DailyMedResult {
  ingredient: string;
  splUrl: string;
  sourceName: string;
  retrievedAt: string;
}

export async function fetchDailyMedLink(ingredient: string): Promise<DailyMedResult> {
  const cleanIngredient = ingredient.trim();
  const retrievedAt = new Date().toISOString().split('T')[0];
  const searchUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(cleanIngredient)}`;

  try {
    const res = await fetch(searchUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      const firstSet = data?.data?.[0];
      if (firstSet?.setid) {
        return {
          ingredient: cleanIngredient,
          splUrl: `https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=${firstSet.setid}`,
          sourceName: 'DailyMed Official US SPL',
          retrievedAt,
        };
      }
    }
  } catch (err) {
    console.warn(`DailyMed lookup failed for ${cleanIngredient}:`, err);
  }

  return {
    ingredient: cleanIngredient,
    splUrl: `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(cleanIngredient)}`,
    sourceName: 'DailyMed Search',
    retrievedAt,
  };
}
