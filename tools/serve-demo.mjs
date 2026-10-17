// Serve an isolated copy of the last production build; source edits/builds do not
// reload or change a teammate's playtest. Stop with Ctrl+C when finished.
import { createServer } from 'node:http';
import { mkdtemp, cp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../dist/', import.meta.url));
await stat(join(source, 'index.html'));
const root = await mkdtemp(join(tmpdir(), 'embers-playtest-'));
await cp(source, root, { recursive: true });
const port = Number(process.argv[2] || process.env.DEMO_PORT || 4176);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const target = resolve(root, pathname === '/' ? 'index.html' : '.' + pathname);
    if (target !== root && !target.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(body);
  } catch { response.writeHead(404).end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Stable playtest: http://127.0.0.1:${port}/\nSnapshot: ${root}\nSource edits and subsequent builds will not change this demo.`));
