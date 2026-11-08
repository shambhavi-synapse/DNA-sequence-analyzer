# Latest checkpoint: approved logo and production release, 8 November 2026

The owner now explicitly authorizes merging the verified release and deploying to the existing GitHub Pages site. This supersedes the historical restrictions below. Work is on `review/seqscope-atlas`, PR #10, preserving PR #9 ancestry and all four scientific engines unchanged. The official approved-image trace, icons and A4 print report are implemented in actual source. See `LOGO-PRINT-RELEASE.md` for evidence and limitations. Exact GitHub/staging/production SHAs are recorded in PR #10 after synchronization.

124 tests pass. Production build contains 66 application files plus a deterministic release manifest. The 39 nt sample PDF has three A4 pages; a 2,000 nt stress report has six pages without horizontal text clipping. Browser-native Save-as-PDF remains unavailable to automation; the actual prepared report HTML was rendered and inspected using WeasyPrint 70. Do not describe that as a native Chrome PDF download.

Release route: stage the exact tree, retarget PR #10 to main and merge normally so PR #9 is included in one main update. This avoids auto-deploying an intermediate audit-only website. Verify the case-sensitive public URL `https://shambhavi-synapse.github.io/DNA-sequence-analyzer/`. Preserve branches and the old main baseline for rollback. No paid dependencies, DNS or hosting migration.

---

# Latest checkpoint: caption and schematic correction, 8 November 2026

Continue on `review/seqscope-atlas`, draft PR #10, stacked on draft PR #9. The final synchronized GitHub revision and private preview receipt are recorded in PR #10. No merge or production release is authorized.

Recovered the previously uncommitted Reading/Overview and SVG work from the workspace. The deployed preview was still version 6, built from the previous committed application. Finished the caption and diagrams, added the interactive base-pair rendering and explicit strand example, corrected tablet caption clipping, and performed Chrome responsive QA. See `CAPTION-SCHEMATIC-VERIFICATION.md` for exact coverage and limits. The core scientific engines are unchanged from PR #9. The suite now has 116 passing tests.

Next required review: inspect the refreshed owner-private preview after owner sign-in. Cloud-browser hosted QA is blocked by the site's sign-in gate; do not claim that gate shows the application. Do not bypass private access or repeat the previously declined sign-in handoff. External NCBI ORFfinder comparison and native FASTA/print transfer checks remain pending. Preserve the one-approved-integration-release plan in `RELEASE-READINESS.md`.

---

# Redesign continuation checkpoint

Implemented: original hero and local Space Grotesk from prior branch commit; interactive alignment column inspection, literal match/mismatch/gap states, difference emphasis and CSV export; amino acid names on selected six-frame codons. Fixed alignment coverage, incomplete triplet count and genetic-code-specific report stops.

Validation: `node --check src/app.js` and `node --test`: 37 passed, 0 failed. Browser preview at http://terminal.local:4173/ successfully aligned ACGT versus AGT (75% identity, 3 matches, one gap, score 4); selecting column 2 correctly reported input A position 2 and gap in B. Settled dark-theme screenshot exposed white statistics backgrounds and dark inherited labels. Targeted CSS fixes were added; their rendered follow-up remains pending.

Not ready to merge: complete illustration set, gallery redesign, interactive GC chart, expanded ORF detail, codon filtering, example comparison presets, complete theme/contrast audit, desktop/mobile interaction and export verification, NCBI ORFfinder comparison, final deployment verification.

Preview setup is local only: `sites-preview start /workspace/scratch/70ca675ec0e2/helix-lab` serves a copied preview directory. Copy changed source/assets into preview before reload. Preview and .openai hosting files are not production source.

Next: inspect the Compare dark-theme render, then add accessible GC window selection with undefined-window gaps. Continue on redesign/helix-experience. Do not claim full redesign complete or deploy until remaining checks pass.

## Latest implementation checkpoint
Added `src/gc-view.js`: GC line segments now break at undefined windows rather than connecting across unmeasured regions. Added keyboard-accessible GC start slider, inclusive coordinate and percentage readout, and a button linking the window to the sequence viewer. Added selected ORF detail showing input interval, length including stop, coding direction, start/stop triplets, and candidate translation. Enlarged chart labels.

Executed 40 tests, all passed; `node --check src/app.js` passed before the ORF detail addition. Browser confirmed synthetic example window 2–31 gives 56.67% GC and locating it selects exactly positions 2–31. ORF detail addition still needs browser verification. Dark-theme, gallery, artwork, mobile, codon filtering, exports, ORFfinder and final deployment requirements remain open as above. Next: browser-check selected reverse-strand ORF details, then continue gallery/artwork work. No merge or deployment performed.

## Visual milestone checkpoint
Visual-only pass: new `visual.css` redesigns landing, example selection, results, Compare, Notes and About presentation. Added original generated chromatin artwork as optimized local `assets/chromatin-editorial.webp`, labelled conceptual rather than atomic. Reworked hierarchy, theme surfaces, responsive layout, reduced-motion-safe reveals and explorer anchor scrolling. No calculation modules changed.
Regression: 40 tests passed. Browser screenshots inspected at desktop 1363×936 and a 390×844 iframe viewport in desktop Chrome (not a physical mobile device). Checked desktop landing, dark results and light Notes; mobile landing, Notes and example selection. Fixed low-contrast interpretation text, uneven metrics, narrow mobile cards, and image height inherited from HTML. Final image-height correction still needs screenshot follow-up. Full cross-page mobile QA and contrast audit remain outstanding; do not claim complete milestone or deploy.
Asset prompt: conceptual chromatin with pearlescent DNA around copper protein assemblies, midnight background, premium science exhibition lighting, no labels. Built-in image generation used; source converted to WebP with Pillow. Next: refresh preview with latest visual.css and inspect Notes image dimensions, then finish Compare and mobile results checks. Preserve no-merge/no-deploy instruction for this milestone.

## Release verification
Fixed deep-link route preservation and scrolling. Fixed mobile composition legend and base-pair overflow. Desktop 1363×936 checked; responsive iframe viewports 390×844 and 768×1024 (content widths 375 and 753 due to scrollbar) tested in Chrome, not physical devices. All four routes checked in light and dark. All four example cards loaded and gave expected lengths/compositions. Candidate ORF detail, GC range control, comparison gap coordinate, base-pair and frameshift explorer checked. Artwork loaded and chromatin aspect ratio verified. Mobile Notes/results overflow rechecked: scrollWidth equals clientWidth 375. Reduced-motion CSS and reveal guards retained. 40 regression tests pass. NCBI ORFfinder external comparison remains unverified, as previously documented; no claim of external validation. Physical mobile browser and assistive-technology testing are not performed.

## SeqScope phase, 2026-11-07
The former redesign was merged to main as f6173e3. The new focused phase uses `redesign/seqscope`. Brand, themes, analyzer inspection controls, responsive chart geometry, original ribosome artwork, HBB coordinate corrections and regression checks are documented in `docs/SEQSCOPE-VALIDATION.md`. Historical pending lists above are not the current branch specification. External ORFfinder validation and physical-device testing remain explicitly unclaimed. Local QA completed; merge and public deployment verification are the release steps.

## Latest owner-directed checkpoint: Molecular Atlas review
Resume from `review/seqscope-atlas`, draft PR10 based on PR9's audit branch. Recovered prior local SeqScope commits, independently ran PR9's55 tests, reconciled UI conflicts, and ran integrated60 tests. Manrope, logo candidate and six atlas SVG specimens are implemented. See docs/ATLAS-REVIEW.md for exact remaining tasks and screenshot. The latest owner instruction supersedes older release instructions: do not merge PR9 or any other work, and do not deploy, without explicit approval. Main/public site are unchanged in this session.

## Additional asset checkpoint
Supplied replication/transcription/translation artwork integrated in matching existing Molecular Notes content, preserving aspect ratios. Attachment logo retained as reference only. Review details: docs/ATTACHED-ASSET-REVIEW.md. All60 regression tests passed; desktop/tablet/mobile light/dark image checks passed. Continue review/seqscope-atlas, PR10. No merge/deployment without approval.

## Focused final refinement
Explore now contains the existing interactive modules; Molecular Notes is reading-focused. Approved creator message, GenomeIndia/IBDC reference, softer geometry and smaller illustrations implemented.61tests pass. See FINAL-REFINEMENT.md for precise checks and limits. Keep PR10 and PR9 unmerged; refresh only existing preview appgprj_6aeefdee8804819187555f7f78007f69, preserving owner-private access. Source preview repository is separate from GitHub Pages.

## 7 November 2026: Indian research and editorial refinement

Resume on `review/seqscope-atlas`, draft PR #10, still stacked on unmerged PR #9. Read `docs/INDIAN-CONTENT-REVIEW.md` and `docs/INDIAN-SOURCES.json` before further content work. This pass integrates the Notes hero, moves Everyday Life earlier, varies process-art compositions, updates Shambhavi Tiwari in About only, and adds 14 India-affiliated research papers plus Indian teaching and data resources. Twenty of 35 unique Notes references are Indian-origin. Confirmed unrelated legacy ERV/G4 citations were corrected. No calculation engine changed.

A browser-confirmed nested ORF map overlap was fixed with display-only subtracks in `src/orf-view.js`; order and scientific coordinates are preserved. Tests: 66/66, syntax and whitespace checks passed. Browser route/theme matrix and representative screenshots are in `docs/review/indian-atlas-*`. Review private preview only; main and GitHub Pages must remain untouched. Remaining: owner visual approval and any requested refinements, authenticated hosted interaction checks if the cloud browser remains at sign-in, physical-device/screen-reader/reduced-motion preference testing, and the previously pending external ORFfinder comparison. Logo stays the existing review candidate.

## Latest checkpoint: text-led concepts and unified references

Read `docs/REFERENCE-REFINEMENT.md` first. All twelve Essential Concepts are now text-led with richer mechanism/qualification explanations; the three large process images are absent from entries but preserved as assets. Thirty unified Further reading groups replace country-specific research boxes. The narrow-column bug and obsolete per-topic layout overrides are corrected. Removed three tangential papers, replaced a general lab link with the Ahmed et al. 2017 transcription/topoisomerase study, and added directly relevant foundational chapters. No geographic quota applies. Theme-specific elevation, selected example states, secondary text contrast and Analyze radii are refined.

68 tests pass; desktop and nine responsive widths in both themes checked. Screenshots and measured route/layout matrices are in docs/review. Continue on review/seqscope-atlas and draft PR10. Refresh only the existing owner-private preview; do not merge either PR, change access or touch main/GitHub Pages. Remaining limitations are documented in REFERENCE-REFINEMENT.md.

## Latest checkpoint: compact reading and release preparation

Resume `review/seqscope-atlas`, draft PR10 still based on draft PR9. Read `READINESS-VERIFICATION.md` and `RELEASE-READINESS.md` first. All implementation is source-backed: compact concept/genomics lists, selective mechanism-led copy, footer/privacy correction, early System theme, forward/reverse translation disclosures, aligned internal-scroll comparison, mobile layout fixes and clipboard feedback. Scientific core files remain unchanged from PR9. The current logo is intentionally preserved.

96 tests, syntax and whitespace checks pass. A real dependency-free production build now validates references and emits `dist/` plus a SHA-256 release manifest. Proposed Pages/CI changes are review-only. Browser checks and limitations are recorded in docs/review/readiness-* and the verification record. The exact GitHub/staging SHAs and deployment receipt belong in PR10's description. Do not merge either PR, publish publicly, modify domains or change existing GitHub Pages production. Remaining gates include owner review, authenticated hosted QA, ordinary-browser FASTA/print delivery, physical-device/accessibility checks and the prior external ORFfinder comparison.
