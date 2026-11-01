import assert from 'node:assert/strict';
import {boot,read} from './dom-harness.mjs';

const app=boot('index.html');
const players=app.sandbox.TEAM_DATA.world.playerProfiles;
const names=['豪炎寺','灰崎','劍城','白龍','吉良','敦也','阿芙洛蒂','鬼道','野坂','神童','天馬','基山','一星','黑瀨','吹雪','水神矢','飛鷹','風丸','壁山','圓堂','西蔭','立向居'];
const titles=['炎之王牌射手','球場上的惡魔','闇黑射手','十年一遇的天才','神之射手','熊之殺手・敦也','天空的支配者','球場上的絕對指導者','戰術的皇帝','神之指揮棒','清風般的足球少年','永世的貴公子','蒼藍一等星','球場上的獨裁者','雪原的王子','冷靜的熱血隊長','鐵腿托比','蒼藍疾風','心地善良的巨人','傳說的守門員','沉默的守護神','無限成長的守門員'];

assert.deepEqual(JSON.parse(JSON.stringify(players.map(player=>player.name))),names,'directory includes the complete 22-player roster');
assert.deepEqual(JSON.parse(JSON.stringify(players.map(player=>player.title))),titles,'every player uses the selected character title');
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(['FW','MF','DF','GK'].map(role=>[role,players.filter(player=>player.role===role).length])))),{FW:6,MF:8,DF:5,GK:3},'position counts match the roster filters');
for(const player of players){
  assert.deepEqual(Object.keys(player.abilities),['射門','盤球','傳球','防守','速度','指揮／戰術判斷'],player.name+' uses the shared six ratings');
  assert.ok(Object.values(player.abilities).every(score=>Number.isInteger(score)&&score>=0&&score<=100),player.name+' scores are within 100');
  assert.ok(player.exclusive.name&&player.exclusive.desc.length>=20,player.name+' exclusive ability has a description');
  assert.ok(Number.isInteger(player.exclusive.score)&&player.exclusive.score<=100,player.name+' exclusive score is within 100');
}

const markup=app.get('#worldTeamIdentity').innerHTML;
assert.ok(markup.includes('閃電日本球員介紹'));
assert.ok(markup.includes('完整 22 人'));
assert.ok(markup.includes('前鋒 6'));
assert.ok(markup.includes('data-player-directory-filter="all"'),'all-position filter is interactive');
assert.ok(markup.includes('data-player-directory-filter="MF"'),'midfielder filter is interactive');
assert.ok(markup.includes('<details class="player-directory-details">'),'player introductions are collapsible and closed by default');
assert.ok(!markup.includes('<button type="button" disabled>全部 22</button>'),'position filters are no longer disabled');
for(const player of players)assert.ok(markup.includes(player.fullName),player.name+' card is rendered');
for(const player of players)assert.ok(markup.includes(player.title),player.name+' title is rendered on the card');
assert.ok(!markup.includes('明星球員與三線組合'),'old world identity block is removed');

const directory=read('dist/assets/player-directory.js');
const directoryStyles=read('dist/assets/player-directory.css');
assert.ok(directory.includes('專屬能力'));
assert.ok(directory.includes('能力評價'));
assert.ok(directory.includes('個人必殺'));
assert.ok(directory.includes('合體必殺'));
assert.ok(directory.includes('player-directory-score-track'),'six ratings render as horizontal bars');
assert.ok(directory.includes('player-directory-hero-title'),'the title is rendered directly below the player name in the detail view');
assert.ok(!directory.includes('官方稱號')&&!directory.includes('原創稱號'),'title source labels are not shown');
assert.ok(directory.includes('style="width:${score}%"'),'bar length matches the rating score');
assert.ok(directory.includes('applyFilter(filter.dataset.playerDirectoryFilter)'),'position labels filter the player cards');
assert.ok(directory.includes("activeFilter='all'"),'all players are visible by default');
assert.ok(directory.includes('此位置目前沒有可顯示的球員資料。'),'empty filter state remains clear');
assert.ok(directory.includes('data-player-directory-scroll'),'detail drawer has an independent scroll region');
assert.ok(directory.includes('document.body.appendChild?.(overlay)'),'detail overlay is positioned against the viewport');
assert.ok(directory.includes("overlay.addEventListener('click',handleClick)"),'detached overlay keeps its controls interactive');
assert.ok(directoryStyles.includes('touch-action:pan-y'),'drawer permits vertical touch scrolling');
assert.ok(directoryStyles.includes('-webkit-overflow-scrolling:touch'),'drawer supports momentum scrolling on iOS');
assert.ok(directoryStyles.includes('top:50%;right:auto;left:50%'),'detail card is centered in the viewport');
assert.ok(directoryStyles.includes('transform:translate(-50%,-50%)'),'detail card remains centered');
assert.ok(directoryStyles.includes('grid-template-columns:96px minmax(0,1fr) 34px'),'rating bars align label, bar, and score');
assert.ok(directoryStyles.includes('.player-directory-details>summary'),'directory summary has a dedicated interactive style');
assert.ok(read('dist/index.html').includes('player-directory.css?v=9'));
assert.ok(read('dist/index.html').includes('player-directory.js?v=9'));

console.log(JSON.stringify({teamPlayers:players.length,positionCounts:{FW:6,MF:8,DF:5,GK:3},sharedRatings:6,exclusiveDescriptions:'passed',touchScrolling:'passed',oldIdentityRemoved:'passed'},null,2));
