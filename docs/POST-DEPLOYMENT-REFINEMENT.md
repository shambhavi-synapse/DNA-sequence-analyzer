# Post-deployment refinement

Baseline: `f2dfcc1904afe5936843818b5134eac0077f2e60`, the deployed main revision. Working branch: `refine/post-deployment-qa`. The owner authorized this focused release on 8 November 2026. The earlier unfinished edits were recovered as uncommitted files on this branch, then reviewed and completed.

## Scope

- The print logo uses the same approved vector outlines at 20 mm instead of 32 mm. The title leads the compact header. Coral headings, peach table headers, subtle row tints and a white page preserve grayscale readability. Codon rows are arranged in two alphabetically ordered table columns when there are more than 12 entries. Short pattern sections stay together; long sequence blocks can break across pages rather than being clipped.
- The supplied HBB sample was four Letter pages. The revised same-record report is three A4 pages, with repeat results and closing limitations together on page 3. Body type was not globally reduced. PDF evidence is in `review/post-deployment/`.
- Five mechanism-specific genomic schematics cover alternative exon selection, long introns and RNA processing, shared variants and a qualified inferred tree, UGA under NCBI tables 1/2, and abstract population sampling. The code figure appears in both relevant code topics. The incorrect draft tree grouping was fixed before release. Small-screen diagrams retain readable text in contained horizontal scrolling; their disclosure regions can receive keyboard focus.
- Essential Concepts' `src/schematics.js` and its geometry, labels and colors are unchanged. Existing editing, viral-integration, telomere, G-quartet, methylation and repair illustrations are unchanged.
- The Analyze caption is exactly “Molecular illustration · Not to scale”. The About eyebrow is removed without changing the creator narrative. Header/footer image sizes are modestly reduced without altering the approved artwork or aspect ratios.
- CSV schema and migration are documented in `CSV-EXPORT.md`. Scientific engines remain unchanged.

## Release and rollback

Use the current GitHub Pages `main` push workflow: Node tests, `node scripts/build-static.mjs`, upload `dist/`, deploy to the existing Pages domain. No environment variables, provider, DNS or infrastructure changes are needed. The runtime manifest identifies every tested application byte. QA harnesses, input screenshots and generated temporary files are excluded from the production build.

Open a review PR from the refinement branch, retain its tested revision, merge normally after verification, and verify the actual Pages URL and served manifest. If a critical release regression occurs, revert the release merge with a normal commit and redeploy; do not reset or force-push shared history. The prior production revision above remains recoverable.

## Recorded checks

- `node --test tests/*.test.mjs`: 130 passed, zero failed. New export cases include exact hand-calculated composition, template RNA, six frame labels, inclusive ORF coordinates, GC windows, formula-injection handling and complete long sequences. Genomic diagram tests check their stated mechanisms and the UGA code reassignment.
- Production build: 70 application files plus deterministic SHA-256 manifest. Core sequence, translation, mutation, comparison and Essential Concepts schematic modules have no changes from the baseline.
- Browser-generated HBB CSV: independently parsed with Python's CSV reader. It has 162 data rows, the expected 19 A / 26 C / 44 G / 28 T, six translations, 88 complete 30-nt windows, first-window GC 50%, and 39 counted codons. Its +1 peptide matches the published HBB-fragment fixture.
- Responsive Chrome checks cover 320, 390, 768 and 1200 px outer widths, both explicit themes and the five main destinations. Available content width excludes the scrollbar. No page-level horizontal overflow was observed. Detailed diagrams intentionally scroll within their disclosure areas on narrow screens. These are browser responsive frames, not physical-device certification.
- Compare ACGT/AGT displays 75% identity, three matches, one gap column and score 4. Explore G:C pairing and HBB c.20A>T produce the correct partner and GAG→GTG / Glu→Val missense result.
- Same-record HBB print layout renders three pages under both A4 and Letter page settings. Every A4 page was visually inspected. Repeated render has the same three-page layout. The original four-page PDF's isolated repeat/footer page is eliminated without reducing the body type across the whole report.

## Verification limits

PDF evidence uses WeasyPrint 70 with the actual prepared application report DOM and production CSS. Native mobile Chrome print dialogs and physical printers are not controlled by this environment. Source links that show bot checks, restricted gateways or timeouts are explicitly recorded in `REFERENCE-LINK-AUDIT.md`; they are not represented as dead or fully verified pages. The release does not assert clinical validity or experimental gene discovery.
