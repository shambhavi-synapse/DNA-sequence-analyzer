# Scientific specification

## Input alphabet and parsing

Sequences accept uppercase or lowercase DNA IUPAC symbols `A C G T R Y S W K M B D H V N`. Whitespace is removed. Every other non-whitespace character is an error with its position in the normalized sequence. FASTA headers begin with `>` and each header must have at least one sequence symbol. Multiple records are supported. Input is retained in memory only; there is no network request.

## Composition

Total length counts every accepted symbol. Counts and percentages are reported for A/C/G/T. Their percentages, GC and AT percentages use the number of unambiguous A/C/G/T bases as denominator. Ambiguous bases are reported separately and excluded from those fractions, never silently removed from the sequence or length. Values are undefined when no unambiguous bases exist.

## Strand operations

Complement uses the IUPAC complement map. Reverse complement is the complement in reverse order. The coding-strand DNA-to-RNA operation substitutes U for T. Template-strand transcription first complements the input strand, then substitutes U for T. Both products are displayed 5′ to 3′. Reverse transcription is not implemented because RNA input is outside the accepted DNA alphabet.

## Translation

Translation uses NCBI translation table 1, the standard genetic code. Frames +1/+2/+3 translate the supplied strand from offsets 0/1/2. Frames −1/−2/−3 translate the reverse complement from offsets 0/1/2. Incomplete terminal codons are omitted. For ambiguous codons, all possible concrete codons are enumerated: a residue is shown only if all expansions encode the same amino acid or stop; otherwise `X` is shown. A stop is `*`. These six translations are computational frames, not evidence of functional proteins.

## ORFs and coordinates

Candidate ORFs start at `ATG` and end at the first in-frame `TAA`, `TAG` or `TGA` on that strand. Start and stop codons are included in ORF length. Only complete ORFs are reported. Minimum length is measured in nucleotides and includes the stop codon. Analysis examines all six frames and reports each ATG start that reaches the next in-frame stop, so nested candidates are included when they meet the length threshold. Coordinates are 1-based and inclusive relative to the input sequence, including reverse-strand coordinates mapped back to the input sequence. Candidates are not experimentally verified genes. Ambiguous codons cannot start or stop an ORF.

## GC profile and limits

The sliding-window profile advances one nucleotide and reports the fraction of G/C among A/C/G/T in each complete window. Ambiguity is excluded from each window denominator; windows with no unambiguous base are gaps. No window is shown if the selected window exceeds sequence length. Computation is client-side; very large sequences can consume browser memory and time. The sequence display caps rendered bases at 12,000 while calculations use the full input.

## Validation status

The automated suite uses hand-checked edge cases and canonical genetic code entries. NCBI ORFfinder comparison has not yet been performed; its settings need to match this implementation's ATG-only start rule, all six frames, complete-ORF requirement, minimum length including stop, and coordinate convention. Do not interpret the tests alone as external validation.
