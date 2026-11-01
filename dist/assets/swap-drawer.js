/* Single-player exchange with a read-only impact preview. */
(() => {
  'use strict';
  const teams=new Map(),esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  let drawer=null,editing=null,source=null,target=null,filter='all',query='',basis='',undoTicket=null,notice=null;
  const currentPlayers=()=>Array.from(document.querySelectorAll('[data-lineup-team][data-player]'));
  function impact(definition,before,after){
    const ready=(items,lines)=>{const field=new Set(lines.flat());return (items||[]).filter(item=>item.members.every(n=>field.has(n)))};
    const id=item=>item.id||item.name;
    const changes=items=>{const a=ready(items,before),b=ready(items,after),A=new Set(a.map(id)),B=new Set(b.map(id));return {before:a.length,after:b.length,gained:b.filter(x=>!A.has(id(x))),lost:a.filter(x=>!B.has(id(x)))}};
    return {combos:changes(definition.combos),tactics:changes(definition.tactics)};
  }
  function ensure(){
    if(drawer)return;
    drawer=document.createElement('dialog');drawer.className='swap-drawer';drawer.setAttribute('aria-labelledby','swapDrawerTitle');
    drawer.innerHTML='<header class="swap-heading"><div><p id="swapDrawerTeam"></p><h2 id="swapDrawerTitle">交換球員</h2></div><button type="button" data-swap-close aria-label="關閉換人抽屜">✕</button></header><div class="swap-body"><div id="swapSource" class="swap-source"></div><p class="swap-instruction">選擇交換對象，可自由跨位置調整。</p><label class="swap-search"><span>搜尋球員</span><input id="swapSearch" type="search" placeholder="輸入球員姓名" autocomplete="off"></label><div class="swap-filters" aria-label="候選球員篩選"><button type="button" data-swap-filter="all">全部</button><button type="button" data-swap-filter="bench">替補</button><button type="button" data-swap-filter="field">場上</button></div><p id="swapCandidateCount" class="swap-muted"></p><section id="swapPreview" class="swap-preview" aria-live="polite"></section><div id="swapCandidates" class="swap-candidates"></div></div><footer class="swap-footer"><p id="swapHelp" role="status">選定候選人後可預覽交換影響。</p><div><button type="button" data-swap-close>取消</button><button type="button" class="swap-apply" data-swap-apply disabled>套用交換</button></div></footer>';
    document.body.append(drawer);
    drawer.addEventListener('input',event=>{if(event.target.id==='swapSearch'){query=event.target.value;renderCandidates()}});
    drawer.addEventListener('click',event=>{
      if(event.target.closest('[data-swap-close]')){drawer.close();return}
      const f=event.target.closest('[data-swap-filter]');if(f){filter=f.dataset.swapFilter;renderCandidates();return}
      const option=event.target.closest('[data-swap-candidate]');if(option&&!option.disabled){target=option.dataset.swapCandidate;renderCandidates();renderPreview();drawer.querySelector('#swapPreview').scrollIntoView?.({block:'nearest',behavior:'smooth'});return}
      if(event.target.closest('[data-swap-apply]')){apply();return}
      if(event.target===drawer){const r=drawer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)drawer.close()}
    });
    drawer.addEventListener('close',()=>{const id=editing,name=source;editing=null;source=null;target=null;currentPlayers().find(n=>n.dataset.lineupTeam===id&&n.dataset.player===name)?.focus()});
  }
  function renderCandidates(){
    const team=teams.get(editing);if(!team)return;
    const field=new Set(team.getLines().flat()),sourceOnField=field.has(source);
    // Preserve roster order. No position filtering or position-based ranking.
    const candidates=team.roster.filter(n=>n!==source&&(!query||n.includes(query.trim()))&&(filter==='all'||(filter==='field')===field.has(n)));
    drawer.querySelector('#swapCandidateCount').textContent='候選球員 '+candidates.length+' 人';
    drawer.querySelector('#swapCandidates').innerHTML=candidates.length?candidates.map(name=>{
      const disabled=!sourceOnField&&!field.has(name),selected=target===name;
      return '<button type="button" class="swap-candidate '+(selected?'selected':'')+'" data-swap-candidate="'+esc(name)+'" aria-pressed="'+selected+'" '+(disabled?'disabled':'')+'>'+PlayerPortraits.html(name)+'<span><strong>'+esc(name)+'</strong><small>'+esc(team.players[name].pos)+' · '+(field.has(name)?'場上':'替補')+'</small></span><span class="swap-candidate-action">'+(disabled?'替補間無須交換':selected?'已選取':field.has(name)?'交換站位':'換上場')+'</span></button>';
    }).join(''):'<p class="swap-empty">沒有符合條件的球員。</p>';
    drawer.querySelectorAll('[data-swap-filter]').forEach(b=>{const selected=b.dataset.swapFilter===filter;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});
  }
  function renderPreview(){
    const team=teams.get(editing);if(!team)return;
    const preview=drawer.querySelector('#swapPreview'),apply=drawer.querySelector('[data-swap-apply]');
    if(!target){preview.innerHTML='';preview.hidden=true;apply.disabled=true;drawer.querySelector('#swapHelp').textContent='選定候選人後可預覽交換影響。';return}
    try{
      const before=team.getLines(),next=LineupTools.swapLines(before,[[source,target]],team.roster),change=impact(team,before,next);
      const list=(title,items,kind)=>'<div class="swap-impact '+kind+'"><h4>'+title+' <span>'+items.length+'</span></h4>'+(items.length?'<ul>'+items.map(item=>'<li>'+esc(item.name)+'</li>').join('')+'</ul>':'<p>無變化</p>')+'</div>';
      preview.hidden=false;
      preview.innerHTML='<h3>交換預覽</h3><div class="swap-pair"><span>'+PlayerPortraits.html(source)+esc(source)+'</span><b>↔</b><span>'+PlayerPortraits.html(target)+esc(target)+'</span></div><p class="swap-counts">可用合體技 '+change.combos.before+' → '+change.combos.after+' · 必殺戰術 '+change.tactics.before+' → '+change.tactics.after+'</p>'+list('新增合體技',change.combos.gained,'gain')+list('失效合體技',change.combos.lost,'loss')+list('新增必殺戰術',change.tactics.gained,'gain')+list('失效必殺戰術',change.tactics.lost,'loss')+(team.players[next.at(-1)[0]].pos!=='GK'?'<p class="swap-muted">交換後門將位置由 '+esc(next.at(-1)[0])+' 擔任。</p>':'');
      const both=before.flat().includes(source)&&before.flat().includes(target);apply.textContent=both?'套用站位交換':'套用換人';apply.disabled=false;
      drawer.querySelector('#swapHelp').textContent='已選 '+source+' ↔ '+target+'，套用後可復原。';
    }catch(error){target=null;preview.hidden=false;preview.innerHTML='<p>'+esc(error.message)+'</p>';apply.disabled=true}
  }
  function clearNotice(){undoTicket=null;if(notice)notice.hidden=true}
  function showNotice(id,pair){
    const team=teams.get(id);
    if(!notice){notice=document.createElement('div');notice.className='swap-notice';notice.setAttribute('role','status');document.body.append(notice)}
    undoTicket={id,signature:JSON.stringify(team.getLines())};notice.hidden=false;
    notice.innerHTML='<span>'+esc(pair[0])+' ↔ '+esc(pair[1])+' 已交換</span><button type="button" data-swap-undo>復原</button>';
    currentPlayers().filter(n=>n.dataset.lineupTeam===id&&pair.includes(n.dataset.player)).forEach(n=>{n.classList.add('swap-changed');setTimeout(()=>n.classList.remove('swap-changed'),1600)});
  }
  function apply(){
    const team=teams.get(editing);if(!team||!target)return;
    if(JSON.stringify(team.getLines())!==basis){basis=JSON.stringify(team.getLines());target=null;renderCandidates();renderPreview();drawer.querySelector('#swapHelp').textContent='陣容已更新，請重新選擇交換對象。';return}
    const id=editing,pair=[source,target];
    if(LineupTools.exchange(id,[pair])){drawer.close();showNotice(id,pair)}
  }
  function open(id,name){
    const team=teams.get(id);if(!team||!team.roster.includes(name))return false;
    ensure();clearNotice();window.PlayerSkills?.close();editing=id;source=name;target=null;filter='all';query='';basis=JSON.stringify(team.getLines());
    drawer.dataset.team=id;drawer.querySelector('#swapDrawerTeam').textContent=team.title;
    drawer.querySelector('#swapSource').innerHTML=PlayerPortraits.html(name)+'<div><small>目前選取</small><strong>'+esc(name)+'</strong><span>'+esc(team.players[name].pos)+' · '+(team.getLines().flat().includes(name)?'場上':'替補')+'</span></div>';
    drawer.querySelector('#swapSearch').value='';renderCandidates();renderPreview();drawer.showModal();return true;
  }
  document.addEventListener('click',event=>{
    const undo=event.target.closest('[data-swap-undo]');
    if(undo&&undoTicket){const ticket=undoTicket,team=teams.get(ticket.id);clearNotice();if(team&&JSON.stringify(team.getLines())===ticket.signature)team.undo?.();return}
    const trigger=event.target.closest('[data-player-exchange]');if(trigger){open(trigger.dataset.lineupTeam,trigger.dataset.playerExchange);return}
    if(event.target.closest('[data-swap-apply]')||event.target.closest('.swap-drawer'))return;
    if(undoTicket)clearNotice();
  });
  document.addEventListener('dragstart',clearNotice);
  window.SwapDrawer=Object.freeze({register:(id,adapter)=>teams.set(id,adapter),open,impact});
})();
