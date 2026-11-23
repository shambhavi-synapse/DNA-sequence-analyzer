# SeqScope release verification · 23 November 2026

## Recovery and scope

PR #13 already contained the scientific engine corrections, sequence context, tables 1/2/5/11, deterministic findings, six curated examples, complete HBB comparison, ORF/repeat hierarchy and paginated long-sequence displays. Baseline: 155 passing tests, 73 validated static files. The deployed main branch (342ad5c) still displayed four earlier oversized teaching examples. The missing live features were undeployed work, not missing sequence data. PR #12 is separate README polish and was left untouched.

This release preserves those implementations. It adds a general coding-substitution inspector, linear restriction maps, targeted result ordering, a secondary selector restricted to earlier teaching sequences, complete printed pattern results and reproducible laboratory results in CSV/report/findings. Branding, homepage, Notes and the existing engines are retained.

## Independent primary-record recheck

Fresh NCBI efetch GBSeq XML retrieval on 23 November 2026 matched every biological example's existing SHA-256 fixture. Published `/translation` qualifiers matched the independent protein fixtures, including lacI/Z/Y/A. The original acquisition dates and data remain unchanged. Coordinates below are 1-based inclusive.

| Example | Reference and boundaries | Orientation | Length | Code |
| --- | --- | --- | ---: | --- |
| Human HBB complete CDS | NM_000518.5 transcript 51–494 | Forward; spliced CDS | 444 nt | 1 |
| Human telomeric tract | Synthetic TTAGGG × 10; no accession | As constructed | 60 nt | 1; noncoding demonstration |
| Natural Aequorea victoria GFP | M62653.1 CDS 26–742, AAA27721.1 | Forward | 717 nt | 1 |
| Human MT-CO1 (record COX1) | NC_012920.1 5904–7445, YP_003024028.1 | Forward | 1,542 nt | 2 |
| Complete bacteriophage lambda | NC_001416.1 1–48502 | Forward, linear | 48,502 nt | 11 |
| E. coli K-12 MG1655 lac region | NC_000913.3 361200–367550 | Reverse complement | 6,351 nt | 11 |

The GFP source record is 966 nt; the bundled complete CDS is the verified 717-nt feature, not the full record. The lac interval includes complete lacI and lacZYA plus intervening regulatory context; lacI is a separate transcription unit. Mitochondrial table 2 termination is explicitly rule-based; RNA processing/frameshift termination is not modeled. Reference locations, extraction URLs, protein fixtures and checksums remain in `tests/fixtures/curated-references.json` and the existing curation report.

## Added scientific behavior

- Mutation Lab accepts one DNA/FASTA sequence, a 1-based input coordinate, canonical replacement, any of six reading frames and code 1/2/5/11. Reverse frames complement the altered input base before codon comparison. Incomplete/ambiguous codons receive neutral statuses. Classifications cover unchanged, synonymous, missense, nonsense, stop-loss and stop-retained. It compares table-specific codon meanings, without inferring initiation effects. The complete HBB c.20A>T example is an optional compact preset; existing synthetic lessons remain expandable.
- Restriction mapping: EcoRI G/AATTC (1/5), HindIII A/AGCTT (1/5), BamHI G/GATCC (1/5), PstI CTGCA/G (5/1), NotI GC/GGCCGC (2/6). Verified against the [NEB recognition-specificity chart](https://www.neb.com/tools-and-resources/selection-charts/alphabetized-list-of-recognition-specificities). Offsets count bases from the recognition interval's left edge on input and aligned complementary strands. All five sites are reverse-complement palindromes; each interval is counted once.
- Linear-only, separate single-enzyme maps. Recognition intervals are distinguished from cleavage boundaries. Fragment lengths partition the input strand at its cuts; staggered complementary ends differ. Exact canonical matches only. The interface and exports state that ambiguity can conceal extra sites and that methylation, enzyme activity, end-flanking requirements and digestion efficiency are not predicted.
- Printed motif/repeat/palindrome results now come from complete calculations rather than the paginated screen DOM. CSV retains all recognition sites, strand-cut boundaries, fragment intervals, data source, method and topology.

## Verification

- `node --test`: 168 passed, zero failed. Thirteen focused release tests add independent hand-calculated cleavage/fragment expectations, the established lambda EcoRI pattern, frame/code-specific substitutions, real HBB variant matching, exports and result-order checks. Existing tests cover ambiguity/denominators, transformations, translation tables, overlapping/reverse ORFs, motifs/repeats, GC windows, alignment and source proteins/counts.
- `node scripts/build-static.mjs`: 74 application assets/imports validated. `git diff --check` passed. No dependency, backend, runtime API or paid service added.
- Chromium: all six examples loaded and analyzed. HBB longest 444 nt +1; GFP 717 nt +1; MT-CO1 1542 nt +1 with table 2; lac longest 3075 nt +1, 1246–4320; lambda longest 3399 nt +1, 15505–18903, 5094 candidates at the example settings. Telomere primary repeat is TTAGGG × 10, 1–60; all 11 detections remain accessible.
- Lambda browser exports independently parsed: CSV and FASTA retain the identical 48502-nt sequence/hash; CSV contains all 5094 ORFs, six full translations, 48003 complete 500-nt GC windows and all 44 recognition sites in the five-enzyme set. EcoRI has five sites, with input-strand fragments 21226, 4878, 5643, 7421, 5804, 3530 nt. The standard sorted pattern is 21226, 7421, 5804, 5643, 4878, 3530.
- Browser HBB comparison: 443 matches, one A→T substitution at position 20, zero gap columns, 444 columns. GAG→GTG is Glu7Val in the translated precursor, mature-chain Glu6Val.
- Browser Mutation Lab: HBB preset, current-input loading, reverse-frame CTC→CAC input substitution yielding GAG→GTG, and TGG→TGA under table 2 (synonymous Trp) verified. Invalid input and ambiguous composition checked. Reading-frame selection drives nucleotide inspection.
- Desktop and 375-px iframe mobile layouts checked in light/dark themes. Mobile selector height 83 px, horizontal scroll range 1219 px within 320 px. No document overflow (360 px content/viewport). Lambda viewer renders 600 desktop/120 mobile nucleotide buttons rather than its entire input; codon and ORF pages retain complete underlying calculations.
- Print preparation checked in browser: telomere report contains all 10 motif rows, 11 repeat rows, and laboratory results. Native printer/PDF pagination and physical-device touch are not claimed as verified.

## Release gate and limits

The user explicitly authorized merging PR #13 and deploying after checks pass. CI must pass on the final PR head before merge; the main-branch Pages workflow must then pass its own tests and static build. Live deployment and post-deployment browser results are recorded in the final delivery/PR status after observation.

Tm remains deferred until a validated thermodynamic model and required experimental conditions exist. Circular restriction mapping is optional and deferred to keep this release focused; the UI explicitly labels linear topology. No clinical, expression, gene-function or regulation prediction is introduced.
