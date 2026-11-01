(() => {
  'use strict';

  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const abilityLabels=['射門','盤球','傳球','防守','速度','指揮／戰術判斷'];
  const roleLabels={FW:'前鋒',MF:'中場',DF:'後衛',GK:'守門員'};
  const instances=new WeakMap();
  let pitchOverlay=null,pitchTeam=null,pitchPlayer=null,pitchTab='ability',pitchTrigger=null;

  const portrait=name=>window.PlayerPortraits?.html(name)||`<span class="player-avatar original-player-avatar">${esc([...name].slice(0,2).join(''))}</span>`;

  function personalMoves(team,name){
    const row=(team.roster||[]).find(item=>item[0]===name);
    if(!row?.[2])return [];
    const references=window.CanonSkills?.[name]?.skills||[];
    return row[2].split(',').filter(Boolean).map(encoded=>{
      const [move,type='必殺技']=encoded.split(':');
      const reference=references.find(item=>item.name===move);
      return {name:move,type,desc:team.skillDetails?.[name]?.[move]||reference?.desc||'依角色原有球風施展的個人必殺技。'};
    });
  }

  function combinationMoves(team,name){
    return (team.combos||[]).filter(move=>move.members?.includes(name));
  }

  function moveCards(moves,emptyText,showMembers=false){
    if(!moves.length)return `<p class="player-directory-empty">${esc(emptyText)}</p>`;
    return `<div class="player-directory-moves">${moves.map(move=>`<article class="player-directory-move"><header><strong>${esc(move.name)}</strong><span>${esc(move.type)}</span></header>${showMembers?`<p class="player-directory-members">${esc(move.members.join('＋'))}</p>`:''}<p>${esc(move.desc)}</p></article>`).join('')}</div>`;
  }

  function abilityPanel(player){
    const scores=abilityLabels.map(label=>{
      const score=Math.max(0,Math.min(100,Number(player.abilities[label])||0));
      return `<div class="player-directory-score" aria-label="${esc(label)} ${score}分"><span>${esc(label)}</span><span class="player-directory-score-track" aria-hidden="true"><i style="width:${score}%"></i></span><strong>${score}</strong></div>`;
    }).join('');
    return `<section class="player-directory-ability-panel" aria-label="${esc(player.name)}能力評價"><div class="player-directory-scores">${scores}</div><article class="player-directory-exclusive"><div><span>專屬能力</span><strong>${esc(player.exclusive.name)}</strong></div><b>${esc(player.exclusive.score)}</b><p>${esc(player.exclusive.desc)}</p></article></section>`;
  }

  function tabPanel(team,player,tab){
    if(tab==='personal')return moveCards(personalMoves(team,player.name),'目前沒有可顯示的個人必殺技。');
    if(tab==='combo')return moveCards(combinationMoves(team,player.name),'目前沒有可顯示的合體必殺。',true);
    return abilityPanel(player);
  }

  function drawer(player,team,tab='ability',titleId='playerDirectoryTitle'){
    const tabs=[['ability','能力評價'],['personal','個人必殺'],['combo','合體必殺']];
    return `<div class="player-directory-drawer-scroll" data-player-directory-scroll><div class="player-directory-drawer-head"><button class="player-directory-close" type="button" data-player-directory-close aria-label="關閉球員資料">×</button><div class="player-directory-hero">${portrait(player.name)}<div><span class="player-directory-hero-role">${esc(roleLabels[player.role]||player.role)}</span><h3 id="${esc(titleId)}">${esc(player.fullName||player.name)}</h3><small class="player-directory-hero-title">${esc(player.title)}</small></div></div><p>${esc(player.desc)}</p></div><div class="player-directory-tabs" role="tablist" aria-label="球員資料分類">${tabs.map(([key,label])=>`<button type="button" role="tab" data-player-directory-tab="${key}" aria-selected="${tab===key}">${label}</button>`).join('')}</div><div class="player-directory-tab-content">${tabPanel(team,player,tab)}</div></div>`;
  }

  function closeProfile(returnFocus=true){
    if(!pitchOverlay||pitchOverlay.hidden)return;
    pitchOverlay.hidden=true;
    document.body.classList.remove('player-directory-opened');
    if(returnFocus){
      const current=[...document.querySelectorAll('[data-lineup-team][data-player]')].find(node=>node.dataset.lineupTeam===pitchTrigger?.team&&node.dataset.player===pitchTrigger?.name);
      (current||pitchTrigger?.node)?.focus?.();
    }
    pitchTeam=null;pitchPlayer=null;pitchTrigger=null;
  }

  function paintPitchProfile(){
    const panel=pitchOverlay.querySelector('.player-directory-drawer');
    panel.innerHTML=drawer(pitchPlayer,pitchTeam,pitchTab,'pitchPlayerDirectoryTitle');
    panel.querySelector('[data-player-directory-scroll]')?.scrollTo?.({top:0});
    panel.querySelector('[data-player-directory-close]')?.focus();
  }

  function openProfile(team,name,trigger){
    const player=team?.playerProfiles?.find(item=>item.name===name);
    if(!player)return false;
    closeProfile(false);
    if(!pitchOverlay){
      pitchOverlay=document.createElement('div');
      pitchOverlay.className='player-directory-overlay';
      pitchOverlay.dataset.playerDirectoryOverlay='';
      pitchOverlay.hidden=true;
      pitchOverlay.innerHTML='<button class="player-directory-backdrop" type="button" data-player-directory-close aria-label="關閉球員資料"></button><aside class="player-directory-drawer" role="dialog" aria-modal="true" aria-labelledby="pitchPlayerDirectoryTitle"></aside>';
      pitchOverlay.addEventListener('click',event=>{
        if(event.target.closest('[data-player-directory-close]')){closeProfile();return;}
        const tab=event.target.closest('[data-player-directory-tab]');
        if(tab&&pitchPlayer){pitchTab=tab.dataset.playerDirectoryTab;paintPitchProfile();}
      });
      document.addEventListener('keydown',event=>{
        if(pitchOverlay.hidden)return;
        if(event.key==='Escape'){event.preventDefault();closeProfile();return;}
        if(event.key!=='Tab')return;
        const focusable=[...pitchOverlay.querySelectorAll('button:not([disabled])')].filter(node=>node.offsetParent!==null);
        const first=focusable[0],last=focusable.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      });
      document.body.appendChild(pitchOverlay);
    }
    pitchTeam=team;pitchPlayer=player;pitchTab='ability';
    pitchTrigger={node:trigger,team:trigger?.dataset.lineupTeam,name};
    pitchOverlay.hidden=false;
    document.body.classList.add('player-directory-opened');
    paintPitchProfile();
    return true;
  }

  function render(players,options={}){
    const cards=players.map(player=>`<button class="player-directory-card" type="button" data-player-directory-player="${esc(player.name)}" aria-haspopup="dialog"><span class="player-directory-card-top">${portrait(player.name)}<span class="player-directory-role ${esc(player.role)}">${esc(roleLabels[player.role]||player.role)}</span></span><strong>${esc(player.fullName||player.name)}</strong><small>${esc(player.title)}</small><p>${esc(player.shortDesc)}</p><span class="player-directory-open">查看能力與必殺技</span></button>`).join('');
    const roleCounts=Object.fromEntries(['FW','MF','DF','GK'].map(role=>[role,players.filter(player=>player.role===role).length]));
    const filters=[['all',`全部 ${players.length}`],...['FW','MF','DF','GK'].filter(role=>roleCounts[role]).map(role=>[role,`${roleLabels[role]} ${roleCounts[role]}`])].map(([role,label])=>`<button type="button" data-player-directory-filter="${role}" class="${role==='all'?'active':''}" aria-pressed="${role==='all'}">${label}</button>`).join('');
    const heading=options.heading||'閃電日本球員介紹',description=options.description||`依位置篩選 ${players.length} 名球員，點擊球員可查看能力評價與必殺技。`,countLabel=options.countLabel||`完整 ${players.length} 人`,headingId=options.headingId||'playerDirectoryHeading',scope=options.scope||'player-directory';
    const open=options.open?' open':'';
    return `<section class="player-directory" aria-labelledby="${esc(headingId)}"><details class="player-directory-details"${open}><summary><div class="player-directory-heading"><div><h2 id="${esc(headingId)}">${esc(heading)}</h2><p>${esc(description)}</p></div><span>${esc(countLabel)}</span></div></summary><div class="player-directory-content"><nav class="player-directory-filters" aria-label="依位置篩選球員">${filters}</nav><div class="player-directory-grid">${cards}<p class="player-directory-filter-empty" data-player-directory-filter-empty hidden></p></div></div></details><div class="player-directory-overlay" data-player-directory-overlay data-player-directory-scope="${esc(scope)}" hidden><button class="player-directory-backdrop" type="button" data-player-directory-close aria-label="關閉球員資料"></button><aside class="player-directory-drawer" role="dialog" aria-modal="true" aria-labelledby="playerDirectoryTitle"></aside></div></section>`;
  }

  function unmount(root,{clear=false}={}){
    const instance=instances.get(root);
    if(instance){instance.destroy();instances.delete(root);}
    if(clear)root.innerHTML='';
  }

  function mount(root,team,options={}){
    unmount(root);
    const players=team.playerProfiles||[];
    root.innerHTML=render(players,options);
    if(!players.length)return;
    const overlay=root.querySelector('[data-player-directory-overlay]');
    const panel=root.querySelector('.player-directory-drawer');
    if(!overlay||!panel)return;
    document.body.appendChild?.(overlay);
    const filterButtons=[...root.querySelectorAll('[data-player-directory-filter]')];
    const playerCards=[...root.querySelectorAll('[data-player-directory-player]')];
    const filterEmpty=root.querySelector('[data-player-directory-filter-empty]');
    let activePlayer=null,activeTab='ability',returnFocus=null,activeFilter='all';

    const applyFilter=role=>{
      activeFilter=role;
      let visibleCount=0;
      playerCards.forEach(card=>{
        const player=players.find(item=>item.name===card.dataset.playerDirectoryPlayer);
        card.hidden=role!=='all'&&player?.role!==role;
        if(!card.hidden)visibleCount+=1;
      });
      filterButtons.forEach(button=>{
        const active=button.dataset.playerDirectoryFilter===role;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      if(filterEmpty){
        filterEmpty.hidden=visibleCount>0;
        filterEmpty.textContent='此位置目前沒有可顯示的球員資料。';
      }
    };

    const close=()=>{
      overlay.hidden=true;
      document.body.classList.remove('player-directory-opened');
      if(returnFocus?.focus)returnFocus.focus();
    };
    const paint=()=>{
      panel.innerHTML=drawer(activePlayer,team,activeTab);
      panel.querySelector('[data-player-directory-scroll]')?.scrollTo?.({top:0});
      panel.querySelector('[data-player-directory-close]')?.focus();
    };
    const handleClick=event=>{
      const filter=event.target.closest('[data-player-directory-filter]');
      if(filter){applyFilter(filter.dataset.playerDirectoryFilter);return;}
      const card=event.target.closest('[data-player-directory-player]');
      if(card){
        activePlayer=players.find(player=>player.name===card.dataset.playerDirectoryPlayer);
        if(!activePlayer)return;
        returnFocus=card;activeTab='ability';paint();overlay.hidden=false;
        document.body.classList.add('player-directory-opened');
        root.querySelectorAll('[data-player-directory-player]').forEach(item=>item.classList.toggle('selected',item===card));
        return;
      }
      if(event.target.closest('[data-player-directory-close]')){close();return;}
      const tab=event.target.closest('[data-player-directory-tab]');
      if(tab&&activePlayer){activeTab=tab.dataset.playerDirectoryTab;paint();}
    };
    const handleKeydown=event=>{if(event.key==='Escape'&&!overlay.hidden)close();};
    root.addEventListener('click',handleClick);
    overlay.addEventListener('click',handleClick);
    applyFilter(activeFilter);
    document.addEventListener('keydown',handleKeydown);
    const instance={destroy(){root.removeEventListener?.('click',handleClick);overlay.removeEventListener?.('click',handleClick);document.removeEventListener?.('keydown',handleKeydown);overlay.remove();document.body.classList.remove('player-directory-opened');}};
    instances.set(root,instance);
    return instance;
  }

  window.PlayerDirectory=Object.freeze({mount,render,unmount,openProfile,closeProfile});
})();
