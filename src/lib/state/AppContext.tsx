'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalyzeOutput } from '../schema/analyzeSchema';

export interface MedicineItem {
  id: string;
  originalText: string;
  name: string;
  ingredient: string;
  strength: string;
  form: string;
  schedule: string;
  active: boolean;
  confirmed: boolean;
  sourceFile?: string;
}

interface AppContextType {
  consent: boolean;
  setConsent: (val: boolean) => void;
  medicines: MedicineItem[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicineItem[]>>;
  addMedicine: (med?: Partial<MedicineItem>) => void;
  updateMedicine: (id: string, fields: Partial<MedicineItem>) => void;
  deleteMedicine: (id: string) => void;
  clearAllMedicines: () => void;
  symptoms: string[];
  toggleSymptom: (symptom: string) => void;
  clearSymptoms: () => void;
  notes: string;
  setNotes: (val: string) => void;
  analysisResult: AnalyzeOutput | null;
  setAnalysisResult: (res: AnalyzeOutput | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  loadFictionalDemoData: () => void;
  clearAllData: () => void;
  acknowledgedDisclaimer: boolean;
  setAcknowledgedDisclaimer: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<boolean>(false);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [acknowledgedDisclaimer, setAcknowledgedDisclaimer] = useState<boolean>(false);

  const addMedicine = (med?: Partial<MedicineItem>) => {
    const newMed: MedicineItem = {
      id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      originalText: med?.originalText || 'Manual Entry',
      name: med?.name || 'New Medicine',
      ingredient: med?.ingredient || 'generic ingredient',
      strength: med?.strength || '10mg',
      form: med?.form || 'tablet',
      schedule: med?.schedule || 'once daily',
      active: med?.active ?? true,
      confirmed: med?.confirmed ?? false,
      sourceFile: med?.sourceFile || 'Manual Input',
    };
    setMedicines((prev) => [...prev, newMed]);
  };

  const updateMedicine = (id: string, fields: Partial<MedicineItem>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...fields } : m))
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAllMedicines = () => {
    setMedicines([]);
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const clearSymptoms = () => {
    setSymptoms([]);
  };

  const loadFictionalDemoData = () => {
    const fictionalMeds: MedicineItem[] = [
      {
        id: 'demo-1',
        originalText: 'DEMO ONLY: Aspirin 81mg tab once daily',
        name: 'Aspirin (Fictional Demo)',
        ingredient: 'aspirin',
        strength: '81mg',
        form: 'tablet',
        schedule: 'once daily',
        active: true,
        confirmed: true,
        sourceFile: 'Fictional Demo Sample 1',
      },
      {
        id: 'demo-2',
        originalText: 'DEMO ONLY: Ibuprofen 400mg tab as needed for pain',
        name: 'Ibuprofen (Fictional Demo)',
        ingredient: 'ibuprofen',
        strength: '400mg',
        form: 'tablet',
        schedule: 'as needed',
        active: true,
        confirmed: true,
        sourceFile: 'Fictional Demo Sample 2',
      },
      {
        id: 'demo-3',
        originalText: 'DEMO ONLY: Listerine mouthwash',
        name: 'Listerine (Fictional Demo)',
        ingredient: 'eucalyptol',
        strength: '0.092%',
        form: 'liquid',
        schedule: 'twice daily',
        active: false, // Inactive demo entry
        confirmed: false,
        sourceFile: 'Fictional Demo Sample 3',
      },
    ];

    setMedicines(fictionalMeds);
    setSymptoms(['Stomach pain / upset', 'Mild nausea']);
    setConsent(true);
    setNotes('Fictional sample note: stomach discomfort after taking meds with water.');
    setAcknowledgedDisclaimer(true);
  };

  const clearAllData = () => {
    setConsent(false);
    setMedicines([]);
    setSymptoms([]);
    setNotes('');
    setAnalysisResult(null);
    setErrorMessage(null);
    setAcknowledgedDisclaimer(false);
  };

  return (
    <AppContext.Provider
      value={{
        consent,
        setConsent,
        medicines,
        setMedicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        clearAllMedicines,
        symptoms,
        toggleSymptom,
        clearSymptoms,
        notes,
        setNotes,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        errorMessage,
        setErrorMessage,
        loadFictionalDemoData,
        clearAllData,
        acknowledgedDisclaimer,
        setAcknowledgedDisclaimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
