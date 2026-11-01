/* Shared batch exchange, mouse dragging and touch dragging. */
(() => {
  'use strict';
  const teams = new Map(),dragModes=new Set();
  const esc = s => String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function validLines(lines, roster) {
    return Array.isArray(lines) && lines.length >= 2 && lines.every(r => Array.isArray(r) && r.length > 0)
      && lines.at(-1).length === 1 && lines.flat().length === 11
      && new Set(lines.flat()).size === 11 && lines.flat().every(n => roster.includes(n));
  }
  function currentName(name,roster){
    const names=roster.map(r=>Array.isArray(r)?r[0]:r);
    const canonical=name==='沙木沼'?'沙木沼治':name==='壁山'&&!names.includes('壁山')&&names.includes('天城')?'天城':name;
    return canonical==='沙木沼治'&&!names.includes(canonical)&&names.includes('立向居')?'立向居':canonical;
  }
  // Keep saved positions when a roster changes; only fill departing players' slots.
  function reconcile(lines, roster, formation) {
    // Upgrade an untouched retired preset while retaining manually adjusted lineups.
    if(formation?.previousLines&&JSON.stringify(lines)===JSON.stringify(formation.previousLines))lines=formation.lines;
    if (!Array.isArray(lines) || lines.length < 2 || !lines.every(r=>Array.isArray(r)&&r.length)
      || lines.at(-1).length!==1 || lines.flat().length!==11) return null;
    const roles=Object.fromEntries(roster.map(r=>[r[0],r[1]])),names=roster.map(r=>r[0]);
    const alias=n=>currentName(n,roster),used=new Set();
    const next=lines.map(row=>row.map(old=>{const n=alias(old);if(!roles[n]||used.has(n))return null;used.add(n);return n}));
    const last=next.length-1;
    // A departing goalkeeper must leave the goal to the remaining goalkeeper.
    if(!next[last][0]&&alias(lines[last][0])==='沙木沼治'){
      const keeper=names.find(n=>roles[n]==='GK');
      if(keeper){for(const row of next)for(let i=0;i<row.length;i++)if(row[i]===keeper)row[i]=null;next[last][0]=keeper;used.add(keeper)}
    }
    for(let r=0;r<next.length;r++)for(let c=0;c<next[r].length;c++)if(!next[r][c]){
      const old=alias(lines[r][c]),preferred=roles[old]||(old==='沙木沼治'?'GK':null);
      const rowRole=r===last?'GK':r===0?'FW':r>=last-1?'DF':'MF';
      const free=names.filter(n=>!used.has(n));
      const incoming=free.find(n=>roles[n]===preferred)||free.find(n=>roles[n]===rowRole)||free[0];
      if(!incoming)return null;next[r][c]=incoming;used.add(incoming);
    }
    return validLines(next,names)?next:null;
  }
  function swapLines(lines, pairs, roster) {
    if (!validLines(lines, roster)) throw Error('目前陣容資料有誤');
    if (!Array.isArray(pairs) || !pairs.length) throw Error('請選擇至少一組交換');
    const field = new Set(lines.flat()), seen = new Set(), mapping = new Map();
    for (const pair of pairs) {
      if (!Array.isArray(pair) || pair.length !== 2) throw Error('交換配對不完整');
      const [a,b] = pair;
      if (a === b || !roster.includes(a) || !roster.includes(b)) throw Error('請選擇同隊不同的選手');
      if (seen.has(a) || seen.has(b)) throw Error('同一名選手不能同時加入兩組交換');
      if (!field.has(a) && !field.has(b)) throw Error('每組交換至少需要一名場上選手');
      seen.add(a); seen.add(b); mapping.set(a,b); mapping.set(b,a);
    }
    const next = lines.map(row => row.map(n => mapping.get(n) || n));
    if (!validLines(next, roster)) throw Error('交換後陣容無法成立');
    return next;
  }
  // Each side is rotated 180 degrees, including its own left/right positions.
  function positions(lines, side, slots) {
    let slotIndex=0;
    return lines.flatMap((row,ri) => row.map((name,ci) => {
      const slot=Array.isArray(slots?.[slotIndex])?slots[slotIndex]:null;slotIndex++;
      const x = slot?Number(slot[0]):100 * (ci + 1) / (row.length + 1);
      const ownY = ri===lines.length-1?100:slot?Number(slot[1]):100 * ri / (lines.length - 1);
      const y = 55 + ownY * .38;
      return {name, row:ri, column:ci, x:side==='a'?x:100-x, y:side==='a'?y:100-y};
    }));
  }
  function attrs(team,name) {
    return 'data-lineup-team="'+esc(team)+'" data-lineup-drag-mode="'+dragModes.has(team)+'" draggable="true" title="點選查看球員資料；滑鼠可直接拖拉 '+esc(name)+'，手機可開啟拖拉模式"';
  }
  const handle=()=>'<span class="lineup-drag-handle" data-lineup-handle draggable="true" aria-hidden="true" title="拖拉交換">⠿</span>';
  function register(id, adapter) {
    if (!Array.isArray(adapter.roster) || !validLines(adapter.getLines(),adapter.roster)) throw Error('Invalid lineup adapter');
    teams.set(id,adapter);
  }
  function exchange(id,pairs) {
    const team=teams.get(id);
    if (!team) return false;
    try {
      const next=swapLines(team.getLines(),pairs,team.roster);
      team.commit(next,pairs);
      return true;
    } catch(error) { team.notify?.(error.message); return false; }
  }
  function autoExchange(id,members) {
    const team=teams.get(id);
    if(!team||!Array.isArray(members))return false;
    const lines=team.getLines(),field=new Set(lines.flat()),missing=members.filter(name=>!field.has(name));
    if(!missing.length)return true;
    const rosterData=Object.values(window.TEAM_DATA||{}).find(data=>{
      const names=data?.roster?.map(row=>row[0]);
      return names?.length===team.roster.length&&team.roster.every(name=>names.includes(name));
    })?.roster||[];
    const roles=Object.fromEntries(rosterData.map(([name,role])=>[name,role]));
    const protectedNames=new Set(members),used=new Set(),pairs=[];
    for(const incoming of missing){
      const candidates=[];
      for(let ri=0;ri<lines.length;ri++)for(let ci=0;ci<lines[ri].length;ci++){
        const outgoing=lines[ri][ci],key=ri+'-'+ci;
        if(protectedNames.has(outgoing)||used.has(key))continue;
        const keeperLine=ri===lines.length-1,ratio=lines.length>1?ri/(lines.length-1):0;
        let score=roles[outgoing]===roles[incoming]?200:0;
        if(roles[incoming]==='GK')score+=keeperLine?500:-500;
        else if(keeperLine)score-=500;
        if(roles[incoming]==='FW')score+=(1-ratio)*45;
        if(roles[incoming]==='MF')score+=(1-Math.abs(ratio-.48))*35;
        if(roles[incoming]==='DF')score+=ratio*35;
        candidates.push({outgoing,key,score});
      }
      candidates.sort((a,b)=>b.score-a.score);
      if(!candidates[0]){team.notify?.('無法自動替換必殺戰術需要的球員');return false}
      used.add(candidates[0].key);pairs.push([candidates[0].outgoing,incoming]);
    }
    return exchange(id,pairs);
  }

  let dialog=null, editing=null, from=[], to=[], opener=null;
  function ensureDialog() {
    if(dialog) return;
    dialog=document.createElement('dialog');
    dialog.className='exchange-dialog';
    dialog.setAttribute('aria-labelledby','exchangeTitle');
    dialog.innerHTML='<div class="exchange-heading"><div><h2 id="exchangeTitle"></h2><p>兩欄可多選，依編號一對一交換；也可選場上球員調整彼此位置。</p></div><button type="button" data-exchange-close aria-label="關閉交換面板">✕</button></div><div class="exchange-columns"><section><h3>① 選擇場上位置 <span id="exchangeFromCount"></span></h3><div id="exchangeFrom" class="exchange-options"></div></section><section><h3>② 選擇交換選手 <span id="exchangeToCount"></span></h3><div id="exchangeTo" class="exchange-options"></div></section></div><section class="exchange-preview"><h3>交換配對</h3><div id="exchangePairs" aria-live="polite"></div></section><div class="exchange-footer"><span id="exchangeHelp" role="status"></span><div><button type="button" data-exchange-clear>清除選擇</button><button type="button" class="exchange-apply" data-exchange-apply>套用交換</button></div></div>';
    document.body.append(dialog);
    dialog.addEventListener('change',event=>{
      const box=event.target.closest('[data-exchange-name]');if(!box)return;
      const name=box.dataset.exchangeName;
      const list=box.dataset.exchangeGroup==='from'?from:to;
      if(box.checked){if(!list.includes(name))list.push(name)}else{const at=list.indexOf(name);if(at>=0)list.splice(at,1)}
      if(box.dataset.exchangeGroup==='from')to=to.filter(n=>!from.includes(n));
      refreshDialog(name,box.dataset.exchangeGroup);
    });
    dialog.addEventListener('click',event=>{
      if(event.target.closest('[data-exchange-close]')){dialog.close();return}
      if(event.target.closest('[data-exchange-clear]')){from=[];to=[];refreshDialog();return}
      if(event.target.closest('[data-exchange-apply]')){
        if(from.length&&from.length===to.length){
          const pairs=from.map((n,i)=>[n,to[i]]);
          if(exchange(editing,pairs))dialog.close();
        }
      }
    });
    dialog.addEventListener('close',()=>{editing=null;from=[];to=[];opener?.focus();opener=null});
  }
  function refreshDialog(focusName,focusGroup) {
    const adapter=teams.get(editing);if(!adapter)return;
    const field=adapter.getLines().flat(), fieldSet=new Set(field);
    const option=(name,group)=>{
      const list=group==='from'?from:to, checked=list.includes(name), disabled=group==='to'&&from.includes(name);
      return '<label class="exchange-option '+(checked?'checked':'')+' '+(disabled?'disabled':'')+'"><input type="checkbox" data-exchange-name="'+esc(name)+'" data-exchange-group="'+group+'" '+(checked?'checked ':'')+(disabled?'disabled ':'')+'>'+PlayerPortraits.html(name)+'<span>'+esc(name)+'<small>'+(fieldSet.has(name)?'場上':'替補')+'</small></span><b>'+(checked?list.indexOf(name)+1:'')+'</b></label>';
    };
    dialog.querySelector('#exchangeTitle').textContent=adapter.title+'｜多選交換';
    dialog.querySelector('#exchangeFromCount').textContent=from.length+'人';
    dialog.querySelector('#exchangeToCount').textContent=to.length+'人';
    dialog.querySelector('#exchangeFrom').innerHTML=field.map(n=>option(n,'from')).join('');
    dialog.querySelector('#exchangeTo').innerHTML=adapter.roster.map(n=>option(n,'to')).join('');
    const total=Math.max(from.length,to.length);
    dialog.querySelector('#exchangePairs').innerHTML=total?Array.from({length:total},(_,i)=>'<div class="exchange-pair"><b>'+(i+1)+'</b><span>'+esc(from[i]||'待選擇場上位置')+'</span><span>↔</span><span>'+esc(to[i]||'待選擇交換選手')+'</span></div>').join(''):'<p>先在兩欄勾選需要交換的選手。</p>';
    const valid=from.length>0&&from.length===to.length;
    const apply=dialog.querySelector('[data-exchange-apply]');apply.disabled=!valid;apply.textContent='套用'+(valid?' '+from.length+' 組':'')+'交換';
    dialog.querySelector('#exchangeHelp').textContent=valid?'配對完成，可一次套用。':'請在兩欄選擇相同人數。';
    if(focusName)Array.from(dialog.querySelectorAll('[data-exchange-name]')).find(el=>el.dataset.exchangeName===focusName&&el.dataset.exchangeGroup===focusGroup)?.focus();
  }
  function open(id,selected) {
    const team=teams.get(id);if(!team)return;
    ensureDialog();editing=id;from=[];to=[];opener=document.activeElement;
    if(selected&&team.roster.includes(selected)){
      if(team.getLines().flat().includes(selected))from=[selected];else to=[selected];
    }
    refreshDialog();dialog.showModal();
  }

  const playerAt=target=>target?.closest?.('[data-lineup-team][data-player]');
  let drag=null,dropTarget=null,ghost=null,scrollFrame=0,suppressUntil=0,touch=null;
  function markTarget(node) {
    dropTarget?.classList.remove('lineup-drop-target');dropTarget=null;
    if(node&&drag&&node.dataset.lineupTeam===drag.team&&node.dataset.player!==drag.name){dropTarget=node;node.classList.add('lineup-drop-target')}
  }
  function cleanup() {
    markTarget(null);drag?.element?.classList.remove('lineup-drag-source');
    if(ghost)ghost.remove();ghost=null;drag=null;touch=null;
    if(scrollFrame)cancelAnimationFrame(scrollFrame);scrollFrame=0;
    document.body.classList.remove('lineup-touch-drag');
  }
  function finish(node) {
    if(drag&&node){
      if(node.dataset.lineupTeam===drag.team&&node.dataset.player!==drag.name)exchange(drag.team,[[drag.name,node.dataset.player]]);
      else if(node.dataset.lineupTeam!==drag.team)teams.get(drag.team)?.notify?.('請在同一支隊伍內交換選手');
    }
    suppressUntil=Date.now()+400;cleanup();
  }
  document.addEventListener('dragstart',event=>{
    const node=playerAt(event.target);if(!node||!teams.has(node.dataset.lineupTeam))return;
    cleanup();drag={team:node.dataset.lineupTeam,name:node.dataset.player,element:node};node.classList.add('lineup-drag-source');
    event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',drag.team+':'+drag.name);
  });
  document.addEventListener('dragover',event=>{
    if(!drag)return;const node=playerAt(event.target);markTarget(node);
    if(node&&node.dataset.lineupTeam===drag.team){event.preventDefault();event.dataTransfer.dropEffect='move'}
  });
  document.addEventListener('drop',event=>{if(!drag)return;event.preventDefault();finish(playerAt(event.target))});
  document.addEventListener('dragend',cleanup);
  document.addEventListener('click',event=>{if(event.target.closest('[data-lineup-handle]')||Date.now()<suppressUntil&&playerAt(event.target)){event.preventDefault();event.stopImmediatePropagation()}},true);
  document.addEventListener('click',event=>{
    const toggle=event.target.closest('[data-lineup-drag-toggle]');
    if(toggle){
      const id=toggle.dataset.lineupDragToggle;if(!teams.has(id))return;
      const enabled=!dragModes.has(id);enabled?dragModes.add(id):dragModes.delete(id);cleanup();
      document.querySelectorAll('[data-lineup-team][data-player]').forEach(n=>{if(n.dataset.lineupTeam===id)n.dataset.lineupDragMode=String(enabled)});
      document.querySelectorAll('[data-lineup-drag-toggle]').forEach(b=>{if(b.dataset.lineupDragToggle===id){b.setAttribute('aria-pressed',String(enabled));b.classList.toggle('active',enabled);b.textContent=enabled?'結束拖拉':'拖拉交換'}});
      teams.get(id)?.notify?.(enabled?'拖拉模式已開啟：拖動整張球員圖卡到同隊球員即可交換。':'已結束拖拉模式。');return;
    }
    const button=event.target.closest('[data-lineup-open]');if(button)open(button.dataset.lineupOpen);
  });
  document.addEventListener('contextmenu',event=>{if(playerAt(event.target))event.preventDefault()});
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='touch'&&event.pointerType!=='pen')return;
    const node=playerAt(event.target);if(!node||!teams.has(node.dataset.lineupTeam))return;
    if(!event.target.closest('[data-lineup-handle]')&&!dragModes.has(node.dataset.lineupTeam))return;
    touch={id:event.pointerId,x:event.clientX,y:event.clientY,element:node};
    node.setPointerCapture?.(event.pointerId);
  });
  document.addEventListener('pointermove',event=>{
    if(!touch||touch.id!==event.pointerId)return;
    if(!drag&&Math.hypot(event.clientX-touch.x,event.clientY-touch.y)<8)return;
    event.preventDefault();
    if(!drag){
      const node=touch.element;drag={team:node.dataset.lineupTeam,name:node.dataset.player,element:node};node.classList.add('lineup-drag-source');
      ghost=node.cloneNode(true);ghost.removeAttribute('id');ghost.classList.add('lineup-drag-ghost');ghost.setAttribute('aria-hidden','true');document.body.append(ghost);document.body.classList.add('lineup-touch-drag');
      const autoScroll=()=>{if(!drag||!touch)return;const y=touch.y;const speed=y<75?-12:y>window.innerHeight-75?12:0;if(speed)window.scrollBy(0,speed);scrollFrame=requestAnimationFrame(autoScroll)};
      scrollFrame=requestAnimationFrame(autoScroll);
    }
    touch.x=event.clientX;touch.y=event.clientY;ghost.style.left=event.clientX+'px';ghost.style.top=event.clientY+'px';
    markTarget(playerAt(document.elementFromPoint(event.clientX,event.clientY)));
  },{passive:false});
  document.addEventListener('pointerup',event=>{if(!touch||touch.id!==event.pointerId)return;if(drag){event.preventDefault();finish(playerAt(document.elementFromPoint(event.clientX,event.clientY)))}else touch=null});
  document.addEventListener('pointercancel',cleanup);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&drag)cleanup()});
  window.LineupTools=Object.freeze({validLines,currentName,reconcile,swapLines,positions,attrs,handle,register,exchange,autoExchange,open});
})();
