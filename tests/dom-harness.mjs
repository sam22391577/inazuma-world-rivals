import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
export const read=path=>fs.readFileSync(new URL(path,root),'utf8');

// Event/data unit harness only. No browser rendering is emulated.
export function boot(file,initialStorage={}){
  const page=read('dist/'+file),ids=[...page.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs: '+file);
  // A shared persisted seed makes page fixtures comparable; null exercises first-use randomness.
  const elements=new Map(),events=new Map(),storage=new Map([['inazuma-canon-partner-seed-v1','fixture-seed'],...Object.entries(initialStorage)]);
  const created=[];let clock=10000,point=null,document;
  function make(){
    const children=new Map(),classes=new Set(),listeners=new Map();
    const el={innerHTML:'',textContent:'',disabled:false,style:{},dataset:{},listeners,open:false,hidden:false,closest:()=>null,
      getBoundingClientRect:()=>({left:120,right:200,top:180,bottom:260}),
      classList:{toggle(c,force){const value=force??!classes.has(c);value?classes.add(c):classes.delete(c);return value},add(...cs){cs.forEach(c=>classes.add(c))},remove(...cs){cs.forEach(c=>classes.delete(c))},contains:c=>classes.has(c)},
      addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn)},
      setAttribute(k,v){el[k]=v},removeAttribute(k){delete el[k]},
      insertAdjacentHTML(_w,value){el.innerHTML+=value},
      querySelector(s){if(!children.has(s))children.set(s,make());return children.get(s)},
      querySelectorAll(){return []},append(child){created.push(child)},remove(){el.removed=true},
      scrollIntoView(options){el.scrolledWith=options},
      cloneNode(){const copy=make();copy.innerHTML=el.innerHTML;copy.dataset={...el.dataset};return copy},
      setPointerCapture(){},focus(){document.activeElement=el},
      showModal(){el.open=true},close(){el.open=false;for(const fn of listeners.get('close')??[])fn({})}
    };return el;
  }
  const get=s=>{if(!elements.has(s))elements.set(s,make());return elements.get(s)};
  document={readyState:'complete',activeElement:null,querySelector:get,querySelectorAll:()=>[],
    createElement:()=>make(),body:make(),elementFromPoint:()=>point,
    addEventListener(type,fn,options){if(!events.has(type))events.set(type,[]);events.get(type).push({fn,capture:options===true||options?.capture})}};
  const sandbox={document,location:{pathname:'/'+file},Date:{now:()=>clock},innerHeight:800,innerWidth:1024,scrollBy(){},addEventListener(){},
    localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},
    setTimeout:()=>1,clearTimeout(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){}};
  sandbox.window=sandbox;vm.createContext(sandbox);
  for(const [,attrs,inline] of page.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
    const src=attrs.match(/src="\.\/([^"?]+)/)?.[1];vm.runInContext(src?read('dist/'+src):inline,sandbox);
  }
  function target(selectors,dataset={}){const el=make();el.dataset=dataset;el.closest=query=>selectors.includes(query)?el:null;return el}
  function dispatch(type,node,extra={},owner){
    let stopped=false;const e={target:node,preventDefault(){e.prevented=true},stopImmediatePropagation(){stopped=true},...extra};
    if(owner){for(const fn of owner.listeners.get(type)??[]){fn(e);if(stopped)break}}
    else for(const {fn} of [...(events.get(type)??[])].sort((a,b)=>Number(!!b.capture)-Number(!!a.capture))){fn(e);if(stopped)break}
    return e;
  }
  const click=(selector,dataset={})=>dispatch('click',target([selector],dataset));
  const button=selector=>{const el=get(selector),fns=el.onclick?[el.onclick]:el.listeners.get('click');assert.ok(fns?.length);for(const fn of fns)fn({target:el})};
  const dialog=()=>created.find(el=>el.className==='exchange-dialog');
  const dialogChange=(name,group,checked=true)=>dispatch('change',Object.assign(target(['[data-exchange-name]'],{exchangeName:name,exchangeGroup:group}),{checked}),{},dialog());
  const dialogClick=selector=>dispatch('click',target([selector]),{},dialog());
  const node=(team,name)=>target(['[data-lineup-team][data-player]','[data-player]'],{lineupTeam:team,player:name});
  const handle=(team,name)=>{const parent=node(team,name),el=make();el.closest=s=>s==='[data-lineup-handle]'?el:parent.closest(s);return el};
  const drawer=()=>created.find(el=>el.className==='swap-drawer');
  const drawerClick=(selector,dataset={},disabled=false)=>{const el=target([selector,'.swap-drawer'],dataset);el.disabled=disabled;dispatch('click',el,{},drawer());return dispatch('click',el)};
  const drawerSearch=value=>dispatch('input',Object.assign(target([]),{id:'swapSearch',value}),{},drawer());
  return {get,click,button,sandbox,storage,dialog,dialogChange,dialogClick,node,handle,dispatch,drawer,drawerClick,drawerSearch,notice:()=>created.find(el=>el.className==='swap-notice'),skillCard:()=>created.find(el=>el.className==='player-skill-card'),setPoint:n=>{point=n},advance:()=>{clock+=500}};
}
