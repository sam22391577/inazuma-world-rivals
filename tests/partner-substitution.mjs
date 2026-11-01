import assert from 'node:assert/strict';
import {boot} from './dom-harness.mjs';

const plain=value=>JSON.parse(JSON.stringify(value));
const app=boot('match.html');
const api=app.sandbox.CanonCombos;
const {world,rival}=app.sandbox.TEAM_DATA;
const roster=world.roster.map(row=>row[0]);

assert.deepEqual(plain(world.combos),plain(api.worldPlayable(roster).concat(api.worldPlanACombos)),'The world team combines approved assignments with the curated original set');
assert.equal(world.combos.length,64);
assert.ok(world.combos.some(move=>move.simulation),'Missing original partners use assigned teammates');
assert.equal(world.combos.filter(move=>move.origin==='原創').length,25,'Twenty-five original combinations are included');

const inazuma=world.combos.find(move=>move.id==='inazuma-break');
const zero=world.combos.find(move=>move.id==='zero-magnum');
assert.deepEqual(plain(inazuma.members),['鬼道','風丸','豪炎寺']);
assert.deepEqual(plain(zero.members),['白龍','劍城']);
assert.deepEqual(plain(world.combos.find(move=>move.id==='fire-tornado-dd').members),['豪炎寺','劍城']);

for(const seed of ['one','two','three']){
  const seeded=boot('match.html',{'inazuma-canon-partner-seed-v1':seed});
  assert.deepEqual(plain(seeded.sandbox.TEAM_DATA.world.combos),plain(world.combos),'World exceptions are fixed, not random');
}
assert.ok(!rival.combos.some(move=>move.simulation),'World selection uses only exact original casts and new original moves');
assert.deepEqual(plain(rival.combos.filter(move=>move.origin==='原作').map(move=>move.members)),[['潘恩','加塞爾'],['阿爾法','貝塔','伽馬']]);
assert.equal(JSON.stringify(api.all).includes('twin-boost-world'),false,'Historical source catalog remains immutable');

const impact=app.sandbox.SwapDrawer.impact({combos:[{id:'first',name:'同名技',members:['甲','乙']},{id:'second',name:'同名技',members:['甲','丙']}],tactics:[]},[['甲','乙']],[['甲','丙']]);
assert.deepEqual(plain(impact.combos.gained.map(move=>move.id)),['second']);
assert.deepEqual(plain(impact.combos.lost.map(move=>move.id)),['first']);

console.log(JSON.stringify({worldEntries:world.combos.length,approvedAssignments:'passed',originalEntries:25,randomWorldSubstitutionsRemoved:true,rivalExactOriginalCasts:true},null,2));
