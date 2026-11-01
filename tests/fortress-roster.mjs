import assert from 'node:assert/strict';
import {boot,read} from './dom-harness.mjs';
const plain=x=>JSON.parse(JSON.stringify(x)),copy=plain;
const names=(app,id)=>[...app.get(id).innerHTML.matchAll(/data-player="([^"]+)"/g)].map(m=>m[1]);
const fixture=boot('match.html'),{world,rival}=fixture.sandbox.TEAM_DATA;
assert.equal(world.roster.length,22);assert.equal(rival.roster.length,21);
assert.equal(new Set([...world.roster,...rival.roster].map(r=>r[0])).size,43);
assert.ok(world.roster.some(([name,pos])=>name==='敦也'&&pos==='FW'));
assert.ok(world.roster.some(([name,pos])=>name==='壁山'&&pos==='DF'));
assert.ok(world.roster.some(([name,pos])=>name==='黑瀨'&&pos==='MF'));
assert.ok(rival.roster.some(r=>r[0]==='沙木沼治'));
assert.ok(rival.roster.some(([name,pos,skills])=>name==='天城'&&pos==='DF'&&skills.includes('萬里長城')&&skills.includes('亞特蘭提斯之壁')));
for(const name of ['阿爾法','貝塔','伽馬'])assert.ok(rival.roster.some(([player,pos])=>player===name&&pos==='FW'));
assert.ok(!rival.roster.some(r=>r[0]==='壁山'));
assert.ok(rival.formations.every(form=>!form.lines.flat().includes('壁山')));
assert.ok(rival.combos.every(move=>!move.members.includes('壁山')));
assert.ok(rival.tactics.every(move=>!move.members.includes('壁山')));
assert.equal(fixture.sandbox.LineupTools.currentName('壁山',rival.roster),'天城');
assert.ok(!world.roster.some(r=>r[0]==='沙木沼治'));
assert.deepEqual(plain(world.roster.filter(r=>r[1]==='GK').map(r=>r[0])),['圓堂','西蔭','立向居']);
assert.deepEqual(plain(fixture.sandbox.CanonSkills['立向居'].skills.map(s=>s.name)),['無限之手','魔王的巨掌']);
const attack=world.formations[0];
assert.equal(attack.name,'四鋒雷動');
assert.equal(attack.shape,'2-4-4');
assert.deepEqual(plain(attack.lines.map(line=>line.length)),[2,2,2,2,2,1]);
assert.deepEqual(plain(attack.lines.slice(0,2).flat()),['豪炎寺','劍城','灰崎','白龍']);
assert.deepEqual(plain(attack.lines.slice(2,4).flat()),['阿芙洛蒂','天馬','野坂','黑瀨']);
assert.deepEqual(plain(attack.lines[4]),['吹雪','水神矢']);
assert.ok(world.formations.every(form=>form.lines.length===6),'Every Japan formation uses staggered depth');
assert.ok(world.formations.every(form=>form.lines.slice(0,-1).every(line=>line.length<=3)),'No outfield line is a flat four-to-six-player row');
assert.ok(world.formations.every(form=>form.slots?.length===11),'Every Japan formation has a free-position layout');
assert.ok(world.formations.every(form=>new Set(form.slots.slice(0,-1).map(slot=>slot[1])).size>=5),'Every formation keeps multiple front-to-back layers');
assert.ok(world.formations.every(form=>{
  let offset=0;
  return form.lines.every(line=>{
    const slots=form.slots.slice(offset,offset+line.length);offset+=line.length;
    if(slots.length===1)return slots[0][0]===50;
    if(slots.length===2)return slots[0][0]+slots[1][0]===100&&slots[0][1]===slots[1][1];
    return slots[0][0]+slots[2][0]===100&&slots[1][0]===50&&slots[0][1]===slots[2][1];
  });
}),'Each formation is centered and its paired positions align');
const compactCss=read('dist/assets/player-portraits.css');
assert.ok(compactCss.includes('.pitch .player{min-width:0;width:72px'));
assert.ok(compactCss.includes('.pitch .player{width:58px'));
const formationPreview=boot('index.html');
world.formations.forEach((form,index)=>{
  formationPreview.click('[data-formation]',{formation:String(index)});
  assert.equal(formationPreview.get('#pitchLines').classList.contains('custom-layout'),true,form.name);
});
const fiveWall=world.formations.find(f=>f.name==='五壁控制');
assert.equal(fiveWall.slots.length,11);
assert.deepEqual(plain(fiveWall.slots.slice(5,10).map(slot=>slot[1])),[59,59,68,75,68]);
assert.ok(fiveWall.note.includes('淺 V 形錯位'));
const fiveWallApp=boot('index.html');fiveWallApp.click('[data-formation]',{formation:String(world.formations.indexOf(fiveWall))});
assert.equal(fiveWallApp.get('#pitchLines').classList.contains('custom-layout'),true);
assert.ok(fiveWallApp.get('#pitchLines').innerHTML.includes('left:50%;top:75%'));
const fi=world.formations.findIndex(f=>f.name==='六層鐵域'),formation=world.formations[fi];
assert.equal(formation.shape,'6-2-2');
assert.deepEqual(plain(formation.lines.map(r=>r.length)),[2,2,2,2,2,1]);
assert.deepEqual(plain(formation.lines.slice(2,-1).flat()),['風丸','飛鷹','吹雪','黑瀨','水神矢','壁山']);
assert.deepEqual(plain(formation.lines.at(-1)),['圓堂']);
assert.ok(formation.note.includes('反擊'));
const worldApp=boot('index.html');worldApp.click('[data-formation]',{formation:String(fi)});
assert.deepEqual(names(worldApp,'#pitchLines'),plain(formation.lines.flat()));
assert.equal(worldApp.get('#formationNote').hidden,false);
assert.ok(worldApp.get('#formationNote').textContent.includes('黑瀨'));
assert.ok(!worldApp.get('#formationNote').textContent.includes('沙木沼'));
fixture.click('[data-a]',{a:String(fi)});
assert.deepEqual(names(fixture,'#aLines'),plain(formation.lines.flat()));
assert.equal(fixture.get('#aFormationNote').hidden,false);
assert.ok(!fixture.get('#aComboGuide').innerHTML.includes('阿修羅'));
for(const app of [worldApp,fixture]){
  const api=app.sandbox.CanonCombos;
  assert.ok(!api.all.some(c=>c.id==='triple-defense'));
  assert.ok(!api.worldPlayable(world.roster.map(r=>r[0])).some(c=>c.id==='asura'),'Missing original partner removes Asura from the world-team combination list');
}
for(const [file,guide,definition] of [['index.html','#canonGuide',world],['opponent.html','#canonGuide',rival],['match.html','#aCanonGuide',world],['match.html','#bCanonGuide',rival]]){
  const app=boot(file),html=app.get(guide).innerHTML;
  assert.ok(!/原作搭檔：|原作說明：|simulation-note|original-cast|三重防守/.test(html));
  for(const c of app.sandbox.CanonCombos.playable(definition.roster.map(r=>r[0]))){
    const article=html.split('</article>').find(x=>x.includes('data-canon-id="'+c.id+'"'));
    assert.ok(article,c.id);assert.ok(article.includes(c.members.join('＋')));
    let castText=article;
    for(const name of [...c.members,...app.sandbox.CanonCombos.all.map(c=>c.name)].sort((a,b)=>b.length-a.length))castText=castText.replaceAll(name,'');
    for(const change of c.replacements||[])assert.ok(!castText.includes(change.from),c.id+': old cast leaked: '+change.from);
  }
}
// Legacy rival lineups regain Saginuma without changing the saved positions.
const old=copy(rival.formations[3].lines);old[2][0]='沙木沼';
const previous={fi:3,lines:old,selected:'沙木沼',highlight:['沙木沼','不動'],chosen:'鑽岳天壁'};
const migrated=boot('opponent.html',{'inazuma-rivals-v1':JSON.stringify(previous),'inazuma-tactics-v1':'preserve-world-state'});
const after=JSON.parse(migrated.storage.get('inazuma-rivals-v1'));
assert.equal(after.fi,3);assert.equal(after.lines[2][0],'沙木沼治');assert.equal(after.selected,'沙木沼治');
old.forEach((row,r)=>row.forEach((n,c)=>{if(n!=='沙木沼')assert.equal(after.lines[r][c],n)}));
assert.equal(new Set(after.lines.flat()).size,11);assert.ok(after.highlight.includes('沙木沼治'));
assert.equal(migrated.storage.get('inazuma-tactics-v1'),'preserve-world-state');
// Saginuma can keep a previously saved goalkeeper position on his original team.
const keeperLines=copy(rival.formations[0].lines);keeperLines[1][0]='洛可可';keeperLines.at(-1)[0]='沙木沼';
const keeper=boot('opponent.html',{'inazuma-rivals-v1':JSON.stringify({...previous,fi:0,lines:keeperLines})});
const keeperState=JSON.parse(keeper.storage.get('inazuma-rivals-v1'));
assert.equal(keeperState.lines.at(-1)[0],'沙木沼治');assert.equal(keeperState.lines[1][0],'洛可可');
assert.equal(new Set(keeperState.lines.flat()).size,11);
assert.equal(fixture.sandbox.LineupTools.reconcile([['unknown']],world.roster),null);
console.log(JSON.stringify({uniqueRoster:43,world:22,rival:21,rivalReplacement:'壁山 → 天城',addedWorldMembers:['敦也','壁山','黑瀨'],addedRivalMembers:['阿爾法','貝塔','伽馬'],sixLayerDefense622:'passed',missingPartnerMoveRemoved:'passed',assignedCastOnly:'passed',returningPlayerMigration:'passed',browserVisualQA:'unavailable in this environment'},null,2));
