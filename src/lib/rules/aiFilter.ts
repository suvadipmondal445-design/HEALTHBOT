import { AnalyzeOutput, AnalyzeOutputSchema } from '../schema/analyzeSchema';

export const FORBIDDEN_WORDS = [
  "definitely dangerous",
  "confirmed interaction",
  "no interaction",
  "safe",
  "diagnose",
  "diagnosis",
  "treatment plan",
  "stop taking",
  "discontinue",
  "start taking",
  "change dose",
  "increase dose",
  "decrease dose",
  "prescribe",
  "ai doctor",
  "cured",
];

export function validateAndSanitizeAiOutput(data: unknown): {
  isValid: boolean;
  output: AnalyzeOutput | null;
  error?: string;
} {
  // Step 1: Validate Schema
  const parseResult = AnalyzeOutputSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      isValid: false,
      output: null,
      error: `Schema validation failed: ${parseResult.error.message}`,
    };
  }

  const output = parseResult.data;

  // Step 2: Ensure all drug flags have at least 1 official source URL
  for (const flag of output.drugFlags) {
    if (!flag.sourceUrls || flag.sourceUrls.length === 0) {
      return {
        isValid: false,
        output: null,
        error: `Drug interaction flag for ${flag.medicineA} and ${flag.medicineB} is missing an official source URL.`,
      };
    }

    // Check source URLs are official domains (fda.gov, nlm.nih.gov, nih.gov)
    const validOfficialSource = flag.sourceUrls.some(
      (url) =>
        url.includes('fda.gov') ||
        url.includes('nlm.nih.gov') ||
        url.includes('nih.gov') ||
        url.includes('dailymed.nlm.nih.gov') ||
        url.includes('rxnav.nlm.nih.gov')
    );

    if (!validOfficialSource) {
      return {
        isValid: false,
        output: null,
        error: `Drug flag for ${flag.medicineA} and ${flag.medicineB} contains non-official source URL: ${flag.sourceUrls.join(', ')}`,
      };
    }
  }

  // Step 3: Check string content against forbidden phrase list
  const jsonString = JSON.stringify(output).toLowerCase();
  for (const phrase of FORBIDDEN_WORDS) {
    if (jsonString.includes(phrase.toLowerCase())) {
      return {
        isValid: false,
        output: null,
        error: `AI response contained forbidden text/claim: "${phrase}"`,
      };
    }
  }

  return {
    isValid: true,
    output,
  };
}
