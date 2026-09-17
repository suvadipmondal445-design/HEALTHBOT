'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export function DisclaimerFooter() {
  return (
    <footer className="bg-navy-900 text-slate-300 text-xs sm:text-sm mt-auto border-t border-navy-800 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start gap-3 bg-navy-800/80 p-4 rounded-xl border border-navy-700">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-slate-300">
            <p className="font-semibold text-slate-100">Educational Safety Prototype Disclaimer</p>
            <p className="leading-relaxed">
              HEALTHBOT is an educational prototype only. It does not diagnose illness, replace a clinician or pharmacist, or tell you to change medication. Do not start, stop, or change medicines based on this app. Always consult a licensed healthcare professional for medical advice.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-navy-800 text-slate-400">
          <p>© HEALTHBOT Educational Safety Prototype — Open Public Evidence Model.</p>
          <div className="flex items-center gap-4 font-medium text-slate-300">
            <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy & Limitations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
