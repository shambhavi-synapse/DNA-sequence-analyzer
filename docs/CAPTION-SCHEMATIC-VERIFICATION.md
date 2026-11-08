# Caption and scientific schematic correction

Review checkpoint: 8 November 2026. Branch `review/seqscope-atlas`, draft PR #10. No changes to main, the production website, hosting audience, logo or scientific engines.

## Source recovery and preview discrepancy

The starting GitHub head was `325a752001fd9763ea17e32f5c0fb54014a91cfc`. The workspace already contained uncommitted caption, Reading/Overview and authored SVG changes from the interrupted pass. The private Site was still version 6, with source SHA `3e6c1834094acfb77d813963568d92c7633d984f`. Consequently the hosted old caption was real, rather than a claim that the browser alone had failed to refresh. This batch finishes, tests, commits and packages those source changes. The final GitHub SHA and preview receipt are mapped in PR #10 after publication.

The single live nucleosome caption is exactly **Molecular illustration · Not to scale**. Its former text is removed from application source. It uses 11 px text, no badge, near the lower-right of the artwork. Accurate descriptive alt text is retained. Historical documentation and baseline comparison screenshots deliberately retain evidence of the previous caption; they are excluded from the runtime build.

## Diagram audit and actual changes

| Area | Previous presentation | Implemented change and scientific check |
| --- | --- | --- |
| Notes: complementary pairing | Prose without a paired-strand schematic | Authored SVG with 5′ ATGCA 3′ above 3′ TACGT 5′, opposed backbone arrows and canonical 2/3 hydrogen-bond counts. Dotted lines do not claim atomic geometry. |
| Notes: replication | Prose without a fork schematic | Right-moving fork, antiparallel parental templates, continuous leading daughter arrow toward the fork and left-growing Okazaki fragments. RNA primers are at fragment 5′ ends. Enzymes and the leading initiation primer are explicitly omitted. |
| Notes: transcription | Prose without aligned DNA/RNA | Coding 5′ ATGGCTTAA 3′, template 3′ TACCGAATT 5′ and RNA 5′ AUGGCUUAA 3′. Template reading and RNA synthesis arrows are labeled separately. RNA processing is not shown. |
| Notes: codons and translation | One small AUG / GCU / UAA strip | SVG aligns three offsets of the same synthetic RNA, with Met/Ala/stop, Trp/Leu and Gly/Leu. Incomplete tails are visibly distinguished and not translated. Stop is a signal, not an amino acid. |
| Explore: base pairing | Two names separated by repeated dots | Selected pair is an SVG with labeled bases, full names, purine/pyrimidine classes and exactly two or three bond lines. All four choices update the diagram. Lettered fields are not chemical structures. |
| Notes: strand orientation | Direction labels and disconnected A:T / G:C text | Aligned 5′ ATGC 3′ / 3′ TACG 5′ sequence rows and the explicit reverse complement 5′ GCAT 3′. This compact sequence example uses real fixed-width text. |

Unchanged: the 11 compact genomic-phenomena schematics in the Curious/Genomics disclosures, the Codon Builder's existing selection workflow, the mutation examples, analyzer result charts and scientific calculation engines. No new ribosome, protein or atomic molecular structure is claimed. The four new Notes SVGs and the interactive pair are generated from authored constants in `src/schematics.js`, not from user input or generated molecular artwork.

## Biological references

Existing topic references are retained. The diagram checks use:

- Alberts et al., *Molecular Biology of the Cell*: [DNA structure](https://www.ncbi.nlm.nih.gov/books/NBK26821/), [replication mechanisms](https://www.ncbi.nlm.nih.gov/books/NBK26850/), [DNA to RNA](https://www.ncbi.nlm.nih.gov/books/NBK26887/), [RNA to protein](https://www.ncbi.nlm.nih.gov/books/NBK26829/).
- [NCBI genetic codes](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi) and the [INSDC code tables](https://www.insdc.org/submitting-standards/genetic-code-tables/).

NCBI direct retrieval presented a browser-check page during research; indexed primary-source text was available. This is not evidence that every external link is continuously reachable. No nationality-based source blocks or additional loosely related references were introduced.

## Automated and source checks

Executed `node --test`: **116 passed, 0 failed**. Executed `node scripts/build-static.mjs`: **51 application files plus the deterministic release manifest**. JavaScript syntax and `git diff --check` pass. HTML containers are balanced, every topic has a unique anchor and the old live caption is absent.

Twenty additional tests cover the new Notes controls, diagrams, caption and scientific verification. Published expected strings check all 64 codons in each of tables 1 and 2. Exhaustive alignment enumeration checks 196 short A/C input pairs. Independent ORF interval enumeration checks 688 combinations of sequence, code and minimum length. Tests also cover incomplete codons, ambiguity, malformed FASTA, large composition input and every small sliding-GC window. No scientific engine correction was required. An initially incorrect handwritten expected peptide for an eight-base reverse frame was recalculated and corrected in the test fixture.

The core sequence, translation, mutation and global-alignment files retain the same Git blob SHAs as PR #9 (`7e5cb7c1eb02a963c200906843558b99333f74a1`). These checks supplement rather than replace the pending NCBI ORFfinder comparison.

## Actual Chrome verification

QA used the production-equivalent static output, with an excluded responsive iframe harness. Widths **320, 390, 768 and 1200 px**, height 900 px, light and dark themes. These are desktop Chrome responsive frames, not physical phone devices. `review/correction-browser-checks.json` records eight measured states. No horizontal document overflow occurred; wide Notes diagrams retain readable labels and scroll inside their own focusable regions. The selected-pair diagram was additionally adapted to fit the 320 px layout without internal clipping.

Verified in the rendered application:

- Exactly one new nucleosome caption; no old caption in the visible page. Desktop and mobile placement checked. A tablet clipping defect was found and corrected: its final measured right inset is 24 px.
- Mobile hero height reduced from approximately 649 to 508 px at 390 px frame width. Molecular artwork remains visible rather than uniformly faded.
- All four authored Notes SVGs inspected in desktop dark mode and mobile light mode. Standalone SVG proof also records both palettes. Base-pair selections A/T/G/C inspected; names, complementary partners, classes and bond counts update correctly.
- Reading/Overview shows 30 topic links; selecting a topic opens Reading at that article. Native focusable regions permit internal keyboard scrolling; only the diagram region scrolls horizontally.
- Synthetic analyzer example: 39 nt, GC 56.41%, AT 43.59%, zero ambiguous symbols, two candidate ORFs at the example threshold.
- Comparison ACGT / ACGGT: 80% identity, four matches, zero mismatches, one gap column, score 6.
- The collected error-log sample contained Chrome extension metadata errors, not application exceptions. This is not a claim that every possible browser error or interaction was tested.

Before screenshots use the committed baseline application copied under a QA-only directory. After screenshots use the new source. Neither the baseline copy nor the QA harness is packaged. Comparison sheets only crop the responsive frame or corresponding panel and add Before/After headings; they do not alter application pixels.

- [Mobile hero comparison](review/correction-hero-comparison.jpg)
- [Explore pairing comparison](review/correction-pairing-comparison.jpg)
- [Before codon display](review/correction-before-desktop-frames-dark.jpg) / [after reading-frame SVG](review/correction-after-desktop-frames-dark.jpg)
- [Before replication](review/correction-before-desktop-replication-dark.jpg) / [after](review/correction-after-desktop-replication-dark.jpg)
- [Before transcription](review/correction-before-desktop-transcription-dark.jpg) / [after](review/correction-after-desktop-transcription-dark.jpg)
- [Before pairing](review/correction-before-desktop-pairing-dark.jpg) / [after](review/correction-after-desktop-pairing-dark.jpg)
- [Before orientation](review/correction-before-desktop-orientation-dark.jpg) / [after](review/correction-after-desktop-orientation-dark.jpg)
- [Tablet hero after correction](review/correction-after-tablet-hero-light.jpg)

## Hosted verification and release boundary

The existing private URL is https://seqscope-pr10-review.tiwyamini.chatgpt.site . In this cloud browser it displays **Log in to access**. The previously declined sign-in request was not repeated and private access was not bypassed or widened. The deployment receipt and artifact hashes can establish source parity, but do not establish authenticated hosted visual QA. That final requirement remains incomplete until the owner can inspect the refreshed private application or an authorized authenticated browser session is available.

No merge or production deployment is approved. Keep the controlled single-integration release procedure in `RELEASE-READINESS.md`. Preserve the previous successful production artifact/revision for an authorized rollback. Native FASTA download completion, native print output, physical devices, screen readers and external ORFfinder comparison remain outstanding checks from the earlier review.
