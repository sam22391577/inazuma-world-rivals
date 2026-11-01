/* Preserve existing opponent-page links after the team workspaces were merged. */
(() => {
  const url=new URL('./index.html',window.location.href);
  let team=new URL(window.location.href).searchParams.get('team');
  if(!team)try{team=localStorage.getItem('inazuma-opponent-team-v1')}catch(_){}
  url.searchParams.set('team',team||'rival');
  url.hash=window.location.hash;
  window.location.replace(url.href);
})();
