import { countComposition } from './sequence.js';

// The Wallace rule is a rough empirical estimate for short, unambiguous oligonucleotides.
// It is not appropriate for long DNA, high salt, mismatches, or complex reaction conditions.
export function sequenceProperties(sequence) {
  const composition = countComposition(sequence);
  const eligible = sequence.length >= 4 && sequence.length <= 14 && composition.ambiguous === 0;
  return {
    length: composition.length,
    gc: composition.gc,
    wallaceTmC: eligible ? 2 * (composition.counts.A + composition.counts.T) + 4 * (composition.counts.G + composition.counts.C) : null,
    wallaceApplicable: eligible
  };
}
