# Scientific specification

## Input and parsing

The parser accepts upper- and lowercase DNA IUPAC symbols `A C G T R Y S W K M B D H V N`. Whitespace is removed. All other symbols are rejected with their 1-based position in the normalized sequence. FASTA headers begin with `>` and each record must have at least one sequence symbol. Multi-record FASTA is supported. The application retains input in memory and makes no network request.

## Composition and interpretation

Total length counts all accepted symbols. A/C/G/T counts and their percentages are reported. A/C/G/T percentages and GC/AT percentages use the number of unambiguous A/C/G/T bases as the denominator. Ambiguous symbols are reported separately and remain included in total length. A percentage is undefined when no unambiguous bases exist. GC is `(G+C)/(A+C+G+T) × 100`; AT is `(A+T)/(A+C+G+T) × 100`.

Interpretive text describes composition and computational outputs. It does not infer expression, function, phenotype, or clinical meaning from sequence composition alone.

## Strand transformations

Complement uses the IUPAC complement map. Reverse complement reverses the complemented symbols. Coding-strand DNA-to-RNA directly replaces T with U. For a template-strand DNA sequence supplied 5′ to 3′, transcription reverse-complements it and replaces T with U, yielding an RNA sequence displayed 5′ to 3′. This operation does not infer transcription direction from genomic context. Both RNA outputs are displayed 5′ to 3′. RNA input and reverse transcription are not supported because the input alphabet is DNA.

## Translation and codon usage

Translation uses NCBI table 1 by default. Explicit options are table 2 (vertebrate mitochondrial), table 5 (invertebrate mitochondrial), and table 11 (bacterial, archaeal and plant plastid). Table 2 reassigns ATA to Met, TGA to Trp, and AGA/AGG to stop; table 5 instead assigns AGA/AGG to Ser. Table 11 retains table 1 internal assignments but has additional permitted initiators. Genetic code is never guessed from a source label. Frames +1/+2/+3 read the supplied sequence from offsets 0/1/2. Frames −1/−2/−3 read the reverse complement from offsets 0/1/2. Incomplete terminal codons are omitted. An ambiguous codon is expanded across all possible concrete codons; a residue is displayed only when all expansions yield the same amino acid or stop, otherwise `X` is displayed.

Codon usage counts complete, unambiguous triplets in the selected frame. Its frequency denominator is the number of such codons; ambiguous triplets are reported separately and excluded. Counts include stop codons.

## Candidate ORFs and coordinates

ATG-only initiation remains the conservative default. Optional table-defined initiation uses the NCBI Starts rows:

| Table | Allowed starts when explicitly enabled |
| --- | --- |
| 1 | TTG, CTG, ATG |
| 2 | ATT, ATC, ATA, ATG, GTG |
| 5 | TTG, ATT, ATC, ATA, ATG, GTG |
| 11 | TTG, CTG, ATT, ATC, ATA, ATG, GTG |

These are possible starts across taxa and do not prove initiation at a site. Exact canonical start symbols are required. A candidate ends at the first definite in-frame stop for the selected table. This includes ambiguous triplets whose every expansion is a stop (e.g. TAR in table 1). Mixed stop/sense triplets remain X; candidates crossing X are explicitly flagged because an earlier stop may be concealed. Ambiguity-compatible candidates are not asserted to be definitely open reading frames.

All starts reaching a stop may yield candidates, including nested candidates. Both boundary codons are included in length. Alternative initiators are represented by M only as the first residue of an ORF peptide; raw frame translation and codon usage retain ordinary internal assignments (e.g. GTG remains V). An unresolved-internal-codon count accompanies each ORF.

All six frames are searched. Reverse intervals are mapped to the original input; coordinates are 1-based inclusive and ordered low to high, with a separate strand/frame. Candidate ORFs do not establish a gene or expressed protein. The search does not splice genomic DNA, edit RNA, complete mitochondrial terminal stops by polyadenylation, or model frameshift-dependent termination. NCBI table 2 AGA/AGG assignments remain rule-based; real vertebrate mitochondrial processing may differ.

Source (unspecified, prokaryotic, eukaryotic, organellar) and sequence type (unknown fragment, genomic, coding) are user-supplied context for interpretation, not classifications. They do not change nucleotide arithmetic or silently choose a code. Bacterial initiation commonly uses fMet; archaeal and eukaryotic cytoplasmic initiation normally uses Met. Organellar chemistry and codes vary. M notation does not infer formylation, and no internal methionines are relabeled.

Selecting an ORF or translation tile synchronizes the codon-usage frame. Codon usage covers the **whole selected frame**, including stops, and does not imply that all counted codons belong to the selected ORF. Nucleotide inspection follows this same frame and returns original-input triplet coordinates, including reverse frames and incomplete terminal/leading positions.

## Sliding-window GC

The window advances by one nucleotide. Each complete window reports `(G+C)/(A+C+G+T) × 100`; ambiguity is excluded from that window's denominator. A window with no unambiguous base has undefined GC and is omitted from the plotted line. Inputs shorter than three nucleotides do not show a profile. Very large sequences are analyzed locally; the rendered sequence viewer uses pages of 600 nt on desktop and 120 nt at mobile widths. The position control can reach every input base. Translated frame strips show 60 codons at a time; all codons remain browsable through the first-codon control. Calculations and exports always use the complete input.

## Motifs, palindromes, and repeats

Exact motif search uses literal symbol matching; overlapping occurrences are reported. A reverse-complement search also searches the reverse-complemented motif and labels its strand. IUPAC letters in either input are treated as literal symbols in this exact mode, not expanded to possible bases.

Optional definite-IUPAC motif matching requires the set of bases represented by each input symbol to be a subset of those allowed by the motif symbol. A possible-only match is excluded. Overlap, reverse-strand coordinates and palindromic-pattern deduplication are preserved. A self-reverse-complement pattern is reported once per interval, with + as the representative strand.

A palindrome is a 4–12 nt unambiguous substring that is exactly equal to its reverse complement. Tandem repeats are exact adjacent copies of a 1–6 nt unambiguous unit, with at least three copies. Hits use 1-based inclusive coordinates. These settings are fixed and visible in the interface.

## Pairwise comparison

The comparison uses global Needleman-Wunsch dynamic programming with scores: exact symbol match `+2`, mismatch `−1`, gap `−2`. It aligns complete sequences, supports IUPAC symbols as literal characters, and limits each sequence to 1,500 nt to bound browser memory. Reported identity is exact matches divided by all alignment columns, including gap columns. This is a simple global alignment, not a local database search or a biological homology claim.

Contiguous differences of the same kind are grouped: canonical substitutions, ambiguity-symbol differences, insertions in B relative to A, and deletions from A relative to B. A gap consumes no input coordinate. Indel anchors are the number of consumed input bases before the event; 0 means before the first base. Repeat-associated placements may be equivalent; events are not HGVS-normalized variants. The alignment CSV includes all columns, event boundaries/anchors, actual scoring, identity and its alignment-column denominator. Literal N=N is a symbol match, not proof of nucleotide identity.

## Example sequences and mutation explorer

The synthetic teaching sequence is clearly labelled and is not presented as a biological reference. The legacy HBB teaching fragment is the first 117 coding nucleotides from Homo sapiens HBB mRNA RefSeq NM_000518.5. Its c.20A>T example illustrates the GAG-to-GTG codon change. Protein residue numbering in mature hemoglobin commonly omits the initiating methionine, which is why the coding variant is called p.Glu6Val in the hemoglobin literature while transcript translation includes the initial methionine.

The primary example strip contains complete HBB coding DNA (NM_000518.5, transcript 51–494), natural GFP coding DNA (M62653.1, 26–742), human MT-CO1 (NC_012920.1, 5904–7445, table 2), complete lambda (NC_001416.1, 1–48502, table 11), and the lac region (NC_000913.3, 361200–367550 reverse-complemented, table 11), plus a synthetic TTAGGG × 10 tract. Coding examples use annotated CDS boundaries and published protein expectations. Compare contains matched complete HBB CDSs differing only at c.20A>T. See [curated examples and verification](CURATED_EXAMPLES_REVIEW.md).

Longest ORF selection is display-only and uses actual detected length, with the existing candidate order resolving ties. All candidates remain available, listed longest first in pages of 20. Repeat presentation prioritizes longest non-overlapping tracts, favoring primitive units for equal-length intervals; every shorter, nested or overlapping hit remains in the complete results and exports. The underlying repeat and ORF calculations are unchanged.

## Single-base substitution interpretation

The HBB teaching explorer changes one unambiguous DNA base. A selected base identical to the reference is classified as `unchanged`, not as a synonymous substitution. For complete, unambiguous codons under the standard genetic code, synonymous and missense substitutions are distinguished from stop-gain (`nonsense`), stop-loss, and stop-retained changes. These are codon-level classifications and do not predict transcript processing or the biological impact of a variant.

## Composition statistics

Skews use the oriented input strand: GC skew = `(G−C)/(G+C)`, AT skew = `(A−T)/(A+T)`. Ambiguous symbols do not contribute. A zero denominator is undefined, not zero. Taking the reverse complement negates both skews where defined. These global fragment statistics are not replication-origin predictions.

All 16 dinucleotides count overlapping adjacent unambiguous pairs in the linear input. A pair containing ambiguity is excluded, and adjacency is never bridged across an unknown symbol. Frequency = count / number of counted pairs. Sequence ends are not joined.

CpG count is count(CG). CpG pair percentage divides by counted pairs. The conventional observed/expected statistic is `count(CG) × full length / (count(C) × count(G))`. It is undefined for ambiguous input or absent C/G. This is a composition model, not a methylation assay or CpG-island prediction; short fragments are especially sensitive to sampling and boundary effects.

## Conditional properties and findings

Melting temperature is deferred. The former Wallace value omitted experimental conditions; a future implementation must validate a thermodynamic parameter set and require explicit salt/strand concentration and supported oligonucleotide assumptions. No numerical Tm is currently emitted.

Integrated findings are deterministic calculations from the input and selected settings, with exact counts separated from rule-dependent coding candidates and limits on biological interpretation. Analysis CSV contains the complete input, version, settings, denominators, all frames/ORFs/usage/GC windows/motif and repeat hits, composition statistics, and findings. Print retains complete input/translations/ORFs and lists screen-selected pattern examples with visible display caps; CSV retains all hits. Context and initiation settings accompany both formats. A copied summary contains the same settings and limitations.

## References

- [NCBI genetic-code tables and Starts rows](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi), checked 2026-11-22. Tables 1/2 were already present; the added tables 5/11 and every permitted start are tested against published rows.
- [EMBOSS cpgplot](https://emboss.sourceforge.net/apps/release/6.6/emboss/apps/cpgplot.html): conventional CpG observed/expected interpretation. SeqScope.io does not implement its island classifier.
- [Genome synthesis/translation processing reference](https://www.ncbi.nlm.nih.gov/books/NBK21111/): initiation-specific methionine formylation and internal Met.

## Release additions (23 November 2026)

Mutation Lab accepts general single-record inputs and selected frames/code tables. Substitution positions always refer to the input; reverse-frame triplets are re-derived after substitution. Classifications use codon meanings rather than initiation chemistry. Ambiguous triplets and incomplete frame ends are neutral.

Restriction maps use the five canonical palindromic sites documented in `src/restriction.js`. Recognition intervals are 1-based inclusive; cleavage boundaries count input bases to the left (0..length) on input/aligned-complement strands. Separate linear single-enzyme maps report input-strand fragment intervals and lengths. Exact matches only; ambiguity can hide additional sites. Staggered complementary ends, methylation, reaction activity and circular topology are not inferred. CSV, report and deterministic findings include this method and results. See `docs/FINAL_RELEASE_REVIEW.md` for reference specifications and validation.
