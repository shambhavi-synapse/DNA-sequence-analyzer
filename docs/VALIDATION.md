# Validation notes

## Automated checks

Run with `node --test`. The suite uses Node's built-in test runner and no installed packages. The automated suite tests parsing, IUPAC ambiguities, base counts and denominators, complements, transcription, standard and vertebrate mitochondrial translation, six frames, forward and reverse ORF coordinates, code-specific stop handling, sliding GC, exact motif matching, palindromes, tandem repeats, global alignment, codon usage, short-oligo estimate boundaries, workspace route resolution, synthetic teaching examples, and the HBB c.20A>T example. A 64-codon fixture checks the standard code in canonical T/C/A/G codon order. Separate regression fixtures independently check template-strand 5′→3′ orientation, truly single-base substitutions, unchanged and stop-related codon classifications, GC boundary cases, nested and reverse-frame ORFs, ambiguous codon translation, overlapping motif hits, and alignment edge cases.

## Technical regression coverage

`tests/technical-refinement.test.mjs` verifies that cached ORF frame translations reproduce independently translated candidate intervals, including nested and reverse-strand candidates, and that alignment rejects fractional, invalid, or overflowing scoring parameters. It also checks bounded invalid-symbol diagnostics. The ORF map limits rendered marks to the first 250 candidate results without changing the scientific candidate count. FASTA record selection exposes its active button via `aria-pressed`.

The repository has no compilation or bundling step; `node --test` is the supported automated verification command. A passing test run does not establish browser-level accessibility or rendering performance.

## Independent references

- Standard genetic code table: NCBI translation table 1, linked in the README.
- HBB example fragment: NCBI RefSeq NM_000518.5; the embedded example is the coding fragment from positions 1–117.
- ORF comparison: **pending**. An attempt to submit the local synthetic fixture to NCBI ORFfinder reached its viewer, but the viewer returned no usable result rows. The local test suite covers exact forward and reverse coordinates and table-dependent stop codons. Repeat the external comparison with genetic code 1, ATG-only starts, all six frames, complete ORFs, matching minimum-length semantics, and equivalent nested-ORF settings when the reference viewer returns results.

## Known limits

The tests establish deterministic behavior for the covered cases, not complete biological validation. Substitution consequences are standard-code codon-level labels rather than transcript-wide variant annotations. Global alignment uses fixed simple scores and literal IUPAC equality. Motif search is literal, while palindrome/repeat searches omit ambiguity. The displayed Wallace-rule value is only a rough short-oligonucleotide estimate and is not a measured melting temperature. Sequence viewer rendering is capped at 12,000 nt. NCBI ORFfinder comparison remains pending. Browser-based interaction and responsive layout checks are reported separately after live verification.
