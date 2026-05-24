import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'src', 'cli.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'api-snapshot-'));

function run(args) {
  return execFileSync(process.execPath, [cli, ...args], { cwd: tmp, encoding: 'utf8' });
}

const v1 = path.join(tmp, 'v1.json');
const v2 = path.join(tmp, 'v2.json');
fs.writeFileSync(v1, JSON.stringify({ user: { id: 1, name: 'Ada' } }));
fs.writeFileSync(v2, JSON.stringify({ user: { id: 1, name: 'Ada', vip: true } }));

run(['capture', 'v1', v1]);
run(['capture', 'v2', v2]);
const diff = JSON.parse(run(['diff', 'v1', 'v2']));

assert.deepEqual(diff.added, ['user.vip']);
assert.deepEqual(diff.removed, []);

console.log('api-snapshot tests passed');
