import { createWorker } from 'tesseract.js';

export interface ExtractedCandidate {
  id: string;
  originalText: string;
  name: string;
  ingredient: string;
  strength: string;
  form: string;
  schedule: string;
  sourceFile: string;
}

export async function processPrescriptionImageWithOCR(
  file: File,
  onProgress?: (progress: number, status: string) => void
): Promise<ExtractedCandidate[]> {
  // Validate browser File object
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file (JPG, JPEG, PNG). Printed prescription images work best.');
  }

  onProgress?.(10, 'Initializing local OCR engine...');
  const worker = await createWorker('eng');

  try {
    onProgress?.(30, 'Scanning text in browser...');
    const ret = await worker.recognize(file);
    onProgress?.(80, 'Parsing candidate medicine lines...');

    const rawLines = ret.data.text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 2);

    const candidates: ExtractedCandidate[] = parseCandidateLines(rawLines, file.name);

    onProgress?.(100, 'OCR complete.');
    await worker.terminate();

    return candidates;
  } catch (err) {
    await worker.terminate();
    throw new Error(`Browser OCR scan failed: ${err instanceof Error ? err.message : 'Unable to read image'}`);
  }
}

// Heuristic line parser to identify medicine-like lines
function parseCandidateLines(lines: string[], fileName: string): ExtractedCandidate[] {
  const candidateList: ExtractedCandidate[] = [];

  const strengthRegex = /(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu|units?))/i;
  const formRegex = /(tablet|tablets|tab|capsule|capsules|cap|syrup|solution|cream|ointment|injection|patch)/i;
  const scheduleRegex = /(once|twice|thrice|daily|every|hours?|hrs?|b\.?i\.?d|t\.?i\.?d|q\.?i\.?d|p\.?r\.?n|at bedtime)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Filter out common header words
    if (/^(rx|doctor|patient|date|pharmacy|address|tel|phone|refill|signature)/i.test(line)) {
      continue;
    }

    const hasStrength = strengthRegex.test(line);
    const hasForm = formRegex.test(line);
    const hasSchedule = scheduleRegex.test(line);

    // If line has strength, form, schedule, or capitalized words
    if (hasStrength || hasForm || hasSchedule || /^[A-Z][a-z]{3,}/.test(line)) {
      const strengthMatch = line.match(strengthRegex);
      const formMatch = line.match(formRegex);
      const scheduleMatch = line.match(scheduleRegex);

      // Clean up extracted medicine name
      let cleanedName = line
        .replace(strengthRegex, '')
        .replace(formRegex, '')
        .replace(scheduleRegex, '')
        .replace(/[^\w\s-]/g, '')
        .trim();

      if (!cleanedName || cleanedName.length < 2) {
        cleanedName = line;
      }

      candidateList.push({
        id: `ocr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        originalText: line,
        name: cleanedName,
        ingredient: cleanedName, // Default generic ingredient to candidate name for user review
        strength: strengthMatch ? strengthMatch[0] : '',
        form: formMatch ? formMatch[0] : '',
        schedule: scheduleMatch ? scheduleMatch[0] : '',
        sourceFile: fileName,
      });
    }
  }

  // Fallback if no specific medicine lines matched: return non-empty lines for user review
  if (candidateList.length === 0 && lines.length > 0) {
    for (const line of lines.slice(0, 5)) {
      candidateList.push({
        id: `ocr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        originalText: line,
        name: line,
        ingredient: line,
        strength: '',
        form: '',
        schedule: '',
        sourceFile: fileName,
      });
    }
  }

  return candidateList;
}
