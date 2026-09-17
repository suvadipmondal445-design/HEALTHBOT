'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, AlertOctagon, Trash2, ArrowRight, ShieldCheck, Lock, AlertTriangle, Heart, Brain, Thermometer, Activity, X } from 'lucide-react';
import { useApp } from '@/lib/state/AppContext';
import { ConsentSection } from '@/components/ConsentModal';
import { checkEmergencyRedFlags } from '@/lib/rules/emergency';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';

// Symptom Groups Definition with icons
const SYMPTOM_GROUPS = [
  {
    category: 'Breathing (Emergency Watch)',
    icon: Activity,
    symptoms: [
      'severe breathing difficulty',
      'Shortness of breath on exertion',
      'Mild wheezing or coughing',
    ],
  },
  {
    category: 'Chest (Emergency Watch)',
    icon: Heart,
    symptoms: [
      'severe chest symptoms',
      'Mild chest pressure / tightness',
      'Rapid heart rate / palpitations',
    ],
  },
  {
    category: 'Neurological & Swelling (Emergency Watch)',
    icon: Brain,
    symptoms: [
      'swelling of lips, face, tongue, or throat',
      'fainting',
      'sudden confusion',
      'Dizziness or lightheadedness',
      'Headache',
    ],
  },
  {
    category: 'Stomach & Digestive',
    icon: AlertTriangle,
    symptoms: [
      'Stomach pain / upset',
      'Mild nausea',
      'Vomiting',
      'Heartburn / acid reflux',
      'Diarrhea',
    ],
  },
  {
    category: 'Skin & Allergy',
    icon: AlertOctagon,
    symptoms: [
      'Skin rash or redness',
      'Itching / hives',
      'Dry skin',
    ],
  },
  {
    category: 'Fever & Pain',
    icon: Thermometer,
    symptoms: [
      'Fever',
      'Muscle aches / joint pain',
      'Fatigue / weakness',
    ],
  },
  {
    category: 'Other',
    icon: Activity,
    symptoms: [
      'Dry mouth',
      'Drowsiness',
      'Insomnia / sleep issues',
    ],
  },
];

export default function SymptomsPage() {
  const {
    symptoms,
    toggleSymptom,
    clearSymptoms,
    notes,
    setNotes,
    acknowledgedDisclaimer,
    setAcknowledgedDisclaimer,
    consent,
  } = useApp();

  const emergencyCheck = checkEmergencyRedFlags(symptoms);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-sky-600 p-2 rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900">Select Symptoms</h1>
          </div>
          <p className="text-navy-600 text-base">
            Select any symptoms you are currently experiencing to evaluate potential symptom-pattern flags.
          </p>
        </div>

        {symptoms.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearSymptoms}>
            <Trash2 className="w-4 h-4" />
            Clear Selected
          </Button>
        )}
      </div>

      {/* Emergency Warning Banner */}
      {emergencyCheck.isEmergency && (
        <Alert variant="danger" title="Emergency Red-Flag Symptoms Selected">
          <p className="text-sm font-bold">
            You have selected: {emergencyCheck.matchedFlags.join(', ')}.
          </p>
          <p className="text-xs mt-2">
            Continuing to the Results page will show a full-screen emergency alert instructing you to seek immediate local care.
          </p>
        </Alert>
      )}

      {/* Selected Symptoms Summary Card */}
      {symptoms.length > 0 && (
        <Card variant="elevated" className="border-sky-300 bg-sky-50/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Symptoms Summary</span>
              <Badge variant="sky">{symptoms.length} selected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <Badge key={symptom} variant="sky" className="flex items-center gap-1">
                  <span>{symptom}</span>
                  <button
                    onClick={() => toggleSymptom(symptom)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptom Chips by Category */}
      <div className="space-y-6">
        {SYMPTOM_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg uppercase tracking-wider text-sky-900">
                  <Icon className="w-5 h-5 text-sky-600" />
                  {group.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2.5">
                  {group.symptoms.map((symptom) => {
                    const isSelected = symptoms.includes(symptom);
                    const isRedFlag = [
                      'severe breathing difficulty',
                      'swelling of lips, face, tongue, or throat',
                      'fainting',
                      'sudden confusion',
                      'severe chest symptoms',
                    ].includes(symptom);

                    return (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                          isSelected
                            ? isRedFlag
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-sky-600 text-white shadow-md'
                            : isRedFlag
                            ? 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                            : 'bg-slate-100 text-navy-700 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isRedFlag && <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{symptom}</span>
                        {isSelected && <span className="ml-1 text-2xs opacity-80">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Local Free-Text Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Optional Personal Symptom Notes</span>
            <Badge variant="success" className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Local Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type any private symptom context for your own review... (Note: this text remains strictly on your device and will NEVER be uploaded)."
            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
          />
        </CardContent>
      </Card>

      {/* Consent Section */}
      <ConsentSection />

      {/* Mandatory Disclaimer Acknowledgement */}
      <Alert variant="privacy">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledgedDisclaimer}
            onChange={(e) => setAcknowledgedDisclaimer(e.target.checked)}
            className="mt-1 w-5 h-5 text-sky-500 rounded border-slate-600 focus:ring-sky-400"
          />
          <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            I acknowledge that HEALTHBOT is an educational prototype and does not provide medical diagnosis, treatment, or dosage advice. I understand that I must consult a licensed doctor or pharmacist for any health concerns.
          </span>
        </label>
      </Alert>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link href="/confirm" className="text-navy-600 hover:text-navy-900 font-semibold text-sm">
          ← Back to Medicine Confirmation
        </Link>

        <Link href="/results">
          <Button disabled={!acknowledgedDisclaimer}>
            Continue to Results
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}