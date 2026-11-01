import assert from 'node:assert/strict';
import {boot} from './dom-harness.mjs';

const names=(app,id)=>[...app.get(id).innerHTML.matchAll(/data-player="([^"]+)"/g)].map(m=>m[1]);
const plain=value=>JSON.parse(JSON.stringify(value));
const data=boot('match.html').sandbox.TEAM_DATA;
const configs=[
  ['index.html','world','#pitchLines','#bench',data.world],
  ['opponent.html','rival','#lines','#bench',data.rival],
  ['match.html','match-a','#aLines','#aBench',data.world],
  ['match.html','match-b','#bLines','#bBench',data.rival]
];
const candidateNames=drawer=>[...drawer.querySelector('#swapCandidates').innerHTML.matchAll(/data-swap-candidate="([^"]+)"/g)].map(m=>m[1]);
let impactChecks=0;
for(const [file,team,pitch,bench,definition] of configs){
  const app=boot(file),initial=names(app,pitch),reserves=names(app,bench),roster=definition.roster.map(r=>r[0]);
  const source=initial[0],target=reserves.find(n=>definition.roster.find(r=>r[0]===n)[1]!==definition.roster.find(r=>r[0]===source)[1]);
  const otherPitch=team==='match-a'?'#bLines':team==='match-b'?'#aLines':null;
  const otherBefore=otherPitch?names(app,otherPitch):null;
  const open=name=>app.click('[data-player-exchange]',{lineupTeam:team,playerExchange:name});
  const select=name=>app.drawerClick('[data-swap-candidate]',{swapCandidate:name});
  const apply=()=>app.drawerClick('[data-swap-apply]');
  app.dispatch('click',app.node(team,source));
  assert.ok(app.skillCard().innerHTML.includes('data-player-exchange="'+source+'"'));
  open(source);
  const drawer=app.drawer();
  assert.equal(drawer.open,true);
  assert.equal(app.skillCard().hidden,true,'Opening exchange dismisses the player details');
  assert.deepEqual(candidateNames(drawer),plain(roster.filter(n=>n!==source)),'All candidates retain roster order, including other positions');
  assert.ok(drawer.querySelector('#swapSource').innerHTML.includes('data-portrait-name="'+source+'"'));
  assert.equal(drawer.querySelector('[data-swap-apply]').disabled,true);
  app.drawerClick('[data-swap-filter]',{swapFilter:'bench'});
  assert.deepEqual(new Set(candidateNames(drawer)),new Set(reserves));
  app.drawerClick('[data-swap-filter]',{swapFilter:'field'});
  assert.deepEqual(new Set(candidateNames(drawer)),new Set(initial.filter(n=>n!==source)));
  app.drawerClick('[data-swap-filter]',{swapFilter:'all'});
  app.drawerSearch(target);
  assert.deepEqual(candidateNames(drawer),[target]);
  app.drawerSearch('');
  select(target);
  assert.deepEqual(names(app,pitch),initial,'Preview must not mutate the lineup');
  const next=initial.map(n=>n===source?target:n),preview=drawer.querySelector('#swapPreview').innerHTML;
  const expected=items=>{
    const ready=field=>items.filter(item=>item.members.every(n=>field.includes(n)));
    const before=ready(initial),after=ready(next);
    const id=c=>c.id||c.name;
    return {before:before.length,after:after.length,gained:after.filter(x=>!before.some(y=>id(y)===id(x))),lost:before.filter(x=>!after.some(y=>id(y)===id(x)))};
  };
  const change=plain(app.sandbox.SwapDrawer.impact(definition,[initial],[next]));
  assert.deepEqual(change,{combos:plain(expected(definition.combos)),tactics:plain(expected(definition.tactics))});
  for(const kind of ['combos','tactics'])for(const direction of ['gained','lost'])for(const item of change[kind][direction]){
    assert.ok(preview.includes('<li>'+item.name+'</li>'));impactChecks++;
  }
  assert.ok(preview.includes('可用合體技 '+change.combos.before+' → '+change.combos.after));
  assert.ok(preview.includes('必殺戰術 '+change.tactics.before+' → '+change.tactics.after));
  app.drawerClick('[data-swap-close]');
  assert.equal(drawer.open,false);
  assert.deepEqual(names(app,pitch),initial,'Cancel preserves the lineup');
  open(source);select(target);apply();
  assert.equal(drawer.open,false);
  assert.deepEqual(names(app,pitch),next,'Cross-position exchange is allowed');
  assert.equal(app.notice().hidden,false,'Undo notice survives the apply click bubbling');
  assert.equal(new Set([...names(app,pitch),...names(app,bench)]).size,roster.length);
  app.click('[data-swap-undo]');
  assert.deepEqual(names(app,pitch),initial,'Drawer undo restores all positions');
  assert.equal(app.notice().hidden,true);
  // Two starting players exchange their exact positions.
  open(source);select(initial[1]);apply();
  assert.deepEqual(names(app,pitch),initial.map(n=>n===source?initial[1]:n===initial[1]?source:n));
  app.click('[data-swap-undo]');
  // A bench source can select a starter, but other bench candidates are disabled.
  open(reserves[0]);
  assert.deepEqual(candidateNames(drawer),plain(roster.filter(n=>n!==reserves[0])));
  assert.equal((drawer.querySelector('#swapCandidates').innerHTML.match(/ disabled>/g)||[]).length,reserves.length-1);
  app.drawerClick('[data-swap-candidate]',{swapCandidate:reserves[1]},true);
  assert.equal(drawer.querySelector('[data-swap-apply]').disabled,true);
  select(source);apply();
  assert.equal(names(app,pitch)[0],reserves[0]);
  app.click('[data-swap-undo]');
  // An externally changed lineup cannot be overwritten by a stale preview.
  open(source);select(target);
  app.sandbox.LineupTools.exchange(team,[[initial[1],reserves[1]]]);
  const changed=names(app,pitch);
  apply();
  assert.equal(drawer.open,true);
  assert.deepEqual(names(app,pitch),changed);
  assert.equal(drawer.querySelector('[data-swap-apply]').disabled,true);
  assert.ok(drawer.querySelector('#swapHelp').textContent.includes('陣容已更新'));
  app.drawerClick('[data-swap-close]');
  assert.equal(app.sandbox.SwapDrawer.open(team,'非本隊人物'),false);
  assert.equal(app.sandbox.SwapDrawer.open('不存在的隊伍',source),false);
  if(otherPitch)assert.deepEqual(names(app,otherPitch),otherBefore,'Opposing team is untouched');
  // Ordinary card gestures leave browser scrolling available; only the handle starts dragging.
  const beforeGesture=names(app,pitch);
  const down=app.dispatch('pointerdown',app.node(team,source),{pointerId:2,pointerType:'touch',clientX:20,clientY:20});
  const move=app.dispatch('pointermove',app.node(team,source),{pointerId:2,pointerType:'touch',clientX:20,clientY:80});
  app.setPoint(app.node(team,target));
  app.dispatch('pointerup',app.node(team,source),{pointerId:2,pointerType:'touch'});
  assert.ok(!down.prevented&&!move.prevented);
  assert.deepEqual(names(app,pitch),beforeGesture);
  const drag=app.dispatch('dragstart',app.node(team,source),{dataTransfer:{setData(){}}});
  assert.ok(!drag.prevented,'The whole card supports native mouse dragging');
  app.dispatch('dragend',app.node(team,source));
  const handleClick=app.dispatch('click',app.handle(team,source));
  assert.equal(handleClick.prevented,true);
}
// Every bottom-list entry has an explanation, including unavailable moves.
for(const definition of [data.world,data.rival]){
  const app=boot('match.html'),emptyLines=[[]];
  for(const [kind,items] of [['combos',definition.combos],['tactics',definition.tactics]]){
    const html=app.sandbox.TechniqueInfo[kind](items,emptyLines);
    assert.equal((html.match(/class="technique-desc"/g)||[]).length,items.length);
    for(const item of items){assert.ok(item.desc.length>20,item.name);assert.ok(html.includes(item.desc),item.name)}
  }
}
console.log(JSON.stringify({pages:3,lineups:4,defaultWholeRoster:'passed',crossPositionPreviewApplyUndo:'passed',impactNameChecks:impactChecks,benchAndFieldSwaps:'passed',stalePreviewProtection:'passed',opposingTeamIsolation:'passed',cardScrollAndDragHandle:'passed',descriptions:{combos:data.world.combos.length+data.rival.combos.length,tactics:data.world.tactics.length+data.rival.tactics.length},browserVisualQA:'unavailable in this environment'},null,2));
