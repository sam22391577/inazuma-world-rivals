import assert from 'node:assert/strict';
import {boot,read} from './dom-harness.mjs';

const teamKeys=['verona','monsoon','redlightning','redcopper','sunseal','seacompass','prism','bloom','blackcrown'];
const abilityLabels=['射門','盤球','傳球','防守','速度','指揮／戰術判斷'];
const app=boot('opponent.html',{'inazuma-opponent-team-v1':'verona'});

assert.deepEqual(JSON.parse(JSON.stringify(app.sandbox.OPPONENT_PROFILE_TEAM_KEYS)),teamKeys,'all nine original opponent teams have profiles');
let previousExclusiveAverage=0;
for(const key of teamKeys){
  const team=app.sandbox.TEAM_DATA[key],profiles=team.playerProfiles;
  assert.equal(profiles.length,11,key+' has a complete 11-player directory');
  assert.deepEqual(profiles.map(player=>player.name),team.roster.map(row=>row[0]),key+' profiles follow the roster order');
  assert.equal(new Set(profiles.map(player=>player.title)).size,11,key+' player titles are unique');
  for(const player of profiles){
    assert.ok(player.role&&player.title&&player.shortDesc&&player.desc.length>player.shortDesc.length,player.name+' has complete introduction copy');
    assert.deepEqual(Object.keys(player.abilities),abilityLabels,player.name+' uses the shared six ratings');
    assert.ok(Object.values(player.abilities).every(score=>Number.isInteger(score)&&score>=35&&score<=100),player.name+' ratings stay within 100');
    assert.ok(player.exclusive.name&&player.exclusive.desc.length>=20,player.name+' has an explained exclusive ability');
    assert.ok(Number.isInteger(player.exclusive.score)&&player.exclusive.score>=80&&player.exclusive.score<=100,player.name+' exclusive score stays within 100');
  }
  const exclusiveAverage=profiles.reduce((sum,player)=>sum+player.exclusive.score,0)/profiles.length;
  assert.ok(exclusiveAverage>previousExclusiveAverage,key+' is stronger than the previous stage');
  previousExclusiveAverage=exclusiveAverage;
}

const markup=app.get('#teamIdentity').innerHTML;
assert.ok(markup.includes('維羅納夜梟球員介紹'),'the selected opponent directory is rendered');
assert.ok(markup.includes('全部 11'),'the complete roster count is rendered');
assert.ok(markup.includes('data-player-directory-filter="FW"'),'position filters are rendered');
assert.ok(markup.includes('<details class="player-directory-details">'),'opponent introductions are collapsible');
for(const player of app.sandbox.TEAM_DATA.verona.playerProfiles){
  assert.ok(markup.includes(player.name),player.name+' is rendered');
  assert.ok(markup.includes(player.title),player.name+' title is rendered beneath the name');
}

const rival=boot('opponent.html');
const rivalMarkup=rival.get('#teamIdentity').innerHTML;
assert.ok(rivalMarkup.includes('聯合選拔隊球員介紹'),'world selection uses the shared player directory');
assert.ok(rivalMarkup.includes('全部 21'),'world selection renders its complete roster count');
assert.ok(rivalMarkup.includes('前鋒 9')&&rivalMarkup.includes('中場 5')&&rivalMarkup.includes('後衛 5')&&rivalMarkup.includes('守門員 2'),'world selection filters use the updated position counts');
assert.ok(!rivalMarkup.includes('明星球員與三線組合'),'legacy star and unit section is removed');

const page=read('dist/opponent.html');
const directory=read('dist/assets/player-directory.js');
assert.ok(page.includes('opponent-player-profiles.js?v=1'));
assert.ok(page.includes('player-directory.css?v=9'));
assert.ok(page.includes('player-directory.js?v=9'));
assert.ok(!page.includes("if(teamKey==='rival')directoryRoot.innerHTML=TeamIdentity.render(data,true)"),'legacy rival identity branch is removed');
assert.ok(page.includes('PlayerDirectory.mount(directoryRoot,data'),'all opponent teams mount the shared player directory');
assert.ok(directory.includes('countLabel=options.countLabel||`完整 ${players.length} 人`'),'player count is dynamic');
assert.ok(directory.includes('function unmount(root'),'directories are cleaned up during team switches');

console.log(JSON.stringify({opponentTeams:teamKeys.length,players:teamKeys.length*11,rivalPlayers:21,ratings:abilityLabels.length,progression:'passed',rivalDirectory:'passed'},null,2));
