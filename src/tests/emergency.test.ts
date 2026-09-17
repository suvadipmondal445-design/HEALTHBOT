import { describe, it, expect } from 'vitest';
import { checkEmergencyRedFlags } from '../lib/rules/emergency';

describe('Emergency Red-Flag Priority', () => {
  it('triggers emergency flag on severe breathing difficulty', () => {
    const symptoms = ['headache', 'severe breathing difficulty'];
    const result = checkEmergencyRedFlags(symptoms);
    expect(result.isEmergency).toBe(true);
    expect(result.matchedFlags).toContain('severe breathing difficulty');
  });

  it('triggers emergency flag on throat swelling', () => {
    const symptoms = ['swelling of lips, face, tongue, or throat'];
    const result = checkEmergencyRedFlags(symptoms);
    expect(result.isEmergency).toBe(true);
  });

  it('does not trigger emergency flag on mild symptoms', () => {
    const symptoms = ['Mild headache', 'Nausea'];
    const result = checkEmergencyRedFlags(symptoms);
    expect(result.isEmergency).toBe(false);
    expect(result.matchedFlags).toHaveLength(0);
  });
});
