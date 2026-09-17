import { describe, it, expect } from 'vitest';
import { AnalyzeInputSchema, AnalyzeOutputSchema } from '../lib/schema/analyzeSchema';

describe('Zod Schema Input/Output Validation', () => {
  it('validates a correct AnalyzeInput payload', () => {
    const payload = {
      consent: true,
      medicines: [
        {
          id: '1',
          name: 'Aspirin',
          ingredient: 'aspirin',
          strength: '81mg',
          form: 'tablet',
          schedule: 'daily',
          active: true,
          confirmed: true,
        },
      ],
      symptoms: ['headache'],
    };

    const result = AnalyzeInputSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('fails input validation if consent is false', () => {
    const payload = {
      consent: false,
      medicines: [
        {
          id: '1',
          name: 'Aspirin',
          ingredient: 'aspirin',
          active: true,
          confirmed: true,
        },
      ],
      symptoms: [],
    };

    const result = AnalyzeInputSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('validates a valid AnalyzeOutput payload', () => {
    const validOutput = {
      drugFlags: [
        {
          medicineA: 'aspirin',
          medicineB: 'ibuprofen',
          status: 'evidence_found',
          label: 'Possible concern',
          summary: 'Simultaneous use may increase bleeding risk.',
          sourceUrls: ['https://dailymed.nlm.nih.gov/dailymed/spl.cfm'],
          retrievedAt: '2026-09-17',
          limitations: 'Consult pharmacist for evaluation.',
        },
      ],
      symptomAssessment: {
        status: 'not_enough_information',
        label: 'Not enough information',
        summary: 'Symptoms require clinical review.',
        selectedSymptoms: ['headache'],
        questionsForClinician: ['Could my medicine cause headache?'],
      },
      limitations: ['HEALTHBOT may miss important interactions.'],
    };

    const result = AnalyzeOutputSchema.safeParse(validOutput);
    expect(result.success).toBe(true);
  });
});
