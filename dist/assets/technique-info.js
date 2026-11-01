/* Explanations shared by team lists and the match reference panels. */
(() => {
  const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const explanation=(item,style)=>(item.effect?'<p class="'+style+' tactic-core"><strong>發動核心：</strong>'+esc(item.members.join('＋'))+'</p>':'')+'<p class="'+style+'">'+(item.effect?'<strong>發動與演出：</strong>':'')+esc(item.desc)+'</p>'+(item.effect?'<p class="'+style+' tactic-effect"><strong>戰術效果：</strong>'+esc(item.effect)+'</p>':'')+(item.weakness?'<p class="'+style+' tactic-weakness"><strong>弱點與破解：</strong>'+esc(item.weakness)+'</p>':'');
  function render(items,lines,kind){
    const field=new Set(lines.flat());
    const article=item=>{
      const missing=item.members.filter(n=>!field.has(n)),original=item.origin==='原作';
      return '<article class="technique-item"><div class="technique-head"><strong>'+esc(item.name)+'</strong><span class="technique-kind '+esc(item.type)+'">'+esc(item.type)+'</span></div><p class="technique-meta">'+(item.themeElement?'原創・'+item.themeElement+'系':item.simulation?'原作改編':original?'原作':'原創')+(kind==='tactic'?'戰術':'合體技')+' · '+(item.leader?'指揮：'+esc(item.leader)+' · 全隊配合':esc(item.members.join('＋')))+'</p>'+(window.CanonCombos?.note(item)||'')+(item.jp?'<p class="technique-meta" lang="ja">'+esc(item.jp)+' · '+esc(item.work||'')+'</p>':'')+explanation(item,'technique-desc')+'<p class="technique-status '+(missing.length?'unavailable':'available')+'">'+(missing.length?'缺少：'+esc(missing.join('、')):item.leader?'指揮者在場，可組織發動':'成員齊備，可使用')+'</p>'+(item.source?'<a class="technique-source" href="'+esc(item.source)+'" target="_blank" rel="noopener noreferrer">原作資料 ↗</a>':'')+'</article>';
    };
    if(kind==='tactic'&&items.some(item=>item.origin==='原作')&&items.some(item=>item.origin!=='原作')){
      const original=items.filter(item=>item.origin==='原作'),custom=items.filter(item=>item.origin!=='原作');
      return '<section class="technique-group"><h3>動畫原作必殺戰術 <span>'+original.length+'</span></h3>'+original.map(article).join('')+'</section><section class="technique-group technique-group-custom"><h3>角色設定原創戰術 <span>'+custom.length+'</span></h3>'+custom.map(article).join('')+'</section>';
    }
    return items.map(article).join('');
  }
  const readyPanels=new Map();
  function readyDescription(panel){
    const item=panel.items.find(t=>t.name===panel.selected);
    panel.description.innerHTML=item
      ? '<p class="ready-tactic-meta"><span class="technique-kind '+esc(item.type)+'">'+esc(item.type)+'</span><span>'+(item.leader?'指揮：'+esc(item.leader)+' · 全隊配合':'參與：'+esc(item.members.join('＋')))+'</span></p>'+explanation(item,'ready-tactic-desc')
      : '<p class="ready-tactic-hint">所有戰術皆可選取；缺少必要成員時，系統會優先以相同位置球員自動替換。</p>';
  }
  function scrollToFormation(id){
    const anchor=id==='aReadyTactics'||id==='bReadyTactics'
      ? document.querySelector('#matchPitch')
      : document.querySelector(id==='worldReadyTactics'?'.pitch':'#lines');
    const target=id==='rivalReadyTactics'?anchor?.closest?.('.pitch')||anchor:anchor;
    if(!target?.scrollIntoView)return;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  }
  function readyTactics(id,items,lines,context){
    const host=document.querySelector('#'+id);if(!host)return;
    let panel=readyPanels.get(id);
    if(!panel){
      host.innerHTML='<div class="ready-tactics-heading"><label for="'+id+'Select">所有必殺戰術</label><span data-ready-count></span></div><select id="'+id+'Select" aria-describedby="'+id+'Description"></select><div id="'+id+'Description" class="ready-tactic-description" aria-live="polite" aria-atomic="true"></div>';
      panel={id,select:host.querySelector('select'),count:host.querySelector('[data-ready-count]'),description:host.querySelector('.ready-tactic-description'),items:[],lines:[],context:null,missing:new Map(),selected:''};
      panel.select.addEventListener('change',()=>{
        const value=panel.select.value,item=panel.items.find(t=>t.name===value);panel.selected=item?value:'';
        const missing=item?panel.missing.get(item.name)||[]:[];
        const teamId=panel.context?.teamId||({worldReadyTactics:'world',rivalReadyTactics:'rival',aReadyTactics:'match-a',bReadyTactics:'match-b'})[panel.id];
        if(item&&missing.length&&(!teamId||!window.LineupTools?.autoExchange(teamId,item.members))){
          panel.selected='';
        }
        panel.select.value=panel.selected;readyDescription(panel);
        if(panel.selected)scrollToFormation(panel.id);
      });
      readyPanels.set(id,panel);
    }
    const field=new Set(lines.flat());panel.items=items;panel.lines=lines;panel.context=context||null;panel.missing=new Map(items.map(t=>[t.name,t.members.filter(n=>!field.has(n))]));
    if(!panel.missing.has(panel.selected)||panel.missing.get(panel.selected).length)panel.selected='';
    panel.select.innerHTML='<option value="">請選擇必殺戰術</option>'+panel.items.map(t=>{
      const missing=panel.missing.get(t.name);
      return '<option value="'+esc(t.name)+'">'+esc(t.name)+' · '+esc(t.type)+(missing.length?'（自動換上：'+esc(missing.join('、'))+'）':'（可直接施展）')+'</option>';
    }).join('');
    panel.select.value=panel.selected;panel.select.disabled=!panel.items.length;panel.count.textContent='可選 '+panel.items.length+' / '+panel.items.length;
    const ratio=panel.items.length+' / '+panel.items.length;
    if(id==='worldReadyTactics')for(const target of ['metricTactics','tacticsCount']){const node=document.querySelector('#'+target);if(node)node.textContent=ratio}
    if(id==='rivalReadyTactics')for(const target of ['mTactic','tacticCount']){const node=document.querySelector('#'+target);if(node)node.textContent=ratio}
    if(id==='aReadyTactics'||id==='bReadyTactics'){
      const node=document.querySelector('#'+id[0]+'Ready');if(node)node.textContent=node.textContent.replace(/必殺戰術\s+\d+\s*\/\s*\d+/,'必殺戰術 '+ratio);
    }
    readyDescription(panel);
  }
  window.TechniqueInfo=Object.freeze({tactics:(items,lines)=>render(items,lines,'tactic'),combos:(items,lines)=>render(items,lines,'combo'),readyTactics});
})();
