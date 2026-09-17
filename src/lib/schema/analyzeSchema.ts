import { z } from 'zod';

// Input validation schema for /api/analyze
export const MedicineInputSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Medicine name is required"),
  ingredient: z.string().min(1, "Generic ingredient is required"),
  strength: z.string().optional().default(''),
  form: z.string().optional().default(''),
  schedule: z.string().optional().default(''),
  active: z.boolean(),
  confirmed: z.boolean(),
});

export const AnalyzeInputSchema = z.object({
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to run online safety analysis." }),
  }),
  medicines: z.array(MedicineInputSchema).min(1, "At least one active confirmed medicine is required"),
  symptoms: z.array(z.string()).default([]),
});

export type MedicineInput = z.infer<typeof MedicineInputSchema>;
export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

// Drug Interaction Flag Schema
export const DrugFlagSchema = z.object({
  medicineA: z.string(),
  medicineB: z.string(),
  status: z.enum(["evidence_found", "needs_pharmacist_review", "no_evidence_retrieved"]),
  label: z.enum(["Possible concern", "Needs pharmacist review"]),
  summary: z.string(),
  sourceUrls: z.array(z.string().url()).min(1, "At least one official source URL is required for drug flags"),
  retrievedAt: z.string(),
  limitations: z.string(),
});

// Symptom Pattern Assessment Schema
export const SymptomAssessmentSchema = z.object({
  status: z.enum(["same_day_clinician_review", "not_enough_information"]),
  label: z.enum(["Possible concern to discuss with a clinician", "Not enough information"]),
  summary: z.string(),
  selectedSymptoms: z.array(z.string()),
  questionsForClinician: z.array(z.string()).max(3, "At most 3 questions for a clinician allowed"),
});

// Strict AI Response Schema
export const AnalyzeOutputSchema = z.object({
  drugFlags: z.array(DrugFlagSchema),
  symptomAssessment: SymptomAssessmentSchema,
  limitations: z.array(z.string()),
});

export type DrugFlag = z.infer<typeof DrugFlagSchema>;
export type SymptomAssessment = z.infer<typeof SymptomAssessmentSchema>;
export type AnalyzeOutput = z.infer<typeof AnalyzeOutputSchema>;
