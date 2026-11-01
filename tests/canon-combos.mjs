import assert from 'node:assert/strict';
import {boot,read} from './dom-harness.mjs';
const plain=x=>JSON.parse(JSON.stringify(x));
const names=(app,id)=>[...app.get(id).innerHTML.matchAll(/data-player="([^"]+)"/g)].map(m=>m[1]);
const definitions=boot('match.html').sandbox.TEAM_DATA;
const catalog=boot('match.html').sandbox.CanonCombos;
assert.equal(new Set(catalog.all.map(c=>c.id)).size,catalog.all.length);
for(const [team,definition] of Object.entries(definitions)){
  const moveNames=definition.combos.map(c=>c.name),tacticNames=definition.tactics.map(t=>t.name);
  assert.equal(new Set(moveNames).size,moveNames.length,team+' cannot display duplicate move names');
  assert.equal(new Set(tacticNames).size,tacticNames.length,team+' cannot display duplicate tactic names');
}
for(const c of catalog.all){
  assert.ok(c.jp&&c.work&&c.source.startsWith('https://')&&c.desc.length>20,c.id);
  assert.equal(new Set(c.members).size,c.members.length,c.id);
  assert.ok(c.members.length>=2,c.id);
}
const dd=catalog.all.filter(c=>c.jp==='ファイアトルネードＤＤ');
assert.equal(dd.length,1);
assert.deepEqual(plain(dd[0].members),['豪炎寺','劍城']);
assert.ok(dd[0].work.includes('超次元夢幻比賽'));
assert.deepEqual(plain(catalog.all.find(c=>c.id==='last-resort-sigma').members),['明日人','灰崎','野坂','一星']);
assert.deepEqual(plain(catalog.all.find(c=>c.id==='penguin-2-shark-japan').members),['灰崎','風丸','水神矢']);
assert.deepEqual(plain(catalog.all.find(c=>c.id==='penguin-2-shark-zhao').members),['灰崎','鬼道','不動']);
assert.equal(catalog.all.find(c=>c.id==='haru-inazuma-break').media,'遊戲');
assert.ok(!catalog.all.some(c=>/ソードオブファイア|最強イレブン波動|グレートブラスター/.test(c.jp)),'Avatar fusion, Miximax and trailer-only entries are excluded');
let playerChecks=0,referenceChecks=0;
const configs=[
 ['index.html','world','#pitchLines','#bench','#undoBtn','#canonGuide',definitions.world],
 ['opponent.html','rival','#lines','#bench','#undo','#canonGuide',definitions.rival],
 ['match.html','match-a','#aLines','#aBench','#matchUndo','#aCanonGuide',definitions.world],
 ['match.html','match-b','#bLines','#bBench','#matchUndo','#bCanonGuide',definitions.rival]
];
for(const [file,team,pitch,bench,undo,guide,definition] of configs){
  const app=boot(file),initial=names(app,pitch),reserves=names(app,bench),roster=definition.roster.map(r=>r[0]);
  for(const name of roster){
    app.dispatch('click',app.node(team,name));
    const card=app.skillCard().innerHTML;
    const references=catalog.playable(roster).filter(c=>c.members.includes(name));
    if(references.length)assert.ok(card.includes(team==='world'||team==='match-a'?'合體技圖鑑（原作／指定搭配）':'合體技圖鑑（原作／延伸）'),name);
    for(const entry of references){assert.ok(card.includes('data-canon-id="'+entry.id+'"'),entry.id);referenceChecks++}
    playerChecks++;
  }
  for(const c of definition.combos)assert.ok(c.members.every(n=>roster.includes(n)),'Only full same-team casts are playable: '+c.name);
  const foreign=catalog.playable(roster).find(c=>c.simulation&&c.id!=='asura');
  const article=app.get(guide).innerHTML.split('</article>').find(x=>x.includes('data-canon-id="'+foreign.id+'"'));
  assert.ok(!article.includes('原作搭檔：'));
  assert.ok(!article.includes('原作說明：'));
  for(const outside of foreign.originalMembers.filter(n=>!roster.includes(n)))assert.ok(!article.includes(outside),outside+' must not be shown');
  // Mouse dragging starts from the entire card, including bench players.
  const transfer={setData(){}};
  app.dispatch('dragstart',app.node(team,reserves[0]),{dataTransfer:transfer});
  app.dispatch('drop',app.node(team,initial[0]),{dataTransfer:transfer});
  assert.equal(names(app,pitch)[0],reserves[0]);app.button(undo);app.advance();
  // Whole-card touch dragging is opt-in, so normal card swipes can still scroll.
  app.click('[data-lineup-drag-toggle]',{lineupDragToggle:team});
  app.dispatch('pointerdown',app.node(team,reserves[0]),{pointerId:12,pointerType:'touch',clientX:20,clientY:20});
  app.setPoint(app.node(team,initial[1]));
  const move=app.dispatch('pointermove',app.node(team,reserves[0]),{pointerId:12,pointerType:'touch',clientX:60,clientY:70});
  assert.equal(move.prevented,true);
  app.dispatch('pointerup',app.node(team,reserves[0]),{pointerId:12,pointerType:'touch'});
  assert.equal(names(app,pitch)[1],reserves[0]);app.button(undo);app.advance();
  assert.ok(app.sandbox.LineupTools.attrs(team,initial[0]).includes('data-lineup-drag-mode="true"'),'Rerender preserves drag mode');
  app.click('[data-lineup-drag-toggle]',{lineupDragToggle:team});
  assert.ok(app.sandbox.LineupTools.attrs(team,initial[0]).includes('data-lineup-drag-mode="false"'));
  app.dispatch('pointerdown',app.node(team,reserves[0]),{pointerId:13,pointerType:'touch',clientX:20,clientY:20});
  const normalMove=app.dispatch('pointermove',app.node(team,reserves[0]),{pointerId:13,pointerType:'touch',clientX:60,clientY:70});
  assert.ok(!normalMove.prevented);
  app.dispatch('pointerup',app.node(team,reserves[0]),{pointerId:13,pointerType:'touch'});
  assert.deepEqual(names(app,pitch),initial);
  assert.ok(read('dist/'+file).includes('data-lineup-drag-toggle="'+team+'"'));
}
// The chosen DD cast controls current availability, auto-arranging and swap previews.
const app=boot('index.html');
const combo=definitions.world.combos.find(c=>c.id==='fire-tornado-dd');
let field=names(app,'#pitchLines');
assert.ok(field.includes('豪炎寺')&&field.includes('劍城'));
const reserve=names(app,'#bench').find(n=>!combo.members.includes(n));
const after=field.map(n=>n==='豪炎寺'?reserve:n);
const impact=app.sandbox.SwapDrawer.impact(definitions.world,[field],[after]);
assert.ok(impact.combos.lost.some(c=>c.id==='fire-tornado-dd'));
app.sandbox.LineupTools.exchange('world',[['豪炎寺',reserve]]);
app.dispatch('click',app.node('world','劍城'));
const combosSection=app.skillCard().innerHTML.split('<section data-player-combos>')[1].split('</section>')[0];
assert.ok(combosSection.includes('data-move-id="fire-tornado-dd" data-ready="false"'));
const index=definitions.world.combos.findIndex(c=>c.id==='fire-tornado-dd');
app.click('[data-combo]',{combo:String(index)});
field=names(app,'#pitchLines');assert.ok(combo.members.every(n=>field.includes(n)));
console.log(JSON.stringify({catalogueEntries:catalog.all.length,screenVersions:catalog.all.filter(c=>c.media!=='遊戲').length,playerCatalogueChecks:playerChecks,referenceBindings:referenceChecks,ddCastAndReadiness:'passed',onlyAssignedPartnersDisplayed:'passed',wholeCardMouseAndTouchDragging:'passed',dragModeOffRestoresScrolling:'passed',browserVisualQA:'unavailable in this environment'},null,2));
