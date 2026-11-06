# Validation notes

## Automated checks

Run with `node --test`. The suite uses Node's built-in test runner and no installed packages. It includes hand-checked examples for parsing, IUPAC ambiguities, base counts and denominators, complements, transcription, translation, six frames, forward and reverse ORF coordinates, sliding GC, exact motif matching, palindromes, tandem repeats, global alignment, codon usage, and the HBB c.20A>T example. A 64-codon fixture checks the standard code in canonical T/C/A/G codon order.

## Independent references

- Standard genetic code table: NCBI translation table 1, linked in the README.
- HBB example fragment: NCBI RefSeq NM_000518.5; the embedded example is the coding fragment from positions 1–117.
- ORF comparison: **pending**. Compare against NCBI ORFfinder using genetic code 1, ATG-only starts, all six frames, complete ORFs, matching minimum-length semantics, and equivalent nested-ORF settings. Record exact test input, settings, coordinates, and results here when performed.

## Known limits

The tests establish deterministic behavior for the covered cases, not complete biological validation. Global alignment uses fixed simple scores and literal IUPAC equality. Motif search is literal, while palindrome/repeat searches omit ambiguity. No molecular-weight or melting-temperature estimate is provided. Sequence viewer rendering is capped at 12,000 nt. NCBI ORFfinder comparison remains pending.
