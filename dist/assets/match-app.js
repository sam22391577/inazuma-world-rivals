(() => {
  'use strict';
  const $=s=>document.querySelector(s),clone=x=>JSON.parse(JSON.stringify(x));
  const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const opponentGroups=(window.OPPONENT_TEAM_GROUPS||[])
    .map(([label,keys])=>[label,keys.filter(key=>key!=='rival')])
    .filter(([,keys])=>keys.length);
  const teamGroups=[['現有選拔隊',['world','rival']],...opponentGroups];
  const labels={world:'世界代表隊',rival:'世界聯合選拔隊'};
  const defaultTeams={a:'world',b:'rival'};
  const definition=side=>TEAM_DATA[state[side].teamKey];
  const teamName=side=>definition(side).label||labels[state[side].teamKey]||state[side].teamKey;
  const shortName=side=>definition(side).shortLabel||teamName(side);
  const roster=side=>definition(side).roster.map(r=>r[0]);
  const initial=(teamKey,fi=0)=>({teamKey,fi,lines:clone(TEAM_DATA[teamKey].formations[fi].lines),selected:null});
  let state={a:initial(defaultTeams.a,0),b:initial(defaultTeams.b,1),flipped:false},history=[],timer;
  const registered={a:null,b:null};
  const push=()=>{history.push(clone(state));if(history.length>30)history.shift()};
  function save(){try{localStorage.setItem('inazuma-match-lineups-v3',JSON.stringify(state))}catch(_){}}
  function toast(s){$('#matchToast').textContent=s;$('#matchToast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('#matchToast').classList.remove('show'),2600)}
  function player(name,side,point){
    const selected=state[side].selected===name,role=definition(side).roster.find(r=>r[0]===name)[1];
    if(point)return '<button type="button" class="field-player '+side+(selected?' selected':'')+'" data-player="'+esc(name)+'" '+LineupTools.attrs('match-'+side,name)+' data-x="'+point.x+'" data-y="'+point.y+'" data-row="'+point.row+'" style="left:'+point.x+'%;top:'+point.y+'%" aria-label="'+esc(teamName(side))+' '+esc(name)+' '+role+'">'+LineupTools.handle()+PlayerPortraits.html(name)+'<span class="pname">'+esc(name)+'</span><span class="pos">'+role+'</span></button>';
    return '<button type="button" class="bench-player'+(selected?' selected':'')+'" data-player="'+esc(name)+'" '+LineupTools.attrs('match-'+side,name)+' aria-label="'+esc(teamName(side))+' 替補 '+esc(name)+'">'+LineupTools.handle()+PlayerPortraits.html(name)+'<span>'+esc(name)+'</span></button>';
  }
  function playersFor(side){
    const team=definition(side),details=team.skillDetails||{};
    return Object.fromEntries(team.roster.map(([name,pos,skills])=>[name,{name,pos,skills:skills.split(',').map(value=>{
      const [skill,type]=value.split(':');return {name:skill,type,desc:details[name]?.[skill]||''};
    })}]));
  }
  function ensureAdapter(side){
    const key=state[side].teamKey;if(registered[side]===key)return;
    const team=definition(side),names=roster(side),id='match-'+side;
    LineupTools.register(id,{title:teamName(side),roster:names,getLines:()=>state[side].lines,notify:toast,
      commit(next,pairs){push();state[side].lines=next;state[side].selected=pairs[0][1];render();toast(teamName(side)+'已完成 '+pairs.length+' 組交換');}});
    PlayerSkills.register(id,{title:teamName(side),teamData:()=>definition(side),players:playersFor(side),combos:team.combos,tactics:team.tactics,expandedDescriptions:team.expandedDescriptions,getLines:()=>state[side].lines,
      undo(){if(!history.length)return false;state=history.pop();render();toast('已復原交換');return true;}});
    registered[side]=key;
  }
  function renderBrief(side,data){
    $('#'+side+'SetupTitle').textContent=teamName(side);
    $('#'+side+'SetupProfile').innerHTML=data.focus?'<strong>'+esc(data.focus)+'</strong><span>'+esc(data.ratio||'')+'</span><small>'+esc(data.identity||'')+'</small>':'';
    $('#'+side+'TeamIntro').textContent=data.intro||'依目前陣型與球員特性進行即時攻守調整。';
    $('#'+side+'TeamIdentity').innerHTML=TeamIdentity.render(data,false);
  }
  function renderTeam(side){
    const team=state[side],data=definition(side),form=data.formations[team.fi],field=new Set(team.lines.flat()),bench=roster(side).filter(n=>!field.has(n));
    const orientation=state.flipped?(side==='a'?'b':'a'):side;
    $('#'+side+'Lines').innerHTML=LineupTools.positions(team.lines,orientation,form.slots).map(p=>player(p.name,side,p)).join('');
    $('#'+side+'Lines').setAttribute('aria-label',teamName(side)+'場上11人');
    $('#'+side+'TeamTitle').textContent=teamName(side);$('#'+side+'Name').textContent=form.name+'陣型';$('#'+side+'Shape').textContent=form.shape;renderBrief(side,data);
    $('#'+side+'TeamSelect').value=team.teamKey;
    $('#'+side+'FormationNote').textContent=form.note||'';$('#'+side+'FormationNote').hidden=!form.note;
    $('#'+side+'Tabs').innerHTML=data.formations.map((f,i)=>'<button type="button" class="pill '+(i===team.fi?'active':'')+'" data-'+side+'="'+i+'">'+esc(f.name)+'</button>').join('');
    $('#'+side+'Bench').innerHTML=bench.map(n=>player(n,side)).join('');$('#'+side+'Count').textContent=bench.length+' 人';
    $('#'+side+'Selected').textContent=team.selected?'已選取：'+team.selected+(field.has(team.selected)?'（場上）':'（替補）'):'點選球員或開啟多選交換';
    const combos=data.combos.filter(c=>c.members.every(n=>field.has(n))).length,tactics=data.tactics.filter(t=>t.members.every(n=>field.has(n))).length;
    $('#'+side+'Ready').textContent='可用合體技 '+combos+' / '+data.combos.length+' · 必殺戰術 '+tactics+' / '+data.tactics.length;
    $('#'+side+'TacticGuide').innerHTML=TechniqueInfo.tactics(data.tactics,team.lines);
    TechniqueInfo.readyTactics(side+'ReadyTactics',data.tactics,team.lines);
    $('#'+side+'ComboGuide').innerHTML=TechniqueInfo.combos(data.combos,team.lines);
    const canon=['world','rival'].includes(team.teamKey);$('#'+side+'CanonPanel').hidden=!canon;
    $('#'+side+'CanonGuide').innerHTML=canon?CanonCombos.render(roster(side),team.lines):'';
    $('#'+side+'GuideTitle').textContent=teamName(side);$('#'+side+'GuideCount').textContent=data.combos.length+' 招合體技 · '+data.tactics.length+' 組必殺戰術';
  }
  function byRole(side,roles){
    const roleMap=Object.fromEntries(definition(side).roster.map(([name,pos])=>[name,pos]));
    const field=state[side].lines.flat();
    for(const role of roles){const name=field.find(player=>roleMap[player]===role);if(name)return name}
    return field[0];
  }
  function renderDuels(){
    const pairs=[
      [byRole('a',['FW','MF']),byRole('b',['FW','MF']),'前線終結','比較兩隊第一得分點的射門速度、力量與第二波接應。'],
      [byRole('a',['MF','DF']),byRole('b',['MF','DF']),'中場節奏','司令角色爭奪推進路線，決定比賽落入快攻或陣地戰。'],
      [byRole('a',['DF','GK']),byRole('b',['DF','GK']),'禁區防線','最後一道防守比拚封角、補位與處理反彈球的穩定度。']
    ];
    $('#duels').innerHTML=pairs.map(([a,b,title,desc])=>'<article class="duel"><div class="pair"><span class="chip">'+esc(a)+'</span><span>VS</span><span class="chip rival">'+esc(b)+'</span></div><strong>'+title+'</strong><p>'+desc+'</p></article>').join('');
  }
  function render(){
    ensureAdapter('a');ensureAdapter('b');renderTeam('a');renderTeam('b');renderDuels();
    $('#aAttack').textContent=shortName('a')+(state.flipped?' ↓':' ↑');$('#bAttack').textContent=shortName('b')+(state.flipped?' ↑':' ↓');
    $('#topTeam').textContent=state.flipped?shortName('a')+' ↓':shortName('b')+' ↓';$('#bottomTeam').textContent=state.flipped?shortName('b')+' ↑':shortName('a')+' ↑';
    $('#aHeaderSwap').textContent=shortName('a')+'多選交換';$('#bHeaderSwap').textContent=shortName('b')+'多選交換';
    $('#matchUndo').disabled=!history.length;save();
  }
  function setFormation(side,index){if(!definition(side).formations[index])return;push();state[side]=initial(state[side].teamKey,index);render();toast(teamName(side)+'已切換陣型')}
  function setTeam(side,key){
    if(!TEAM_DATA[key]||key===state[side].teamKey)return;
    push();PlayerSkills.close();state[side]=initial(key,0);registered[side]=null;render();toast(teamName(side)+'已加入對戰');
  }
  function optionMarkup(){return teamGroups.map(([group,keys])=>'<optgroup label="'+esc(group)+'">'+keys.map(key=>'<option value="'+esc(key)+'">'+esc(TEAM_DATA[key].label||labels[key]||key)+'</option>').join('')+'</optgroup>').join('')}
  $('#aTeamSelect').innerHTML=optionMarkup();$('#bTeamSelect').innerHTML=optionMarkup();
  $('#aTeamSelect').addEventListener('change',event=>setTeam('a',event.target.value));$('#bTeamSelect').addEventListener('change',event=>setTeam('b',event.target.value));
  document.addEventListener('click',event=>{
    for(const side of ['a','b']){const f=event.target.closest('[data-'+side+']');if(f){setFormation(side,Number(f.dataset[side]));return}}
    const node=event.target.closest('[data-lineup-team][data-player]');if(node){const side=node.dataset.lineupTeam==='match-a'?'a':node.dataset.lineupTeam==='match-b'?'b':null;if(side){state[side].selected=node.dataset.player;render()}}
  });
  for(const side of ['a','b']){
    $('#'+side+'Swap').addEventListener('click',()=>LineupTools.open('match-'+side,state[side].selected));
    $('#'+side+'Reset').addEventListener('click',()=>{push();state[side]=initial(state[side].teamKey,state[side].fi);render();toast(teamName(side)+'已恢復預設先發')});
  }
  $('#matchUndo').addEventListener('click',()=>{if(history.length){state=history.pop();render();toast('已復原上一步')}});
  $('#flipEnds').addEventListener('click',()=>{push();state.flipped=!state.flipped;render();toast('兩隊已交換場地與進攻方向')});
  function restoreSaved(savedSide){
    const data=TEAM_DATA[savedSide?.teamKey],form=data?.formations[savedSide?.fi];if(!data||!form||!Array.isArray(savedSide.lines))return null;
    const aliases=data.nameAliases||{},mapped=savedSide.lines.map(row=>row.map(name=>aliases[name]||name));
    const lines=LineupTools.reconcile(mapped,data.roster,form);if(!lines)return null;
    const renamed=aliases[savedSide.selected]||savedSide.selected,selected=LineupTools.currentName(renamed,data.roster);
    return {teamKey:savedSide.teamKey,fi:savedSide.fi,lines,selected:data.roster.some(row=>row[0]===selected)?selected:null};
  }
  try{
    const saved=JSON.parse(localStorage.getItem('inazuma-match-lineups-v3'));
    const restoredA=restoreSaved(saved?.a),restoredB=restoreSaved(saved?.b);
    if(restoredA&&restoredB){
      state={a:restoredA,b:restoredB,flipped:!!saved.flipped};
    }else{
      const legacy=JSON.parse(localStorage.getItem('inazuma-match-lineups-v2'));
      if(legacy&&['a','b'].every(side=>TEAM_DATA[defaultTeams[side]].formations[legacy[side]?.fi])){
        const migrated={flipped:!!legacy.flipped};let valid=true;
        for(const side of ['a','b']){
          const key=defaultTeams[side],data=TEAM_DATA[key],form=data.formations[legacy[side].fi];
          const lines=LineupTools.reconcile(legacy[side].lines,data.roster,form);if(!lines){valid=false;break}
          const selected=LineupTools.currentName(legacy[side].selected,data.roster);
          migrated[side]={fi:legacy[side].fi,lines,selected:data.roster.some(row=>row[0]===selected)?selected:null};
        }
        if(valid){state={a:{...clone(migrated.a),teamKey:'world'},b:{...clone(migrated.b),teamKey:'rival'},flipped:migrated.flipped};localStorage.setItem('inazuma-match-lineups-v2',JSON.stringify(migrated))}
      }
    }
  }catch(_){}
  render();
})();
