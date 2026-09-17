'use client';

import React from 'react';
import Link from 'next/link';
import { CheckSquare, Plus, Trash2, AlertTriangle, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { useApp } from '@/lib/state/AppContext';
import { detectDuplicateIngredients } from '@/lib/rules/duplicateDetection';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ConfirmPage() {
  const { medicines, updateMedicine, deleteMedicine, addMedicine, clearAllMedicines } = useApp();

  const confirmedActiveCount = medicines.filter((m) => m.confirmed && m.active).length;
  const duplicateMatches = detectDuplicateIngredients(medicines);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-sky-600 p-2 rounded-xl">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900">Confirm Current Medicines</h1>
          </div>
          <p className="text-navy-600 text-base">
            Review and edit generic active ingredients. Only confirmed and active medicines will be analyzed for safety interactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => addMedicine()}>
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
          {medicines.length > 0 && (
            <Button variant="danger" size="sm" onClick={clearAllMedicines}>
              <Trash2 className="w-4 h-4" />
              Clear List
            </Button>
          )}
        </div>
      </div>

      {/* Duplicate Ingredient Alert Banner */}
      {duplicateMatches.length > 0 && (
        <Alert variant="warning" title="Possible Duplicate Medicine Ingredient Detected">
          <p className="text-sm font-medium leading-relaxed">
            Possible duplicate medicine ingredient — ask a pharmacist or prescriber to review.
          </p>
          <div className="space-y-1 bg-amber-100/70 p-3 rounded-lg border border-amber-200 mt-2">
            {duplicateMatches.map((dup, idx) => (
              <div key={idx} className="text-xs text-amber-900 font-medium">
                • <strong>Ingredient "{dup.ingredient}":</strong> found in {dup.medicineNames.join(', ')}
              </div>
            ))}
          </div>
          <p className="text-2xs text-amber-800 italic mt-2">
            Note: Duplicate ingredients are flagged for professional review only. Do not stop or alter any prescribed medicine without talking to your prescriber.
          </p>
        </Alert>
      )}

      {/* Medicines Table / Cards */}
      {medicines.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No Medicines in List"
          description="Upload prescription images to scan candidates or click 'Add Medicine' above."
          action={{
            label: 'Add Medicine Manually',
            onClick: () => addMedicine(),
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="flex items-center justify-between text-sm font-semibold text-navy-500 px-1">
            <span>Showing {medicines.length} medicine(s)</span>
            <span>{confirmedActiveCount} confirmed & active for analysis</span>
          </div>

          {/* Current Medicines Summary Card */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Medicines Summary</span>
                <Badge variant="sky">{confirmedActiveCount} Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicines.filter(m => m.confirmed && m.active).map((med) => (
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
                {confirmedActiveCount === 0 && (
                  <div className="col-span-full text-center py-8 text-navy-500 text-sm">
                    No confirmed active medicines yet. Check the confirmation boxes above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medicine Cards */}
          <div className="space-y-4">
            {medicines.map((med) => (
              <Card
                key={med.id}
                className={`transition-all ${
                  med.confirmed && med.active
                    ? 'border-sky-300 ring-1 ring-sky-200 bg-sky-50/20'
                    : !med.active
                    ? 'border-slate-200 bg-slate-50 opacity-75'
                    : 'border-slate-200'
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top Row Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-4">
                      {/* Confirmed Checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-navy-900 select-none">
                        <input
                          type="checkbox"
                          checked={med.confirmed}
                          onChange={(e) => updateMedicine(med.id, { confirmed: e.target.checked })}
                          className="w-5 h-5 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                        />
                        <span className={med.confirmed ? 'text-sky-900' : 'text-navy-600'}>
                          {med.confirmed ? '✓ Confirmed' : 'Unconfirmed'}
                        </span>
                      </label>

                      {/* Active Toggle */}
                      <button
                        onClick={() => updateMedicine(med.id, { active: !med.active })}
                        className={`text-xs px-3 py-1 rounded-full font-bold transition-colors flex items-center gap-1.5 ${
                          med.active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-200 text-navy-600 border border-slate-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${med.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{med.active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteMedicine(med.id)}
                      className="text-navy-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors text-xs font-semibold flex items-center gap-1"
                      title="Delete row"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>

                  {/* Editable Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Medicine / Brand Name */}
                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-navy-700 uppercase tracking-wider">
                        Medicine / Brand Name
                      </label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedicine(med.id, { name: e.target.value })}
                        className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                        placeholder="e.g. Advil"
                      />
                    </div>

                    {/* Generic Ingredient */}
                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-sky-800 uppercase tracking-wider flex items-center justify-between">
                        <span>Generic Ingredient *</span>
                      </label>
                      <input
                        type="text"
                        value={med.ingredient}
                        onChange={(e) => updateMedicine(med.id, { ingredient: e.target.value })}
                        className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none bg-sky-50/50"
                        placeholder="e.g. ibuprofen"
                      />
                    </div>

                    {/* Strength */}
                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-navy-700 uppercase tracking-wider">
                        Strength
                      </label>
                      <input
                        type="text"
                        value={med.strength}
                        onChange={(e) => updateMedicine(med.id, { strength: e.target.value })}
                        className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                        placeholder="e.g. 200mg"
                      />
                    </div>

                    {/* Form */}
                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-navy-700 uppercase tracking-wider">
                        Form
                      </label>
                      <input
                        type="text"
                        value={med.form}
                        onChange={(e) => updateMedicine(med.id, { form: e.target.value })}
                        className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                        placeholder="e.g. tablet"
                      />
                    </div>

                    {/* Schedule */}
                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-navy-700 uppercase tracking-wider">
                        Schedule
                      </label>
                      <input
                        type="text"
                        value={med.schedule}
                        onChange={(e) => updateMedicine(med.id, { schedule: e.target.value })}
                        className="w-full text-sm font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                        placeholder="e.g. once daily"
                      />
                    </div>

                    {/* Source File (Read-only) */}
                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-navy-700 uppercase tracking-wider">
                        Source
                      </label>
                      <div className="w-full text-sm font-medium text-navy-600 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2">
                        {med.sourceFile || 'Manual Input'}
                      </div>
                    </div>
                  </div>

                  {/* OCR Original Text (Collapsible) */}
                  {med.originalText && med.originalText !== 'Manual Entry' && (
                    <div className="pt-2 border-t border-slate-100">
                      <details className="group">
                        <summary className="cursor-pointer text-xs font-semibold text-navy-600 hover:text-sky-600 flex items-center gap-1">
                          <span>View OCR extracted text</span>
                          <span className="transform group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-2 text-xs text-navy-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          {med.originalText}
                        </p>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link href="/upload" className="text-navy-600 hover:text-navy-900 font-semibold text-sm">
          ← Back to Upload
        </Link>

        {confirmedActiveCount > 0 && (
          <Link href="/symptoms">
            <Button>
              Continue to Symptoms
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}