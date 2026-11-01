import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {boot} from './dom-harness.mjs';

const json=x=>JSON.parse(JSON.stringify(x));
const reference=json(boot('match.html').sandbox.TEAM_DATA);
const worldTactics=reference.world.tactics,worldTacticNames=worldTactics.map(tactic=>tactic.name);
assert.equal(worldTactics.length,24,'world tactics count');
assert.equal(worldTactics.filter(tactic=>tactic.origin==='原作').length,16,'original anime tactics count');
assert.equal(worldTactics.filter(tactic=>tactic.origin==='原創').length,8,'character-based original tactics count');
assert.equal(new Set(worldTacticNames).size,worldTacticNames.length,'world tactics stay unique');
assert.ok(!worldTacticNames.includes('地雷原'),'Minefield is removed');
assert.ok(worldTacticNames.includes('終結座標')&&worldTacticNames.includes('終結座標2.0'),'Both official Chinese Grid Omega names are present');
const ultimateThunder=worldTactics.find(tactic=>tactic.name==='究極閃電');
assert.deepEqual(ultimateThunder.members,['神童','風丸','吹雪','壁山','劍城']);
assert.equal(ultimateThunder.leader,'神童');assert.ok(ultimateThunder.work.includes('第17話'));
const thunderFormation=reference.world.formations[1];
assert.equal(thunderFormation.name,'雷鏈強襲');assert.equal(thunderFormation.shape,'3-3-4');
assert.deepEqual(thunderFormation.lines.map(line=>line.length),[3,1,2,2,2,1]);
assert.ok(ultimateThunder.members.every(name=>thunderFormation.lines.flat().includes(name)),'Thunder formation includes the full tactic cast');
for(const [name,type,episode] of [['柔與剛','進攻','第2話'],['天使長袍','防守','第3話']]){
  const tactic=worldTactics.find(item=>item.name===name);
  assert.ok(tactic,name+' is included');assert.equal(tactic.type,type);assert.equal(tactic.leader,'鬼道');
  assert.deepEqual(tactic.members,['鬼道']);assert.equal(tactic.origin,'原作');assert.ok(tactic.work.includes(episode));assert.ok(tactic.source);
}
for(const name of ['天空道路','雙颱聯防']){
  const tactic=worldTactics.find(item=>item.name===name);
  assert.ok(tactic,name+' is included');assert.equal(tactic.leader,'鬼道');assert.deepEqual(tactic.members,['鬼道']);assert.ok(tactic.desc.length>=45);
}
const field=(app,id)=>[...app.get(id).innerHTML.matchAll(/data-portrait-name="([^"]+)"/g)].map(m=>m[1]);
const options=select=>[...select.innerHTML.matchAll(/<option value="([^"]+)"([^>]*)>([^<]*)<\/option>/g)].map(m=>({name:m[1],disabled:m[2].includes('disabled'),label:m[3]}));
const fixtures=[
  ['index.html','world','world','worldReadyTactics','#pitchLines','#bench','#undoBtn','.pitch'],
  ['opponent.html','rival','rival','rivalReadyTactics','#lines','#bench','#undo','#lines'],
  ['match.html','world','match-a','aReadyTactics','#aLines','#aBench','#matchUndo','#matchPitch'],
  ['match.html','rival','match-b','bReadyTactics','#bLines','#bBench','#matchUndo','#matchPitch']
];
for(const [page,key,team,id,fieldId,benchId,undo,scrollTarget] of fixtures){
  const app=boot(page),host=app.get('#'+id),select=host.querySelector('select'),description=host.querySelector('.ready-tactic-description');
  const before=field(app,fieldId),members=new Set(before),items=reference[key].tactics;
  assert.deepEqual(options(select).map(o=>o.name),reference[key].tactics.map(t=>t.name));
  assert.ok(options(select).every(o=>!o.disabled),'Every tactic stays selectable');assert.equal(select.disabled,false);
  assert.equal(host.querySelector('[data-ready-count]').textContent,'可選 '+items.length+' / '+items.length);
  for(const item of items){
    const missing=item.members.filter(n=>!members.has(n)),option=options(select).find(o=>o.name===item.name);
    if(missing.length){assert.ok(option.label.includes('自動換上'));for(const name of missing)assert.ok(option.label.includes(name))}
    else assert.ok(option.label.includes('可直接施展'));
  }
  const direct=items.find(t=>t.members.every(n=>members.has(n)));
  assert.ok(direct,'Each default lineup has a directly usable tactic');
  select.value=direct.name;app.dispatch('change',select,{},select);
  assert.ok(description.innerHTML.includes(direct.desc));assert.deepEqual(field(app,fieldId),before,'A complete tactic does not change players');
  assert.equal(app.get(scrollTarget).scrolledWith?.block,'start','Selecting a tactic scrolls back to the formation');
  const automatic=items.find(t=>t.members.some(n=>!members.has(n)));
  assert.ok(automatic,'Each default lineup has a tactic that needs automatic substitution');
  const expectedIncoming=automatic.members.filter(n=>!members.has(n));
  select.value=automatic.name;app.dispatch('change',select,{},select);
  const after=field(app,fieldId),afterSet=new Set(after);
  assert.ok(automatic.members.every(n=>afterSet.has(n)),'All required tactic members are moved onto the field');
  assert.deepEqual(after.filter(n=>!members.has(n)).sort(),[...expectedIncoming].sort(),'Only missing tactic members enter');
  assert.equal(select.value,automatic.name);assert.ok(description.innerHTML.includes(automatic.desc));
  assert.ok(options(select).every(o=>!o.disabled),'Options remain enabled after automatic substitution');
  app.button(undo);assert.deepEqual(field(app,fieldId),before,'Automatic substitution can be undone');
  assert.ok(options(select).every(o=>!o.disabled));assert.equal(select.value,'');
  app.sandbox.TechniqueInfo.readyTactics(id,items,[[]]);
  assert.equal(select.disabled,false,'The menu stays openable even when every tactic needs substitutions');
  assert.equal(options(select).length,items.length);assert.ok(options(select).every(o=>!o.disabled));assert.ok(description.innerHTML.includes('自動替換'));
}

const source=readFileSync('dist/assets/teams-data.js','utf8');
const context={window:{}};vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('for(const [teamKey')),context);
let notes=0,preserved=0;
for(const key of ['world','rival']){
  const page=key==='world'?'index.html':'opponent.html',app=boot(page),match=boot('match.html');
  const baseline=context.window.TEAM_DATA[key].formations;
  reference[key].formations.forEach((form,i)=>{
    assert.ok(form.note?.trim(),form.name+' needs a description');
    if(key==='world'&&baseline[i]){
      assert.deepEqual(json(form.lines),json(baseline[i].lines),'Descriptions must not alter lineups');
      assert.equal(form.shape,baseline[i].shape);
      if(baseline[i].note)preserved++;
    }else{
      assert.equal(key,'rival');assert.equal(reference[key].formations.length,5);assert.equal(form.lines.flat().length,11);assert.equal(form.slots.length,11);
    }
    app.click(key==='world'?'[data-formation]':'[data-form]',key==='world'?{formation:String(i)}:{form:String(i)});
    assert.equal(app.get('#formationNote').textContent,form.note);assert.equal(app.get('#formationNote').hidden,false);
    const side=key==='world'?'a':'b';match.click('[data-'+side+']',{[side]:String(i)});
    assert.equal(match.get('#'+side+'FormationNote').textContent,form.note);notes++;
  });
}
console.log(JSON.stringify({dropdowns:fixtures.length,allTacticsSelectable:'passed',automaticSubstitution:'passed',sameLineupWhenComplete:'passed',undoAutomaticSubstitution:'passed',allMissingMenuRemainsOpenable:'passed',formationDescriptions:notes,existingDescriptionsPreserved:preserved},null,2));
