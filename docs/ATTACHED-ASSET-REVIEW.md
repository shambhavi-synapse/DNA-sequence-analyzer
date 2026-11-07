# Supplied Molecular Atlas asset review

All four attachments were inspected individually at native aspect ratio. No image generation or creative alteration was performed in this batch. Three images were resized/compressed to local WebP assets; the originals remain in the supplied files. Their conceptual artwork is not evidence of experimentally determined molecular geometry.

| Attachment | Assessment | Decision and placement |
| --- | --- | --- |
| 01-file_00000000df3482088231a21a18cebf73.png | Circular charcoal DNA/lens logo exploration. Strong conceptual fit, but dense helix plus internal bars and raster effects lose clarity at favicon size. | Reference only. Not adopted or traced into production. Existing simpler Swiss-style SVG candidate remains unapproved on the review branch. |
| 02-file_00000000bb3c8208af9105a3d5d9f5ad.png | Translation concept with ribosomal subunits, RNA, two stylized tRNAs and peptide. Strong focal hierarchy; tRNA geometry and site assignments are not structurally validated. | Used above the existing codon/base-pair/mutation explorers in place of the earlier conceptual ribosome artwork. No specific tRNA-site, molecular identity or atomic-coordinate claim is made. Original 3:2 composition retained. |
| 03-file_0000000011a08208913c78458d85f134.png | Transcription concept with DNA, polymerase-like assembly and emerging RNA. Useful for the overall DNA-to-RNA relationship; orientation/chemical details are not encoded by the artwork. | Used beside “Transcription makes an RNA copy”. Existing text supplies the direction convention. Full16:9 composition retained. |
| 04-file_000000002868820899cec64d73e99934.png | Replication-fork concept with branched duplexes and protein assemblies. Useful spatial overview; protein identities, strand polarity and Okazaki fragment boundaries are not experimentally resolved. | Used beside “Replication copies both strands”. Not presented as an annotated leading/lagging strand diagram. Full16:9 composition retained. |

## Delivery
Each selected image has1536px and768px WebP versions, responsive srcset/sizes, explicit dimensions, lazy loading, descriptive alt text and a12px caption: “AI-generated illustration; not a structural reference.” No object-cover crop is used. Total image payload is about335KiB across all six files; browsers select one variant per image. Existing homepage and chromatin artwork retained. Previous ribosome asset retained in the repository for recovery.

## Verification
Executed `node --test`:60 passed,0 failed. No calculation modules changed in this batch. Desktop1363×936, tablet iframe768×1024, and mobile iframe390×844 inspected in Chrome. All three images loaded; measured display ratios remain16:9,16:9,3:2. Light/dark theme checks passed. Mobile document width and scrollWidth375; tablet753, with no page overflow. Viewports are not physical-device tests. Screenshot: [transcription placement](review/supplied-artwork.jpg).

Continues draft PR10 on `review/seqscope-atlas`. PR9 remains an open review dependency. No main merge or deployment performed. Remaining tasks in ATLAS-REVIEW.md still apply, except replication/transcription asset integration is now complete.
