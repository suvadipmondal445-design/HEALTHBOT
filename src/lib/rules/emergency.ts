export const EMERGENCY_RED_FLAGS = [
  "severe breathing difficulty",
  "swelling of lips, face, tongue, or throat",
  "fainting",
  "sudden confusion",
  "severe chest symptoms",
] as const;

export function checkEmergencyRedFlags(selectedSymptoms: string[]): {
  isEmergency: boolean;
  matchedFlags: string[];
} {
  const lowerSymptoms = selectedSymptoms.map((s) => s.toLowerCase());
  const matchedFlags = EMERGENCY_RED_FLAGS.filter((flag) =>
    lowerSymptoms.some((s) => s.includes(flag.toLowerCase()) || flag.toLowerCase().includes(s))
  );

  return {
    isEmergency: matchedFlags.length > 0,
    matchedFlags,
  };
}
