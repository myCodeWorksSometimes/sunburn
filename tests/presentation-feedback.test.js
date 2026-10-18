import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {ECHO_FAREWELL_MS,echoStage} from '../src/systems/EchoDissolution.js';
import {BOSS_PROFILES,BOSS_EVENTS,BOSS_AUDIO_FILES} from '../src/systems/BossAudio.js';
import {createHash} from 'node:crypto';

test('Mara farewell leaves time to recognize bones before wind carries ash',()=>{
  assert.equal(ECHO_FAREWELL_MS,8000);
  assert.equal(echoStage(1000).frame,0);
  assert.deepEqual(echoStage(4000),{frame:2,next:2,mix:0,ash:0});
  assert.equal(echoStage(5700).ash,0);
  assert.ok(echoStage(6500).ash>0);
  assert.deepEqual(echoStage(8000),{frame:4,next:5,mix:1,ash:1});
});

test('boss sets ship separate recorded event performances and original scores',()=>{
  for(const file of BOSS_AUDIO_FILES)assert.ok(existsSync(new URL(`../public/audio/${file}.ogg`,import.meta.url)),file);
  for(const p of BOSS_PROFILES){
    const hashes=BOSS_EVENTS.map(e=>createHash('sha256').update(readFileSync(new URL(`../public/audio/${p}-${e}.ogg`,import.meta.url))).digest('hex'));
    assert.equal(new Set(hashes).size,BOSS_EVENTS.length,`${p} may not reuse one file for all events`);
  }
});

test('bundled dialogue manifest resolves exact speaker/text lines and its child memory cue',()=>{
  const lines=JSON.parse(readFileSync(new URL('../public/voices/manifest.json',import.meta.url)));
  assert.ok(lines['Rowan|Eli?']);assert.ok(lines['@eli-chuckle']);
  for(const path of Object.values(lines))assert.ok(existsSync(new URL(`../public/${path}`,import.meta.url)),path);
  for(const who of ['Rowan','Eli','Mara','Tomas','Nia'])assert.ok(Object.keys(lines).some(k=>k.startsWith(`${who}|`)||k.startsWith(`Echo ${who}|`)),who);
});
