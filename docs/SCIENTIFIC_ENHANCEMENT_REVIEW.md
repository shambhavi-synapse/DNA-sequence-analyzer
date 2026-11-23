# Scientific analyzer enhancement review

Base: `342ad5c689d3b7d9fbec4ffd9dc79aba22accc75` on main. Review date: 2026-11-22. No merge or live deployment was performed.

## Corrected issues

- The translator resolved TAR to stop, while the ORF engine previously ignored it and could extend to a later canonical stop. ORFs now end at the first **definite** stop under the selected table, including fully stop-resolving ambiguous codons. Internal unresolved X counts identify candidates that could conceal an earlier stop.
- Individual nucleotide inspection always reported frame +1 even when another frame was selected. It now follows the same selected frame as codon usage, including reverse input coordinates and positions outside complete codons.
- The former Wallace-rule temperature omitted experimental conditions. No numerical temperature is now emitted. This is an intentional scientific restriction, not a claim that the arithmetic of the Wallace formula was wrong.
- Invalid fractional ORF thresholds and GC window values are rejected with visible errors rather than left to unhandled UI exceptions.

Existing parsing/composition, IUPAC complement, oriented template transcription, ordinary six-frame translation, global alignment and exact-repeat algorithms were retained. The original 130 tests passed before changes; the final suite contains 145 passing tests. The original Wallace expectation was updated intentionally to require deferral; the other original tests remain intact.

## Improvements and selected additions

- Added NCBI tables 5 and 11 alongside existing tables 1 and 2. Optional table-defined initiation is explicit; ATG-only remains the default. Alternative ORF initiators are represented as M only at the first residue. Internal codon assignments and codon frequencies remain ordinary table assignments.
- User-supplied biological-source and sequence-type context explains introns, fMet versus Met, bacterial versus archaeal initiation, organellar differences and table 2 processing limitations. Source labels do not silently choose a code or change composition.
- Added oriented GC/AT skew, all 16 overlapping dinucleotide counts/frequencies, CpG count and conventional CpG O/E. Undefined denominators remain undefined. Ambiguity does not bridge pairs; CpG O/E is withheld for ambiguous sequences.
- Added optional definite IUPAC motif matching, retaining literal mode by default. Possible-only hits are excluded. Reverse-strand coordinates, overlap and self-reverse-complement deduplication are preserved.
- Added grouped alignment differences relative to A, with insertion/deletion anchors and separate ambiguity differences. Alignment CSV contains scores, event boundaries, input coordinates and the identity denominator.
- Reordered existing panels to composition/distribution, sequence features, then coding. Existing quick navigation is extended without adding a second navigation system. The homepage, branding, educational content, examples and themes are preserved.
- ORF and codon selections synchronize codon usage to their frame. Usage still covers the whole frame and explicitly says so. Existing motif/repeat/GC viewer links remain intact.
- On-screen findings and copy/CSV/print output share deterministic calculation functions and include settings, limitations and an analysis version. Analysis CSV retains complete inputs, frames, ORFs and feature hits; screen/print pattern examples retain visible caps.

## Automated validation

Commands run in the checkout:

```sh
node --test tests/*.test.mjs
node scripts/build-static.mjs
git diff --check
```

Results: **145 tests passed, 0 failures**. Static build validated 71 application assets/imports and produced a release manifest. No runtime dependency was added.

New checks use independent published NCBI amino-acid/Starts rows for every codon in tables 5/11, hand-counted composition/pairs, and explicit coordinate/translation examples. They cover initiation-only Met handling, definite versus uncertain ambiguous stops, both-strand ORFs, selected-frame inspection, CpG undefined cases, IUPAC motif semantics, grouped indel anchors, actual export settings and deterministic summaries. Existing independent checks include exhaustive short-alignment scores, reference HBB translation, all 64 codons in tables 1/2, and 70,000-symbol composition.

## Browser validation actually performed

Checked in the managed Chromium preview, without modifying the live site:

| Check | Observed result |
| --- | --- |
| Desktop analyzer, light and dark | Existing branding/theme and one results navigation preserved; panel order correct |
| 375 px iframe viewport, light and dark | No page-level horizontal overflow; document client/scroll width both 360 px after the native scrollbar; navigation/sequence content retain their existing internal scrolling |
| 768 px iframe viewport | No page-level horizontal overflow; document client/scroll width both 753 px; alignment rendered correctly |
| Alternative initiation | `GTGGTGTAR`, table 11, table starts, minimum 9: candidate +1, 1–9, `MV*`; raw GTG codon usage remains V |
| Viewer links | ORF and motif clicks locate their input intervals; `AATGGCTTAA`, frame −2, base 9 displays `TAA → *`, input 7–9 |
| IUPAC motif | `GTN` in `GTGGTGTAR`: starts 1, 4 and 6; clicking the first hit locates 1–3 |
| Multi-record/ambiguous input | Selecting `NNNN` shows undefined GC/AT, 4 ambiguous bases, 0 ORFs and undefined GC windows |
| Validation | Analyze with minimum 1.5 displays the integer-range error and hides results |
| Long input | `ACGTNRY` repeated 10,000 times completes with 70,000 nt, 50% known-base GC/AT, 30,000 ambiguous bases, 0 ORFs and the existing 12,000-nt viewer cap |
| Analysis CSV download | Downloaded and parsed: complete 10-nt input, six translated frames and selected usage frame −2 retained |
| Alignment CSV download | Downloaded and parsed: 4 columns, insertion after A2 at B3, scores 2/−1/−2, 75% identity over 4 columns |
| Copy summary | Browser reports successful clipboard copy |
| Print report | Button prepares complete report DOM with sequence, transformations, all frames, current usage frame, statistics, settings and findings |

Browser automation briefly timed out during the large render; subsequent inspection confirmed the completed correct result. The iframe download-event listener did not resolve; the same alignment download was then verified successfully in the top-level page. Native PDF pagination and physical touch interaction were not visually verified. Desktop/iframe checks are not a claim of testing every physical phone or browser engine.

## Deliberate deferrals

- **Thermodynamic melting temperature:** requires a validated parameter set, salt/strand-concentration controls and supported duplex assumptions. The unconditioned Wallace number is withheld.
- **Restriction-site/cleavage mapping:** left for a separately verified enzyme dataset and explicit cleavage/end/topology conventions; no incomplete map was added.
- **Splicing, gene/function/expression inference, RNA editing and mitochondrial processing:** require biological evidence or models beyond this static sequence-rule analyzer.
- **ORF-specific codon usage:** counts remain scoped to the entire selected frame and are labeled accordingly; selecting a candidate does not silently narrow the interval.
- **Other translation tables:** only tables 1, 2, 5 and 11 are available; broad source categories do not cover every organism-specific code.

Scientific conventions and primary reference links are in [SCIENTIFIC_SPECIFICATION.md](SCIENTIFIC_SPECIFICATION.md).
