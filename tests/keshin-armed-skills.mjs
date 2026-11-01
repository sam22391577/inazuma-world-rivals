import assert from 'node:assert/strict';
import {boot} from './dom-harness.mjs';

const app=boot('match.html');
const world=app.sandbox.TEAM_DATA.world;
const rival=app.sandbox.TEAM_DATA.rival;
const tenma=world.roster.find(row=>row[0]==='天馬');
const beta=rival.roster.find(row=>row[0]==='貝塔');
const tenmaSkills=app.sandbox.CanonSkills['天馬'].skills;

assert.ok(tenma[2].includes('神凜烈風:射門'));
assert.ok(!tenma[2].includes('神明之風'));
assert.equal(tenmaSkills.filter(skill=>skill.name==='神凜烈風').length,1);
assert.ok(tenmaSkills.find(skill=>skill.name==='神凜烈風').work.includes('化身武裝'));
assert.equal(beta[2].split(',').filter(move=>move==='射門指令07｜雙重射門:射門').length,1);
assert.ok(rival.skillDetails['貝塔']['射門指令07｜雙重射門'].includes('化身武裝'));

console.log(JSON.stringify({tenma:'神凜烈風',beta:'射門指令07｜雙重射門',duplicates:'none'},null,2));
