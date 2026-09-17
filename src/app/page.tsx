'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, Upload, CheckSquare, Sparkles, FileText, Lock, Globe, Activity } from 'lucide-react';
import { useApp } from '@/lib/state/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

export default function HomePage() {
  const { loadFictionalDemoData } = useApp();

  return (
    <div className="space-y-12 py-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-900 via-sky-950 to-navy-900 text-white rounded-3xl p-8 sm:p-16 shadow-xl border border-navy-800 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-300 border border-sky-400/20 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Educational Safety Prototype</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-sky-600 p-3 rounded-2xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                HEALTHBOT
              </h1>
            </div>
            <p className="text-2xl sm:text-3xl font-medium text-sky-200 max-w-2xl">
              Prescription & Symptom Safety Prototype
            </p>
          </div>

          {/* Compact Disclaimer Alert */}
          <Alert variant="warning" title="Important Medical Disclaimer" className="bg-navy-800/90 border-amber-400/40 text-slate-200">
            <p className="text-sm leading-relaxed text-slate-300">
              HEALTHBOT is an educational prototype. It does not diagnose illness, replace a clinician or pharmacist, or tell you to change medication. Do not start, stop, or change medicines based on this app.
            </p>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/upload">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-navy-950">
                Start Safety Check
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={loadFictionalDemoData}
              className="bg-navy-800 hover:bg-navy-700 text-sky-300 border-navy-700"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              Load Demo Data
            </Button>
            <Link href="/privacy" className="text-sky-300 hover:text-white underline text-sm font-medium px-2 py-2">
              Privacy & Limitations
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" className="hover:border-sky-300 transition-colors group">
          <CardContent className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-navy-900">Upload Prescriptions</h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Upload image or PDF prescriptions. Tesseract.js runs 100% inside your browser to extract medicine lines offline.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-sky-800 bg-sky-50 px-3 py-2 rounded-lg font-medium border border-sky-100">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Images stay on your device</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover:border-sky-300 transition-colors group">
          <CardContent className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <CheckSquare className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-navy-900">Confirm Medicines</h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Review and edit generic ingredients, strength, schedule, and active status for each medicine.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-lg font-medium border border-amber-100">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Automatic duplicate detection</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover:border-sky-300 transition-colors group">
          <CardContent className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-navy-900">Review Safety Flags</h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Get evidence-backed safety flags from public APIs and AI for drug interactions and symptom patterns.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-navy-700 bg-navy-100 px-3 py-2 rounded-lg font-medium border border-navy-200">
              <Globe className="w-4 h-4 shrink-0" />
              <span>Grounded in official US data</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3-Step Timeline */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-navy-900">How It Works</h2>
          <p className="text-navy-600 text-base">Simple 3-step process with privacy-first design</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-lg relative z-10">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-navy-900">Upload</h3>
                <p className="text-sm text-navy-600">Add prescription images for local OCR processing</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-lg relative z-10">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-navy-900">Confirm</h3>
                <p className="text-sm text-navy-600">Review and edit extracted medicine information</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-lg relative z-10">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-navy-900">Analyze</h3>
                <p className="text-sm text-navy-600">Get safety flags and evidence-backed insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust/Privacy Card */}
      <Card variant="subtle" className="border-teal-200 bg-teal-50">
        <CardContent className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-navy-900">Privacy-First Design</h3>
            <p className="text-sm text-navy-600">
              Your prescription images are processed entirely in your browser using Tesseract.js. They never leave your device unless you explicitly consent to online analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
