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
  let roster,forms,combos,tactics,players,state,undoHistory=[],toastTimer;
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
    state={fi:0,lines:clone(forms[0].lines),selected:forms[0].lines[0][0],swap:null,highlight:[],chosen:null,st:'solo',filter:'all'};
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
        chosen:saved.chosen||null,st:saved.st==='combo'?'combo':'solo',
        filter:['all','ready','original','custom','射門','進攻','防守'].includes(filter)?filter:'all'};
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
    $('#pageSubtitle').textContent=`${teamKeys.length} 支隊伍 · 切換球隊，調整陣型並查看球員與招式`;
    $('#activeTeamName').textContent=teamLabel();
    document.title=teamLabel()+'｜隊伍戰術模擬器';
    $('#teamProfile').innerHTML=[data.focus,data.ratio,data.identity].filter(Boolean).map(value=>`<span>${esc(value)}</span>`).join('');
    $('#teamIntro').textContent=data.intro||'查看此隊的完整名單、陣型、必殺技與必殺戰術。';
    const root=$('#teamIdentity');
    PlayerDirectory.mount(root,data,{heading:teamLabel()+'球員介紹',description:`依位置篩選 ${data.playerProfiles?.length||0} 名球員，點擊球員可查看六項能力評價、專屬能力與必殺技。`,headingId:'teamPlayerDirectoryHeading',scope:'team-directory'});
    $('#mSquad').textContent='11 / '+roster.length;
    const canon=document.querySelector('.canon-reference');
    canon.hidden=teamKey!=='world'&&teamKey!=='rival';
    canon.querySelector('summary').textContent=teamKey==='world'?'合體技圖鑑（原作／指定搭配）':'合體技圖鑑（原作／延伸）';
    canon.querySelector('.reference-note').textContent=teamKey==='world'
      ?'僅收錄目前核定的動畫招式；缺少原作搭檔時，依世界代表隊名單使用指定替補成員。'
      :'外隊搭檔由本隊同位置球員搭配，配對結果會保存；招式統一顯示目前搭配的本隊成員。';
  }

  function switchTeam(key,{updateHistory=true}={}){
    if(!teamKeys.includes(key)||key===teamKey)return;
    save();PlayerSkills.close();PlayerDirectory.unmount($('#teamIdentity'),{clear:true});
    teamKey=key;applyDefinition();undoHistory=[];restoreState();registerTeam();renderOverview();render();
    if(updateHistory)updateURL(true);
    toast(teamLabel()+'已載入');
  }

  function clearSelection(){state.swap=null;state.highlight=[];state.chosen=null}
  function undo(){
    if(!undoHistory.length)return false;
    state=undoHistory.pop();state.swap=null;save();render();toast('已復原上一步');return true;
  }

  function playerButton(name,slot){
    const classes=['player'];
    if(state.highlight.includes(name))classes.push('involved');else if(state.selected===name)classes.push('selected');
    if(state.swap===name)classes.push('swap');
    const style=slot?` style="left:${slot[0]}%;top:${slot[1]}%"`:'';
    return `<button type="button" class="${classes.join(' ')}" data-player="${esc(name)}" ${LineupTools.attrs('team',name)}${style} aria-label="${esc(name)} ${esc(players[name].pos)}" aria-haspopup="dialog">${LineupTools.handle()}${PlayerPortraits.html(name)}<span class="pname">${esc(name)}</span><span class="prole">${esc(players[name].pos)}</span>${state.highlight.includes(name)?'<span class="star">★</span>':''}</button>`;
  }

  function selectPlayer(name){
    if(!players[name])return;
    if(state.swap&&state.swap!==name){
      remember();const previous=state.swap;
      state.lines=state.lines.map(row=>row.map(value=>value===previous?name:value===name?previous:value));
      toast(`已將 ${previous} 與 ${name} 交換`);
    }
    state.selected=name;clearSelection();save();render();
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
    state.highlight=[...move.members];state.selected=move.members[0];state.chosen=move.id||move.name;state.swap=null;
    save();render();toast(missing.length?`已換上 ${missing.join('、')}，可施展「${move.name}」`:`可直接施展「${move.name}」`);
  }

  const original=move=>move.origin==='原作'||move.origin==='原作改編'||move.group==='原作';
  const tag=type=>`<span class="tag ${esc(type)}">${esc(type)}</span>`;
  function render(){
    const formation=forms[state.fi],field=active(),fieldSet=new Set(field),available=ready(combos),availableIds=new Set(available.map(move=>move.id||move.name));
    $('#mForm').textContent=formation.name+' '+formation.shape;
    $('#mCombo').textContent=available.length+' / '+combos.length;
    $('#formName').textContent=formation.name+'陣型';$('#shape').textContent=formation.shape;
    $('#formationNote').textContent=formation.note||'';$('#formationNote').hidden=!formation.note;
    $('#forms').innerHTML=forms.map((item,index)=>`<button type="button" class="pill ${index===state.fi?'active':''}" data-form="${index}" aria-pressed="${index===state.fi}">${esc(item.name)}</button>`).join('');
    const slots=formation.slots?.length===field.length?formation.slots:null;let slotIndex=0;
    $('#lines').classList.toggle('custom-layout',!!slots);
    $('#lines').innerHTML=state.lines.map(row=>`<div class="row">${row.map(name=>playerButton(name,slots?slots[slotIndex++]:null)).join('')}</div>`).join('');
    const bench=roster.map(row=>row[0]).filter(name=>!fieldSet.has(name));
    $('#bench').innerHTML=bench.map(name=>playerButton(name)).join('');$('#benchCount').textContent=bench.length+' 人';
    $('#swapbar').classList.toggle('show',!!state.swap);$('#swaptext').textContent=state.swap?`等待選擇與「${state.swap}」交換的球員`:'';
    $('#undo').disabled=!undoHistory.length;$('#clear').disabled=!state.highlight.length;
    const player=players[state.selected];
    $('#selectedName').textContent=player.name;$('#selectedRole').textContent=player.pos;$('#selectedStatus').textContent=fieldSet.has(player.name)?'場上':'替補';
    document.querySelectorAll('[data-st]').forEach(button=>button.classList.toggle('active',button.dataset.st===state.st));
    const personalCombos=available.filter(move=>move.members.includes(player.name));
    const row=(name,type,detail='')=>`<div class="line"><div><div class="move-name">${esc(name)}</div>${detail?`<div class="sub">${esc(detail)}</div>`:''}</div>${tag(type)}</div>`;
    $('#skills').innerHTML=state.st==='solo'?player.skills.map(move=>row(move.name,move.type)).join(''):(personalCombos.length?personalCombos.map(move=>row(move.name,move.type,move.members.join('＋'))).join(''):'<div class="empty">目前沒有可用合體技</div>');
    $('#comboCount').textContent=available.length+' / '+combos.length;
    $('#tactics').innerHTML=TechniqueInfo.tactics(tactics,state.lines);
    TechniqueInfo.readyTactics('rivalReadyTactics',tactics,state.lines,{teamId:'team'});
    $('#canonGuide').innerHTML=teamKey==='world'||teamKey==='rival'?CanonCombos.render(roster.map(row=>row[0]),state.lines):'';
    document.querySelectorAll('[data-filter]').forEach(button=>{
      const selected=button.dataset.filter===state.filter;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));
    });
    const shown=combos.map((move,index)=>({move,index})).filter(({move})=>state.filter==='all'||state.filter==='ready'&&availableIds.has(move.id||move.name)||state.filter==='original'&&original(move)||state.filter==='custom'&&!original(move)||move.type===state.filter);
    $('#combos').innerHTML=shown.length?shown.map(({move,index})=>{
      const missing=move.members.filter(name=>!fieldSet.has(name));
      return `<button type="button" class="combo ${state.chosen===(move.id||move.name)?'chosen':''}" data-combo="${index}"><span><span class="move-name">${esc(move.name)}</span><span class="sub">${move.origin==='原作改編'?'原作・指定搭配':original(move)?'原作':'原創'} · ${move.members.length} 人 · ${esc(move.members.join('＋'))}</span>${CanonCombos.note(move)}${move.jp?`<span class="sub" lang="ja">${esc(move.jp)} · ${esc(move.work||'')}</span>`:''}<span class="combo-description">${esc(move.desc)}</span></span><span>${tag(move.type)}<span class="status">${missing.length?'缺 '+esc(missing.join('、')):'可直接施展'}</span></span></button>`;
    }).join(''):'<div class="empty">沒有符合條件的合體必殺技</div>';
  }

  document.addEventListener('click',event=>{
    if(event.composedPath().some(node=>node.matches?.('[data-player-directory-overlay]')))return;
    const player=event.target.closest('[data-lineup-team="team"][data-player]');if(player){selectPlayer(player.dataset.player);return}
    const formation=event.target.closest('[data-form]');if(formation){setFormation(Number(formation.dataset.form));return}
    const combo=event.target.closest('[data-combo]');if(combo){applyCombo(Number(combo.dataset.combo));return}
    const skillTab=event.target.closest('[data-st]');if(skillTab){state.st=skillTab.dataset.st;render();return}
    const filter=event.target.closest('[data-filter]');if(filter){state.filter=filter.dataset.filter;save();render();return}
    const accordion=event.target.closest('.accbtn');if(accordion){const open=accordion.closest('.accordion').classList.toggle('open');accordion.setAttribute('aria-expanded',String(open))}
  });
  $('#swap').onclick=()=>LineupTools.open('team',state.selected);
  $('#cancelSwap').onclick=()=>{state.swap=null;render()};
  $('#clear').onclick=()=>{clearSelection();save();render()};
  $('#reset').onclick=()=>{remember();state.lines=clone(forms[state.fi].lines);state.selected=state.lines[0][0];clearSelection();save();render();toast('已恢復預設先發')};
  $('#undo').onclick=undo;
  $('#teamSelect').addEventListener('change',event=>switchTeam(event.target.value));
  window.addEventListener('popstate',()=>{const key=new URL(window.location.href).searchParams.get('team');switchTeam(teamKeys.includes(key)?key:'world',{updateHistory:false})});
  applyDefinition();restoreState();registerTeam();renderOverview();render();updateURL();
})();
