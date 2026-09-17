import { describe, it, expect } from 'vitest';
import { validateAndSanitizeAiOutput } from '../lib/rules/aiFilter';

describe('Strict AI Output Safety Filtering Rules', () => {
  it('accepts compliant AI response output with official source URLs', () => {
    const compliant = {
      drugFlags: [
        {
          medicineA: 'aspirin',
          medicineB: 'ibuprofen',
          status: 'evidence_found',
          label: 'Possible concern',
          summary: 'Increased risk of gastrointestinal bleeding reported in label evidence.',
          sourceUrls: ['https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=123'],
          retrievedAt: '2026-09-17',
          limitations: 'Consult a licensed pharmacist.',
        },
      ],
      symptomAssessment: {
        status: 'not_enough_information',
        label: 'Not enough information',
        summary: 'Symptom evaluation requires clinician review.',
        selectedSymptoms: ['stomach pain'],
        questionsForClinician: ['Is this side effect expected?'],
      },
      limitations: ['Always confirm concerns with a clinician.'],
    };

    const res = validateAndSanitizeAiOutput(compliant);
    expect(res.isValid).toBe(true);
    expect(res.output).not.toBeNull();
  });

  it('refuses AI output if a drug flag is missing source URLs', () => {
    const missingUrls = {
      drugFlags: [
        {
          medicineA: 'aspirin',
          medicineB: 'ibuprofen',
          status: 'evidence_found',
          label: 'Possible concern',
          summary: 'Potential concern noted.',
          sourceUrls: [], // EMPTY SOURCES -> MUST REJECT
          retrievedAt: '2026-09-17',
          limitations: 'Consult a clinician.',
        },
      ],
      symptomAssessment: {
        status: 'not_enough_information',
        label: 'Not enough information',
        summary: 'Insufficient info.',
        selectedSymptoms: [],
        questionsForClinician: [],
      },
      limitations: ['Limitation notice.'],
    };

    const res = validateAndSanitizeAiOutput(missingUrls);
    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/sourceUrls|At least one official source URL/i);
  });

  it('refuses AI output if it contains forbidden diagnostic or treatment command words', () => {
    const forbiddenClaims = {
      drugFlags: [
        {
          medicineA: 'aspirin',
          medicineB: 'ibuprofen',
          status: 'evidence_found',
          label: 'Possible concern',
          summary: 'You must stop taking aspirin immediately.', // FORBIDDEN: "stop taking"
          sourceUrls: ['https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=123'],
          retrievedAt: '2026-09-17',
          limitations: 'Consult a clinician.',
        },
      ],
      symptomAssessment: {
        status: 'not_enough_information',
        label: 'Not enough information',
        summary: 'Symptoms indicate a diagnosis of ulcer disease.', // FORBIDDEN: "diagnosis"
        selectedSymptoms: ['stomach pain'],
        questionsForClinician: [],
      },
      limitations: ['Limitation notice.'],
    };

    const res = validateAndSanitizeAiOutput(forbiddenClaims);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('forbidden text/claim');
  });
});
