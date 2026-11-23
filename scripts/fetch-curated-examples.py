"""Maintainer-only refresh of fixed primary records. No network is used by the site or tests.

Run: python3 scripts/fetch-curated-examples.py [--records-dir /path/to/cached/records]
The cache consists of NCBI efetch GBSeq XML files named hbb/gfp/mt/lambda/lac.xml.
"""
import argparse
from collections import Counter
from datetime import date
from hashlib import sha256
import json
from pathlib import Path
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
RECORDS = {
    'hbb': {'id': 'NM_000518.5'},
    'gfp': {'id': 'M62653.1'},
    'mt': {'id': 'NC_012920.1', 'seq_start': 5904, 'seq_stop': 7445},
    'lambda': {'id': 'NC_001416.1'},
    'lac': {'id': 'NC_000913.3', 'seq_start': 361200, 'seq_stop': 367550, 'strand': 2},
}

def read_record(key, cache):
    params = {'db': 'nuccore', 'rettype': 'gb', 'retmode': 'xml', **RECORDS[key]}
    url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?' + urllib.parse.urlencode(params)
    cached = cache / (key + '.xml') if cache else None
    if cached and cached.exists():
        data = cached.read_bytes()
    else:
        data = urllib.request.urlopen(url, timeout=60).read()
        time.sleep(.4)
    record = ET.fromstring(data).find('GBSeq')
    assert record is not None, f'Missing primary record: {key}'
    assert record.findtext('GBSeq_accession-version') == RECORDS[key]['id']
    sequence = record.findtext('GBSeq_sequence').upper()
    assert re.fullmatch('[ACGT]+', sequence)
    features = []
    for feature in record.findall('GBSeq_feature-table/GBFeature'):
        if feature.findtext('GBFeature_key') != 'CDS':
            continue
        quals = {q.findtext('GBQualifier_name'): q.findtext('GBQualifier_value')
                 for q in feature.findall('GBFeature_quals/GBQualifier')}
        if 'translation' in quals:
            features.append({'location': feature.findtext('GBFeature_location'),
                             **{k: quals[k] for k in ['gene', 'protein_id', 'translation', 'transl_table'] if k in quals}})
    return {'sequence': sequence, 'features': features, 'retrievalUrl': url,
            'organism': record.findtext('GBSeq_organism')}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--records-dir', type=Path)
    parser.add_argument('--retrieved-on', type=date.fromisoformat, default=date.today(), help='Actual acquisition date; supply the original date when using cached records.')
    args = parser.parse_args()
    records = {key: read_record(key, args.records_dir) for key in RECORDS}
    definitions = [
        ('hbb-cds', 'hbb', 51, 494, 'Human beta-globin (HBB)', 'Homo sapiens HBB complete CDS, NM_000518.5:51-494',
         'Encodes the beta chain of hemoglobin for oxygen transport. A classic example in sickle-cell genetics and sequence variation.',
         'Inspect the complete +1 ORF, translate its 147 residues, or compare the c.20A>T teaching substitution.',
         '1', 'eukaryotic', 'coding', 'atg', '51–494 on the spliced transcript; forward (+), coding 1–444',
         'HBB', 'Complete CDS in DNA alphabet, extracted from the spliced mRNA reference.'),
        ('telomere', None, 1, 60, 'Human telomeric repeats', 'Synthetic human telomeric repeat tract, TTAGGG x 10',
         'TTAGGG repeat motifs characterize human chromosome ends and provide an entry point into telomere biology.',
         'Find TTAGGG × 10, inspect positions 1–60, and compare motif and repeat counts.',
         '1', 'unspecified', 'unknown', 'atg', 'Synthetic tract positions 1–60; TTAGGG orientation, 5′ to 3′',
         'Canonical vertebrate telomeric repeat', 'Synthetic demonstration, not extracted from a genomic record.'),
        ('gfp', 'gfp', 26, 742, 'Green fluorescent protein', 'Aequorea victoria natural GFP CDS, M62653.1:26-742',
         'The jellyfish fluorescent protein became a landmark tool for biological imaging. This example uses natural GFP, not an engineered EGFP variant.',
         'Translate the 238-residue GFP reference and inspect codon usage in frame +1.',
         '1', 'eukaryotic', 'coding', 'atg', '26–742 on the mRNA reference; forward (+), coding 1–717',
         'GFP; natural sequence represented by AAA27721.1', 'Complete CDS in DNA alphabet; Prasher et al. natural GFP record.'),
        ('mt-co1', 'mt', 1, 1542, 'Human mitochondrial MT-CO1', 'Homo sapiens MT-CO1 CDS, NC_012920.1:5904-7445',
         'Encodes a respiratory complex IV subunit. CO1 sequences are also widely used in molecular identification studies.',
         'Use table 2 and compare its 513-residue translation with table 1. The reference ends in AGA, a table-2 stop.',
         '2', 'organellar', 'coding', 'atg', '5904–7445 on the mitochondrial reference; forward (+)',
         'MT-CO1 (COX1 in the sequence record)', 'Complete mitochondrial CDS; table-2 rule translation, without modeling RNA processing.'),
        ('lambda', 'lambda', 1, 48502, 'Bacteriophage lambda', 'Escherichia phage lambda complete genome, NC_001416.1',
         'A classic bacterial virus whose genome helped establish molecular genetics and cloning. Explore the complete 48.5 kb reference.',
         'Compare regional GC with a 500-nt window, inspect both-strand ORFs and browse the complete genome in pages.',
         '11', 'unspecified', 'genomic', 'table', '1–48502 on the reference genome; forward (+), linear reference coordinates',
         'Complete lambda reference genome', 'Phage CDS annotations use table 11. Viral DNA is not classified as a prokaryotic cell.'),
        ('lac-operon', 'lac', 1, 6351, 'E. coli lac operon region', 'E. coli K-12 MG1655 lac region, NC_000913.3:c367550-361200',
         'A landmark system for studying lactose metabolism and gene regulation. This region includes lacI, lacZYA and their intervening regulatory context.',
         'Inspect the lacI/lacZ/lacY/lacA coding intervals with table 11 and compare sequence organization. lacI has its own transcription unit.',
         '11', 'prokaryotic', 'genomic', 'table', '361200–367550 on NC_000913.3; reverse complement (−), written in lac transcription direction',
         'lacI plus lacZYA and intervening promoter/operator context', 'E. coli str. K-12 substr. MG1655; input position p maps to reference position 367551−p.'),
    ]
    examples, fixtures = {}, {}
    for (key, rec_key, first, last, title, name, intro, explore, code, source, kind, start_rule, coords, gene, note) in definitions:
        rec = records.get(rec_key)
        sequence = rec['sequence'][first-1:last] if rec else 'TTAGGG' * 10
        assert len(sequence) == last-first+1
        accession = RECORDS[rec_key]['id'] if rec else None
        organism = rec['organism'] if rec else 'Synthetic tract modeled on the human/vertebrate motif'
        source_url = f'https://www.ncbi.nlm.nih.gov/nuccore/{accession}' if rec else 'https://www.genome.gov/genetics-glossary/Telomere'
        examples[key] = dict(title=title, name=name, sequence=sequence, introduction=intro, explore=explore,
                             accession=accession, organism=organism, gene=gene, coordinates=coords,
                             orientation='−' if key=='lac-operon' else '+', synthetic=rec is None,
                             code=code, biologicalSource=source, sequenceType=kind, startRule=start_rule,
                             gcWindow=500 if key=='lambda' else 100 if len(sequence)>3000 else 30,
                             minimum=90 if key in ['lambda','lac-operon'] else 30,
                             motif='TTAGGG' if key=='telomere' else 'ATG', url=source_url,
                             source=f'{organism}. {accession or "Synthetic repeat"}; {coords}. {note}',
                             sha256=sha256(sequence.encode()).hexdigest())
        proteins = []
        for feature in rec['features'] if rec else []:
            gene_name=feature.get('gene')
            if key=='hbb-cds' and gene_name=='HBB':
                assert feature['location']=='51..494'; loc='1..444'
            elif key=='gfp' and gene_name=='GFP':
                assert feature['location']=='26..742'; loc='1..717'
            elif key=='mt-co1' and gene_name=='COX1':
                assert feature['location']=='1..1542'; loc=feature['location']
            elif key=='lac-operon' and gene_name in ['lacI','lacZ','lacY','lacA']:
                loc=feature['location']
            elif key=='lambda' and gene_name in ['nu1','J','cI']:
                loc=feature['location']
            else:
                continue
            proteins.append({**feature, 'location':loc})
        examples[key]['referenceFeatures'] = [{'gene':f.get('gene','CDS'),'location':f['location'],'proteinId':f['protein_id'],'residues':len(f['translation'])} for f in proteins]
        fixtures[key] = {'accession':accession,'length':len(sequence),'sha256':examples[key]['sha256'],
                         'counts':{base:Counter(sequence)[base] for base in 'ACGT'}, 'cds':proteins,
                         'retrievalUrl':rec['retrievalUrl'] if rec else None}
    assert fixtures['lac-operon']['length']==6351
    assert len(fixtures['lac-operon']['cds'])==4
    assert fixtures['lambda']['length']==48502
    payload=json.dumps(examples,ensure_ascii=False,indent=2)
    (ROOT/'src/curated-examples.js').write_text(f'// Fixed primary sequence records, retrieved {args.retrieved_on}. Refresh with scripts/fetch-curated-examples.py.\n'
        +'export const CURATED_EXAMPLES=Object.freeze('+payload+');\n'
        +'export const CURATED_KEYS=Object.freeze('+json.dumps(list(examples))+');\n'
        +"export const HBB_COMPARISON=Object.freeze({reference:CURATED_EXAMPLES['hbb-cds'].sequence,alternate:CURATED_EXAMPLES['hbb-cds'].sequence.slice(0,19)+'T'+CURATED_EXAMPLES['hbb-cds'].sequence.slice(20),position:20,referenceCodon:'GAG',alternateCodon:'GTG',url:'https://www.ncbi.nlm.nih.gov/clinvar/variation/15333/'});\n")
    (ROOT/'tests/fixtures/curated-references.json').write_text(json.dumps(fixtures,indent=2)+'\n')
    for key,data in fixtures.items():print(key,data['length'],data['sha256'])

if __name__=='__main__':main()
