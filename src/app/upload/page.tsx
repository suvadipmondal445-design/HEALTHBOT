'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, FileImage, Trash2, CheckCircle2, AlertCircle, ArrowRight, Info, Lock } from 'lucide-react';
import { useApp } from '@/lib/state/AppContext';
import { processPrescriptionImageWithOCR, ExtractedCandidate } from '@/lib/ocr/tesseract';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Progress, Spinner } from '@/components/ui/Progress';
import { EmptyState } from '@/components/ui/EmptyState';

interface UploadedFileState {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  statusMessage: string;
  error?: string;
  candidatesCount?: number;
}

export default function UploadPage() {
  const { medicines, setMedicines, clearAllMedicines } = useApp();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileState[]>([]);
  const [isOverallScanning, setIsOverallScanning] = useState<boolean>(false);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const newFileEntries: UploadedFileState[] = filesArray.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      statusMessage: 'Ready for browser OCR scan',
    }));

    setUploadedFiles((prev) => [...prev, ...newFileEntries]);
  };

  const runOcrOnAllFiles = async () => {
    if (uploadedFiles.length === 0) return;
    setIsOverallScanning(true);

    const allNewCandidates: ExtractedCandidate[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const fileItem = uploadedFiles[i];

      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === fileItem.id ? { ...f, status: 'processing', progress: 10, statusMessage: 'Scanning text...' } : f))
      );

      try {
        const candidates = await processPrescriptionImageWithOCR(fileItem.file, (prog, msg) => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileItem.id ? { ...f, progress: prog, statusMessage: msg } : f))
          );
        });

        allNewCandidates.push(...candidates);

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  status: 'completed',
                  progress: 100,
                  statusMessage: `Scanned ${candidates.length} candidate line(s)`,
                  candidatesCount: candidates.length,
                }
              : f
          )
        );
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'OCR scan failed';
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: 'error', progress: 0, error: errMsg, statusMessage: 'Scan failed' }
              : f
          )
        );
      }
    }

    if (allNewCandidates.length > 0) {
      setMedicines((prev) => [
        ...prev,
        ...allNewCandidates.map((c) => ({
          id: c.id,
          originalText: c.originalText,
          name: c.name,
          ingredient: c.ingredient,
          strength: c.strength,
          form: c.form,
          schedule: c.schedule,
          active: true,
          confirmed: false,
          sourceFile: c.sourceFile,
        })),
      ]);
    }

    setIsOverallScanning(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const deleteAllUploadedFiles = () => {
    uploadedFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setUploadedFiles([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-sky-600 p-2 rounded-xl">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900">Upload Prescription Documents</h1>
        </div>
        <p className="text-navy-600 text-base">
          Upload image files of printed prescriptions to extract candidate medicine lines locally in your browser.
        </p>
      </div>

      {/* Guidance Notice */}
      <Alert variant="info">
        <p className="font-semibold">Printed prescriptions work better than handwritten prescriptions.</p>
        <p className="text-sm mt-1">
          OCR extracts text candidates into editable fields. You will be able to review, edit, and confirm every medicine name on the next page.
        </p>
      </Alert>

      {/* File Dropzone */}
      <Card variant="bordered" className="border-dashed border-2 hover:border-sky-400 transition-colors">
        <CardContent className="p-8">
          <input
            type="file"
            id="prescription-upload-input"
            multiple
            accept="image/png, image/jpeg, image/jpg, application/pdf"
            onChange={handleFileSelection}
            className="hidden"
          />
          <label
            htmlFor="prescription-upload-input"
            className="cursor-pointer flex flex-col items-center justify-center space-y-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <FileImage className="w-10 h-10" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-xl font-bold text-navy-900">
                Click to browse or select prescription files
              </p>
              <p className="text-sm text-navy-500">
                Supports JPG, JPEG, PNG image files
              </p>
            </div>
            <Button size="lg" className="bg-sky-600 hover:bg-sky-500">
              Select Files
            </Button>
          </label>
        </CardContent>
      </Card>

      {/* Privacy Guarantee */}
      <Alert variant="privacy">
        <p>
          <strong>Zero Upload Privacy:</strong> Tesseract.js processes images entirely in your browser memory. Files are never transmitted across the network.
        </p>
      </Alert>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Selected Files ({uploadedFiles.length})</CardTitle>
              <Button
                variant="danger"
                size="sm"
                onClick={deleteAllUploadedFiles}
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {uploadedFiles.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-xl p-4 flex gap-4 items-start bg-slate-50/50 hover:bg-slate-50 transition-colors relative"
                >
                  {/* File Preview */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300 flex items-center justify-center">
                    {item.file.type.startsWith('image/') ? (
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileImage className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  {/* File Info & Status */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-navy-900 truncate">{item.file.name}</p>
                      <p className="text-xs text-navy-500">{(item.file.size / 1024).toFixed(1)} KB</p>
                    </div>

                    {/* Status Badge */}
                    {item.status === 'pending' && (
                      <Badge variant="default">Ready</Badge>
                    )}
                    {item.status === 'processing' && (
                      <Badge variant="sky" className="flex items-center gap-1 w-fit">
                        <Spinner size="sm" />
                        Scanning...
                      </Badge>
                    )}
                    {item.status === 'completed' && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Done
                      </Badge>
                    )}
                    {item.status === 'error' && (
                      <Badge variant="danger" className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Error
                      </Badge>
                    )}

                    {/* Progress Bar */}
                    {item.status === 'processing' && (
                      <Progress value={item.progress} showLabel={false} />
                    )}

                    {/* Status Message */}
                    <p className="text-xs text-navy-600 font-medium">{item.statusMessage}</p>

                    {/* Error Message */}
                    {item.error && (
                      <p className="text-xs text-red-600 font-medium">{item.error}</p>
                    )}

                    {/* Candidates Count */}
                    {item.candidatesCount !== undefined && (
                      <p className="text-xs text-sky-700 font-semibold">
                        {item.candidatesCount} candidate(s) extracted
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Scan All Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-sm text-navy-500">
                {uploadedFiles.filter((f) => f.status === 'pending').length} files ready to scan
              </p>
              <Button
                onClick={runOcrOnAllFiles}
                disabled={isOverallScanning || uploadedFiles.every((f) => f.status !== 'pending')}
                isLoading={isOverallScanning}
              >
                Scan All Files
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Upload}
          title="No Files Selected"
          description="Upload prescription images to begin the safety check process."
        />
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link href="/" className="text-navy-600 hover:text-navy-900 font-semibold text-sm">
          ← Back to Home
        </Link>

        {medicines.length > 0 && (
          <Link href="/confirm">
            <Button>
              Review Medicines
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}