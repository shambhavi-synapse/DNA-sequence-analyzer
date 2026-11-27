# SeqScope.io identity and compatibility review

27 November 2026. Review-only branch `branding/seqscope-io-20261127`, based on deployed `main` commit `b7480e09ec91533175173895cb2dafa836e9578d`. The live GitHub Pages URL and repository name are unchanged. PR #14 (cleanup) and PR #12 (older README polish) remain separate, unmerged work; this branch does not merge or rewrite them. Four unreferenced old-logo deletions overlap the branding-only portion of PR #14; its six unrelated process-image deletions are not included.

## Identity and source

Exact active display name: **SeqScope.io**. Description: **A Web-Based DNA Sequence Analysis and Molecular Biology Platform**. The suffix represents input/output; it is not a custom-domain ownership claim. No custom-domain link, redirect, purchase or DNS change is added. Created by Shambhavi and the existing AI-assisted implementation attribution remain.

The approved attachment was supplied as `file_00000000845c8208bcc889afa813454f.png`, but its actual encoding is sRGB WebP, 1536 × 512. Its original bytes are retained as `assets/branding/approved-reference.webp`; the extension reflects its actual format. `tests/fixtures/branding-reference.json` pins its SHA-256, dimensions and native-coordinate view boxes. The previous approved-reference PNG is superseded by this supplied source; the old source remains recoverable at the baseline commit.

The maintainer utility `scripts/branding/trace-approved-logo.py` traces the supplied shapes directly. It preserves the emblem, orange sequence bars/dot, divider, exact lettering outlines and their relative positions. No font substitution, generated artwork, extra emblem, tagline or rearranged stacked design is introduced. Only empty surrounding canvas is trimmed for usable transparent logo bounds. Tracing applies 0.6-source-pixel contour smoothing and neutral-ink antialias calibration; this is a source-derived vector rendition, not a claim of original vector-master ownership.

## Assets and limited adaptations

- Replaced the existing full/horizontal light/dark SVG paths, symbol SVG variants, print SVG, favicon SVG/ICO, Apple touch icon, manifest icons and social card with the supplied identity. Stable asset filenames are retained where possible.
- Added transparent 1539 × 321 light/dark PNG copies. The source remains unchanged and is kept for future regeneration.
- Light mode retains source-derived dark ink and warm/orange gradients. Dark mode changes neutral ink to the existing ivory `#f4f0e8`; the source-derived accent colours remain. The print version retains identical outlines with source-median flat colours, matching the existing gradient-free print approach.
- Compact icons use only the supplied emblem within the existing ivory rounded icon framing. The 1200 × 630 social card uses the approved full horizontal identity on the existing ivory surface, without additional decoration.
- Header width and navigation layout stay unchanged. Footer logo widths become 176 px desktop / 158 px mobile so the longer horizontal wordmark remains readable. The report logo column grows from 20 mm to 42 mm for the same reason. These are the only layout-rule changes.
- Changed asset/module/manifest URL query versions to refresh modified branding and generated labels together; persistent state keys and base paths do not change.

The optional tracing utility uses the available local Pillow/numpy/scipy/contourpy/Inkscape tools for asset preparation. It is not run by the website, tests or deployment. No runtime or build dependency is installed or added.

## Display text and outputs

Updated browser/OG titles and descriptions, manifest name/short name, About content, image alt text and home labels, deterministic findings, printed-report branding, README and current scientific/export documentation. New branded downloads use `SeqScope.io-analysis.csv` and `SeqScope.io-alignment.csv`. The FASTA filename is unchanged because it never contained the old product name. CSV schemas, numerical precision, analysis version, coordinates, source citations and scientific fields remain unchanged.

Repository About metadata is a separate public setting rather than a file in a PR. On approved release, its proposed description is the exact description above; it has not been changed ahead of review. Historical screenshots/reports are retained as evidence, not represented as current branded output. New review screenshots accompany this change.

## Compatibility and remaining references

`seqscope-theme` and the `helix-lab-theme` fallback remain byte-for-byte unchanged, preserving saved theme preferences. CSS filenames, module filenames, approved-branding asset paths, repository/Pages URLs, anchor routes, analysis version and scientific identifiers remain stable. No service worker or other cache migration is introduced.

[The reference inventory](rebranding-reference-inventory.json) records each remaining old-name text occurrence by file, line and column, plus the reason category. Technical filenames are listed separately. Exceptions are:

1. Dated scientific/source/release records and captured HTML/PDF/CSV/screenshots: preserve the identity used when that evidence was created.
2. Earlier export filenames in the explicit CSV migration history: retained to document compatibility, alongside current filenames.
3. Stable paths, cache identifiers, preference keys and tests of those identifiers: not user-facing display names.
4. Test regular expressions/negative checks: intentionally mention the earlier spelling to reject it in active output.
5. References to removed earlier logo drafts in this review or older records describe historical assets, not current branding. The four drafts outside `assets/branding/` had no application, test or maintenance consumer and are removed here as superseded branding: `seqscope-logo-candidate.svg`, `seqscope-symbol.svg`, `seqscope-wordmark-dark.svg`, `seqscope-wordmark-light.svg`. This agrees with the already-proposed branding deletions in PR #14; no other cleanup is included.
6. This review and its inventory: explicit previous-name/compatibility context, not active display branding. Inventory rows quote references and do not recursively index themselves.

No external scientific reference, author name, accession, gene annotation, dataset or earlier evidence was renamed merely because it predates the rebrand.

## Verification

- Baseline: 168 tests passed, zero failed; 74 static application files validated. The public release manifest matched this baseline.
- Rebrand: 173 tests passed, zero failed; 72 static application files validated. Five focused branding tests cover exact metadata/labels, output names, compatibility keys, approved-source hash/geometry and local transparent/icon/social assets. Existing scientific tests and reference fixtures are preserved apart from display-name expectations/comments.
- Independent identical-input snapshots: six curated examples plus short, ambiguous, reverse-coding, overlapping-ORF, no-ORF and explicit tables 2/5/11 cases (14 inputs), four alignments and three substitutions. Full calculations, frame usage, composition, transformations, motifs/repeats, GC profiles, restriction maps, findings, complete CSV and report HTML match the baseline after normalizing only the product label and the report logo image tag/intrinsic sizing. Normalization does not remove scientific fields or values.
- Scientific engines, bundled reference sequences, source fixtures, navigation/state logic and educational content are unchanged. The CSV module change is only its versioned import of the renamed findings label; no calculation changes.
- Chromium: all five routes in Light/Dark on desktop and 375/768-px iframes (30 route/theme/viewport checks). The approved header assets loaded in both themes, with no horizontal overflow (1348/360/753 px content widths respectively). Header/footer and longer report-logo sizing were inspected. All six examples loaded/analyzed after the final assets; HBB remained 444 nt, GFP 717 nt, MT-CO1 1542 nt with table 2, lac 6351 nt and lambda 48502 nt.
- HBB comparison retained 443 matches, one difference and no gaps. Mutation Lab retained GAG→GTG, Glu→Val, missense. Longest-ORF selection and report preparation worked; the report contained the new text identity and loaded the new print SVG. All eleven Notes image elements loaded after disclosures were expanded. No application console errors or missing rendered internal anchor targets were observed.
- The final browser lambda CSV retained the full reference sequence hash and all 5094 candidate ORFs, with the SeqScope.io product label. Clipboard success feedback was observed, but direct browser clipboard readback returned empty and is not claimed as verified.
- Five genuine before/after screenshots are included below. Deployment remains unperformed; PR CI must pass on the final head.

## Review screenshots

The before image is from production at the baseline. After images show this branch, including its supplied logo. They are genuine browser captures, not recreated interfaces. Historical screenshots elsewhere remain clearly historical.

| View | Before | After |
| --- | --- | --- |
| About, desktop light | [Baseline](review/rebranding/before-about-light.jpg) | [Rebranded](review/rebranding/after-about-light.jpg) |
| Desktop dark | Baseline code and original captures remain in prior review records | [Rebranded](review/rebranding/after-desktop-dark.jpg) |
| Mobile dark, 375 px iframe | Same baseline layout rules | [Rebranded](review/rebranding/after-mobile-dark.jpg) |
| Tablet light, 768 px iframe | Same baseline layout rules | [Rebranded](review/rebranding/after-tablet-light.jpg) |

## Rollback and release gate

Do not merge or deploy without owner approval. Before merge, rerun `node --test`, `node scripts/build-static.mjs`, `git diff --check` and the existing PR CI. After approval, the unchanged main-push Pages workflow performs tests/build and deployment. Verify the actual live site and release manifest after deployment.

If a merged release requires rollback, use a normal reviewed revert of the rebranding merge and rerun the existing Pages workflow. The known-good pre-rebrand production commit is `b7480e09ec91533175173895cb2dafa836e9578d`. Do not force-reset shared history, rename the repository or change hosting/domain settings. If cleanup merges first, retain that approved cleanup when reverting only this rebrand.

Physical touch hardware, exhaustive assistive-technology testing and native printer/PDF pagination are not claimed as verified. Report HTML preparation and logo loading were verified; the optional local WeasyPrint renderer was unavailable and no dependency was installed solely to render a PDF. Current source-derived vector assets are not a substitute for an unavailable original vector master.
