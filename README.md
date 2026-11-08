# SeqScope: DNA Sequence Analyzer

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/branding/seqscope-logo-dark.svg"><img src="assets/branding/seqscope-logo-light.svg" width="220" alt="SeqScope"></picture>

A static, client-side bioinformatics workspace for sequence composition, strand transformations, six-frame translation, candidate ORFs, motifs, codon usage, and pairwise comparison. DNA stays in the browser. The deployed site has no backend, analytics, AI service, paid API, or account requirement.

**Live site:** https://shambhavi-synapse.github.io/DNA-sequence-analyzer/  
**Repository:** https://github.com/shambhavi-synapse/dna-sequence-analyzer

## What it does

### Sequence analysis

- Parse pasted DNA or single and multi-record FASTA. Accept uppercase/lowercase and standard DNA IUPAC codes; report invalid symbols with positions.
- Calculate sequence length, A/C/G/T counts, known-base percentages, GC and AT content, and ambiguous-symbol totals. The percentages use unambiguous A/C/G/T as the denominator; ambiguity remains part of the sequence and total length.
- Generate IUPAC complements, reverse complements, coding-strand T-to-U RNA, and RNA transcribed from the template strand.
- Translate all six frames with NCBI standard table 1 or vertebrate mitochondrial table 2. Ambiguous codons resolve only when all possible codons encode the same amino acid; otherwise display X.
- Find candidate ATG-to-stop ORFs on both strands, using configurable minimum length, selected table stop codons, and 1-based inclusive input coordinates.
- Plot sliding-window GC content and show codon counts, strand-aware positions, motifs, repeats, and reverse-complement palindromes.
- Align two sequences globally with Needleman-Wunsch using explicit match/mismatch/gap scores and a 1,500 nt per-sequence limit.
- Export FASTA, CSV, copied summaries, and printable result reports.

### Learning tools

- Explore contains the base-pairing explorer, RNA codon builder, HBB substitution example and labelled synthetic mutation demonstrations.
- Molecular Notes contains twelve text-led Essential Concepts, a compact collection on genomic structure, variation and regulation, and sourced genetics examples from everyday life. These explain general biology and do not predict personal traits.
- The example library includes synthetic reading-frame and telomere-repeat sequences, a vertebrate mitochondrial-code demonstration, and a 117 nt HBB fragment from RefSeq NM_000518.5, plus its documented c.20A>T teaching substitution.
- Short unambiguous oligonucleotides from 4–14 nt show a Wallace-rule melting-temperature estimate with its limitations stated beside the interpretation.
- Analyze, Compare, Explore, Molecular Notes and About are hash-addressable workspaces. Theme follows the operating system on a first visit; explicit Light, Dark and System preferences persist locally.

## Scientific conventions

See [Scientific specification](docs/SCIENTIFIC_SPECIFICATION.md) for algorithms, parameters, denominators, alignment scoring, motif semantics, coordinate conversion, and limitations.

ORFs are computational candidates, not experimentally verified genes. The finder uses ATG starts and table-specific stop codons; it does not model alternative initiation codons, splicing, or gene context. Six-frame translations do not establish that a protein is expressed. Global alignment uses literal IUPAC symbol equality, not probabilistic base compatibility. Exact motif searches compare symbols literally; palindrome and tandem-repeat searches operate only on unambiguous A/C/G/T. The Wallace estimate is a rough rule for short oligonucleotides only and is not a measured melting temperature. No molecular-mass estimate is shown.

## Run locally

Serve the repository root with any static HTTP server, then open `index.html`. For example:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. No dependency installation is required for development. All calculations run locally; the app uses locally bundled fonts and scientific assets.

## Tests and validation

Tests use Node's built-in test runner:

```sh
node --test
```

They cover input/FASTA validation, composition, ambiguity, IUPAC transformations, canonical standard-code entries, table 2 reassigned codons, six frames, ORF coordinates and boundaries, sliding GC, motifs, repeats, global alignment, codon counts, sequence-property estimates, workspace routing, and the HBB coding variant. GitHub Actions runs the same suite for pushes and pull requests.

Validation status is recorded in [Validation notes](docs/VALIDATION.md). Automated tests do not replace external reference comparison or experimental validation. The NCBI ORFfinder comparison is pending unless explicitly marked completed in that file.

## Deployment

The repository uses GitHub Actions and GitHub Pages. No paid service or runtime is required. The review branch includes a dependency-free production build:

```sh
node --test
node scripts/build-static.mjs
```

The build writes `dist/`, validates local asset and module references, and creates a SHA-256 `release-manifest.json`. Serve `dist/` to inspect the production-equivalent output. The proposed Pages workflow runs tests, builds and uploads only `dist/`; it is inactive until approved changes reach `main`. The existing owner-private staging Site is separate from GitHub Pages.

See [release readiness and rollback](docs/RELEASE-READINESS.md) for PR dependencies, approval gates, preview parity, release steps and remaining verification limits. Do not merge or change production until the owner approves.

## References

- NCBI, [The Genetic Codes](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi)
- NCBI, [ORFfinder](https://www.ncbi.nlm.nih.gov/orffinder/)
- NCBI RefSeq, [Homo sapiens HBB mRNA NM_000518.5](https://www.ncbi.nlm.nih.gov/nuccore/NM_000518.5)
- Cohen et al., [The molecular basis of lactase persistence](https://pmc.ncbi.nlm.nih.gov/articles/PMC12336946/)
- Eriksson et al., [A genetic variant near olfactory receptor genes influences cilantro preference](https://link.springer.com/article/10.1186/2044-7248-1-22)
- MedlinePlus Genetics, [Eye colour and genetics](https://medlineplus.gov/genetics/understanding/traits/eyecolor/)
- PubMed, [CYP1A2 polymorphism and caffeine metabolism](https://pubmed.ncbi.nlm.nih.gov/10233211/)
- NCBI Bookshelf, [Sickle Cell Disease GeneReviews](https://www.ncbi.nlm.nih.gov/books/NBK1377/)
- IUPAC, [Nomenclature for incompletely specified bases in nucleic acid sequences](https://doi.org/10.1016/0022-2836(84)90309-2)

## Project and attribution

Created by **Shambhavi**. The idea was to bring sequence analysis, scientific visualizations, and clear biological explanations together in one place. AI tools assisted development and review; the deployed scientific calculations execute locally without AI services.

## SeqScope visual identity and verification

SeqScope retains the existing browser-local scientific engine and repository URL. Its graphite, vermilion and ivory interface includes linked GC/ORF/sequence inspection, an inline six-frame codon inspector, responsive nucleotide rows and locally bundled artwork. See [the refinement verification record](docs/SEQSCOPE-VALIDATION.md) for executed checks, source provenance and limitations. Logo variants are in `assets/seqscope-*.svg`; design tokens and responsive refinements are in `seqscope.css`.

## Official branding and printable reports

The approved SeqScope mark is traced from the owner's reference artwork, including its original wordmark outlines. Stacked, horizontal, symbol-only, light, dark and print variants are in `assets/branding/`. The source reference and optional development tracing script are preserved; they are not build dependencies.

Print Report and normal browser printing use the same dedicated A4 report. It includes the official logo as a real SVG image, complete sequence transformations, all six translations, complete candidate ORF tables, codon usage and current pattern results. Full strings are retained beyond screen display caps. A verified sample is in [the sample report PDF](docs/review/seqscope-sample-report.pdf). Browser printing remains entirely local.

The public GitHub Pages repository path is case-sensitive: use **DNA-sequence-analyzer** in the live URL.
