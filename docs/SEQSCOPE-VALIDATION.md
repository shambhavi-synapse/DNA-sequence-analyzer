# SeqScope visual refinement

Implemented on `redesign/seqscope`, based on main `f6173e3`. No scientific calculation engine or alignment scoring algorithm was replaced.

## Changes
- SeqScope navigation wordmark, inspection-field SVG symbol, favicon and standalone light/dark wordmarks. Existing repository address retained.
- Graphite/vermilion/ivory theme tokens, accessible nucleotide colors, revised hero, overview, composition, transformations, charts, comparison and Notes presentation.
- GC selected-window band, cursor and point; direct plot selection plus keyboard range control. Coordinates use the existing complete-window calculations.
- Inline six-frame DNA/RNA/amino-acid inspection, reverse-strand context and explicit locate action. Keyboard-selectable ORF map synchronized with candidate list and sequence highlight.
- Nucleotide buttons with accessible position labels; 12-base mobile rows keep complementary strands aligned. Codon filter preserves whole-frame frequency denominators.
- Example selected state, clear-input control, concise artwork captions and reduced-motion-safe JavaScript scrolling.
- Original ribosome editorial artwork, locally optimized WebP at 1536 and 768 source widths. Existing hero and chromatin images preserved. Generated artwork is explicitly not a structural reference.

## Scientific verification
`node --test`: 45 passed, 0 failed. Includes existing scientific/regression suite and new reference-fixture, palette contrast, local asset and chart-coordinate tests. `node --check src/app.js` and `git diff --check` passed.

HBB was retrieved from NCBI EFetch on 2026-11-07. NM_000518.5 CDS is transcript 51..494. The bundled 117-base fragment exactly matches transcript 51..167, coding 1..117, positive transcript orientation. The independent source snapshot is recorded in `tests/fixtures/hbb-refseq.json`. The c.20A>T teaching substitution changes coding residue 7 E to V. The fragment is spliced and incomplete, not a genomic interval.

## Browser checks
Chrome desktop 1363×936 and fixed responsive iframe viewports 390×844 and 768×1024. These are browser viewport tests, not physical phones/tablets. All four routes checked in light and dark; no page-level horizontal overflow. Tablet checks used keyboard activation where the automation pointer did not align with the scrolled outer iframe.

Verified: example loading, synthetic 39 nt and GC56.41%; GC window2–31 gives56.67% and highlights30 bases; reverse frame−1 CTA/CUA/Leu at37–39; ORF keyboard selection +1 1–24 MAIVMGR*; methionine codon filter ATG2/13=15.4%; comparison ACGT/AGT75% identity with B gap at column2; base-pair G/C3 bonds; frameshift MKPG* to MNPG; clipboard summary and CSV browser download. Existing artwork and new responsive artwork loaded. Screenshots inspected during QA.

## Limits
NCBI ORFfinder external equivalence remains unverified. Unit tests do not constitute experimental biological validation. No physical-device, assistive-technology or exhaustive WCAG certification is claimed. Large sequences retain existing interface caps. Illustrative artwork must not be used to infer molecular coordinates.

## Artwork provenance
`assets/translation-editorial.webp` and `assets/translation-editorial-small.webp` were generated using the built-in image tool and optimized with Pillow. Prompt: conceptual ribosome with distinct folded subunits in ivory/sandstone, vermilion RNA and emerging peptide, graphite background, museum science lighting, no labels or atomic-structure claims. The SVG logo is original programmatic artwork. Fonts retain their existing local license.
