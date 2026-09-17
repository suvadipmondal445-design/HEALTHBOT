'use client';

import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Globe } from 'lucide-react';
import { useApp } from '@/lib/state/AppContext';

export function ConsentSection() {
  const { consent, setConsent } = useApp();

  return (
    <div className={`rounded-xl border p-5 transition-all shadow-sm ${
      consent ? 'bg-sky-50 border-sky-300' : 'bg-amber-50/70 border-amber-300'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${consent ? 'bg-sky-600 text-white' : 'bg-amber-500 text-white'}`}>
          <Globe className="w-5 h-5" />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>Public Internet Lookup & Gemini Consent</span>
              {consent ? (
                <span className="text-xs font-semibold bg-sky-600 text-white px-2 py-0.5 rounded-full">Consent Granted</span>
              ) : (
                <span className="text-xs font-semibold bg-amber-600 text-white px-2 py-0.5 rounded-full">Offline Only</span>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Before performing online evidence lookup via RxNorm, openFDA, DailyMed, and Gemini 3.6 Flash, explicit consent is required.
            </p>
          </div>

          <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-sky-400 cursor-pointer transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
            />
            <span className="text-xs sm:text-sm text-slate-800 font-medium leading-normal">
              I understand that confirmed generic medicine names and selected symptoms will be sent to public internet services (RxNorm, openFDA, DailyMed) and Gemini for this demo.
            </span>
          </label>

          {!consent && (
            <div className="text-xs text-amber-800 bg-amber-100/80 p-2.5 rounded-md border border-amber-200 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-700" />
              <span>
                Without consent, online lookup is disabled. You may still perform 100% offline OCR scanning and manual medicine list editing.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
