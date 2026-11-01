import assert from 'node:assert/strict';
import {boot} from './dom-harness.mjs';

const plain=value=>JSON.parse(JSON.stringify(value));
const app=boot('match.html');
const world=app.sandbox.TEAM_DATA.world;
const endouSkills=world.roster.find(row=>row[0]==='圓堂')[2].split(',').map(item=>item.split(':')[0]);
const forbidden=['神之手','熱血拳','爆裂拳','魔神之手'];

assert.deepEqual(plain(endouSkills),['正義的鐵拳','憤怒的鐵鎚','異次元之手','神之捕捉']);
assert.ok(!endouSkills.some(name=>forbidden.includes(name)),'Pre-Zeus Endou moves stay removed');
const endouOriginal=world.combos.filter(move=>move.members.includes('圓堂')&&move.origin==='原創');
assert.equal(endouOriginal.length,3,'Endou has the approved three defensive combinations');
assert.ok(endouOriginal.every(move=>move.type==='防守'&&move.members.length===3),'Every Endou combination is a three-person defense');
assert.deepEqual(plain(endouOriginal.map(move=>move.name)),['三界神門','雷霆鎮界','永恆聖域']);
assert.ok(endouOriginal.every(move=>JSON.stringify(move.members)===JSON.stringify(['圓堂','西蔭','立向居'])),'Nishikage and Tachimukai amplify Endou in every combination');
assert.ok(endouOriginal.every(move=>move.members[0]==='圓堂'),'Endou leads every newly approved combination');
assert.ok(endouOriginal.every(move=>move.desc.includes('圓堂')),'Descriptions make Endou the amplified finisher');
assert.ok(endouOriginal.every(move=>!['異次元之手','正義的鐵拳','神之捕捉'].some(oldName=>move.name.includes(oldName)||move.desc.includes(oldName))),'The trio produces brand-new moves rather than upgraded solo techniques');
assert.ok(!world.combos.some(move=>['閃電一號','閃電一號落雷','地球之歌','噴射氣流'].includes(move.name)));
assert.deepEqual(plain(world.combos.find(move=>move.name==='閃電爆破').members),['鬼道','風丸','豪炎寺']);
assert.ok(!world.combos.find(move=>move.name==='閃電爆破').members.includes('圓堂'));

for(const file of ['index.html','match.html']){
  const page=boot(file),guide=file==='index.html'?'#canonGuide':'#aCanonGuide';
  const html=page.get(guide).innerHTML;
  for(const name of forbidden)assert.ok(!html.includes('<strong>'+name+'</strong>'),name+' must not appear');
}

console.log(JSON.stringify({endouSkills:endouSkills.length,preZeusMovesRemoved:true,approvedOriginalCombinations:3,allEndouCombinationsThreePersonDefense:true,endouCooperativeShotsRemoved:true},null,2));
