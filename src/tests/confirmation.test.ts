import { describe, it, expect } from 'vitest';
import { MedicineInputSchema } from '../lib/schema/analyzeSchema';

describe('Medicine Confirmation & Active Filtering', () => {
  it('validates a valid medicine entry', () => {
    const validMed = {
      id: 'med-1',
      name: 'Advil',
      ingredient: 'ibuprofen',
      strength: '400mg',
      form: 'tablet',
      schedule: 'once daily',
      active: true,
      confirmed: true,
    };

    const parseResult = MedicineInputSchema.safeParse(validMed);
    expect(parseResult.success).toBe(true);
  });

  it('rejects a medicine missing an ingredient', () => {
    const invalidMed = {
      id: 'med-2',
      name: 'Unknown',
      ingredient: '',
      active: true,
      confirmed: true,
    };

    const parseResult = MedicineInputSchema.safeParse(invalidMed);
    expect(parseResult.success).toBe(false);
  });

  it('correctly filters active and confirmed medicines', () => {
    const medicinesList = [
      { id: '1', name: 'Med 1', ingredient: 'aspirin', active: true, confirmed: true },
      { id: '2', name: 'Med 2', ingredient: 'ibuprofen', active: false, confirmed: true },
      { id: '3', name: 'Med 3', ingredient: 'paracetamol', active: true, confirmed: false },
    ];

    const activeConfirmed = medicinesList.filter((m) => m.active && m.confirmed);
    expect(activeConfirmed).toHaveLength(1);
    expect(activeConfirmed[0].ingredient).toBe('aspirin');
  });
});
