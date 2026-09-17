'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Sparkles, Trash2, FileText, CheckSquare, Stethoscope, FileCheck } from 'lucide-react';
import { useApp } from '@/lib/state/AppContext';

export function Navbar() {
  const pathname = usePathname();
  const { loadFictionalDemoData, clearAllData, medicines, symptoms, acknowledgedDisclaimer } = useApp();

  const confirmedActiveCount = medicines.filter(m => m.confirmed && m.active).length;
  
  // Calculate progress based on workflow completion
  const calculateProgress = () => {
    let progress = 0;
    if (medicines.length > 0) progress += 25; // Upload step
    if (confirmedActiveCount > 0) progress += 25; // Confirm step
    if (symptoms.length > 0) progress += 25; // Symptoms step
    if (acknowledgedDisclaimer) progress += 25; // Disclaimer step
    return progress;
  };

  const progress = calculateProgress();

  const navLinks = [
    { href: '/', label: 'Home', icon: Activity },
    { href: '/upload', label: 'Upload', icon: FileText },
    { href: '/confirm', label: 'Medicines', icon: CheckSquare, count: confirmedActiveCount },
    { href: '/symptoms', label: 'Symptoms', icon: Stethoscope, count: symptoms.length },
    { href: '/results', label: 'Results', icon: FileCheck },
  ];

  const getStepNumber = (href: string) => {
    const stepMap: Record<string, number> = {
      '/': 0,
      '/upload': 1,
      '/confirm': 2,
      '/symptoms': 3,
      '/results': 4,
    };
    return stepMap[href] ?? 0;
  };

  const currentStep = getStepNumber(pathname);

  return (
    <header className="bg-navy-900 text-white sticky top-0 z-40 border-b border-navy-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar with logo and actions */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg p-1">
            <div className="bg-sky-600 p-2 rounded-lg text-white group-hover:bg-sky-500 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block">HEALTHBOT</span>
              <span className="text-xs text-sky-300 font-medium block">Safety Prototype</span>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadFictionalDemoData}
              className="flex items-center gap-1.5 bg-navy-950 text-sky-300 hover:bg-navy-800 hover:text-sky-200 border border-navy-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
              title="Load safe fictional demo medicines and symptoms"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Load Demo</span>
            </button>
            <button
              onClick={clearAllData}
              className="flex items-center gap-1.5 bg-navy-800 text-slate-300 hover:bg-red-950 hover:text-red-300 border border-navy-700 hover:border-red-800 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              title="Clear all stored local data"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-sky-300">Safety Check Progress</span>
            <span className="text-xs font-bold text-sky-200">{progress}% Complete</span>
          </div>
          <div className="w-full bg-navy-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-3 max-w-full">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            const isCompleted = idx < currentStep;
            const isDisabled = idx > currentStep + 1 && progress < (idx * 25);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md'
                    : isCompleted
                    ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                    : isDisabled
                    ? 'bg-navy-800 text-navy-400 cursor-not-allowed opacity-50'
                    : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
                }`}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
              >
                <div className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white text-sky-600' : isCompleted ? 'bg-teal-500 text-white' : 'bg-navy-700 text-navy-400'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
