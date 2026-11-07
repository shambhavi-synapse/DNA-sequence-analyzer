# Final experience refinement verification

This record continues draft PR #10 and supersedes older layout and build descriptions. It is a staging review checkpoint, not production approval.

## Implemented refinements

Essential Concepts now uses a compact numbered editorial list: heading immediately above its explanation, a shared reading edge, comfortable measure and light separators. Six entries were selectively edited to explain a mechanism or distinction more naturally, including replication's antiparallel-template problem, reading-frame choice, chromatin accessibility and alternative RNA processing. The other accurate explanations were preserved. No large concept illustration was reintroduced.

The thirteen genomics entries now form one consistent vertical collection. Existing small diagrams are retained in native, keyboard-operable disclosures rather than dominating unequal-height cards. All thirty Further reading groups remain unified, with no national research boxes or source quota. The successful nucleosome hero and homepage DNA artwork, logo and approved creator message remain intact.

The misleading global footer message was static privacy wording, not an analyzer status. It is removed. Accurate local-file-processing information now belongs beside the Analyze input. Multi-record FASTA switching and analysis state survive navigation.

Theme initialization now runs before stylesheets and shares one state across the page. First visits follow the OS; Light, Dark and System persist appropriately. System listens for OS changes, legacy explicit preferences remain respected, inaccessible storage falls back safely, cross-tab changes synchronize, and browser theme-colour metadata follows the theme. There is no hardcoded dark default.

All six existing translation frames are retained in forward/reverse native disclosures. Their open states survive recalculation. Before printing, closed frame groups are temporarily opened, then restored afterward; event behavior has automated tests. This is display-only; genetic-code and coordinate algorithms are unchanged.

Compare separates inputs, method/settings, summary and results. Alignment columns remain contiguous in one scrollable strip with A/B row labels and explicit match/mismatch/gap symbols. Selection reports the original coordinates, including null gap positions. Empty inputs receive appropriate Compare wording. Difference highlighting no longer fades matched text below comfortable contrast.

Mobile fixes include aligned navigation baselines, a constrained pairing grid, bounded genetic-code controls, non-sticky narrow-screen header, readable 16px form/sequence text, 24px nucleotide widths, adaptive rows and separate coordinate markers. Panel/anchor offsets account for the tablet header. Existing dark elevation and moderate radii are preserved. Entry motion no longer hides newly selected page content. Reduced-motion overrides remain.

Clipboard buttons now provide actual success/failure feedback and a local-copy fallback for HTTP previews. Feedback resets when results change. A successful browser copy was pasted back and checked for exact summary values. CSV was downloaded and its contents inspected. FASTA delivery did not produce a completed download event in this browser, so that transfer is explicitly unverified; no application error was logged.

## Scientific reference review

The earlier relevance corrections are preserved: no recycling paper used to establish frame choice, no chemosensory catalogue presented as coriander validation, and no HBG-editing paper attached to the HBB substitution. Relevant research from IISc, NCBS, CCMB/IGIB, NIPGR and IISER Bhopal remains integrated with normal attribution and appropriate organism, cohort and assay qualifications.

This pass added no new paper or nationality-based target. Replication, RNA-to-protein, chromatin and RNA-processing foundations were rechecked against the indexed NCBI chapters NBK26850, NBK26829, NBK26834 and NBK26887. No unsupported consequence was introduced in the selective writing edits.

All 37 unique reading destinations were requested during the availability audit. Eleven returned substantive content; fourteen had retrieval limitations, eight presented challenges, two returned partial responses and two exposed client-rendered course shells. These are retrieval observations, not declarations that those references are broken. Prior DOI/title/affiliation verification remains in the source catalogue. Full text and publisher availability cannot be promised. The per-URL observations are in `review/readiness-reference-checks.json`.

## Executed automated checks

- `node --test`: **96 passed, 0 failed**. Includes all prior scientific tests, ten additional comparison cases, six theme behavior cases, four clipboard cases, two print-state cases, static-output validation and relevant navigation/content regressions.
- `node scripts/build-static.mjs`: passed. Includes local-reference/import checks and a deterministic SHA-256 manifest. No dependencies installed.
- Syntax checks on app, navigation and theme; `git diff --check`: passed.
- Core sequence, translation, mutation and comparison modules are byte-for-byte unchanged from PR #9.

## Executed browser checks

Chrome desktop viewport 1363×936; responsive Chrome frames at 320×844, 390×844, 768×1024 and 844×390 in both themes. Forty route/theme/viewport checks passed without page-level overflow. All five routes were inspected. Reading layouts were also measured at ten frame widths from 320 to 1200px in both themes. The narrowest concept and genomics reading bodies were 265px. Screenshots were visually reviewed, including both themes and desktop/mobile reading, Explore, comparison and translation. Frames are desktop Chrome emulation, not physical phones.

Loaded synthetic results were rechecked at 320, 390, 768 and 844 widths in both themes, with no page overflow, all six frames in the DOM, bounded code controls and 24px base targets. A discovered 320px Base Pairing overflow and a loaded-result code-control overflow were fixed and retested. Sequence panels and long alignment/codon strips may scroll internally by design.

Functional evidence:

- Synthetic teaching sequence: 39 nt, A9/C8/G14/T8, GC56.41%, AT43.59%, two ORFs at minimum9nt.
- GC window start2: positions2–31, GC56.67%, exactly30 nucleotides highlighted.
- Reverse frame−1 first codon CTA→CUA→Leu at input37–39; all six frames accessible. Table2 changes DNA TGA translation to W.
- Real file chooser: two-record FASTA read; ambiguous record ACGTNN reports length6, two ambiguous bases, GC50% and AT50% among known bases. Selected record persists through Compare/Analyze navigation.
- Compare: identical, single/multiple substitutions, insertion/deletion, unequal lengths, literal ambiguity, empty/invalid and over-limit inputs checked. Maximum1500nt identical alignment reports1500 matches, identity100%, score3000, one internally scrollable row; selecting its last column reports input1500 in both sequences. A gap column correctly has no coordinate in one input. CSV rendering/export coordinate logic is also unit tested.
- Explore: G pairs with C/three canonical bonds; UUG→Leu; HBB c.20A>T produces GTG/Val/missense and LTPEEK→LTPVEK. No individual health inference is made.
- System preference follows this browser's light OS state and persists across reload; explicit Light and Dark also persist. Simulated live OS changes and denied storage pass the actual theme-script tests.
- Direct replication anchor opens Molecular Notes with its heading below the sticky desktop header; browser Back restores the correct route. Native schematic and reverse-frame disclosures and gap selection accept keyboard activation.
- CSV export contains the measured counts and unrounded percentages. Clipboard summary was pasted and matched. No application-origin runtime error was observed in the fresh review tab; unrelated browser-extension diagnostics are excluded from that statement.

## Explicit remaining limits

Authenticated hosted interactions must be checked separately from local exact-source QA; the private preview's owner sign-in gate previously blocked the cloud browser. Confirm its current state after the refresh. Deployment success alone does not pass this check.

FASTA download events timed out twice and no completed transfer was supplied to the tool. Ordinary-browser FASTA delivery needs confirmation before public release. Native print-dialog output was not inspected, although print disclosure restoration is tested. Physical-device/mobile-keyboard, screen-reader and actual OS preference/reduced-motion switching were not available. Reduced-motion code paths were inspected rather than emulated at OS level. External NCBI ORFfinder comparison remains pending. The logo remains the owner-deferred candidate.

No merge, public deployment, domain change or production configuration change is authorized by this checkpoint. See `RELEASE-READINESS.md` for release and rollback steps.
