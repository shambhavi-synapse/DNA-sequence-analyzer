# SeqScope resumed review checkpoint

## Recovery
Recovered local `a826cfb` and `dec5efc`, which had not reached remote `redesign/seqscope`. Preserved their rebrand, chart selections, codon inspection, HBB provenance fixture, original ribosome image and responsive presentation. Main remains f6173e3.

## PR 9 independent review
Reviewed actual core/app differences at 7e5cb7c. Ran its isolated worktree suite: 55 passed. Template 5′→3′ convention requires reverse complement then T→U; reconciled the recovered UI's conflicting 3′→5′ label. Mutation classification now handles unchanged and stop-loss cases. Integer scoring bounds are conservative and avoid Int32 truncation. ORF cached frame peptides preserve start/stop indexing and one-based inclusive reverse coordinates. Invalid-character collection is bounded. No confirmed additional calculation defect found in this review.

PR 9 was integrated into this review branch only. It remains open and unmerged into main. Two text conflicts in index.html and src/app.js were reconciled while preserving the interactive UI, 250-candidate map cap and FASTA pressed states. Combined suite: 60 passed, zero failed. No dependencies added. Buildless static project, no bundler build step.

## Design batch
Manrope variable font locally bundled from google/fonts/ofl/manrope, with SIL OFL license. Browser comparison against previous Space Grotesk/system typography favored Manrope for consistent labels and readable scientific prose. Aligned sequences/codons retain monospace.

Circular lens/helix symbol is a review candidate, not approved branding. SVG versions and favicon are included in the branch only. No public website changes.

Molecular Atlas: six new precise SVG specimens cover A-to-I RNA editing, CpG marking, a guanine quartet, table1/table2 UGA meanings, intron excision, and telomeric repeats. Removed unlabeled genome-size bars rather than implying quantitative data. Existing DNA, chromatin and ribosome artwork preserved. No new experimental molecular structure is claimed.

## Next steps before release
1. Owner review of Manrope and circular logo candidate.
2. Complete the remaining viral-integration, repair and phylogeny specimens; those three older sprites remain.
3. Review available replication/transcription artwork against the educational text before integrating it. No claim that other-conversation artwork has been imported.
4. Full keyboard/screen-reader and physical-device walkthrough. ORFfinder external comparison remains pending.
5. Obtain explicit owner approval before any main merge or deployment, including PR 9.

## Browser evidence
Desktop 1363×936 and mobile iframe390×844 inspected with Manrope loaded. Mobile all four routes passed light/dark overflow checks (clientWidth and scrollWidth both375). Confirmed synthetic39nt/GC56.41% and template ATGC→GCAU. Screenshot: [desktop atlas review](review/atlas-desktop.jpg). Remote draft PR10 is stacked on PR9; its tree matches the locally verified integration. No merge or deployment authorized.
