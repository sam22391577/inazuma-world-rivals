(() => {
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const roleLabels={FW:'前鋒',MF:'中場',DF:'後衛',GK:'門將'};
  function render(team,expanded=false){
    const stars=team.stars||[],units=team.units||[];
    if(!stars.length&&!units.length)return '';
    const starMarkup=stars.map(star=>`<article class="team-star-card"><div class="team-star-head"><span class="team-star-role ${esc(star.role)}">${esc(roleLabels[star.role]||star.role)}</span><div><strong>${esc(star.name)}</strong><small>${esc(star.title)}</small></div></div><p>${esc(star.desc)}</p></article>`).join('');
    const unitMarkup=units.map(unit=>`<article class="team-unit-card"><div class="team-unit-head"><span>${esc(unit.role)}</span><strong>${esc(unit.title)}</strong></div><p class="team-unit-members">${esc(unit.members.join('＋'))}</p><p>${esc(unit.desc)}</p></article>`).join('');
    return `<details class="team-identity-panel"${expanded?' open':''}><summary><span>明星球員與三線組合</span><small>${stars.length} 名明星 · ${units.length} 組稱號</small></summary><div class="team-identity-content">${stars.length?`<section><h3>明星球員</h3><div class="team-star-grid">${starMarkup}</div></section>`:''}${units.length?`<section><h3>前鋒／中場／後衛組合</h3><div class="team-unit-grid">${unitMarkup}</div></section>`:''}</div></details>`;
  }
  window.TeamIdentity=Object.freeze({render});
})();
