import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SCENERY_ISLANDS,sceneryProjection,courtyardY} from '../src/presentation/OutdoorPainting.js';
import {GROUND_SAMPLES} from '../src/presentation/NaturalGround.js';
import {REGIONS,A3,GROUND} from '../src/world/layout.js';

test('building islands finish inside their area, leaving open scenery at every join',()=>{
  for(const [id,islands]of Object.entries(SCENERY_ISLANDS)){
    const r=REGIONS.find(r=>r.id===id);
    for(const [art,sx,sw,x,scale]of islands){
      const png=readFileSync(new URL(`../public/bg/bg_${art}_dark.png`,import.meta.url));
      assert.ok(sx>=0&&sx+sw<=png.readUInt32BE(16));
      assert.ok(x>=60&&x+sw*scale<=r.width-100,`${id}: roof/house cannot meet a region boundary`);
    }
  }
  const square=REGIONS.find(r=>r.id==='square'),p=sceneryProjection(square);
  assert.equal(p.x+540,square.x+650,'painted clock projection must follow its moved vignette');
});
test('courtyard floor registration is continuous and keeps existing ledge contacts',()=>{
  assert.equal(courtyardY(600),GROUND);
  for(const [,,y]of A3.courtSteps)assert.equal(courtyardY(y+20),y);
  assert.equal(courtyardY(535),515);assert.equal(courtyardY(720),680);
  for(let y=1;y<=720;y++)assert.ok(courtyardY(y)>courtyardY(y-1));
});
test('continuous paving samples avoid the source cliff cutout on both variants',()=>{
  for(const state of ['dark','restored']){
    const png=readFileSync(new URL(`../public/bg/bg_a1_lane_${state}.png`,import.meta.url));
    for(const [x,y,w,h]of Object.values(GROUND_SAMPLES)){
      assert.ok(x>=400,'the source edge cliff begins before the continuous paving');
      assert.ok(x+w<=png.readUInt32BE(16)&&y+h<=png.readUInt32BE(20));
    }
  }
});
