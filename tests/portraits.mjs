import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {boot} from './dom-harness.mjs';

const root=new URL('../',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root),'utf8');
const records=JSON.parse(read('dist/assets/portrait-sources.json'));
assert.equal(records.length,42);
assert.equal(new Set(records.map(x=>x.officialId)).size,42);
assert.equal(new Set(records.map(x=>x.sha256)).size,42);
const byName=new Map(records.map(x=>[x.label,x]));
for(const record of records){
  const data=fs.readFileSync(new URL('dist/'+record.file,root));
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(data.readUInt32BE(16),256);
  assert.equal(data.readUInt32BE(20),256);
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'),record.sha256);
  assert.ok(record.imageSource.includes(record.officialId));
  assert.ok(record.source.startsWith('https://zukan.inazuma.jp/chara_param/'));
}
assert.equal(byName.get('圓堂').officialName,'円堂 守');
assert.equal(byName.get('圓堂晴').officialName,'円堂 ハル');
assert.equal(byName.get('基山').officialName,'基山 タツヤ');
assert.equal(byName.get('吉良').officialName,'吉良 ヒロト');
assert.equal(byName.get('潘恩').officialName,'バーン');
assert.equal(byName.get('加塞爾').officialName,'ガゼル');
assert.equal(byName.get('天城').officialName,'天城 大地');
assert.equal(byName.get('阿爾法').officialName,'アルファ');
assert.equal(byName.get('貝塔').officialName,'ベータ');
assert.equal(byName.get('伽馬').officialName,'ガンマ');

let snapshots=0,comboTransitions=0;
function checkRegion(app,selector,count){
  const html=app.get(selector).innerHTML;
  const pairs=[...html.matchAll(/data-portrait-name="([^"]+)" data-official-id="([^"]+)"><img[^>]+src="\.\/([^"]+)"/g)];
  const originals=[...html.matchAll(/class="player-avatar original-player-avatar"[^>]+data-portrait-name="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(pairs.length+originals.length,count,'Wrong avatar count in '+selector);
  const names=[];
  for(const [,name,id,file] of pairs){const record=byName.get(name);assert.ok(record,'Unknown player: '+name);assert.equal(id,record.officialId);assert.equal(file,record.file);names.push(name)}
  for(const name of originals){assert.equal(name,'黑瀨');assert.ok(!byName.has(name),'Original players must not reuse an official portrait');names.push(name)}
  assert.equal(new Set(names).size,count,'Duplicate player in '+selector);
  snapshots++;
  return names;
}
const definitions=boot('match.html').sandbox.TEAM_DATA;
for(const file of ['index.html','opponent.html']){
  const app=boot(file),isA=file==='index.html';
  const field=isA?'#pitchLines':'#lines';
  const expected=definitions[isA?'world':'rival'].roster.map(r=>r[0]),benchCount=expected.length-11;
  const check=()=>{const names=[...checkRegion(app,field,11),...checkRegion(app,'#bench',benchCount)];assert.equal(new Set(names).size,expected.length);assert.deepEqual([...names].sort(),[...expected].sort())};
  check();
  const formCount=definitions[isA?'world':'rival'].formations.length;
  for(let form=0;form<formCount;form++){app.click(isA?'[data-formation]':'[data-form]',isA?{formation:String(form)}:{form:String(form)});check()}
  const comboCount=(app.get(isA?'#comboList':'#combos').innerHTML.match(/data-combo=/g)||[]).length;
  for(let combo=0;combo<comboCount;combo++){app.click('[data-combo]',{combo:String(combo)});check();comboTransitions++}
  // Explicit bench swap, plus undo, must carry the selected player's own portrait.
  app.button(isA?'#resetBtn':'#reset');
  const from=checkRegion(app,field,11)[0],incoming=checkRegion(app,'#bench',benchCount)[0];
  assert.ok(app.sandbox.LineupTools.exchange(isA?'world':'rival',[[from,incoming]]));check();
  assert.ok(checkRegion(app,field,11).includes(incoming));
  app.button(isA?'#undoBtn':'#undo');check();assert.ok(checkRegion(app,field,11).includes(from));
}
const match=boot('match.html');
for(let a=0;a<definitions.world.formations.length;a++)for(let b=0;b<definitions.rival.formations.length;b++){
  match.click('[data-a]',{a:String(a)});match.click('[data-b]',{b:String(b)});
  const one=[...checkRegion(match,'#aLines',11),...checkRegion(match,'#aBench',definitions.world.roster.length-11)];
  const two=[...checkRegion(match,'#bLines',11),...checkRegion(match,'#bBench',definitions.rival.roster.length-11)];
  assert.equal(new Set([...one,...two]).size,43);
}
console.log(JSON.stringify({verifiedOfficialPortraits:42,originalPlayerMarkers:1,uniqueImages:42,threePages:true,formationPairs:definitions.world.formations.length*definitions.rival.formations.length,teamComboTransitions:comboTransitions,regionSnapshots:snapshots,swapAndUndo:'passed',identityBinding:'passed',browserVisualQA:'unavailable in this environment'},null,2));
