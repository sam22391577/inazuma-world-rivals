import assert from 'node:assert/strict';
import {boot} from './dom-harness.mjs';

const plain=value=>JSON.parse(JSON.stringify(value));
const app=boot('match.html');
const {world}=app.sandbox.TEAM_DATA;
const player=world.roster.find(row=>row[0]==='黑瀨');

assert.ok(player,'Kurose is on the Japan roster');
assert.equal(player[1],'MF');
assert.deepEqual(player[2].split(',').map(item=>item.split(':')[0]),[
  '黑曜封鎖','死角截奪','獵影穿梭','影界交錯','終焉貫星','黑曜回歸線'
]);
assert.equal(app.sandbox.CanonSkills['黑瀨'].original,true);
assert.equal(app.sandbox.CanonSkills['黑瀨'].source,null);

const kuroseCombos=world.combos.filter(move=>move.members.includes('黑瀨'));
assert.deepEqual(plain(kuroseCombos.map(move=>move.name)),[
  '黑曜曙光','黑曜終星','三重斷界','無聲獵場','極寒伏獵'
]);
assert.ok(kuroseCombos.every(move=>move.origin==='原創'&&move.members[0]==='黑瀨'));
assert.deepEqual(plain(kuroseCombos.map(move=>move.type)),['射門','射門','防守','防守','防守']);
assert.deepEqual(plain(kuroseCombos.find(move=>move.name==='極寒伏獵').members),['黑瀨','敦也']);
assert.ok(kuroseCombos.find(move=>move.name==='三重斷界').desc.includes('守門員'));
assert.ok(kuroseCombos.filter(move=>move.name.startsWith('黑曜')).length<kuroseCombos.length,'Move names use varied openings');

const standalone=['黑曜終星','三重斷界','無聲獵場','極寒伏獵'].map(name=>kuroseCombos.find(move=>move.name===name));
const soloNames=['黑曜封鎖','死角截奪','獵影穿梭','影界交錯','終焉貫星','黑曜回歸線'];
assert.ok(standalone.every(move=>!soloNames.some(name=>move.desc.includes(name))),'New combinations use independent choreography instead of named move fusion');

console.log(JSON.stringify({kuroseSkills:6,kuroseLedCombinations:5,shotMoves:2,defensiveMoves:3,atsuyaDefense:true,independentMechanics:true},null,2));
