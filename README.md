# DNA Sequence Analyzer

A browser-based DNA sequence analysis workspace for academic exploration. The application computes locally and requires no account, backend, paid API or runtime service after deployment.

## Features

- Direct input and multi-record FASTA parsing with precise IUPAC validation.
- Base counts, known-base percentages, GC and AT content, and ambiguity reporting.
- IUPAC complement, reverse complement, coding-strand DNA-to-RNA substitution and template-strand transcription.
- Six-frame translation using the standard genetic code, including conservative ambiguous-codon resolution.
- Candidate ORFs on both strands with configurable minimum nucleotide length and mapped 1-based inclusive coordinates.
- Nucleotide composition, sliding-window GC profile, reading-frame and sequence views.
- Copy, FASTA, CSV and print exports.
- Responsive static interface suitable for GitHub Pages.

## Run locally

Open `index.html` in a modern browser, or serve the repository with any static file server. ES modules require a local HTTP server in some browsers. No build step or package installation is required.

## Scientific methods and limits

See [Scientific specification](docs/SCIENTIFIC_SPECIFICATION.md) for parsing, denominators, strand conventions, translation, ORF parameters and coordinate definitions. ORFs are candidates, not validated genes. All six frame outputs are translations, not evidence of proteins. The tool does not infer a genetic code other than NCBI table 1, model introns, or identify non-ATG starts.

## Tests

Tests use Node's built-in test runner and need no dependencies:

```sh
node --test
```

The tests check parsing, counting, ambiguous bases, transformations, standard code codons, frames, ORF coordinates and GC boundaries. External comparison with NCBI ORFfinder remains pending and is explicitly not claimed as completed validation.

## References

- NCBI, The Genetic Codes: https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi
- NCBI ORFfinder: https://www.ncbi.nlm.nih.gov/orffinder/
- IUPAC, Nomenclature for incompletely specified bases in nucleic acid sequences: https://doi.org/10.1016/0022-2836(84)90309-2

## Deployment

The application is static and compatible with GitHub Pages. Enable Pages to serve from the repository root (or configure the included Actions workflow, if present). No secrets or external services are used.

## AI-assisted development

AI tools assisted with implementation and review. The calculations execute in the browser without an AI model or API. Scientific behavior and validation claims are documented for independent review.
