import assert from 'node:assert/strict';
import {boot,read} from './dom-harness.mjs';

const plain=value=>JSON.parse(JSON.stringify(value));
const app=boot('opponent.html'),team=app.sandbox.TEAM_DATA.rival;
const names=team.roster.map(row=>row[0]);
const abilityLabels=['射門','盤球','傳球','防守','速度','指揮／戰術判斷'];

assert.equal(team.roster.length,21);
assert.equal(team.playerProfiles.length,21);
assert.deepEqual(plain(team.playerProfiles.map(player=>player.name)),plain(names));
assert.equal(team.formations.length,5);
assert.deepEqual(plain(team.formations.map(form=>form.name)),['歐米伽四極陣','冰炎流星陣','五洲獵網','雙門封界','萬象轉換']);
assert.deepEqual(plain(team.formations.map(form=>form.shape)),['3-3-4','3-2-2-3','5-3-2','5-4-1','4-2-3-1']);
assert.deepEqual(plain(team.formations[0].lines[0]),['阿爾法','貝塔','伽馬']);
assert.ok(team.formations.every(form=>form.lines.flat().length===11&&form.slots?.length===11));
assert.ok(team.formations.slice(0,2).every(form=>form.lines.flat().filter(name=>team.roster.find(row=>row[0]===name)?.[1]==='FW').length>=4));
assert.ok(team.formations.slice(2,4).every(form=>form.lines.flat().filter(name=>team.roster.find(row=>row[0]===name)?.[1]==='DF').length===5));
assert.ok(team.formations[3].lines.flat().includes('沙木沼治'));
for(const player of team.playerProfiles){
  assert.ok(player.title&&player.shortDesc&&player.desc&&player.exclusive?.desc);
  assert.deepEqual(Object.keys(player.abilities),abilityLabels);
  assert.ok(Object.values(player.abilities).every(score=>Number.isInteger(score)&&score<=100));
}

assert.equal(team.combos.length,32);
const originals=team.combos.filter(move=>move.group==='原作');
assert.deepEqual(plain(originals.map(move=>[move.name,move.members])),[
  ['冰火暴風',['潘恩','加塞爾']],
  ['射門指令24｜最終攻擊',['阿爾法','貝塔','伽馬']]
]);
const commandMoves=team.combos.filter(move=>move.members.some(name=>['阿爾法','貝塔','伽馬'].includes(name)));
assert.equal(commandMoves.length,10);
assert.ok(commandMoves.every(move=>/^(射門|進攻|防守)指令\d{2}｜/.test(move.name)));
for(const leader of ['阿爾法','貝塔','伽馬']){
  const led=commandMoves.filter(move=>move.members.includes(leader));
  assert.ok(led.length>=4,leader+' has original and new command combinations');
  assert.ok(led.some(move=>move.members.some(name=>!['阿爾法','貝塔','伽馬'].includes(name))),leader+' combines with other teammates');
}
for(const move of team.combos){
  assert.ok(move.desc.length>=60&&move.desc.length<=90,move.name+' description length');
  assert.ok(!move.members.some(name=>move.desc.includes(name)),move.name+' description omits player names');
  assert.ok(!/對手|守門員/.test(move.desc),move.name+' description only covers caster actions and the ball path');
}
assert.ok(team.combos.some(move=>move.name==='三段超越'&&move.members.join('＋')==='圓堂晴＋雨宮太陽＋虎丸'));
assert.ok(team.combos.some(move=>move.name==='斷層巨砲'&&move.members.join('＋')==='特雷斯＋天城＋潘恩'));
assert.ok(team.roster.find(row=>row[0]==='貝塔')[2].includes('射門指令07｜雙重射門:射門'));
assert.ok(team.skillDetails['貝塔']['射門指令07｜雙重射門'].includes('化身武裝'));
assert.ok(!JSON.stringify(team).includes('極限合體'));

const directory=app.get('#teamIdentity').innerHTML;
assert.ok(directory.includes('全部 21'));
for(const name of names)assert.ok(directory.includes(name),name+' is rendered in the player directory');
assert.ok(!directory.includes('明星球員與三線組合'));
const source=read('dist/opponent.html');
assert.ok(source.includes('rival-upgrade.js?v=3'));
assert.ok(source.includes('.player{position:relative;width:72px'));
assert.ok(source.includes('.player{width:58px'));
team.formations.forEach((form,index)=>{
  app.click('[data-form]',{form:String(index)});
  assert.equal(app.get('#lines').classList.contains('custom-layout'),true,form.name);
  assert.ok(app.get('#lines').innerHTML.includes('left:'),form.name+' renders its free-position coordinates');
});
const matchCss=read('dist/assets/match.css');
assert.ok(matchCss.includes('.field-player{position:absolute;transform:translate(-50%,-50%);width:72px'));
assert.ok(matchCss.includes('.field-player{max-width:13%;width:58px'));

console.log(JSON.stringify({players:21,formations:team.formations.length,combinations:32,originalCombinations:2,commandCombinations:commandMoves.length,profilesAndDirectory:'passed',motionDescriptions:'passed'},null,2));
