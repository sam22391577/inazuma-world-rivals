import assert from 'node:assert/strict';
import {boot,read} from './dom-harness.mjs';

const latest=['verona','monsoon','redlightning','redcopper','sunseal','seacompass','prism','bloom','blackcrown'];
const removed=['turkey','colombia','senegal','india','newzealand','germany','switzerland','egypt','greece','chile','vietnam','poland','peru','algeria','austria','denmark','belgium','croatia','hungary','sweden','worldcrown'];
const ranges={
  verona:[1,2],monsoon:[2,3],redlightning:[2,4],redcopper:[3,3],
  sunseal:[3,4],seacompass:[3,4],prism:[3,4],bloom:[3,4],blackcrown:[4,4]
};
const app=boot('match.html');

assert.ok(app.sandbox.TEAM_DATA.rival,'world selection team remains');
assert.deepEqual(JSON.parse(JSON.stringify(app.sandbox.LATEST_OPPONENT_KEYS)),latest,'latest story opponents are ordered by schedule');
for(const key of removed)assert.equal(app.sandbox.TEAM_DATA[key],undefined,key+' removed');
for(const key of latest)assert.ok(app.sandbox.TEAM_DATA[key],key+' exists');

let priorCombos=0,priorTactics=0;
for(const key of latest){
  const team=app.sandbox.TEAM_DATA[key],names=new Set(team.roster.map(row=>row[0]));
  assert.equal(team.roster.length,11,key+' uses the eleven story starters');
  assert.equal(names.size,11,key+' unique roster names');
  assert.ok(team.intro.length>35,key+' detailed intro');
  assert.ok(team.focus&&team.ratio&&team.identity&&team.strength,key+' profile fields');
  assert.equal(team.formations.length,1,key+' one finalized formation');
  assert.equal(team.formations[0].lines.flat().length,11,key+' starting eleven');
  assert.equal(team.formations[0].slots.length,11,key+' uses free-position coordinates');
  assert.ok(new Set(team.formations[0].slots.slice(0,-1).map(slot=>slot[1])).size>=5,key+' keeps front-to-back depth');
  assert.equal(new Set(team.formations[0].lines.flat()).size,11,key+' unique starting eleven');
  assert.ok(team.formations[0].lines.flat().every(name=>names.has(name)),key+' lineup belongs to roster');
  assert.equal(team.roster.find(row=>row[0]===team.formations[0].lines.at(-1)[0])[1],'GK',key+' goalkeeper is last line');
  assert.ok(team.stars.length>=3,key+' key player list');
  assert.equal(team.units.length,3,key+' three line identities');

  const [minimum,maximum]=ranges[key];
  for(const [name,pos,encoded] of team.roster){
    const moves=encoded.split(',').map(value=>value.split(':'));
    assert.equal(new Set(moves.map(move=>move[0])).size,moves.length,name+' unique moves');
    assert.ok(moves.length>=minimum&&moves.length<=maximum,name+' follows stage move range');
    assert.ok(moves.every(([move])=>team.skillDetails[name][move]?.length>=6),name+' move descriptions');
    if(pos==='GK')assert.ok(moves.every(([,type])=>type==='防守'),name+' keeper-only skills');
    if(pos==='DF')assert.ok(moves.every(([,type])=>type==='防守'||type==='搶球'),name+' defender-only defensive skills');
    if(key!=='verona'&&(pos==='MF'||pos==='FW')){
      const types=new Set(moves.map(([,type])=>type));
      assert.ok(types.has('射門')&&types.has('搶球')&&types.has('進攻'),name+' has shooting, stealing and dribbling');
    }
  }
  for(const combo of team.combos){
    assert.ok(combo.members.length>=2&&combo.members.length<=3,combo.name+' uses two or three players');
    assert.ok(combo.members.every(name=>names.has(name)),combo.name+' participants belong to team');
    assert.ok(combo.desc.length>=12,combo.name+' detailed description');
  }
  assert.ok(team.combos.length>=priorCombos,key+' combination count does not decrease');
  assert.ok(team.tactics.length>=priorTactics,key+' tactic count does not decrease');
  priorCombos=team.combos.length;priorTactics=team.tactics.length;
  assert.ok(team.tactics.every(tactic=>tactic.members.every(name=>names.has(name))&&tactic.desc.length>=20),key+' tactic data');
}

assert.equal(app.sandbox.TEAM_DATA.redcopper.formations[0].shape,'4-2-3-1','Ghana formation');
assert.equal(app.sandbox.TEAM_DATA.blackcrown.roster.length,11,'final opponent roster');
assert.equal(app.sandbox.TEAM_DATA.blackcrown.combos.length,8,'final opponent combination count');
assert.equal(app.sandbox.TEAM_DATA.blackcrown.tactics.length,5,'final opponent tactic count');
assert.ok(app.sandbox.TEAM_DATA.blackcrown.stars.some(star=>star.name==='羅倫佐・德盧卡'),'Lorenzo is a key player');

assert.equal(app.sandbox.TEAM_DATA.world.matchupStruggles,undefined,'opponent struggle points are removed');

for(const side of ['a','b']){
  const select=app.get('#'+side+'TeamSelect').innerHTML;
  for(const key of latest)assert.ok(select.includes('value="'+key+'"'),side+' selector '+key);
  for(const key of removed)assert.ok(!select.includes('value="'+key+'"'),side+' selector removes '+key);
}

const bSelect=app.get('#bTeamSelect');
bSelect.value='blackcrown';app.dispatch('change',bSelect,{},bSelect);
assert.ok(app.get('#bSetupTitle').textContent.includes('黑冠天穹'));
assert.ok(app.get('#bTeamIdentity').innerHTML.includes('羅倫佐・德盧卡'));
assert.deepEqual([...app.get('#bLines').innerHTML.matchAll(/data-player="([^"]+)"/g)].map(match=>match[1]),JSON.parse(JSON.stringify(app.sandbox.TEAM_DATA.blackcrown.formations[0].lines.flat())));

const opponent=boot('opponent.html');
for(const key of ['rival',...latest])assert.ok(opponent.get('#teamSelect').innerHTML.includes('value="'+key+'"'),'opponent selector '+key);
for(const key of removed)assert.ok(!opponent.get('#teamSelect').innerHTML.includes('value="'+key+'"'),'opponent selector removes '+key);
const teamSelect=opponent.get('#teamSelect');teamSelect.value='verona';opponent.dispatch('change',teamSelect,{},teamSelect);
assert.ok(opponent.get('#pageTitle').textContent.includes('維羅納夜梟'));
assert.equal(opponent.get('#mSquad').textContent,'11 / 11');
assert.ok(opponent.get('#teamIntro').textContent.includes('黑瀨離開後'));
assert.ok(opponent.get('#teamIdentity').innerHTML.includes('達里奧・薩爾蒂'));
assert.ok(opponent.get('#lines').classList.contains('custom-layout'),'opponent formations use free-position rendering');

assert.ok(!read('dist/opponent.html').includes('strugglePanel')&&!read('dist/opponent.html').includes('struggleList'),'opponent page removes struggle analysis');
assert.ok(!read('dist/match.html').includes('StrugglePanel')&&!read('dist/assets/match-app.js').includes('matchupStruggles'),'match page removes struggle analysis');
assert.ok(read('dist/index.html').includes('latest-opponent-teams.js?v=3'));
assert.ok(read('dist/assets/latest-opponent-teams.js').includes('世界賽前熱身'));
console.log(JSON.stringify({latestTeams:latest.length,stageMoveRules:'passed',positionRules:'passed',progression:'passed',worldSelectionPreserved:'passed',oldTeamsRemoved:'passed',dropdowns:'passed'},null,2));
