# Controlled release of SeqScope

Status: reviewable private staging, not approved for public release. Neither PR may be merged and GitHub Pages must remain unchanged until the owner explicitly approves. The current logo is deliberately preserved for a separate design task.

## Source of truth and dependencies

- GitHub: `shambhavi-synapse/DNA-sequence-analyzer`.
- Review branch: `review/seqscope-atlas`, draft PR #10.
- PR #10 is stacked on draft PR #9, `audit/scientific-correctness-20261107`, head `7e5cb7c1eb02a963c200906843558b99333f74a1`.
- Production baseline: `f6173e39ba195a7bb78723735ad03f7cd35f2a46`, the main head returned during the audit. No production ref was updated.
- Previous verified review revision: `0d14936cb28c9700d536db9e2821103f616ba96a`. New review commits, the exact final GitHub SHA, staging source SHA and deployment receipt are recorded in PR #10's description after synchronization.

The four core modules `sequence.js`, `translation.js`, `mutation.js` and `compare.js` have no diff from PR #9. Its transcription orientation, substitution classification, ORF translation reuse, rendering cap and alignment-score validation remain preserved. This pass changes reading, display, theme, export feedback and release preparation.

All implementation is in source files, not browser DOM edits. GitHub uploads are checked against the local Git tree hash. The private staging provider has a separate source repository, so its commit SHA differs from GitHub. The deployment receipt maps both; every packaged application byte is compared with the tested GitHub-backed source. Ignore local `dist/`, `preview/` and `.openai/` in the GitHub project.

## Hosting and configuration

Production is configured by `.github/workflows/pages.yml` for GitHub Actions and GitHub Pages. The repository URL and default Pages address remain unchanged. No CNAME file is present in this source. Repository/environment protection settings were not modified.

The existing isolated preview is the owner-private Site `appgprj_6aeefdee8804819187555f7f78007f69`, at https://seqscope-pr10-review.tiwyamini.chatgpt.site . Its access policy has one owner, no additional viewers or groups, and no custom domains. Keep that audience and project identity unchanged. This preview is separate from GitHub Pages production.

The application is static HTML, CSS and ES modules with hash routing. All essential assets are local and use relative paths, suitable for the repository subpath on Pages. No application environment variables, backend, database, runtime AI service or paid API are required. Existing hosting secrets were neither needed nor changed.

## Reproducible production build

Use Node 20 or later, without installing dependencies:

```sh
node --test
node scripts/build-static.mjs
```

The build copies only the application HTML, four stylesheets, `src/` and `assets/` into `dist/`. It rejects missing local references, broken imports and asset paths escaping the output. `release-manifest.json` contains SHA-256 hashes of every application file; the manifest is deterministic and excludes itself. Serve `dist/` for local production-equivalent QA.

The proposed Pages workflow runs the tests, builds and uploads `dist/`, rather than the complete repository. A main-ref guard prevents manual dispatch from deploying another branch. This proposal exists only on the review branch until approved. It does not alter the currently running production workflow.

The private preview is packaged from the same production output. No QA iframe wrapper, test fixture, documentation, Git metadata or credential belongs in the static deployment. Packaging adds the preview provider's hosting manifest separately; it does not add a runtime dependency to SeqScope.

## Verification and release gates

The newest focused checks are in `CAPTION-SCHEMATIC-VERIFICATION.md`; previous checks remain in `READINESS-VERIFICATION.md` and `review/readiness-*.json`. The current automated suite passes 116 tests, including all prior scientific regressions. The actual production build passes.

Do not mark authenticated staging QA as passed merely because deployment succeeds. The hosted private URL has previously required ChatGPT owner sign-in in the cloud browser. Exact-source local browser QA and the hosted deployment receipt are separate evidence. Public release still requires owner review of the refreshed staging version and any unresolved checks listed in the verification record.

Physical-device/mobile-keyboard, screen-reader and actual OS-level preference switching remain outside the available browser emulation. Source/runtime theme tests cover simulated OS changes. External NCBI ORFfinder comparison remains pending; no external validation claim is made. Native print output and the completed FASTA download transfer also need a final ordinary-browser check.

## Steps after explicit approval

1. Record the owner-approved GitHub revision, private deployment version/source SHA and the SHA-256 manifest. Confirm that main is still the reviewed baseline, or inspect subsequent changes before proceeding.
2. Obtain explicit approval of both PR #9 and PR #10 and confirm their required checks. Do not merge PR #9 separately first: the current main-push workflow would publish that intermediate revision. Once both changes are approved for integration, retarget PR #10 to main and review the expanded diff, which includes the already reviewed audit. This is a future approved action, not a change made during staging.
3. Build that candidate integration in a temporary checkout and compare its release manifest with approved staging. Stop and restage if application hashes differ, or if newer main changes introduce conflicts. Preserve the audit commits and their ancestry; do not duplicate or discard them. A final merge commit has a new Git SHA, so identical runtime hashes are the parity criterion.
4. With explicit authorization covering the production release, use one normal merge commit for the approved integration PR, retaining the scientific audit ancestry. Verify PR #9's resulting GitHub status. This produces one final main update and one Pages release, instead of publishing the audit branch as a separate intermediate release. Main's workflow tests, builds and deploys. Preserve hosting settings, URL and DNS.
5. Open the actual Pages URL. Verify branding, first-visit System theme, explicit theme persistence, examples, validation, composition, GC selection, both translation strands, ORF selection, comparison gaps/coordinates, Explore tools, Notes, navigation and exports. Compare the served release manifest with approved staging. Check mobile and both themes before declaring release success.

## Rollback

Keep the previous successful Pages run/artifact and baseline revision above available before release. If the approved release fails its public checks, an owner-authorized rollback can rerun the previous successful Pages workflow at its original revision, or revert the release merge commit through a new reviewed commit and allow Pages to redeploy. Do not force-push, reset shared main or change domains. Re-run scientific tests after any revert, and verify the public website itself. The private preview can remain available for diagnosis while production uses the last known working version.
