'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  RefreshCw,
  Lock,
  Info,
  CheckCircle2,
  AlertOctagon,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '@/lib/state/AppContext';
import { EmergencyModal } from '@/components/EmergencyModal';
import { checkEmergencyRedFlags } from '@/lib/rules/emergency';
import { AnalyzeOutput } from '@/lib/schema/analyzeSchema';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Progress';

export default function ResultsPage() {
  const {
    medicines,
    symptoms,
    consent,
    analysisResult,
    setAnalysisResult,
    isAnalyzing,
    setIsAnalyzing,
    errorMessage,
    setErrorMessage,
  } = useApp();

  const emergencyCheck = checkEmergencyRedFlags(symptoms);
  const activeConfirmedMedicines = medicines.filter((m) => m.active && m.confirmed);

  const fetchAnalysis = async () => {
    if (!consent) {
      setErrorMessage('Online analysis requires consent. Showing offline medicine list review.');
      return;
    }

    if (activeConfirmedMedicines.length === 0) {
      setErrorMessage('No active confirmed medicines available for interaction analysis. Please confirm at least one medicine.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent: true,
          medicines: activeConfirmedMedicines.map((m) => ({
            id: m.id,
            name: m.name,
            ingredient: m.ingredient,
            strength: m.strength,
            form: m.form,
            schedule: m.schedule,
            active: m.active,
            confirmed: m.confirmed,
          })),
          symptoms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze safety data');
      }

      setAnalysisResult(data as AnalyzeOutput);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during analysis';
      setErrorMessage(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!emergencyCheck.isEmergency && consent && !analysisResult && !isAnalyzing) {
      fetchAnalysis();
    }
  }, [consent, activeConfirmedMedicines.length]);

  if (emergencyCheck.isEmergency) {
    return <EmergencyModal matchedFlags={emergencyCheck.matchedFlags} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-sky-600 p-2 rounded-xl">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900">Safety Review Results</h1>
          </div>
          <p className="text-navy-600 text-base">
            Evidence-backed safety flags from openFDA, RxNorm, DailyMed, and Gemini.
          </p>
        </div>

        {consent && (
          <Button onClick={fetchAnalysis} disabled={isAnalyzing} isLoading={isAnalyzing}>
            <RefreshCw className="w-4 h-4" />
            Re-run Analysis
          </Button>
        )}
      </div>

      {/* Offline Notice */}
      {!consent && (
        <Alert variant="warning" title="Offline Review Mode Active">
          <p className="text-sm">
            Online evidence lookup is disabled because internet consent was not granted. You can review your confirmed medicines below. Enable consent on the Symptoms page to query public APIs & Gemini.
          </p>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="danger" title="Analysis Notice">
          <p>{errorMessage}</p>
        </Alert>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <LoadingState message="Querying Official Evidence Sources..." />
      )}

      {/* Status Overview Cards */}
      {analysisResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" className="border-emerald-300 bg-emerald-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xs text-navy-600 uppercase tracking-wider">Status</p>
                  <p className="font-bold text-navy-900">No Concerns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="border-amber-300 bg-amber-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xs text-navy-600 uppercase tracking-wider">Review Needed</p>
                  <p className="font-bold text-navy-900">{analysisResult.drugFlags.filter(f => f.status !== 'no_evidence_retrieved').length} Flags</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="border-sky-300 bg-sky-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xs text-navy-600 uppercase tracking-wider">Symptoms</p>
                  <p className="font-bold text-navy-900">{symptoms.length} Selected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="border-slate-300 bg-slate-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xs text-navy-600 uppercase tracking-wider">Medicines</p>
                  <p className="font-bold text-navy-900">{activeConfirmedMedicines.length} Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Current Confirmed Medicines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Confirmed Active Medicines ({activeConfirmedMedicines.length})</span>
            <Badge variant="sky">Included in Analysis</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeConfirmedMedicines.length === 0 ? (
            <p className="text-sm text-navy-500 italic">
              No confirmed active medicines. Please return to step 3 to confirm at least one medicine.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeConfirmedMedicines.map((med) => (
                <div key={med.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-navy-900 text-base">{med.name}</h3>
                    <Badge variant="sky" size="sm">{med.ingredient}</Badge>
                  </div>
                  <div className="text-xs text-navy-600 grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div><strong>Strength:</strong> {med.strength || 'N/A'}</div>
                    <div><strong>Form:</strong> {med.form || 'N/A'}</div>
                    <div><strong>Schedule:</strong> {med.schedule || 'N/A'}</div>
                    <div><strong>Source:</strong> {med.sourceFile || 'Manual'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drug Interaction Results */}
      {analysisResult && analysisResult.drugFlags.filter(f => f.status !== 'no_evidence_retrieved').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Possible Drug-Interaction Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult.drugFlags
              .filter(f => f.status !== 'no_evidence_retrieved')
              .map((flag, idx) => (
              <Card key={`${flag.medicineA}-${flag.medicineB}-${idx}`} variant="subtle" className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-4 space-y-3">
                  {/* Medicine Pair Header */}
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900">{flag.medicineA}</span>
                      <span className="text-navy-400">+</span>
                      <span className="font-bold text-navy-900">{flag.medicineB}</span>
                    </div>
                    <Badge variant={flag.status === 'evidence_found' ? 'danger' : flag.status === 'needs_pharmacist_review' ? 'warning' : 'default'}>
                      {flag.label}
                    </Badge>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <p className="text-sm text-navy-700">{flag.summary}</p>
                    
                    {/* Evidence Links */}
                    {flag.sourceUrls && flag.sourceUrls.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-navy-600">Evidence Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {flag.sourceUrls.map((link, linkIdx) => (
                            <a
                              key={linkIdx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Source {linkIdx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Limitations */}
                    {flag.limitations && (
                      <div className="text-xs text-navy-500 italic">
                        {flag.limitations}
                      </div>
                    )}
                  </div>

                  {/* Next Step Reminder */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    <p className="text-xs text-navy-600 flex items-start gap-2">
                      <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>Discuss this potential interaction with your pharmacist or healthcare provider before making any changes to your medication.</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Symptom Results */}
      {analysisResult && analysisResult.symptomAssessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-sky-600" />
              Symptom Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card key="symptom-assessment" variant="subtle" className="border-sky-200 bg-sky-50/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                  <span className="font-bold text-navy-900">Assessment Result</span>
                  <Badge variant={analysisResult.symptomAssessment.status === 'same_day_clinician_review' ? 'warning' : 'default'}>
                    {analysisResult.symptomAssessment.label}
                  </Badge>
                </div>
                <p className="text-sm text-navy-700">{analysisResult.symptomAssessment.summary}</p>
                
                {analysisResult.symptomAssessment.questionsForClinician && analysisResult.symptomAssessment.questionsForClinician.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-navy-600">Questions for Clinician:</p>
                    <ul className="list-disc list-inside text-sm text-navy-700 space-y-1">
                      {analysisResult.symptomAssessment.questionsForClinician.map((question, idx) => (
                        <li key={idx}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-navy-600 flex items-start gap-2">
                    <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>These symptom patterns may indicate side effects or interactions. Consult a healthcare provider for proper evaluation.</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Sources & Limitations Accordion */}
      {analysisResult && (
        <Card variant="subtle">
          <CardContent className="p-4">
            <details className="group">
              <summary className="cursor-pointer font-semibold text-navy-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600" />
                <span>Sources & Limitations</span>
                <span className="transform group-open:rotate-180 transition-transform ml-auto">▼</span>
              </summary>
              <div className="mt-4 space-y-3 text-sm text-navy-600">
                <p><strong>Data Sources:</strong> RxNorm, openFDA, DailyMed (US SPL labels), and Gemini 3.6 Flash for summarization.</p>
                <p><strong>Limitations:</strong> This is an educational prototype. Results are based on publicly available data and may not reflect your specific medical situation. Always consult a licensed healthcare professional.</p>
                <p><strong>Privacy:</strong> Your data is processed according to your consent preferences. Images are processed locally via Tesseract.js.</p>
              </div>
            </details>
          </CardContent>
        </Card>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link href="/symptoms" className="text-navy-600 hover:text-navy-900 font-semibold text-sm">
          ← Back to Symptoms
        </Link>

        <Link href="/">
          <Button variant="outline">
            Start New Safety Check
          </Button>
        </Link>
      </div>
    </div>
  );
}