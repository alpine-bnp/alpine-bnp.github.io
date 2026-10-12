import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(html, /<html\s+lang="en-GB"/);
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'The page must have one main heading.');
const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Page IDs must be unique.');
const basePath = (process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '');
let checked = 0;
for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
  const ref = match[1];
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue;
  if (ref.startsWith('#')) {
    assert.ok(ids.includes(ref.slice(1)), `Missing page anchor: ${ref}`);
  } else {
    let localPath = decodeURIComponent(ref.split(/[?#]/)[0]).replace(/^\//, '');
    if (basePath) {
      assert.ok(localPath.startsWith(basePath + '/'), `Missing base path: ${ref}`);
      localPath = localPath.slice(basePath.length + 1);
    }
    const target = path.resolve(root, localPath);
    assert.ok(target.startsWith(root), `Asset outside the website: ${ref}`);
    assert.ok(existsSync(target), `Missing asset: ${ref}`);
  }
  checked += 1;
}
for (const name of readdirSync(path.join(root, 'assets'))) {
  if (!name.endsWith('.css')) continue;
  const css = readFileSync(path.join(root, 'assets', name), 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(match[1])) continue;
    assert.ok(existsSync(path.resolve(root, 'assets', match[1])), `Missing CSS asset: ${match[1]}`);
  }
}
console.log(`Checked the one-page website: ${checked} local links/assets, unique anchors and page metadata.`);
