import assert from 'node:assert/strict';
import {boot} from './dom-harness.mjs';

const plain=value=>JSON.parse(JSON.stringify(value));
const app=boot('match.html');
const {world}=app.sandbox.TEAM_DATA;
const roster=world.roster.map(row=>row[0]);
const banned=['地球之歌','噴射氣流','翼龍暴風雪','閃電爆破CG','三重天馬','閃電一號','閃電一號落雷','不死鳥','死亡三角2','雙重噴射','皇帝企鵝2號（灰崎版）','死亡三角','最終保留'];

assert.equal(world.combos.length,64,'The approved animation list and curated original list are displayed');
assert.equal(world.combos.filter(move=>move.origin==='原創').length,25,'Exactly twenty-five character-based original combinations are included');
assert.equal(world.combos.filter(move=>move.origin!=='原創').length,39,'The approved animation combination list stays intact');
assert.equal(world.combos.some(move=>move.planA||move.aphrodiPlan||move.keeperPlan),false,'Legacy draft flags stay removed');
assert.ok(world.combos.every(move=>move.members.every(name=>roster.includes(name))),'Every assigned partner is on the roster');
assert.ok(world.combos.every(move=>move.desc?.length>25),'Every move has an adjusted description');
assert.ok(!world.combos.some(move=>banned.includes(move.name)),'Removed moves stay absent');

const casts={
  'inazuma-break':['鬼道','風丸','豪炎寺'],
  'penguin-2-world-kidou':['鬼道','灰崎','豪炎寺'],
  'fire-tornado-dd':['豪炎寺','劍城'],
  'triple-blizzard':['吹雪','敦也','白龍'],
  'polar-bear-2':['阿芙洛蒂','天馬','西蔭'],
  'zero-magnum':['白龍','劍城'],
  'chaos-break':['阿芙洛蒂','豪炎寺','吹雪']
};
for(const [id,members] of Object.entries(casts)){
  const move=world.combos.find(item=>item.id===id);
  assert.ok(move,id);assert.deepEqual(plain(move.members),members,id+' cast');
}
const kidouPenguin=world.combos.find(item=>item.id==='penguin-2-world-kidou');
assert.ok(kidouPenguin.desc.includes('灰崎')&&!kidouPenguin.desc.includes('吹雪'),'Kidou Penguin 2 description follows the updated cast');

for(let i=0;i<8;i++){
  const seeded=boot('match.html',{'inazuma-canon-partner-seed-v1':'latest-world-'+i});
  assert.deepEqual(plain(seeded.sandbox.TEAM_DATA.world.combos),plain(world.combos),'Approved world assignments are stable');
}

console.log(JSON.stringify({worldCombinations:world.combos.length,animationCombinations:39,originalCombinations:25,legacyDraftsRemoved:true,removedMovesAbsent:true,assignedCasts:'passed',seedIndependent:true},null,2));
