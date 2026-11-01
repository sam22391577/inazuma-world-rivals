/* Player details shared by both team pages and the match pitch. */
(() => {
  'use strict';
  const teams=new Map();
  const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const playerAt=target=>target?.closest?.('[data-lineup-team][data-player]');
  // Tab rendering replaces the clicked button; the event path retains its overlay.
  const fromPlayerDirectory=event=>event.composedPath().some(node=>node.matches?.('[data-player-directory-overlay]'));
  let card=null,current=null,touch=null;
  const anchors=()=>Array.from(document.querySelectorAll('[data-lineup-team][data-player]'));
  const anchor=()=>current&&anchors().find(el=>el.dataset.lineupTeam===current.team&&el.dataset.player===current.name);
  function close(returnFocus=false){
    window.PlayerDirectory?.closeProfile(returnFocus);
    const previous=anchor();
    if(card)card.hidden=true;
    previous?.setAttribute('aria-expanded','false');
    current=null;
    if(returnFocus)previous?.focus();
  }
  function ensureCard(){
    if(card)return;
    card=document.createElement('section');
    card.id='playerSkillCard';card.className='player-skill-card';card.hidden=true;
    card.setAttribute('data-player-skill-card','');
    card.setAttribute('role','dialog');card.setAttribute('aria-modal','false');
    card.setAttribute('aria-labelledby','playerSkillTitle');card.setAttribute('tabindex','-1');
    card.addEventListener('toggle',position,true);
    document.body.append(card);
  }
  function position(){
    if(!current||!card||card.hidden)return;
    const el=anchor(),rect=el?.getBoundingClientRect()||current.rect;
    if(window.innerWidth<=640){card.style.left='12px';card.style.top='auto';card.style.bottom='12px';return}
    card.style.bottom='auto';
    const width=card.offsetWidth||380,height=card.offsetHeight||420,pad=12,gap=12;
    let left=rect.right+gap;
    if(left+width>window.innerWidth-pad)left=rect.left-width-gap;
    card.style.left=Math.max(pad,Math.min(left,window.innerWidth-width-pad))+'px';
    card.style.top=Math.max(pad,Math.min(rect.top,window.innerHeight-height-pad))+'px';
  }
  function comboRow(move,field){
    const missing=move.members.filter(name=>!field.has(name)),ready=!missing.length;
    const cast=move.members.map(name=>'<span class="skill-cast-member '+(field.has(name)?'is-on-field':'is-off-field')+'">'+esc(name)+'</span>').join('<span class="skill-cast-plus" aria-hidden="true">＋</span>');
    return '<li class="skill-combo '+(ready?'is-ready':'is-unavailable')+'" data-move-id="'+esc(move.id||move.name)+'" data-ready="'+ready+'"><details class="skill-move"><summary><span class="skill-combo-label"><strong>'+esc(move.name)+'</strong><span class="skill-cast-tag" aria-label="參與選手">'+cast+'</span><span class="skill-combo-status">'+(ready?'可施展':'缺少：'+esc(missing.join('、')))+'</span></span><span class="skill-kind '+esc(move.type)+'">'+esc(move.type)+'</span></summary><div class="skill-move-content">'+(move.group?'<small>'+esc(move.group)+'</small>':'')+(window.CanonCombos?.note(move)||'')+(move.jp?'<small lang="ja">'+esc(move.jp)+' · '+esc(move.work||'')+'</small>':'')+(move.desc?'<small>'+esc(move.desc)+'</small>':'')+'</div></details></li>';
  }
  function comboGroups(combos,field){
    const groups=new Map();
    for(const move of combos){const count=move.members.length;if(!groups.has(count))groups.set(count,[]);groups.get(count).push(move)}
    return [...groups].sort((a,b)=>a[0]-b[0]).map(([count,moves],index)=>{
      const ready=moves.filter(move=>move.members.every(name=>field.has(name))).length;
      return '<details class="skill-section skill-combo-group" data-skill-combo-count="'+count+'"'+(index===0?' open':'')+'><summary><span class="skill-group-title">'+count+' 人合體必殺</span><span class="skill-group-count">'+ready+' / '+moves.length+' 可施展</span></summary><ul>'+moves.map(move=>comboRow(move,field)).join('')+'</ul></details>';
    }).join('');
  }
  function show(node,keyboard=false){
    const team=node.dataset.lineupTeam,name=node.dataset.player,adapter=teams.get(team),p=adapter?.players[name];
    if(!p)return;
    if(adapter.teamData&&window.PlayerDirectory?.openProfile(adapter.teamData(),name,node))return;
    close();ensureCard();
    const field=new Set(adapter.getLines().flat()),onField=field.has(name);
    const reference=window.CanonSkills?.[name],originalProfile=reference?.original===true;
    const solo=p.skills.map(skill=>({...skill,...reference?.skills.find(s=>s.name===skill.name),...(adapter.expandedDescriptions&&skill.desc?{desc:skill.desc}:{})}));
    const combos=adapter.combos.filter(c=>c.members.includes(name));
    const available=combos.filter(c=>c.members.every(n=>field.has(n)));
    const originals=window.CanonCombos?.playable(Object.keys(adapter.players)).filter(c=>c.members.includes(name))||[];
    const strictOriginal=adapter.title==='世界代表隊';
    const originalPanel=window.CanonCombos&&originals.length?'<details class="skill-canon"><summary>合體技圖鑑（'+(strictOriginal?'原作／指定搭配':'原作／延伸')+'） <span>'+originals.filter(c=>c.media!=='遊戲').length+'</span></summary><p class="skill-card-note">'+(strictOriginal?'僅列目前核定的動畫招式；原作搭檔不在名單時，顯示指定替補隊友與調整後說明。':'外隊搭檔由本隊同位置球員隨機搭配，配對結果會保存；招式統一顯示目前搭配的本隊成員。')+'</p>'+CanonCombos.render(Object.keys(adapter.players),adapter.getLines(),name)+'</details>':'';
    const row=move=>'<li data-move-id="'+esc(move.id||move.name)+'"><details class="skill-move"><summary><strong>'+esc(move.name)+'</strong><span class="skill-kind '+esc(move.type)+'">'+esc(move.type)+'</span></summary><div class="skill-move-content">'+(move.jp?'<small class="skill-original" lang="ja">'+esc(move.jp)+'</small><small class="skill-origin">'+esc(move.work)+'</small>':'')+(move.desc?'<small>'+esc(move.desc)+'</small>':'')+'</div></details></li>';
    card.dataset.team=team;
    card.innerHTML='<header class="skill-card-heading">'+PlayerPortraits.html(name)+'<div><p>'+esc(adapter.title)+'</p><h2 id="playerSkillTitle">'+esc(name)+'</h2><span>'+esc(p.pos)+' · '+(onField?'場上':'替補')+'</span></div><button type="button" data-skill-close aria-label="關閉球員招式">✕</button></header><div class="skill-card-body"><p class="skill-card-note skill-card-guide">點招式展開說明；亮字代表目前可施展。</p><section class="skill-primary-section"><details class="skill-section" open><summary>'+(reference?(originalProfile?'本作原創個人技':'原作個人技'):'個人必殺技')+' <span>'+solo.length+' 招</span></summary>'+(!onField?'<p class="skill-card-note">替補招式預覽，上場後可使用。</p>':'')+'<ul>'+solo.map(row).join('')+'</ul></details></section><section data-player-combos><h3>合體必殺 <span><b>'+available.length+'</b> / '+combos.length+' 可施展</span></h3><p class="skill-card-note">依參與人數分類；暗字會標示缺少的選手。</p>'+(combos.length?comboGroups(combos,field):'<p class="skill-card-empty">目前沒有此球員參與的合體必殺。</p>')+'</section>'+originalPanel+'</div><div class="skill-card-actions"><button type="button" data-player-exchange="'+esc(name)+'" data-lineup-team="'+esc(team)+'" aria-haspopup="dialog">換人／交換站位</button></div><footer>'+(reference?.source?'<p class="skill-source-note">中文採通稱或意譯，日文為原作名稱。<a href="'+esc(reference.source)+'" target="_blank" rel="noopener noreferrer">角色招式來源 ↗</a> · <a href="https://zukan.inazuma.jp/skill/" target="_blank" rel="noopener noreferrer">官方圖鑑 ↗</a></p>':'')+'點其他球員切換 · 點外面關閉</footer>';
    current={team,name,rect:node.getBoundingClientRect()};card.hidden=false;
    node.setAttribute('aria-expanded','true');node.setAttribute('aria-controls',card.id);
    position();
    // The page selects and redraws the player button after this click.
    requestAnimationFrame(()=>{
      if(!current||current.team!==team||current.name!==name)return;
      const el=anchor();el?.setAttribute('aria-expanded','true');el?.setAttribute('aria-controls',card.id);
      position();if(keyboard)card.focus();
    });
  }
  document.addEventListener('click',event=>{
    if(fromPlayerDirectory(event))return;
    if(event.target.closest('[data-skill-close]')){close(true);return}
    if(event.target.closest('[data-player-skill-card]'))return;
    const node=playerAt(event.target);
    if(node&&teams.has(node.dataset.lineupTeam))show(node,event.detail===0);else close();
  });
  document.addEventListener('pointerdown',event=>{
    if(fromPlayerDirectory(event))return;
    if(!event.target.closest('[data-player-skill-card]')&&!playerAt(event.target))close();
    touch=null;
    if((event.pointerType==='touch'||event.pointerType==='pen')&&playerAt(event.target))touch={id:event.pointerId,x:event.clientX,y:event.clientY};
  },true);
  document.addEventListener('pointermove',event=>{
    if(touch&&touch.id===event.pointerId&&Math.hypot(event.clientX-touch.x,event.clientY-touch.y)>=8){close();touch=null}
  },{passive:true});
  document.addEventListener('pointerup',()=>{touch=null});
  document.addEventListener('pointercancel',()=>{touch=null});
  document.addEventListener('dragstart',()=>close());
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&current){event.preventDefault();close(true)}});
  window.addEventListener('resize',position);
  document.addEventListener('scroll',position,true);
  window.PlayerSkills=Object.freeze({register:(id,adapter)=>{teams.set(id,adapter);window.SwapDrawer?.register(id,{...adapter,roster:Object.keys(adapter.players)})},close});
})();
