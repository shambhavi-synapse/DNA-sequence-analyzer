# Analysis CSV, schema 1

The **Download analysis CSV** control exports the active, last-analyzed FASTA record and its current genetic code, ORF threshold, codon frame and GC window. Motif rows are calculated from the current motif field with the same literal-symbol rules as Find. Invalid motifs produce an export error instead of an incomplete file. FASTA export still includes every parsed record. Compare retains its separate alignment CSV.

The UTF-8 CSV has a BOM, CRLF record separators and one header. It is a long-form table: filter `dataset` before interpreting other columns. Full sequences, proteins and computed intervals are not shortened to the screen's display caps.

| Dataset | Contents |
| --- | --- |
| metadata | Sequence label and complete normalized input |
| settings | Genetic-code table, ORF minimum, codon frame, GC window, denominator and motif rules |
| composition | A/C/G/T and each ambiguous IUPAC symbol count, base percentages, GC and AT |
| transformation | Antiparallel complement, reverse complement, coding RNA and template RNA |
| translation | Complete computational translations for all six frames |
| summary / orf | Candidate count and every complete candidate's protein, frame, strand, inclusive interval and length |
| codon_usage | Codon, residue symbol, count and frequency among counted unambiguous codons |
| gc_profile | Every complete window and its GC percentage |
| motif | Overlapping matches, including reverse-strand input coordinates when selected |
| palindrome | All exact reverse-complement palindromes, lengths 4–12 nt |
| tandem_repeat | All exact adjacent repeat intervals, unit lengths 1–6 nt and at least three copies |

Columns are `dataset,record,field,value,unit,start_1based,end_1based,strand,frame,codon,amino_acid,count,frequency_percent,length_nt,notes`. Non-applicable fields are empty. Undefined percentages are empty rather than zero. GC, AT and base percentages exclude ambiguous symbols from their denominator. Frequencies are percentages, not fractions. Frame labels retain `+` or Unicode minus `−`. All coordinates are 1-based inclusive on the original input. A reverse-strand protein is oriented 5′→3′ on the reverse complement.

Quoted fields escape internal double quotes. User-supplied sequence labels beginning with whitespace followed by `=`, `+`, `-` or `@` receive a leading apostrophe, preventing spreadsheet execution. Trusted frame and strand labels remain unchanged. No runtime ZIP dependency is needed.

## Migration from the former summary CSV

The previous `dna-analysis.csv` had `metric,value,unit`. The replacement is `seqscope-analysis.csv`. Select `dataset=composition` to recover those metrics: `length` is now `sequence_length`; `count_A/C/G/T`, `ambiguous_count`, `gc_content` and `at_content` keep their meaning. Use column names rather than fixed column positions. Compare's `seqscope-alignment.csv` and FASTA files are unchanged.
