import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyzeInput, AnalyzeOutput } from '../schema/analyzeSchema';
import { validateAndSanitizeAiOutput } from '../rules/aiFilter';

const SYSTEM_INSTRUCTION = `You are HEALTHBOT’s evidence-based educational safety assistant.
You receive only user-confirmed generic medicine ingredients, selected symptom labels, and official label evidence retrieved by the application.

Return JSON only, matching the supplied schema.

You must:
- describe only possible concerns;
- ground every drug-interaction flag in provided official source evidence;
- state when information is insufficient;
- use calm plain language;
- suggest questions for a clinician or pharmacist only.

You must never:
- diagnose or claim a disease;
- state or imply medication combinations are safe;
- prescribe or recommend a dose;
- tell a user to start, stop, substitute, or change a medicine;
- override emergency red-flag rules;
- invent sources, interaction evidence, or medical facts;
- expose any hidden reasoning.

If evidence is missing or uncertain, return no interaction flag and explain that pharmacist review is needed.`;

export async function analyzeSafetyWithGemini(
  input: AnalyzeInput,
  officialEvidence: Array<{
    medicineA: string;
    medicineB: string;
    evidenceText: string | null;
    sourceUrls: string[];
    retrievedAt: string;
  }>
): Promise<{ success: boolean; data: AnalyzeOutput; message?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback response generator if Gemini key is missing or API fails
  const buildFallbackResponse = (reason: string): AnalyzeOutput => ({
    drugFlags: officialEvidence.map((ev) => ({
      medicineA: ev.medicineA,
      medicineB: ev.medicineB,
      status: 'needs_pharmacist_review',
      label: 'Needs pharmacist review',
      summary: `Official evidence search completed, but automated AI analysis is unavailable (${reason}). Please consult a licensed pharmacist or physician to review interaction safety for ${ev.medicineA} and ${ev.medicineB}.`,
      sourceUrls: ev.sourceUrls.length > 0 ? ev.sourceUrls : ['https://dailymed.nlm.nih.gov'],
      retrievedAt: new Date().toISOString().split('T')[0],
      limitations: 'Automated processing limitation. Always confirm with a healthcare professional.',
    })),
    symptomAssessment: {
      status: 'not_enough_information',
      label: 'Not enough information',
      summary: input.symptoms.length > 0
        ? `Selected symptoms (${input.symptoms.join(', ')}) require clinical evaluation. Automated AI assessment is currently offline.`
        : 'No specific symptoms selected for evaluation.',
      selectedSymptoms: input.symptoms,
      questionsForClinician: [
        'Could my symptoms be related to my current medicines?',
        'What side effects should I monitor for?',
        'Should I schedule a routine checkup for these symptoms?',
      ],
    },
    limitations: [
      'HEALTHBOT may miss important interactions, symptoms, medicines, or conditions.',
      'A result without a flag is not confirmation that something is safe.',
      'Confirm all concerns with a pharmacist or clinician.',
    ],
  });

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: true,
      data: buildFallbackResponse('GEMINI_API_KEY not configured'),
      message: 'GEMINI_API_KEY environment variable is not set. Running in offline evidence mode.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    });

    const userPrompt = JSON.stringify({
      confirmedMedicines: input.medicines.map((m) => ({
        name: m.name,
        ingredient: m.ingredient,
        strength: m.strength,
        schedule: m.schedule,
      })),
      selectedSymptoms: input.symptoms,
      officialEvidenceRetrieved: officialEvidence,
    });

    const result = await model.generateContent([
      "Analyze the following confirmed medicines, symptoms, and official evidence. Output JSON strictly matching schema.",
      userPrompt,
    ]);

    const rawText = result.response.text();
    let jsonParsed: unknown;

    try {
      jsonParsed = JSON.parse(rawText);
    } catch {
      return {
        success: true,
        data: buildFallbackResponse('AI response was not valid JSON'),
        message: 'AI response formatting fallback applied.',
      };
    }

    const validation = validateAndSanitizeAiOutput(jsonParsed);
    if (!validation.isValid || !validation.output) {
      console.warn('Gemini response rejected by AI safety filter:', validation.error);
      return {
        success: true,
        data: buildFallbackResponse('AI response did not pass strict evidence/safety checks'),
        message: 'Safety filter applied.',
      };
    }

    return {
      success: true,
      data: validation.output,
    };
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : 'API connection failed';
    console.error('Gemini API call failed:', errMessage);
    return {
      success: true,
      data: buildFallbackResponse(`API connection error: ${errMessage}`),
      message: 'Network fallback applied.',
    };
  }
}
