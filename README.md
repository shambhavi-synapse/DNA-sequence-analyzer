# SeqScope: DNA Sequence Analyzer

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

- Base-pairing explorer, standard-code RNA codon explorer, and a single-base HBB mutation example.
- Twelve illustrated Molecular Notes, an interactive base-pairing explorer, a codon-change explorer, synthetic mutation examples, twelve researched Curious DNA facts, and sourced examples of lactase persistence, caffeine metabolism, coriander aroma perception, eye-colour genetics, and haemoglobin. These explain general biology and do not predict personal traits.
- Example library contains synthetic reading-frame and telomere-repeat sequences and a 117 nt human HBB coding fragment from RefSeq NM_000518.5, plus a copy with the documented c.20A>T teaching substitution.
- Synthetic short-oligo inputs from 4–14 unambiguous nucleotides show a Wallace-rule melting-temperature estimate with its limitations stated beside the interpretation.
- Analyze, Compare, Molecular Notes, and About are distinct hash-addressable workspaces. Theme preference can follow the system, or be set to light or dark and remembered locally.
- Molecular Notes includes twelve illustrated topics, a base-pairing explorer, codon-change feedback, and six clearly labelled synthetic mutation demonstrations. Curious DNA contains twelve sourced research notes.

## Scientific conventions

See [Scientific specification](docs/SCIENTIFIC_SPECIFICATION.md) for algorithms, parameters, denominators, alignment scoring, motif semantics, coordinate conversion, and limitations.

ORFs are computational candidates, not experimentally verified genes. The finder uses ATG starts and table-specific stop codons; it does not model alternative initiation codons, splicing, or gene context. Six-frame translations do not establish that a protein is expressed. Global alignment uses literal IUPAC symbol equality, not probabilistic base compatibility. Exact motif searches compare symbols literally; palindrome and tandem-repeat searches operate only on unambiguous A/C/G/T. The Wallace estimate is a rough rule for short oligonucleotides only and is not a measured melting temperature. No molecular-mass estimate is shown.

## Run locally

Serve the repository root with any static HTTP server, then open `index.html`. For example:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. No dependency installation or build step is required. The site works offline after its files are loaded.

## Tests and validation

Tests use Node's built-in test runner:

```sh
node --test
```

They cover input/FASTA validation, composition, ambiguity, IUPAC transformations, canonical standard-code entries, table 2 reassigned codons, six frames, ORF coordinates and boundaries, sliding GC, motifs, repeats, global alignment, codon counts, sequence-property estimates, workspace routing, and the HBB coding variant. GitHub Actions runs the same suite for pushes and pull requests.

Validation status is recorded in [Validation notes](docs/VALIDATION.md). Automated tests do not replace external reference comparison or experimental validation. The NCBI ORFfinder comparison is pending unless explicitly marked completed in that file.

## Deployment

The repository uses GitHub Actions and GitHub Pages. No build service or paid runtime is used. Changes pushed to `main` trigger the site deployment workflow.

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
