# Curated examples and scientific presentation

Completed on 2026-11-23, continuing the uncommitted work from 2026-11-22 on `enhancement/scientific-analysis-20261122`, PR #13. This extends commit `784329d66ddaba77b7e628925165f30ee79b578c`; no merge or live deployment was performed.

## Recovery and scope

The interrupted checkout already contained the six primary-record inputs, compact selector, scientific wording changes, longest-ORF display, repeat prioritization, paging, HBB comparison and focused tests. Those files were preserved. This continuation completed browser verification, keyboard/Go actions for position controls, mobile-sized pages, source deselection after direct input edits, current documentation and the commit/PR update.

The homepage, primary navigation, branding, typography, educational tools, Molecular Notes and analytical engines are preserved. Wording in the analyzer now explains measurements and practical uses first; essential qualifications remain in methodology/context details. The overview has no temperature placeholder. Candidate coding intervals are consistently labeled as candidates.

## Primary records bundled with the static site

Records were retrieved from NCBI efetch GBSeq XML on 2026-11-22. CDS boundaries and independently supplied `/translation` annotations are captured in `tests/fixtures/curated-references.json`. The site imports fixed local sequence data from `src/curated-examples.js`; no runtime database request is required.

| Example | Accession/version and extraction | Input length | Orientation and translation |
| --- | --- | ---: | --- |
| Human HBB complete CDS | [NM_000518.5](https://www.ncbi.nlm.nih.gov/nuccore/NM_000518.5), transcript 51–494, coding 1–444 | 444 nt | Forward spliced CDS in DNA alphabet; table 1; NP_000509.1, 147 residues + stop |
| Human telomeric repeats | Synthetic `TTAGGG` repeated ten times; no accession | 60 nt | Written in TTAGGG 5′→3′ orientation; explicitly synthetic, not a genomic sample |
| Natural Aequorea victoria GFP | [M62653.1](https://www.ncbi.nlm.nih.gov/nuccore/M62653.1), transcript 26–742 | 717 nt | Forward CDS in DNA alphabet; table 1; AAA27721.1, 238 residues + stop; natural GFP, not EGFP |
| Human MT-CO1 | [NC_012920.1](https://www.ncbi.nlm.nih.gov/nuccore/NC_012920.1), 5904–7445 | 1,542 nt | Forward mitochondrial CDS; table 2; YP_003024028.1, 513 residues + terminal AGA under table-2 rules |
| Complete bacteriophage lambda | [NC_001416.1](https://www.ncbi.nlm.nih.gov/nuccore/NC_001416.1), 1–48502 | 48,502 nt | Forward linear reference coordinates; table 11 as annotated for its CDSs; source category remains unspecified because a phage is a virus rather than a prokaryotic cell |
| E. coli K-12 MG1655 lac region | [NC_000913.3](https://www.ncbi.nlm.nih.gov/nuccore/NC_000913.3), 361200–367550 | 6,351 nt | Reverse complement, written in lac transcription direction; table 11 and table-defined initiation. Contains lacI, lacZYA and intervening regulatory context |

The lac input position `p` maps to original reference position `367551 − p`. This region includes complete genes with short flanks, avoiding partial neighboring genes:

| Reference annotation | Input interval | Original NC_000913.3 interval, reverse strand | Protein reference |
| --- | --- | --- | --- |
| lacI | 41–1123 | 366428–367510 | NP_414879.3, 360 residues |
| lacZ | 1246–4320 | 363231–366305 | NP_414878.1, 1024 residues |
| lacY | 4372–5625 | 361926–363179 | NP_414877.1, 417 residues |
| lacA | 5691–6302 | 361249–361860 | NP_414876.1, 203 residues |

lacI has its own transcription unit; it is not presented as part of the lacZYA transcript. These annotations come from the reference records and are shown only as example provenance, not inferred gene identities for arbitrary inputs. The MT-CO1 reference uses the existing table-2 convention; frameshift-dependent mitochondrial termination is still outside the analyzer's model.

A maintainer-only refresh script, `scripts/fetch-curated-examples.py`, records fixed accession/version, extraction parameters, SHA-256, counts and reference translations. `--records-dir` accepts cached GBSeq XML records; pair it with `--retrieved-on 2026-11-22` for this snapshot. Fresh retrieval defaults to the actual current date. It introduces no site or test dependency. Fixed hashes guard against accidental sequence edits.

## Compact selection and complete browsing

- Six horizontal buttons show recognizable titles and input lengths. The selected entry displays its concise introduction and expandable source/analysis suggestions. Selecting an entry loads DNA and documented context without running analysis; Analyze remains explicit. The existing Try an example and secondary Load example actions retain their analysis behavior.
- Earlier synthetic reading-frame/mitochondrial-code demonstrations and HBB fragment/variant remain available under secondary controls; the mutation explorer continues to use its established 117-nt HBB fragment.
- Editing pasted DNA clears selected-reference attribution. FASTA upload also clears that attribution before analyzing the new file.
- The overview shows the longest actual ORF's length, frame, coordinates and total candidate count. Ambiguity is shown when present; no qualifying ORF produces a neutral criteria-based result.
- ORF list/map pages contain 20 candidates; complete peptides are expandable. All detected candidates remain accessible and exportable.
- Repeat presentation promotes maximal non-overlapping tracts. For the synthetic telomere, `TTAGGG × 10`, positions 1–60, appears first; all 11 detections remain in secondary details and exports.
- Sequence pages contain at most 600 base buttons on desktop or 120 at mobile widths; position/Previous/Next controls reach the entire input. Frame strips show 60 codons per frame with full-range codon controls. These are display limits only.

## HBB comparison

The Compare button loads two matched 444-nt HBB CDSs in forward orientation. The reference comes from NM_000518.5:51–494. The alternate is explicitly reconstructed by changing only coding position 20 A→T, documenting [ClinVar variation 15333 / rs334](https://www.ncbi.nlm.nih.gov/clinvar/variation/15333/). GAG→GTG changes translated residue 7 E→V; mature beta-globin numbering omits the initiator and calls it residue 6. This teaching comparison is not patient data or a clinical prediction.

## Validation

- `node --test tests/*.test.mjs`: 155 passing tests, including 10 focused curated-data/presentation tests; no failures.
- Published reference protein strings validate all three primary coding examples, all four lac genes and selected plus/reverse-strand lambda CDSs (nu1, J, cI), including initiation-specific Met and terminal stops. Length, counts, SHA-256, boundary coordinates, motif content and HBB single-substitution identity are checked independently of the presentation.
- `node scripts/build-static.mjs`: 73 static application assets/imports validated. `git diff --check`: passed.
- Chromium: all six examples loaded and analyzed with their selected codes. Observed HBB/GFP/MT-CO1 complete +1 candidates are 444/717/1542 nt; lacZ appears at input 1246–4320, length 3075 nt. Lambda completes with 48502 nt, 49.86% GC, 5094 candidates at minimum 90 nt/table starts and a longest 3399-nt +1 candidate at 15505–18903.
- Lambda desktop rendering contained 600 base buttons, 360 total codon tiles and one featured ORF before opening candidate details. The next candidate page showed 21–40 of 5094. Position navigation reached original base 48502; final-codon navigation also reached the terminal complete triplets.
- Downloaded lambda CSV was parsed: full 48502-nt input, all 5094 ORFs, six translations and 48003 GC windows at width 500. No underlying calculation was truncated. Downloaded HBB alignment CSV retained 444 columns and the sole A/T difference at column 20; UI reports 443 matches, 1 mismatch, 0 gaps and 99.77% identity.
- Light/dark presentation checked at desktop and 375/768-px iframe viewports; the existing RNA codon learning tool also remained functional. At 768 px, client and scroll widths both measured 753 px. At 375 px, document client/scroll widths both measured 360 px (after native scrollbar), with horizontal overflow confined to the example strip and existing internal sequence controls. Mobile lambda used 120 base buttons and position navigation reached 48502. Source selection cleared after custom input edits.

Physical-device touch and native PDF pagination were not visually verified. Restriction mapping and thermodynamic temperature remain the earlier PR's deliberate deferrals; they are not requirements newly omitted from this refinement.
