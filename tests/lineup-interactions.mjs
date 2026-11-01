import assert from 'node:assert/strict';
import vm from 'node:vm';
import {boot,read} from './dom-harness.mjs';
const list=(app,id)=>[...app.get(id).innerHTML.matchAll(/data-portrait-name="([^"]+)"/g)].map(x=>x[1]);
const toJSON=x=>JSON.parse(JSON.stringify(x));
const setup=[
 ['index.html','world','#pitchLines','#bench','#swapBtn','#undoBtn'],
 ['opponent.html','rival','#lines','#bench','#swap','#undo'],
 ['match.html','match-a','#aLines','#aBench','#aSwap','#matchUndo'],
 ['match.html','match-b','#bLines','#bBench','#bSwap','#matchUndo']
];
let checks=0;
for(const [file,team,field,bench,swap,undo] of setup){
  const app=boot(file),original=list(app,field),reserves=list(app,bench);
  // Open the actual batch UI; choose two outgoing and two incoming players.
  app.button(swap);assert.equal(app.dialog().open,true);
  // Singles preselect one player, match starts with no selection.
  app.dialogClick('[data-exchange-clear]');
  for(const n of original.slice(0,2))app.dialogChange(n,'from');
  app.dialogChange(reserves[0],'to');
  assert.equal(app.dialog().querySelector('[data-exchange-apply]').disabled,true);
  assert.deepEqual(list(app,field),original,'Partial selection must not mutate the pitch');
  app.dialogChange(reserves[1],'to');
  assert.equal(app.dialog().querySelector('[data-exchange-apply]').disabled,false);
  assert.ok(app.dialog().querySelector('#exchangePairs').innerHTML.includes(original[1]));
  app.dialogClick('[data-exchange-apply]');assert.equal(app.dialog().open,false);
  assert.deepEqual(list(app,field).slice(0,2),reserves.slice(0,2));
  assert.equal(new Set([...list(app,field),...list(app,bench)]).size,original.length+reserves.length);
  app.button(undo);assert.deepEqual(list(app,field),original);
  // Native mouse drag, bench to field.
  const source=app.handle(team,reserves[0]),target=app.node(team,original[0]);
  const transfer={setData(){}};
  app.dispatch('dragstart',source,{dataTransfer:transfer});
  const over=app.dispatch('dragover',target,{dataTransfer:transfer});assert.equal(over.prevented,true);
  app.dispatch('drop',target,{dataTransfer:transfer});
  assert.equal(list(app,field)[0],reserves[0]);app.button(undo);assert.deepEqual(list(app,field),original);
  app.advance();
  // Touch uses the same exchange path, and a drag does not become a selection click.
  const touchSource=app.handle(team,original[0]),touchTarget=app.node(team,original[1]);
  app.dispatch('pointerdown',touchSource,{pointerId:7,pointerType:'touch',clientX:10,clientY:10});
  app.setPoint(touchTarget);
  app.dispatch('pointermove',touchSource,{pointerId:7,pointerType:'touch',clientX:40,clientY:50});
  app.dispatch('pointerup',touchSource,{pointerId:7,pointerType:'touch',clientX:40,clientY:50});
  assert.equal(list(app,field)[0],original[1]);assert.equal(list(app,field)[1],original[0]);
  const post=app.dispatch('click',touchTarget);assert.equal(post.prevented,true);
  app.button(undo);assert.deepEqual(list(app,field),original);app.advance();
  // Cross-team and duplicate batch participants are rejected atomically.
  const foreign=file==='match.html'?list(app,team==='match-a'?'#bLines':'#aLines')[0]:'圓堂晴';
  if(![...original,...reserves].includes(foreign)){
    assert.equal(app.sandbox.LineupTools.exchange(team,[[original[0],foreign]]),false);assert.deepEqual(list(app,field),original);
  }
  assert.equal(app.sandbox.LineupTools.exchange(team,[[original[0],reserves[0]],[original[1],reserves[0]]]),false);assert.deepEqual(list(app,field),original);
  // Cancelled touch drag and dismissed dialog do not change the team.
  app.dispatch('pointerdown',source,{pointerId:8,pointerType:'touch',clientX:10,clientY:10});
  app.dispatch('pointermove',source,{pointerId:8,pointerType:'touch',clientX:40,clientY:50});
  app.dispatch('pointercancel',source);assert.deepEqual(list(app,field),original);
  app.button(swap);app.dialogChange(original[1],'from');app.dialogClick('[data-exchange-close]');assert.deepEqual(list(app,field),original);
  checks++;
}
const match=boot('match.html');
function points(id){return [...match.get(id).innerHTML.matchAll(/data-player="([^"]+)"[^>]*data-x="([^"]+)" data-y="([^"]+)" data-row="([^"]+)"/g)].map(([,name,x,y,row])=>({name,x:+x,y:+y,row:+row}))}
for(let a=0;a<match.sandbox.TEAM_DATA.world.formations.length;a++)for(let b=0;b<match.sandbox.TEAM_DATA.rival.formations.length;b++){
  match.click('[data-a]',{a:String(a)});match.click('[data-b]',{b:String(b)});
  const A=points('#aLines'),B=points('#bLines');assert.equal(A.length,11);assert.equal(B.length,11);
  assert.ok(A.every(p=>p.y>50));assert.ok(B.every(p=>p.y<50));
  assert.equal(A.at(-1).y,93);assert.equal(B.at(-1).y,7);
  const firstB=B.filter(p=>p.row===0);if(firstB.length>1)assert.ok(firstB[0].x>firstB.at(-1).x,'Opponent left/right must be mirrored');
  match.button('#flipEnds');
  const flippedA=points('#aLines'),flippedB=points('#bLines');
  A.forEach((p,i)=>{assert.ok(Math.abs(flippedA[i].x-(100-p.x))<1e-9);assert.ok(Math.abs(flippedA[i].y-(100-p.y))<1e-9)});
  B.forEach((p,i)=>{assert.ok(Math.abs(flippedB[i].x-(100-p.x))<1e-9);assert.ok(Math.abs(flippedB[i].y-(100-p.y))<1e-9)});
  match.button('#matchUndo');assert.deepEqual(points('#aLines'),A);assert.deepEqual(points('#bLines'),B);
}
// New match state survives reload; independent team pages keep their own state.
const aBefore=list(match,'#aLines'),bBefore=list(match,'#bLines');
match.sandbox.LineupTools.exchange('match-a',[[aBefore[0],list(match,'#aBench')[0]]]);
const restored=boot('match.html',Object.fromEntries(match.storage));
assert.deepEqual(list(restored,'#aLines'),list(match,'#aLines'));assert.deepEqual(list(restored,'#bLines'),bBefore);
assert.equal(match.storage.has('inazuma-tactics-v1'),false);assert.equal(match.storage.has('inazuma-rivals-v1'),false);
// Shared match definitions match the independent pages exactly.
for(const [file,key] of [['index.html','world'],['opponent.html','rival']]){
  const s=[...read('dist/'+file).matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],prefix=s.slice(0,s.indexOf('const $=')),context={CanonCombos:match.sandbox.CanonCombos,TEAM_DATA:match.sandbox.TEAM_DATA};vm.createContext(context);
  vm.runInContext(prefix+'globalThis.out={roster,formations:'+(key==='world'?'formations':'forms')+',combos,tactics};})();',context);
  const expected=match.sandbox.TEAM_DATA[key];
  if(key==='world')assert.deepEqual(toJSON(context.out),toJSON(expected));
  else{
    assert.deepEqual(toJSON(context.out.roster),toJSON(expected.roster));
    assert.deepEqual(toJSON(context.out.formations),toJSON(expected.formations));
    const identity=items=>items.map(({name,type,members})=>({name,type,members}));
    assert.deepEqual(toJSON(identity(context.out.combos)),toJSON(identity(expected.combos)));
    assert.deepEqual(toJSON(identity(context.out.tactics)),toJSON(identity(expected.tactics)));
    const page=boot(file);
    assert.ok(page.get('#combos').innerHTML.includes(expected.combos[0].desc),'Independent page displays the shared expanded description');
  }
}
console.log(JSON.stringify({batchDialogs:checks,mouseDrag:'passed',touchDrag:'passed',cancelAndUndo:'passed',crossTeamProtection:'passed',opposingDirections:72,fieldFlipRotatesBothAxes:true,persistenceAndTeamIsolation:'passed'},null,2));
