'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, Globe, Server, FileText, ArrowLeft, Key } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-semibold mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Lock className="w-8 h-8 text-sky-600" />
          <span>Privacy & Technical Limitations Policy</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Complete transparent guide to browser privacy, public evidence fetching, and environment security.
        </p>
      </div>

      {/* 1. Zero Image Upload Privacy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>1. Browser-Only OCR Privacy Guarantee</span>
        </h2>
        <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
          <p>
            Prescription images uploaded to HEALTHBOT are processed entirely within your web browser using WebAssembly and Tesseract.js.
          </p>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <li><strong>No Image Uploads:</strong> Prescription images (JPG, PNG) are never uploaded to Gemini, Vercel, RxNorm, openFDA, DailyMed, or any cloud server.</li>
            <li><strong>No Raw OCR Text Uploads:</strong> Raw scanned text remains in browser memory.</li>
            <li><strong>User Confirmation Required:</strong> Only generic active ingredients and selected symptoms explicitly confirmed by you are sent to the backend endpoint for evidence lookup.</li>
          </ul>
        </div>
      </div>

      {/* 2. Public Evidence Sources */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-600" />
          <span>2. Public Evidence Sources</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          HEALTHBOT queries official public US government APIs to ground safety evaluations in documented label text:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
            <p className="font-bold text-sky-900 text-sm">RxNorm / RxNav</p>
            <p className="text-sky-800">Normalizes medicine names to standard generic ingredients and RxCUIs.</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
            <p className="font-bold text-sky-900 text-sm">openFDA API</p>
            <p className="text-sky-800">Searches official US FDA drug interaction label sections.</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
            <p className="font-bold text-sky-900 text-sm">DailyMed API</p>
            <p className="text-sky-800">Retrieves current US Structured Product Label (SPL) package inserts.</p>
          </div>
        </div>
      </div>

      {/* 3. API Key & Security */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-600" />
          <span>3. Server-Side AI Security & API Keys</span>
        </h2>
        <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
          <p>
            API keys for Gemini 3.6 Flash are kept strictly on the server:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <li>The environment variable is strictly named <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300">GEMINI_API_KEY</code>.</li>
            <li><code className="bg-white px-1.5 py-0.5 rounded border border-slate-300">NEXT_PUBLIC_GEMINI_API_KEY</code> is NEVER used to prevent client bundle leaks.</li>
            <li>Only the server route <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300">/api/analyze</code> interacts with Gemini 3.6 Flash.</li>
          </ul>
        </div>
      </div>

      {/* 4. Limitations Disclaimer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3 shadow-md">
        <h2 className="font-bold text-base text-amber-400">
          4. Prototype Scope & Medical Limitation
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          HEALTHBOT is designed for educational exploration of public medication APIs and OCR. It does not replace medical judgment, clinical diagnoses, or professional pharmacy consultations. Never alter prescriptions without medical supervision.
        </p>
      </div>
    </div>
  );
}
