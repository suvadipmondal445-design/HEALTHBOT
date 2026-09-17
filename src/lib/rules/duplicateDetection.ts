export interface DuplicateMatch {
  ingredient: string;
  medicineNames: string[];
}

export function detectDuplicateIngredients(
  medicines: Array<{ name: string; ingredient: string; active?: boolean; confirmed?: boolean }>
): DuplicateMatch[] {
  // Only filter active and confirmed medicines if flags are present
  const activeMedicines = medicines.filter(
    (m) => (m.active !== false) && (m.confirmed !== false) && m.ingredient.trim() !== ''
  );

  const ingredientMap: Record<string, string[]> = {};

  for (const med of activeMedicines) {
    const normalized = med.ingredient.trim().toLowerCase();
    if (!ingredientMap[normalized]) {
      ingredientMap[normalized] = [];
    }
    ingredientMap[normalized].push(med.name.trim() || med.ingredient);
  }

  const duplicates: DuplicateMatch[] = [];

  for (const [normalized, names] of Object.entries(ingredientMap)) {
    if (names.length > 1) {
      // Find original casing of first item
      const originalIngredient =
        activeMedicines.find((m) => m.ingredient.trim().toLowerCase() === normalized)?.ingredient ||
        normalized;

      duplicates.push({
        ingredient: originalIngredient,
        medicineNames: names,
      });
    }
  }

  return duplicates;
}
