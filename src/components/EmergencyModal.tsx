'use client';

import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert } from 'lucide-react';

interface EmergencyModalProps {
  matchedFlags: string[];
}

export function EmergencyModal({ matchedFlags }: EmergencyModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-red-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-4 border-red-600 p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-300">
        <div className="inline-flex p-4 rounded-full bg-red-100 text-red-600 mb-2">
          <AlertOctagon className="w-16 h-16 animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight">
            Seek Local Emergency Care Now
          </h1>
          <p className="text-lg text-slate-800 font-semibold max-w-xl mx-auto">
            You selected symptoms that may indicate a life-threatening medical emergency.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Emergency Symptoms Triggered:</span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-900 space-y-1 font-medium pl-2">
            {matchedFlags.map((flag, idx) => (
              <li key={idx} className="capitalize">{flag}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-center gap-3 text-red-400 font-bold text-lg">
            <PhoneCall className="w-6 h-6 animate-bounce" />
            <span>Call 911 or your local emergency services immediately</span>
          </div>
          <p className="text-xs text-slate-300">
            Do not use this app or wait for automated responses. Go to the nearest emergency department right away.
          </p>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
          <p>HEALTHBOT Safety Override — Automated AI tools are strictly disabled during emergency red-flag conditions.</p>
        </div>
      </div>
    </div>
  );
}
