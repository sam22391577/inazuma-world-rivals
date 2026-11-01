(() => {
  'use strict';
  const data=TEAM_DATA.world;
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  document.querySelector('#worldTeamIntro').textContent=data.intro||'';
  document.querySelector('#worldTeamProfile').innerHTML=[data.focus,data.ratio,data.identity].filter(Boolean).map(value=>`<span>${esc(value)}</span>`).join('');
  PlayerDirectory.mount(document.querySelector('#worldTeamIdentity'),data);
})();
