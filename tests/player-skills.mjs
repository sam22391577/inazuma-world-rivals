import assert from 'node:assert/strict';
import {boot,read} from './dom-harness.mjs';

const names=(app,id)=>[...app.get(id).innerHTML.matchAll(/data-player="([^"]+)"/g)].map(m=>m[1]);
const definitions=boot('match.html').sandbox.TEAM_DATA;
const configs=[
  ['index.html','world','#pitchLines','#bench',definitions.world,'#undoBtn'],
  ['opponent.html','rival','#lines','#bench',definitions.rival,'#undo'],
  ['match.html','match-a','#aLines','#aBench',definitions.world,'#matchUndo'],
  ['match.html','match-b','#bLines','#bBench',definitions.rival,'#matchUndo']
];
let checkedPlayers=0;
for(const [file,team,pitch,bench,data,undo] of configs){
  const app=boot(file),field=names(app,pitch),reserves=names(app,bench);
  assert.equal(app.skillCard(),undefined,'No details should display before a player is clicked');
  function checkPlayer(name){
    const before=names(app,pitch);
    app.dispatch('click',app.node(team,name));
    const card=app.skillCard(),entry=data.roster.find(r=>r[0]===name),active=new Set(names(app,pitch));
    assert.equal(card.hidden,false);
    assert.equal(card.dataset.team,team);
    assert.ok(card.innerHTML.includes('<h2 id="playerSkillTitle">'+name+'</h2>'));
    assert.ok(card.innerHTML.includes('data-portrait-name="'+name+'"'));
    for(const skill of entry[2].split(','))assert.ok(card.innerHTML.includes('<strong>'+skill.split(':')[0]+'</strong>'));
    const comboSection=card.innerHTML.split('<section data-player-combos>')[1].split('</section>')[0];
    const ownCombos=data.combos.filter(combo=>combo.members.includes(name));
    const counts=[...new Set(ownCombos.map(combo=>combo.members.length))].sort((a,b)=>a-b);
    assert.deepEqual([...comboSection.matchAll(/data-skill-combo-count="(\d+)"/g)].map(m=>+m[1]),counts,'Participant-count categories');
    assert.equal((comboSection.match(/data-skill-combo-count="\d+" open/g)||[]).length,counts.length?1:0,'Only the first group opens initially');
    assert.equal((comboSection.match(/data-move-id=/g)||[]).length,ownCombos.length,'All participating moves appear exactly once');
    for(const combo of data.combos){
      const id=combo.id||combo.name,expected=combo.members.includes(name);
      const item=[...comboSection.matchAll(/<li class="skill-combo [\s\S]*?<\/li>/g)].map(m=>m[0]).find(html=>html.includes('data-move-id="'+id+'"'));
      assert.equal(!!item,expected,'Only this player’s combos: '+id);
      if(!expected)continue;
      const ready=combo.members.every(n=>active.has(n)),summary=item.split('<summary>')[1].split('</summary>')[0];
      assert.ok(item.includes('data-ready="'+ready+'"'),'Live combo status: '+id);
      assert.ok(item.includes(ready?'is-ready':'is-unavailable'),'Brightness state: '+id);
      assert.ok(summary.includes(ready?'可施展':'缺少：'),'Readable status: '+id);
      for(const member of combo.members)assert.ok(summary.includes('>'+member+'</span>'),'Collapsed tag includes '+member);
      assert.ok(item.includes('<details class="skill-move">'),'Description remains collapsed initially');
      assert.ok(item.includes(combo.desc),'Complete move description: '+id);
    }
    assert.deepEqual(names(app,pitch),before,'Viewing skills must not change the lineup');
    checkedPlayers++;
    return card;
  }
  // Every field and bench card shows its own portrait, personal moves and full combinations.
  for(const name of [...field,...reserves])checkPlayer(name);
  assert.ok(app.skillCard().innerHTML.includes('替補招式預覽'));
  app.click('[data-player-skill-card]');assert.equal(app.skillCard().hidden,false,'Clicks inside remain open');
  app.click('.pitch');assert.equal(app.skillCard().hidden,true,'Blank pitch click closes');
  checkPlayer(field[0]);app.dispatch('pointerdown',{closest:()=>null},{pointerType:'mouse'});
  assert.equal(app.skillCard().hidden,true,'Pointer down beside a card closes immediately');
  checkPlayer(field[1]);app.dispatch('keydown',app.node(team,field[1]),{key:'Escape'});assert.equal(app.skillCard().hidden,true);
  checkPlayer(field[0]);app.click('[data-skill-close]');assert.equal(app.skillCard().hidden,true);
  checkPlayer(field[0]);
  const transfer={setData(){}};
  app.dispatch('dragstart',app.handle(team,reserves[0]),{dataTransfer:transfer});
  assert.equal(app.skillCard().hidden,true,'Starting mouse drag closes details');
  app.dispatch('drop',app.node(team,field[0]),{dataTransfer:transfer});
  app.dispatch('click',app.node(team,reserves[0]));assert.equal(app.skillCard().hidden,true,'Post-drag click cannot reopen details');
  app.advance();
  for(const name of names(app,pitch))checkPlayer(name);
  app.button(undo);app.click('.pitch');
  checkPlayer(field[0]);
  app.dispatch('pointerdown',app.handle(team,field[0]),{pointerId:9,pointerType:'touch',clientX:10,clientY:10});
  app.setPoint(app.node(team,field[1]));
  app.dispatch('pointermove',app.handle(team,field[0]),{pointerId:9,pointerType:'touch',clientX:30,clientY:40});
  assert.equal(app.skillCard().hidden,true,'Touch drag also closes details');
  app.dispatch('pointerup',app.handle(team,field[0]),{pointerId:9,pointerType:'touch',clientX:30,clientY:40});
  app.dispatch('click',app.node(team,field[1]));assert.equal(app.skillCard().hidden,true);
  app.advance();
  app.sandbox.innerWidth=390;checkPlayer(field[1]);
  assert.equal(app.skillCard().style.bottom,'12px','Phone details use a bottom sheet');
  assert.equal(app.skillCard().style.top,'auto');
  if(file!=='match.html')assert.ok(read('dist/'+file).includes('selected-card"'+(file==='index.html'?' aria-label="選手資訊"':'')+' hidden'));
}
// Switching between opposing teams replaces the details, preserving each team's data.
const match=boot('match.html');
match.dispatch('click',match.node('match-a','圓堂'));
match.dispatch('click',match.node('match-b','圓堂晴'));
assert.equal(match.skillCard().dataset.team,'match-b');
assert.ok(match.skillCard().innerHTML.includes('メテオッド・ファイアトルネード'));
assert.ok(match.skillCard().innerHTML.includes('原作個人技'));
assert.ok(!match.skillCard().innerHTML.includes('星火環步'));
assert.ok(!match.skillCard().innerHTML.includes('data-portrait-name="圓堂"'));
console.log(JSON.stringify({pages:3,lineups:4,playerDetailChecks:checkedPlayers,allPlayerCombosByParticipantCount:'passed',castTagsAndReadiness:'passed',collapsibleDescriptions:'passed',outsideAndEscapeDismissal:'passed',switchTeams:'passed',dragSuppression:'passed',phonePositioning:'logic passed',browserVisualQA:'unavailable in this environment'},null,2));
