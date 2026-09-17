'use client';

import React from 'react';
import { AlertTriangle, Lock } from 'lucide-react';

export function PrivacyBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-xs sm:text-sm font-medium shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo mode:</strong> Do not enter real personal health information.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-amber-800 text-xs bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300/50">
          <Lock className="w-3 h-3 text-amber-700" />
          <span>Browser-Only OCR Privacy Active</span>
        </div>
      </div>
    </div>
  );
}
