/* One team workspace for Japan, the world selection and all World Cup opponents. */
(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const clone=value=>JSON.parse(JSON.stringify(value));
  const teamKeys=['world','rival',...(window.LATEST_OPPONENT_KEYS||[])];
  const teamGroups=[['代表隊',['world','rival']],...(window.OPPONENT_TEAM_GROUPS||[])
    .map(([label,keys])=>[label,keys.filter(key=>key!=='world'&&key!=='rival')])
    .filter(([,keys])=>keys.length)];
  const labels={world:'閃電日本',rival:'世界聯合選拔隊'};
  const definition=key=>TEAM_DATA[key];
  const labelFor=key=>labels[key]||definition(key).label||key;
  const optionLabel=key=>key==='world'?'閃電日本｜世界代表隊':labelFor(key);
  const read=key=>{try{return localStorage.getItem(key)}catch(_){return null}};
  const write=(key,value)=>{try{localStorage.setItem(key,value)}catch(_){/* Keep the current session usable when storage is unavailable. */}};
  const readJSON=key=>{try{return JSON.parse(read(key))}catch(_){return null}};
  const requested=new URL(window.location.href).searchParams.get('team');
  const lastTeam=read('inazuma-selected-team-v1');
  let teamKey=teamKeys.includes(requested)?requested:teamKeys.includes(lastTeam)?lastTeam:'world';
  let roster,forms,combos,tactics,players,state,undoHistory=[],toastTimer,comboSearch='';
  const stateKey=()=>teamKey==='world'?'inazuma-team-world-v1':teamKey==='rival'?'inazuma-rivals-v1':`inazuma-opponent-${teamKey}-v1`;
  const teamLabel=()=>labelFor(teamKey);
  const active=()=>state.lines.flat();
  const ready=items=>{const field=new Set(active());return items.filter(move=>move.members.every(name=>field.has(name)))};
  const remember=()=>{undoHistory.push(clone(state));if(undoHistory.length>20)undoHistory.shift()};

  function applyDefinition(){
    const data=definition(teamKey);
    ({roster,formations:forms,combos,tactics}=data);
    players=Object.fromEntries(roster.map(([name,pos,encoded])=>[name,{name,pos,skills:encoded.split(',').filter(Boolean).map(value=>{
      const [skill,type]=value.split(':');return {name:skill,type,desc:data.skillDetails?.[name]?.[skill]||''};
    })}]));
  }

  function save(){
    write(stateKey(),JSON.stringify(state));
    write('inazuma-selected-team-v1',teamKey);
    if(teamKey!=='world')write('inazuma-opponent-team-v1',teamKey);
  }

  function restoreState(){
    state={fi:0,lines:clone(forms[0].lines),selected:forms[0].lines[0][0],swap:null,highlight:[],chosen:null,tactic:null,st:'solo',filter:'ready',view:'formation',moveView:'combo'};
    let saved=readJSON(stateKey());
    if(!saved&&teamKey==='world'){
      const legacy=readJSON('inazuma-tactics-v1');
      if(legacy)saved={...legacy,fi:legacy.formation,chosen:legacy.chosenCombo,st:legacy.skillTab};
    }
    const formation=saved&&forms[saved.fi];
    const lines=formation&&LineupTools.reconcile(saved.lines,roster,formation);
    if(lines){
      const selected=LineupTools.currentName(saved.selected,roster);
      const filter=saved.filter==='原作'?'original':saved.filter;
      state={...state,fi:Number(saved.fi),lines,selected:players[selected]?selected:lines[0][0],
        highlight:Array.isArray(saved.highlight)?saved.highlight.map(name=>LineupTools.currentName(name,roster)).filter(name=>players[name]):[],
        chosen:saved.chosen||null,tactic:tactics.some(item=>item.name===saved.tactic)?saved.tactic:null,st:saved.st==='combo'?'combo':'solo',
        filter:['all','ready','original','custom','射門','進攻','防守'].includes(filter)?filter:'ready',
        view:['formation','players','moves'].includes(saved.view)?saved.view:'formation',
        moveView:['combo','tactic'].includes(saved.moveView)?saved.moveView:'combo'};
    }
    if(state.chosen){
      const move=combos.find(item=>(item.id||item.name)===state.chosen||item.name===state.chosen);
      state.chosen=move?(move.id||move.name):null;
      if(!move)state.highlight=[];
    }
    save();
  }

  function toast(message){
    $('#toast').textContent=message;$('#toast').classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600);
  }

  function registerTeam(){
    PlayerSkills.register('team',{title:teamLabel(),teamData:()=>definition(teamKey),players,combos,tactics,expandedDescriptions:true,
      getLines:()=>state.lines,undo(){return undo()}});
    LineupTools.register('team',{title:teamLabel(),roster:roster.map(row=>row[0]),getLines:()=>state.lines,notify:toast,
      commit(next,pairs){remember();state.lines=next;state.selected=pairs[0][1];clearSelection();save();render();toast('已完成 '+pairs.length+' 組交換，可復原上一步')}});
  }

  function updateURL(push=false){
    const url=new URL(window.location.href);url.searchParams.set('team',teamKey);
    window.history[push?'pushState':'replaceState']({team:teamKey},'',url.href);
  }

  function renderOverview(){
    const data=definition(teamKey);
    $('#teamSelect').innerHTML=teamGroups.map(([label,keys])=>`<optgroup label="${esc(label)}">${keys.map(key=>`<option value="${esc(key)}">${esc(optionLabel(key))}</option>`).join('')}</optgroup>`).join('');
    $('#teamSelect').value=teamKey;
    $('#pageSubtitle').textContent=`${teamKeys.length} 支隊伍 · 選擇隊伍後查看陣型、球員與招式`;
    $('#activeTeamName').textContent=teamLabel();
    document.title=teamLabel()+'｜隊伍戰術模擬器';
    $('#teamProfile').innerHTML=[data.focus,data.ratio].filter(Boolean).map(value=>`<span>${esc(value)}</span>`).join('');
    $('#teamIntro').textContent=data.intro||'查看此隊的完整名單、陣型、必殺技與必殺戰術。';
    const root=$('#playersPanelRoot');
    PlayerDirectory.mount(root,data,{heading:teamLabel()+'球員',description:`共 ${data.playerProfiles?.length||0} 名，依位置篩選後點擊查看能力與必殺技。`,countLabel:`${data.playerProfiles?.length||0} 人`,headingId:'teamPlayerDirectoryHeading',scope:'team-directory',open:true,embedded:true});
  }

  function switchTeam(key,{updateHistory=true}={}){
    if(!teamKeys.includes(key)||key===teamKey)return;
    save();PlayerSkills.close();PlayerDirectory.unmount($('#playersPanelRoot'),{clear:true});
    teamKey=key;comboSearch='';applyDefinition();undoHistory=[];restoreState();registerTeam();renderOverview();render();
    if(updateHistory)updateURL(true);
    toast(teamLabel()+'已載入');
  }

  function clearSelection(){state.swap=null;state.highlight=[];state.chosen=null;state.tactic=null}
  function undo(){
    if(!undoHistory.length)return false;
    state=undoHistory.pop();state.swap=null;save();render();toast('已復原上一步');return true;
  }

  function playerButton(name,slot,tacticOrder=0){
    const classes=['player'];
    if(state.highlight.includes(name))classes.push('involved');else if(state.selected===name)classes.push('selected');
    if(state.swap===name)classes.push('swap');
    const style=slot?` style="left:${slot[0]}%;top:${slot[1]}%"`:'';
    return `<button type="button" class="${classes.join(' ')}" data-player="${esc(name)}" ${LineupTools.attrs('team',name)}${style} aria-label="${esc(name)} ${esc(players[name].pos)}" aria-haspopup="dialog">${LineupTools.handle()}${PlayerPortraits.html(name)}<span class="pname">${esc(name)}</span><span class="prole">${esc(players[name].pos)}</span>${tacticOrder?`<span class="tactic-order" aria-label="戰術核心第 ${tacticOrder} 位">${tacticOrder}</span>`:state.highlight.includes(name)?'<span class="star">★</span>':''}</button>`;
  }

  function baseSlots(formation){
    const field=active();if(formation.slots?.length===field.length)return formation.slots.map(slot=>[Number(slot[0]),Number(slot[1])]);
    const slots=[];state.lines.forEach((row,ri)=>row.forEach((_,ci)=>slots.push([100*(ci+1)/(row.length+1),ri===state.lines.length-1?92:8+76*ri/(state.lines.length-1)])));
    return slots;
  }

  function tacticOverlay(item,formation){
    const field=active(),slots=baseSlots(formation);
    return {byName:Object.fromEntries(field.map((name,index)=>[name,slots[index]])),core:item.members.filter(name=>field.includes(name))};
  }

  function tacticRoute(layout){
    const points=layout.core.map(name=>layout.byName[name]).filter(Boolean);if(!points.length)return '';
    return `<svg class="tactic-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${points.length>1?`<polyline points="${points.map(point=>point.join(',')).join(' ')}"></polyline>`:''}${points.map(point=>`<circle cx="${point[0]}" cy="${point[1]}" r="2.2"></circle>`).join('')}</svg>`;
  }

  function activateTactic(item){
    if(!item){clearSelection();save();render();return}
    state.tactic=item.name;state.highlight=[...item.members];state.selected=item.members.find(name=>players[name])||state.selected;state.chosen=null;state.swap=null;state.view='formation';
    save();render();toast(`已在目前陣型標示「${item.name}」`);
    const pitch=$('#lines')?.closest('.pitch');if(pitch)requestAnimationFrame(()=>{
      const rect=pitch.getBoundingClientRect(),top=Math.max(0,window.scrollY+rect.top+rect.height/2-window.innerHeight/2);
      const root=document.documentElement,previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo(0,top);root.style.scrollBehavior=previous;
    });
  }

  function chooseTactic(name){
    const item=tactics.find(tactic=>tactic.name===name);if(!item){activateTactic(null);return}
    const missing=item.members.filter(player=>!active().includes(player));
    if(missing.length&&!LineupTools.autoExchange('team',item.members)){render();return}
    activateTactic(item);
  }

  function selectPlayer(name){
    if(!players[name])return;
    const keepTactic=!!state.tactic&&!state.swap;
    if(state.swap&&state.swap!==name){
      remember();const previous=state.swap;
      state.lines=state.lines.map(row=>row.map(value=>value===previous?name:value===name?previous:value));
      toast(`已將 ${previous} 與 ${name} 交換`);
    }
    state.selected=name;if(keepTactic)state.swap=null;else clearSelection();save();render();
  }

  function setFormation(index){
    if(!forms[index])return;
    remember();state.fi=index;state.lines=clone(forms[index].lines);state.selected=state.lines[0][0];
    clearSelection();save();render();toast('已切換為'+forms[index].name+'陣型');
  }

  function applyCombo(index){
    const move=combos[index];if(!move)return;
    const missing=move.members.filter(name=>!active().includes(name));
    remember();
    if(missing.length){
      const next=clone(state.lines),protectedNames=new Set(move.members),used=new Set();
      for(const incoming of missing){
        const candidates=[];
        for(let ri=0;ri<next.length;ri++)for(let ci=0;ci<next[ri].length;ci++){
          const old=next[ri][ci],key=ri+'-'+ci;
          if(protectedNames.has(old)||used.has(key))continue;
          const keeper=ri===next.length-1,ratio=ri/(next.length-1);
          let score=players[old].pos===players[incoming].pos?100:0;
          if(players[incoming].pos==='GK')score+=keeper?160:-300;else if(keeper)score-=260;
          if(players[incoming].pos==='FW')score+=(1-ratio)*22;
          if(players[incoming].pos==='DF')score+=ratio*20;
          candidates.push({ri,ci,key,score});
        }
        candidates.sort((a,b)=>b.score-a.score);
        if(candidates[0]){next[candidates[0].ri][candidates[0].ci]=incoming;used.add(candidates[0].key)}
      }
      state.lines=next;
    }
    state.highlight=[...move.members];state.selected=move.members[0];state.chosen=move.id||move.name;state.tactic=null;state.swap=null;
    state.view='formation';save();render();toast(missing.length?`已換上 ${missing.join('、')}，可施展「${move.name}」`:`已標示「${move.name}」的施放成員`);
    const panel=$('#formationPanel');if(panel)requestAnimationFrame(()=>panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
  }

  const original=move=>move.origin==='原作'||move.origin==='原作改編'||move.group==='原作';
  const tag=type=>`<span class="tag ${esc(type)}">${esc(type)}</span>`;
  function render(){
    const formation=forms[state.fi],field=active(),fieldSet=new Set(field),available=ready(combos),availableIds=new Set(available.map(move=>move.id||move.name));
    const selectedTactic=tactics.find(item=>item.name===state.tactic)||null,tacticOverlayData=selectedTactic?tacticOverlay(selectedTactic,formation):null;
    document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.view===state.view)));
    document.querySelectorAll('[data-panel]').forEach(panel=>panel.hidden=panel.dataset.panel!==state.view);
    document.querySelectorAll('[data-move-view]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.moveView===state.moveView)));
    document.querySelectorAll('[data-move-panel]').forEach(panel=>panel.hidden=panel.dataset.movePanel!==state.moveView);
    $('#mForm').textContent=formation.name+' '+formation.shape;
    $('#mCombo').textContent=available.length+' 招';
    $('#formName').textContent=formation.name+'陣型';$('#shape').textContent=formation.shape;
    $('#formationNote').textContent=formation.note||'';$('#formationNote').hidden=!formation.note;
    $('#forms').innerHTML=forms.map((item,index)=>`<button type="button" class="pill ${index===state.fi?'active':''}" data-form="${index}" aria-pressed="${index===state.fi}">${esc(item.name)}</button>`).join('');
    $('#formationTacticSelect').innerHTML='<option value="">選擇必殺戰術</option>'+tactics.map(item=>`<option value="${esc(item.name)}">${esc(item.name)} · ${esc(item.type)}</option>`).join('');
    $('#formationTacticSelect').value=selectedTactic?.name||'';
    $('#tacticBoardSummary').innerHTML=selectedTactic?`<span><strong>${esc(selectedTactic.name)}</strong>｜${esc(selectedTactic.type)}｜原陣型核心順序：${esc(selectedTactic.members.join(' → '))}</span>`:'選擇後會保留目前陣型，只標示核心施放者與順序。';
    $('#clearTactic').hidden=!selectedTactic;
    const slots=formation.slots?.length===field.length?formation.slots:null;let slotIndex=0;
    $('#lines').classList.toggle('custom-layout',!!slots);
    const coreOrder=new Map((selectedTactic?.members||[]).map((name,index)=>[name,index+1]));
    $('#lines').innerHTML=(tacticOverlayData?tacticRoute(tacticOverlayData):'')+state.lines.map(row=>`<div class="row">${row.map(name=>playerButton(name,slots?slots[slotIndex++]:null,coreOrder.get(name)||0)).join('')}</div>`).join('');
    const bench=roster.map(row=>row[0]).filter(name=>!fieldSet.has(name));
    $('#bench').innerHTML=bench.map(name=>playerButton(name)).join('');$('#benchCount').textContent=bench.length+' 人';
    $('#swapbar').classList.toggle('show',!!state.swap);$('#swaptext').textContent=state.swap?`等待選擇與「${state.swap}」交換的球員`:'';
    $('#undo').hidden=!undoHistory.length;$('#undo').disabled=!undoHistory.length;$('#clear').hidden=!state.highlight.length;$('#clear').disabled=!state.highlight.length;
    $('#comboCount').textContent=`可用 ${available.length}／全部 ${combos.length}`;
    $('#tacticCount').textContent=`共 ${tactics.length} 組`;
    $('#tactics').innerHTML=TechniqueInfo.tactics(tactics,state.lines);
    TechniqueInfo.readyTactics('rivalReadyTactics',tactics,state.lines,{teamId:'team',selectedName:state.tactic,onSelect:activateTactic});
    $('#comboSearch').value=comboSearch;
    document.querySelectorAll('[data-filter]').forEach(button=>{
      const selected=button.dataset.filter===state.filter;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));
    });
    const query=comboSearch.trim().toLocaleLowerCase('zh-Hant');
    const shown=combos.map((move,index)=>({move,index})).filter(({move})=>(state.filter==='all'||state.filter==='ready'&&availableIds.has(move.id||move.name)||state.filter==='original'&&original(move)||state.filter==='custom'&&!original(move)||move.type===state.filter)&&(!query||[move.name,move.jp,move.work,...move.members].filter(Boolean).join(' ').toLocaleLowerCase('zh-Hant').includes(query)));
    $('#combos').innerHTML=shown.length?shown.map(({move,index})=>{
      const missing=move.members.filter(name=>!fieldSet.has(name));
      const origin=move.origin==='原作改編'?'替代搭配':original(move)?'動畫原作':'原創';
      return `<article class="combo ${state.chosen===(move.id||move.name)?'chosen':''}"><div class="combo-main"><div><span class="move-name">${esc(move.name)}</span><span class="sub">${origin} · ${move.members.length} 人 · ${esc(move.members.join('＋'))}</span></div><div class="combo-status">${tag(move.type)}<span class="status">${missing.length?`需換上 ${missing.length} 人`:'目前可施展'}</span></div></div><details class="combo-details"><summary>查看招式說明</summary><p class="combo-description">${esc(move.desc)}</p>${move.jp?`<span class="sub" lang="ja">${esc(move.jp)}${move.work?' · '+esc(move.work):''}</span>`:''}${CanonCombos.note(move)}</details><button type="button" class="combo-apply" data-combo="${index}">${missing.length?`自動換上 ${missing.length} 人並套用`:'標示施放成員'}</button></article>`;
    }).join(''):'<div class="empty">沒有符合條件的合體必殺技</div>';
  }

  document.addEventListener('click',event=>{
    if(event.composedPath().some(node=>node.matches?.('[data-player-directory-overlay]')))return;
    const player=event.target.closest('[data-lineup-team="team"][data-player]');if(player){selectPlayer(player.dataset.player);return}
    const formation=event.target.closest('[data-form]');if(formation){setFormation(Number(formation.dataset.form));return}
    const combo=event.target.closest('[data-combo]');if(combo){applyCombo(Number(combo.dataset.combo));return}
    const view=event.target.closest('[data-view]');if(view){state.view=view.dataset.view;save();render();return}
    const moveView=event.target.closest('[data-move-view]');if(moveView){state.moveView=moveView.dataset.moveView;save();render();return}
    const skillTab=event.target.closest('[data-st]');if(skillTab){state.st=skillTab.dataset.st;render();return}
    const filter=event.target.closest('[data-filter]');if(filter){state.filter=filter.dataset.filter;save();render();return}
  });
  $('#cancelSwap').onclick=()=>{state.swap=null;render()};
  $('#clear').onclick=()=>{clearSelection();save();render()};
  $('#clearTactic').onclick=()=>{clearSelection();save();render();toast('已清除戰術標示')};
  $('#formationTacticSelect').addEventListener('change',event=>chooseTactic(event.target.value));
  $('#reset').onclick=()=>{remember();state.lines=clone(forms[state.fi].lines);state.selected=state.lines[0][0];clearSelection();save();render();toast('已恢復預設先發')};
  $('#undo').onclick=undo;
  $('#teamSelect').addEventListener('change',event=>switchTeam(event.target.value));
  $('#comboSearch').addEventListener('input',event=>{comboSearch=event.target.value;if(comboSearch.trim())state.filter='all';render()});
  window.addEventListener('popstate',()=>{const key=new URL(window.location.href).searchParams.get('team');switchTeam(teamKeys.includes(key)?key:'world',{updateHistory:false})});
  applyDefinition();restoreState();registerTeam();renderOverview();render();updateURL();
})();
