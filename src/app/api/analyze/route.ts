import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeInputSchema } from '@/lib/schema/analyzeSchema';
import { fetchOpenFdaInteractions } from '@/lib/api/openfda';
import { fetchDailyMedLink } from '@/lib/api/dailymed';
import { normalizeIngredientWithRxNorm } from '@/lib/api/rxnorm';
import { analyzeSafetyWithGemini } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate input payload with Zod
    const inputParse = AnalyzeInputSchema.safeParse(body);
    if (!inputParse.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload',
          details: inputParse.error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    const input = inputParse.data;

    // Filter confirmed and active medicines only
    const activeConfirmedMeds = input.medicines.filter((m) => m.active && m.confirmed);
    if (activeConfirmedMeds.length === 0) {
      return NextResponse.json(
        { error: 'No active confirmed medicines provided for analysis' },
        { status: 400 }
      );
    }

    // 2. Extract unique generic ingredients & generate pairs
    const uniqueIngredients = Array.from(
      new Set(activeConfirmedMeds.map((m) => m.ingredient.trim().toLowerCase()))
    );

    // Fetch official evidence for each ingredient & interaction pairs
    const pairEvidence: Array<{
      medicineA: string;
      medicineB: string;
      evidenceText: string | null;
      sourceUrls: string[];
      retrievedAt: string;
    }> = [];

    const retrievedAt = new Date().toISOString().split('T')[0];

    // Generate pairs if 2 or more active ingredients exist
    if (uniqueIngredients.length >= 2) {
      for (let i = 0; i < uniqueIngredients.length; i++) {
        for (let j = i + 1; j < uniqueIngredients.length; j++) {
          const ingA = uniqueIngredients[i];
          const ingB = uniqueIngredients[j];

          // Fetch evidence from openFDA & DailyMed & RxNorm concurrently
          const [openfdaA, openfdaB, dailymedA, dailymedB, rxnormA, rxnormB] = await Promise.all([
            fetchOpenFdaInteractions(ingA),
            fetchOpenFdaInteractions(ingB),
            fetchDailyMedLink(ingA),
            fetchDailyMedLink(ingB),
            normalizeIngredientWithRxNorm(ingA),
            normalizeIngredientWithRxNorm(ingB),
          ]);

          const combinedText = [
            openfdaA.drugInteractionsText ? `Label for ${ingA}: ${openfdaA.drugInteractionsText}` : null,
            openfdaB.drugInteractionsText ? `Label for ${ingB}: ${openfdaB.drugInteractionsText}` : null,
          ]
            .filter(Boolean)
            .join('\n\n');

          const sourceUrls = Array.from(
            new Set([
              openfdaA.sourceUrl,
              openfdaB.sourceUrl,
              dailymedA.splUrl,
              dailymedB.splUrl,
              rxnormA.sourceUrl,
              rxnormB.sourceUrl,
            ])
          );

          pairEvidence.push({
            medicineA: rxnormA.normalizedName || ingA,
            medicineB: rxnormB.normalizedName || ingB,
            evidenceText: combinedText || null,
            sourceUrls,
            retrievedAt,
          });
        }
      }
    }

    // 3. Perform analysis with Gemini 3.6 Flash
    const analysisResult = await analyzeSafetyWithGemini(input, pairEvidence);

    return NextResponse.json(analysisResult.data, { status: 200 });
  } catch (err) {
    console.error('Error processing /api/analyze:', err);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during safety analysis. Please try again.',
      },
      { status: 500 }
    );
  }
}
