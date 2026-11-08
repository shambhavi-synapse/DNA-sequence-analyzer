# Approved logo and report release

8 November 2026. The owner explicitly approved production deployment after verification. This record supersedes the earlier preview-only restriction, without changing hosting, domain or DNS.

## Branding provenance

`assets/branding/approved-reference.png` is the supplied approved artwork. `scripts/branding/trace-approved-logo.py` traces its pixel silhouettes into closed SVG paths, including the actual wordmark outlines. No replacement typeface, generated symbol, subtitle or tagline is used. The stacked light/dark assets preserve the original arrangement. The horizontal header adapts the same symbol and outlined wordmark; the favicon uses the same icon alone. Necessary inverse ink supports dark backgrounds. The print asset keeps identical path geometry and uses solid sampled colors for reliable print-engine and grayscale rendering.

Assets include SVG full, horizontal and symbol variants, SVG/ICO favicon, 180 px Apple touch icon, 192/512 px manifest icons and a 1200×630 social image. Main navigation, mobile navigation, footer, README and report use the official identity. No SVG depends on an external font or embedded screenshot background.

## Actual print output

`src/print-report.js` prepares a dedicated semantic report for the active record, both from Print Report and beforeprint. The logo is an actual SVG image, preloaded and decoded before the button invokes printing. Navigation, controls and decorative site surfaces are omitted. Full sequence transformations and all six translated frames are included without screen truncation. ORF rules, coordinates, complete candidate table, composition denominators, existing estimate limits, current GC plot, codon usage and current motif/repeat results are preserved. Labels are escaped.

The sample HTML was captured from the actual application report DOM after analyzing its 39 nt synthetic teaching example. WeasyPrint 70 rendered that HTML with the actual stylesheets to the committed three-page A4 sample PDF. Every page and a grayscale first-page proof were inspected. The logo is sharp and readable; the GC chart is visible. A separate 2,000 nt ACGT-repeat report produced six pages. PDF character-boundary checks found zero horizontal clipping in either report. The print layout corrected a black GC plot caused by missing SVG presentation attributes and a stranded closing paragraph.

Native Chrome Save-as-PDF download/dialog automation is not exposed in this cloud browser. The supplied PDF is a real print-engine output from the prepared application HTML, not a native Chrome PDF download. Physical printers have not been tested. Beforeprint and complete report data have automated coverage.

## Verification

- `node --test`: 124 passed, zero failed.
- `node scripts/build-static.mjs`: 66 application files plus deterministic release manifest. No new runtime dependencies.
- Core `sequence.js`, `translation.js`, `mutation.js` and `compare.js` retain PR #9's exact blobs. Existing independent scientific cases, code-table tests and exhaustive small ORF cases remain covered.
- Browser checks: synthetic 39 nt example, 56.41% GC, 43.59% AT and two complete candidates at 9 nt threshold; 2,000 nt input gives 50% GC/AT and zero complete ORFs; stale motif matches clear after reanalysis.
- Compare ACGT/AGT: 75% identity, three matches, one gap column, score 4. Alignment coordinate labels remain correct. Automated cases cover identical inputs, substitutions, gaps, ambiguity, empty/invalid input and scoring validation.
- Explore: G:C pairing displays three canonical hydrogen bonds; UAA displays a stop signal; HBB c.20A>T displays GAG→GTG, Glu→Val, missense.
- Molecular Notes Overview links open the relevant Reading topic. The hero has exactly one `Molecular illustration · Not to scale` caption; old packaging caption absent. Previously corrected pairing, replication, transcription and reading-frame diagrams remain intact.
- Chrome responsive frames: 320, 390, 768 and 1200 px outer widths, 844 px high, both themes, all five pages. Available content width excludes 15 px scrollbar. No page overflow or visible broken image detected. Desktop light and mobile dark logo screenshots inspected. These are responsive Chrome checks, not physical-device certification.
- System preference bootstrap/persistence/change cases remain covered by tests; explicit Light/Dark switch correctly. Keyboard Enter operates Analyze, Print and comparison controls. Reduced-motion rules remain preserved.

The private preview remains owner-private and may require owner sign-in in this cloud browser. Its deployment receipt and artifact byte parity are separate from rendered local QA. Do not claim inspection through the private sign-in wall.

## Production release and rollback

Use the existing GitHub Pages main-push workflow at `https://shambhavi-synapse.github.io/DNA-sequence-analyzer/` (capitalization matters). Retarget PR #10 to main, retaining PR #9 ancestry, and perform one normal merge after candidate CI and isolated staging pass. This avoids deploying an intermediate audit-only revision. Record candidate, staging source and production merge SHAs in PR #10. Verify public branding, manifest, all pages, themes and report preparation after deployment.

The prior main baseline is `f6173e39ba195a7bb78723735ad03f7cd35f2a46`. Preserve branches. If a release-blocking regression occurs, revert the release merge in a normal reviewed commit and rerun the prior working Pages deployment; do not force-reset shared history. No environment variables, paid APIs, backend, custom domain or DNS changes are required.

## Limits

External NCBI ORFfinder cross-tool validation remains pending; do not describe it as completed. Scientific results remain computational candidates, not evidence of gene function or clinical interpretation. External scientific links were not exhaustively re-audited during this focused branding pass. Screen-reader, physical-device and native printer testing remain outside the available environment.
