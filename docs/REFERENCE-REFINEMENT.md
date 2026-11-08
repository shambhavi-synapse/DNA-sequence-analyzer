# Text-led Molecular Notes refinement

Review branch: `review/seqscope-atlas`, draft PR #10, stacked on the unmerged scientific audit PR #9. This checkpoint supersedes the earlier geographic-source target and process-image layouts. Main and GitHub Pages remain unchanged.

## Implemented

All twelve Essential Concepts now use a number, heading, one reading body, selective small sequence examples and compact Further reading links. The three large process illustrations are removed from the entries; their source assets remain available. Explanations cover mechanisms, consequences and limitations in approximately 90–106 words per concept. The successful nucleosome hero and homepage artwork remain, with shorter conceptual captions. Four relevant links connect concepts to existing pairing, codon, mutation and comparison tools.

The reported narrow column was caused by a new research aside being auto-placed in the 50px index track. Each article now groups all prose and citations into a dedicated `note-body` grid item. Removed obsolete transcription/translation ID-specific layout rules that overrode the shared reading layout. All thirty topics use unified Further reading groups, with no country-specific boxes or source quota.

Interactive surfaces use theme-specific brighter surfaces, multi-layer shadows, upper-edge highlights, consistent moderate radii and visible selected states. The selected example styling now follows its actual `aria-pressed` state. Fixed inherited low-contrast secondary labels, sequence coordinates, frame counts and Mutation Lab feedback. Preserved reduced-motion guards and the scientific engine.

## Source corrections

| Change | Scientific reason |
| --- | --- |
| Removed RRF/EF-G recycling paper, DOI 10.1093/emboj/20.11.2977 | Ribosome recycling does not directly establish reading-frame selection. Added the Molecular Biology of the Cell RNA-to-protein chapter alongside NCBI code tables. |
| Removed chemosensory catalogue, DOI 10.3389/fgene.2022.878134 | It does not independently verify the specific coriander association. Retained Eriksson et al. and its cohort qualification. |
| Removed HBG-promoter editing paper, DOI 10.1186/s13287-024-04117-0 | Different locus and intervention from the HBB coding substitution illustrated here. Retained the directly relevant GeneReviews source. |
| Replaced general IISc lab link with Ahmed et al., 2017, DOI 10.1371/journal.pgen.1006754 | Direct transcription/topoisomerase recruitment study in mycobacteria. Presented as DNA torsional-stress context, not discovery of basic transcription. |
| Added replication, chromatin-packaging and RNA-to-protein textbook chapters | Foundations now link to the mechanisms actually explained rather than relying on adjacent specialized studies. |
| Added IUPAC sequence nomenclature and NHGRI tandem-repeat definitions | Direct support for ambiguity symbols and repeat terminology. |

Retained relevant research from IISc, CSIR–IGIB/CCMB, NCBS, NIPGR and IISER Bhopal, with organism, cohort, assay and correlation limitations where needed. The provenance catalogue contains twelve India-affiliated papers and five teaching/data resources; nationality does not determine inclusion or presentation. Earlier source-count targets in historical documents are no longer requirements. Specialized RECQL5 work is explicitly about stalled forks, rice H4 work about a plant histone variant, and methylation/splicing work is not presented as proof of causality.

Authoritative foundations added: NCBI Bookshelf NBK26850, NBK26829 and NBK26834; IUPAC-IUB nucleotide nomenclature at iubmb.qmul.ac.uk/misc/naseq.html. Paper identifiers and affiliation evidence are in INDIAN-SOURCES.json. External retrieval verified scientific titles and relevance; no promise is made that every publisher allows unrestricted full-text access.

## Executed verification

- `node --test`: **68 passed, 0 failed**. Includes the scientific audit, coordinates, examples, ORF display lanes, provenance, removed mismatched citations and two new structural regressions for text-led concepts and grouped reading bodies.
- JavaScript syntax checks for app/navigation and `git diff --check`: passed.
- Chrome desktop viewport 1363×936 and responsive iframe widths 320, 360, 390, 650, 700, 768, 820, 1024 and 1200 px, 844 px high, both themes. All twelve concept bodies remain readable; minimum measured body width is 265px at the 320px frame. No page-level horizontal overflow, large concept images or country research blocks. Thirty reading groups present. Scrollbars reduce CSS content width by 15px.
- All five routes checked at 390 and 768 px in both themes, with no page overflow. Representative desktop, mobile and tablet screenshots are in review/essential-concepts-*; dark analyzer surfaces in review/analyzer-elevation-dark.jpg. These are responsive desktop Chrome frames, not physical-device tests.
- Read-only computed text-color checks found faint secondary labels; corrected and rechecked visible text in all five routes and both themes after transitions settled. This is targeted contrast testing, not a full accessibility certification; raster-image and SVG internal text are outside that check.
- Synthetic example remains 39nt and 56.41% GC; comparison of ATGGAG and ATGGTG gives 83.33% identity, five matches and one mismatch. Pairing G→C/three bonds, RNA UUG→Leu and HBB c.20A>T→GTG/Val/missense checked. Concept-to-codon route works. No scientific calculation module changed.

This repository has no bundler or production build command. Production preparation copies the existing static HTML, four stylesheets, runtime modules and local assets; the isolated preview package is checked against these tested files.

## Remaining review limits

Keep both PRs unmerged and production untouched. Owner visual/logo approval remains necessary. The hosted owner-private preview may require ChatGPT sign-in; local exact-source browser checks are distinct from authenticated hosted verification. Physical-device, screen-reader and OS-level reduced-motion emulation were not performed. Reduced-motion CSS/source guards remain present. External NCBI ORFfinder comparison remains pending from the earlier scientific validation and is not claimed as completed.
