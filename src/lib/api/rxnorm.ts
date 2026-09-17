export interface RxNormResult {
  rxcui: string | null;
  normalizedName: string;
  sourceUrl: string;
  status: 'normalized' | 'needs_manual_review';
}

export async function normalizeIngredientWithRxNorm(ingredientName: string): Promise<RxNormResult> {
  const cleanName = ingredientName.trim();
  const sourceUrl = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(cleanName)}`;

  try {
    const response = await fetch(sourceUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    if (!response.ok) {
      return {
        rxcui: null,
        normalizedName: cleanName,
        sourceUrl,
        status: 'needs_manual_review',
      };
    }

    const data = await response.json();
    const idGroup = data?.idGroup;
    const rxcuiList = idGroup?.rxnormId;

    if (rxcuiList && Array.isArray(rxcuiList) && rxcuiList.length > 0) {
      return {
        rxcui: rxcuiList[0],
        normalizedName: idGroup.name || cleanName,
        sourceUrl,
        status: 'normalized',
      };
    }

    return {
      rxcui: null,
      normalizedName: cleanName,
      sourceUrl,
      status: 'needs_manual_review',
    };
  } catch (err) {
    console.warn(`RxNorm lookup failed for ${cleanName}:`, err);
    return {
      rxcui: null,
      normalizedName: cleanName,
      sourceUrl,
      status: 'needs_manual_review',
    };
  }
}
