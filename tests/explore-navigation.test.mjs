import test from 'node:test';
import assert from 'node:assert/strict';
import {routeFromHash} from '../src/navigation.js';
test('Explore routes and legacy module links select the relocated interactive view',()=>{for(const hash of ['#explore','#molecular-explorers','#base-pairing','#codon-builder','#mutation-lab'])assert.equal(routeFromHash(hash),'explore',hash);for(const hash of ['#notes','#molecular-notes','#curious-dna','#example-sources'])assert.equal(routeFromHash(hash),'notes',hash);assert.equal(routeFromHash('#method'),'about');});
