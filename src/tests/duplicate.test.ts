import { describe, it, expect } from 'vitest';
import { detectDuplicateIngredients } from '../lib/rules/duplicateDetection';

describe('Duplicate Ingredient Detection', () => {
  it('detects duplicate generic ingredients across different brand names', () => {
    const medicines = [
      { name: 'Advil', ingredient: 'ibuprofen', active: true, confirmed: true },
      { name: 'Motrin', ingredient: 'Ibuprofen', active: true, confirmed: true },
      { name: 'Tylenol', ingredient: 'acetaminophen', active: true, confirmed: true },
    ];

    const duplicates = detectDuplicateIngredients(medicines);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].ingredient.toLowerCase()).toBe('ibuprofen');
    expect(duplicates[0].medicineNames).toEqual(['Advil', 'Motrin']);
  });

  it('ignores inactive or unconfirmed duplicate ingredients', () => {
    const medicines = [
      { name: 'Advil', ingredient: 'ibuprofen', active: true, confirmed: true },
      { name: 'Motrin', ingredient: 'ibuprofen', active: false, confirmed: true },
    ];

    const duplicates = detectDuplicateIngredients(medicines);
    expect(duplicates).toHaveLength(0);
  });
});
