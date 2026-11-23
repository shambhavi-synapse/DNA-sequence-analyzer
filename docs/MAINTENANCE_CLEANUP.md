# Production-safe cleanup audit · 23 November 2026

## Baseline and recovery point

- Default/deployment branch: `main`, commit `b7480e09ec91533175173895cb2dafa836e9578d` (merged PR #13).
- Cleanup branch: `maintenance/production-cleanup-20261123`, created directly from that commit. The baseline remains recoverable in normal Git history; no branches, tags, PRs or history were removed or rewritten.
- GitHub Pages run [45140280351](https://github.com/shambhavi-synapse/DNA-sequence-analyzer/actions/runs/45140280351) deployed that exact commit successfully. The public `release-manifest.json` matched the baseline's 74 application-file hashes before editing.
- No newer completed application work was unmerged. The only open PR was #12, older README-only polish; it was left untouched. Some README edits in this cleanup overlap its documentation subject and may need reconciliation if that older PR is revived.
- Baseline checks: `node --test` passed all 168 tests; `node scripts/build-static.mjs` validated 74 files plus the generated manifest. No baseline automated failure was observed.
- Production was not changed by this cleanup. Merge and deployment require separate owner review.

## Inventory and dependency review

The tracked baseline contains 188 files, 6,790,113 bytes (file contents, excluding Git history and ignored output).

| Area | Files | Bytes | Disposition |
| --- | ---: | ---: | --- |
| Root HTML, CSS, README, manifest and ignore rules | 8 | 198,060 | Retain; correct outdated README descriptions only |
| `src/` | 26 | 194,405 | Required; all 26 modules reachable from HTML script roots through imports |
| `assets/` | 42 | 1,413,210 | Remove only the 10 verified obsolete files below |
| `tests/` and fixtures | 26 | 96,617 | Required; preserve every byte |
| `scripts/` | 3 | 18,015 | Required build, reference acquisition and approved-logo maintenance utilities |
| `.github/workflows/` | 2 | 1,315 | Required; preserve test triggers, Pages gate, permissions and artifact configuration |
| `docs/`, including review evidence | 81 | 4,868,491 | Preserve historical scientific/source, attribution and release evidence |

Review included direct and side-effect JS imports, re-exports, generated markup, event handlers, dynamic selectors, SVG references, HTML/CSS/manifest assets, social metadata, code/data fixtures, maintenance scripts and workflows. Static text/dependency searches were candidate discovery only. Every deletion was additionally checked against current rendering code and its replacement/history.

Application roots are `index.html` scripts `theme.js`, `app.js` and `experience.js`. The application import closure covers sequence/translation/codon/properties/motifs/compare/mutation/restriction engines; examples/curated data; alignment, GC, inspection, ORF and presentation helpers; findings/CSV/print; navigation/Notes/schematics/clipboard. No dynamic module loader or runtime asset-path generator selects the deleted files. The branding script's dynamic output paths use `assets/branding/`, not the deleted draft paths. Tests also generate approved-branding variant paths, and those files remain.

All four stylesheet layers remain: `styles.css`, `experience.css`, `visual.css`, `seqscope.css`. Their theme variables, grouped/negated selectors, media queries, keyframes, reduced-motion and print rules can affect conditional content. No CSS rule was deleted based on an empty selector match. Runtime state such as `seqscope-theme`, legacy `helix-lab-theme` migration, active FASTA record, selected frame and paginated regions remains unchanged. Conditional print, clipboard fallback, Notes Reading/Overview, SVG disclosures and educational tools are retained.

`build-static.mjs` copies the declared application entries into ignored `dist/`, validates references and emits hashes. Its whole-assets copy previously shipped the obsolete graphics even though no UI requested them. Reference refresh and optional logo tracing are maintenance workflows, not runtime APIs. All licensing and source records remain.

## A. Verified obsolete, removed

All names below are under `assets/`. Each has zero current application, CSS, manifest, test, maintenance-script or documentation-file dependency on its exact path/basename (the README's generic old logo-directory wording is corrected). None is selected by a dynamic path. References in this deletion inventory are historical records of the removal.

| Deleted file | Bytes | Additional evidence |
| --- | ---: | --- |
| `seqscope-logo-candidate.svg` | 547 | Earlier programmatic draft from `76a66d5`; current header/footer/report/icons use the owner-approved `assets/branding/` family |
| `seqscope-symbol.svg` | 298 | Earlier draft family from `76a66d5`; no current consumer; approved symbol variants and favicon remain |
| `seqscope-wordmark-dark.svg` | 817 | Earlier draft wordmark from `76a66d5`; current dark header uses `branding/seqscope-horizontal-dark.svg` |
| `seqscope-wordmark-light.svg` | 817 | Earlier draft wordmark from `76a66d5`; current light header uses `branding/seqscope-horizontal-light.svg` |
| `atlas-replication-1536.webp` | 55,602 | Introduced in `3d9e17e`; illustration references removed from `index.html` in `0d14936`; current authored replication schematic is in `src/schematics.js` |
| `atlas-replication-768.webp` | 21,656 | Same superseded process-image family; no remaining `srcset` or responsive consumer |
| `atlas-transcription-1536.webp` | 71,888 | Same removal in `0d14936`; current authored transcription schematic is in `src/schematics.js` |
| `atlas-transcription-768.webp` | 27,520 | Same superseded family; no remaining responsive consumer |
| `atlas-translation-1536.webp` | 122,946 | Same removal in `0d14936`; current authored frame/translation schematic is in `src/schematics.js` |
| `atlas-translation-768.webp` | 43,810 | Same superseded family; no remaining responsive consumer |

Total: **10 files, 345,901 bytes (337.8 KiB)**. Four SVG drafts and six WebP images. No JS functions, modules, CSS, scientific datasets, test fixtures or review documents were removed. Tests were rerun after the four-logo group and again after the six-illustration group: 168 passed, zero failed in each run.

## B. Potentially obsolete, preserved

- `translation-editorial.webp` and `translation-editorial-small.webp`: not used by the current UI, but explicitly recorded as generated source artwork in `docs/SEQSCOPE-VALIDATION.md`. Historical/provenance value remains; no deletion based solely on current reachability.
- Unused-looking CSS fragments and layered overrides: conditional, negated/grouped and responsive relationships make aggressive pruning inappropriate for an appearance-preserving change. Keep pending a separate narrowly scoped investigation.
- Historical screenshot/HTML/PDF/CSV/JSON evidence in `docs/review/` and earlier release notes: not runtime code, but records earlier scientific, visual and deployment checks. They are excluded from the production build and remain useful evidence.

## C. Required, preserved

- Every source module and scientific table; all complete curated sequences and source metadata, including the 48,502-nt lambda genome; every test and independent fixture.
- Approved branding variants, original approved artwork, trace utility, icon/social/print assets. Symbol files have dynamic test/generator consumers; the social image is referenced by social metadata, despite not being a homepage `img`.
- Both locally bundled fonts and licenses; all current educational SVGs, SVG sprite references, hero/Notes imagery, charts, teaching schematics and optional disclosures.
- Build/reference-maintenance scripts, ignore rules, GitHub workflows, scientific documentation, attribution and prior review artifacts.

## Documentation corrections

README now describes the shipped general Mutation Lab and linear restriction maps, points to the approved branding directory, and explains the active main-push Pages build instead of calling it a proposed review-branch workflow. Test trigger wording matches the actual workflow. Existing source links, local serving instructions and historical release/rollback evidence remain. No directories were migrated, files renamed, dependencies added or architecture changed.

## Scientific and build regression evidence

- Full suite: **168 tests passed, zero failed** before cleanup and after each deletion group. The test sources/fixtures themselves are unchanged.
- Static build: **64 retained application files**, down from 74 solely through the ten listed deletions. Every retained file's SHA-256 is identical to the deployed baseline. HTML, all JS, all CSS, datasets, manifests, scripts, tests and workflows are byte-for-byte preserved.
- Identical-input snapshots: all six curated examples plus short DNA, IUPAC ambiguity, reverse coding, overlapping ORFs, no-ORF input and explicit tables 2/5/11 (14 cases); four alignments including complete HBB reference/variant and ambiguity; three mutation cases including reverse-frame and mitochondrial reassignment. Compared complete serialized calculations and SHA-256 values of complete CSV and fixed-timestamp report output, not rounded screen values alone.
- Covered counts/denominators/percentages, complement/reverse complement, both transcription orientations, properties, six frames, all candidate ORFs, usage in all frames, complete GC windows, literal/definite-IUPAC motifs, all repeats/palindromes, restriction maps, deterministic findings, alignment and exports. All snapshots matched exactly. Combined snapshot digest: `e14937a85fdaac170b455e308eb6c5e89dafe497e36097a34df879478212196a`.
- Browser-downloaded lambda CSV before/after: identical 8,008,326 bytes, SHA-256 `0a50a898e45140fed0e91ebdb199124941d03a640d83822f4723483af7b00076`. Contains full input, 5,094 ORFs, six translations, 48,003 GC windows and 44 restriction sites. Downloaded FASTA preserves the same complete 48,502-nt sequence. HBB alignment CSV retains all 444 columns.
- `git diff --check` and final diff inspection are release-review checks. PR CI runs the unchanged suite/build; its result and PR head are recorded in the PR delivery rather than modifying runtime files to record a test receipt.

## Browser regression evidence and limits

Chromium baseline (public production) and cleaned static build were compared. All five pages were visited in Light/Dark on desktop (1348 px content width) and 375-px iframe mobile (360 px content width). All 20 route/theme/viewport heading and document-width observations matched; no page overflow. Baseline screenshots and cleaned screenshots were inspected as visual evidence, not asserted as a pixel-perfect diff.

All six examples matched baseline metric text, frame-tile counts, nucleotide-button counts and restriction summaries. Keyboard Enter operated selection and analysis. Checked selected ORF inspection, reverse-frame nucleotide inspection, GC-window and restriction-site links, HBB comparison, Mutation Lab preset, pairing and RNA codon tools, Notes Reading/Overview parity, custom IUPAC/FASTA input, invalid-character feedback, downloads and print preparation. All eleven Notes image elements loaded after expanding their disclosures and bringing images into view. The four authored Notes SVG schematics remain. Internal anchor targets were checked in the rendered document; no missing targets. Source URLs and navigation code are unchanged.

Native printer/PDF pagination, physical touch hardware, exhaustive screen-reader behavior and every external reference destination are not claimed as retested. External reference links and their source documentation are unchanged. No cleanup can guarantee zero risk; preserving all active bytes and limiting deletions to proven non-consumers substantially narrows the regression surface. The cleanup PR must remain unmerged and undeployed until reviewed.
