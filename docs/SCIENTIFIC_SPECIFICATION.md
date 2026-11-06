# Scientific specification

## Input and parsing

The parser accepts upper- and lowercase DNA IUPAC symbols `A C G T R Y S W K M B D H V N`. Whitespace is removed. All other symbols are rejected with their 1-based position in the normalized sequence. FASTA headers begin with `>` and each record must have at least one sequence symbol. Multi-record FASTA is supported. The application retains input in memory and makes no network request.

## Composition and interpretation

Total length counts all accepted symbols. A/C/G/T counts and their percentages are reported. A/C/G/T percentages and GC/AT percentages use the number of unambiguous A/C/G/T bases as the denominator. Ambiguous symbols are reported separately and remain included in total length. A percentage is undefined when no unambiguous bases exist. GC is `(G+C)/(A+C+G+T) × 100`; AT is `(A+T)/(A+C+G+T) × 100`.

Interpretive text describes composition and computational outputs. It does not infer expression, function, phenotype, or clinical meaning from sequence composition alone.

## Strand transformations

Complement uses the IUPAC complement map. Reverse complement reverses the complemented symbols. Coding-strand DNA-to-RNA directly replaces T with U. Template-strand transcription first complements the supplied strand, then replaces T with U. RNA outputs are displayed 5′ to 3′. RNA input and reverse transcription are not supported because the input alphabet is DNA.

## Translation and codon usage

Translation uses NCBI translation table 1 by default, with table 2 (vertebrate mitochondrial code) available by explicit selection. Table 2 reassigns ATA to methionine, TGA to tryptophan, and AGA/AGG to stop. Frames +1/+2/+3 read the supplied sequence from offsets 0/1/2. Frames −1/−2/−3 read the reverse complement from offsets 0/1/2. Incomplete terminal codons are omitted. An ambiguous codon is expanded across all possible concrete codons; a residue is displayed only when all expansions yield the same amino acid or stop, otherwise `X` is displayed.

Codon usage counts complete, unambiguous triplets in the selected frame. Its frequency denominator is the number of such codons; ambiguous triplets are reported separately and excluded. Counts include stop codons.

## Candidate ORFs and coordinates

Candidate ORFs start at `ATG` and end at the first in-frame stop for the selected code: `TAA`, `TAG`, `TGA` for table 1; `TAA`, `TAG`, `AGA`, `AGG` for table 2. The current finder intentionally uses ATG-only initiation in both tables; alternate mitochondrial initiation codons are not modeled. Every start that reaches that stop can yield a candidate, including nested candidates. Start and stop codons are included in the ORF length. The minimum is measured in nucleotides, including the stop. Analysis checks all six frames. Ambiguous codons cannot serve as a start or stop. Reverse-strand coordinates are mapped back to the original input. Coordinates are 1-based and inclusive. Candidate ORFs do not establish a gene or expressed protein.

## Sliding-window GC

The window advances by one nucleotide. Each complete window reports `(G+C)/(A+C+G+T) × 100`; ambiguity is excluded from that window's denominator. A window with no unambiguous base has undefined GC and is omitted from the plotted line. Inputs shorter than three nucleotides do not show a profile. Very large sequences are analyzed locally; the rendered sequence viewer is capped at 12,000 nucleotides for responsiveness.

## Motifs, palindromes, and repeats

Exact motif search uses literal symbol matching; overlapping occurrences are reported. A reverse-complement search also searches the reverse-complemented motif and labels its strand. IUPAC letters in either input are treated as literal symbols in this exact mode, not expanded to possible bases.

A palindrome is a 4–12 nt unambiguous substring that is exactly equal to its reverse complement. Tandem repeats are exact adjacent copies of a 1–6 nt unambiguous unit, with at least three copies. Hits use 1-based inclusive coordinates. These settings are fixed and visible in the interface.

## Pairwise comparison

The comparison uses global Needleman-Wunsch dynamic programming with scores: exact symbol match `+2`, mismatch `−1`, gap `−2`. It aligns complete sequences, supports IUPAC symbols as literal characters, and limits each sequence to 1,500 nt to bound browser memory. Reported identity is exact matches divided by all alignment columns, including gap columns. This is a simple global alignment, not a local database search or a biological homology claim.

## Example sequences and mutation explorer

The synthetic teaching sequence is clearly labelled and is not presented as a biological reference. The HBB example is the first 117 coding nucleotides from Homo sapiens HBB mRNA RefSeq NM_000518.5. Its c.20A>T example illustrates the GAG-to-GTG codon change. Protein residue numbering in mature hemoglobin commonly omits the initiating methionine, which is why the coding variant is called p.Glu6Val in the hemoglobin literature while transcript translation includes the initial methionine.

## Short-oligonucleotide melting-temperature estimate

For an unambiguous sequence of 4–14 nt, the interface shows the Wallace-rule estimate `2 × (A+T) + 4 × (G+C)` °C. This is a rough screening approximation for short oligonucleotides. It is not a measured melting temperature and does not incorporate nearest-neighbour enthalpy/entropy, salt concentration, strand concentration, mismatches, terminal chemistry, or assay conditions. Ambiguous or longer sequences do not receive an estimate. Molecular mass is not calculated.
