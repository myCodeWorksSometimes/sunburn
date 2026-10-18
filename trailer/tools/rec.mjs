// Records scripted gameplay segments from headless Chrome via CDP screencast.
// Usage: node rec.mjs <outDir> [segmentName...]
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2];
const ONLY = process.argv.slice(3);
const ORIGIN = 'http://localhost:4190';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9334;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const base = { version: 3, hasLantern: true, completedStory: { 'home-first-memory': true }, clearedEncounters: {}, health: 3, flame: 100, oil: 1 };
const act1Done = { maraFreed: true, villageGateOpen: true, heardNia: true, heardTomas: true, bridgeBrakeSet: true, bridgeReturnOpen: true, campReturnOpen: true,
  clearedEncounters: { 'five-hand': true, 'braced-shadow': true }, completedStory: { 'home-first-memory': true, 'act-1': true } };
const act2Done = { ...act1Done, swingReturnOpen: true, hasDrawing: true, canalGateOpen: true, canalReturnOpen: true,
  completedStory: { ...act1Done.completedStory, 'act-2': true } };
const withEmber = { ...act2Done, eliFound: true, oldRoadOpen: true, hasHearthEmber: true, homeMemorySpent: true,
  completedStory: { ...act2Done.completedStory, 'act-3': true, 'eli-found': true, 'eli-taps': true } };
const save = (cp, extra = {}) => ({ ...base, ...extra, checkpoint: { scene: 'World', spawnId: cp } });

// Page-side helpers, injected before every scenario.
const HELPERS = `
const K = {ArrowLeft:37,ArrowRight:39,Space:32,KeyE:69,Enter:13,KeyF:70,KeyR:82};
const kn = c => c==='Space'?' ':c.replace('Key','').replace('Arrow','');
window.down = c => window.dispatchEvent(new KeyboardEvent('keydown', {code:c, key:kn(c), keyCode:K[c], which:K[c]}));
window.up = c => window.dispatchEvent(new KeyboardEvent('keyup', {code:c, key:kn(c), keyCode:K[c], which:K[c]}));
window.sleep = ms => new Promise(r => setTimeout(r, ms));
window.press = async (c, ms = 80) => { down(c); await sleep(ms); up(c); };
window.re = () => { window.W = game.scene.getScene('World'); window.P = W.player; };
window.land = async () => { for (let i = 0; i < 80; i++) { await sleep(25); if (i > 6 && P.body.blocked.down) break; } };
window.walkTo = async (x, max = 900) => { const dir = x > P.x ? 'ArrowRight' : 'ArrowLeft'; down(dir); let t = 0; while ((dir === 'ArrowRight' ? P.x < x : P.x > x) && t++ < max) await sleep(16); up(dir); await sleep(60); };
window.hop = async (dir = 'ArrowRight', ms = 250) => { if (dir) down(dir); down('Space'); await sleep(120); up('Space'); await sleep(ms); if (dir) up(dir); await land(); };
window.holdE = async ms => { down('KeyE'); await sleep(ms); up('KeyE'); };
window.rest = async () => { const R = c => window.dispatchEvent(new KeyboardEvent(c, { code: 'KeyR', key: 'R', keyCode: 82, which: 82 })); R('keydown'); await sleep(2300); R('keyup'); };
window.fight = async (kind, ms) => { const t0 = performance.now(); while (performance.now() - t0 < ms) { const e = W.enemies.find(e => e.active && e.alive && (!kind || e.kind === kind)); if (!e) break; if (Math.abs(e.x - P.x) > 70) await walkTo(e.x + (e.x > P.x ? -55 : 55), 60); P.setFlipX(e.x < P.x); await press('KeyF'); await sleep(420); } };
`;

const SEGMENTS = {
  yard: [save('front'), `await sleep(600); await walkTo(480); await sleep(300); await press('KeyE'); await sleep(2200); await walkTo(1400); await sleep(400);`],
  lane: [save('lane', { completedStory: { 'home-first-memory': true, 'act-1': true } }), `await sleep(400); await press('KeyE'); await sleep(2000); await walkTo(2300); await fight(null, 5000); await walkTo(3000); await sleep(300);`],
  fivehand: [save('square', { maraFreed: true, completedStory: { 'home-first-memory': true, 'act-1': true, 'mara-knock': true, 'mara-freed': true } }),
    `await sleep(400); await press('KeyE'); await sleep(1500); await walkTo(4300); await fight(null, 16000); await sleep(800);`],
  bridge: [save('bridge', { ...act1Done, bridgeReturnOpen: false, campReturnOpen: false }), `await sleep(400); await press('KeyE'); await sleep(2000); await walkTo(8150); await sleep(600);`],
  swing: [save('playground', act1Done), `await sleep(400); await press('KeyE'); await sleep(900);
    await walkTo(9690); let t0 = performance.now(), last = 1e9;
    while (performance.now() - t0 < 8000) { const x = W.swingPlatform.zone.x; if (x < 9845 && x < last) break; last = x; await sleep(10); }
    down('ArrowRight'); down('Space'); await sleep(120); up('Space'); await land(); up('ArrowRight');
    t0 = performance.now(); while (!(W.swingPlatform.zone.x > 9990) && performance.now() - t0 < 8000) await sleep(50);
    down('ArrowRight'); down('Space'); await sleep(120); up('Space'); await land(); await sleep(900); up('ArrowRight'); await sleep(400);`],
  treehouse: [save('treehouse', { ...act1Done, swingReturnOpen: true }), `await sleep(400); await press('KeyE'); await sleep(1200);
    await walkTo(10610); await hop('ArrowRight', 300); await hop('ArrowRight', 300); await hop('ArrowRight', 300);
    await walkTo(11140); await sleep(200); await press('KeyE'); await sleep(3000);`],
  canal: [save('canal', { ...act1Done, swingReturnOpen: true, hasDrawing: true }), `await sleep(400); await press('KeyE'); await sleep(1200);
    await walkTo(12270); await hop('ArrowRight', 250); await hop('ArrowRight', 200); await walkTo(12450); await holdE(1100); await sleep(800);
    await walkTo(12492); down('ArrowRight'); let t = 0; while (P.x < 13000 && t++ < 400) await sleep(16); up('ArrowRight'); await sleep(500);`],
  knock: [save('canalBank', act2Done), `await sleep(300); await walkTo(14230); await sleep(300); await press('KeyE'); await sleep(6500);`],
  bells: [save('courtyard', withEmber), `await sleep(300); await press('KeyE'); await sleep(1200);
    await walkTo(14015); await hop('ArrowRight', 200); await hop('ArrowRight', 250); await walkTo(14370); await hop(null);
    await walkTo(14560); await holdE(900); await sleep(2200);`],
  mechanisms: [save('mechanisms', { ...withEmber, litFinaleLamps: { 'tower-relay-1': true } }), `await sleep(300); await press('KeyE'); await sleep(1200);
    await walkTo(15025); await hop('ArrowRight', 150); await hop('ArrowRight', 150); await hop('ArrowRight', 200);
    await walkTo(15465); await holdE(900); await sleep(2000);`],
  warden: [save('crown', { ...withEmber, litFinaleLamps: { 'tower-relay-1': true, 'tower-relay-2': true, 'tower-relay-3': true },
      clearedEncounters: { ...withEmber.clearedEncounters, 'tower-pouncer': true, 'court-crawler': true } }),
    `await sleep(300); await walkTo(16650); await fight('warden', 14000); await sleep(1200);`],
  rescue: [save('crown', { ...withEmber, litFinaleLamps: { 'tower-relay-1': true, 'tower-relay-2': true, 'tower-relay-3': true },
      clearedEncounters: { ...withEmber.clearedEncounters, 'tower-pouncer': true, 'court-crawler': true, 'bell-warden': true } }),
    `await sleep(300); await press('KeyE'); await sleep(800); await walkTo(16735); await hop('ArrowRight', 150); await hop('ArrowRight', 150); await hop('ArrowRight', 200);
    await walkTo(16985); await holdE(1200); await sleep(3500); await walkTo(17200); await sleep(4500);`],
};

async function cdpConnect(wsUrl) {
  const ws = new WebSocket(wsUrl); let id = 0; const pending = new Map(); const listeners = [];
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result); } else listeners.forEach(l => l(msg)); };
  return { send: (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }), on: l => listeners.push(l), close: () => ws.close() };
}

const prof = path.join(OUT, 'profile');
const chrome = spawn(CHROME, ['--window-position=-3000,0', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--window-size=1280,720', '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--use-angle=d3d11', '--enable-gpu', 'about:blank'], { stdio: 'ignore' });
await sleep(2000);
const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${ORIGIN}`, { method: 'PUT' })).json();
const cdp = await cdpConnect(target.webSocketDebuggerUrl);
await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
const evaluate = async (expr, timeout = 90000) => { const r = await cdp.send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true, timeout }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; };

let frames = [], capturing = false;
cdp.on(msg => { if (msg.method === 'Page.screencastFrame') { const { data, metadata, sessionId } = msg.params; cdp.send('Page.screencastFrameAck', { sessionId }); if (capturing) frames.push({ t: metadata.timestamp, data }); } });

for (const [name, [state, script]] of Object.entries(SEGMENTS)) {
  if (ONLY.length && !ONLY.includes(name)) continue;
  await cdp.send('Page.navigate', { url: ORIGIN + '/' }); await sleep(1500);
  await evaluate(`if (window.game && game.destroy) game.destroy(true); localStorage.setItem('embers-before-three-acts-v1', ${JSON.stringify(JSON.stringify(state))});`);
  await cdp.send('Page.navigate', { url: ORIGIN + '/' }); await sleep(2500);
  await evaluate(HELPERS + `let t = 0; while (!(window.game && game.scene && game.scene.isActive('Title')) && t++ < 150) await sleep(100); await sleep(500); await press('Enter');
    t = 0; while (!game.scene.isActive('World') && t++ < 150) await sleep(100); await sleep(1200); re(); for (let i = 0; i < 3; i++) { await press('Enter'); await sleep(150); }`);
  frames = []; capturing = true;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 1280, maxHeight: 720, everyNthFrame: 1 });
  let err = null;
  try { await evaluate(HELPERS + 're();' + script); } catch (e) { err = e.message; }
  await sleep(300); capturing = false; await cdp.send('Page.stopScreencast');
  const dir = path.join(OUT, name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let list = '';
  frames.forEach((f, i) => { const file = `f${String(i).padStart(5, '0')}.jpg`; fs.writeFileSync(path.join(dir, file), Buffer.from(f.data, 'base64'));
    const d = i + 1 < frames.length ? frames[i + 1].t - f.t : 1 / 30; list += `file '${file}'\nduration ${Math.max(0.001, d).toFixed(4)}\n`; });
  if (frames.length) list += `file 'f${String(frames.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(path.join(dir, 'list.txt'), list);
  const dur = frames.length ? (frames.at(-1).t - frames[0].t).toFixed(1) : 0;
  if (frames.length) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-vf', 'fps=30,scale=1280:720:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', path.join(OUT, name + '.mp4')], { cwd: dir });
  const state2 = await evaluate(`const s = game.registry.get('worldState'); return { x: Math.round(game.scene.getScene('World').player.x), obj: s.objective, hp: s.health };`).catch(() => null);
  console.log(name, 'frames', frames.length, 'dur', dur, err ? 'ERR ' + err : '', JSON.stringify(state2));
}
cdp.close(); chrome.kill();
