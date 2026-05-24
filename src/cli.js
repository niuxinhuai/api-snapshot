#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dir = '.api-snapshots';

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`api-snapshot

Usage:
  api-snapshot capture <name> <url-or-json-file>
  api-snapshot diff <old-name> <new-name>
  api-snapshot list
`);
  process.exit(0);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

async function load(input) {
  if (/^https?:\/\//.test(input)) {
    const response = await fetch(input);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  }
  return JSON.parse(fs.readFileSync(input, 'utf8'));
}

function flatten(value, prefix = '') {
  if (!value || typeof value !== 'object') return { [prefix || '$']: typeof value };
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    Object.assign(out, flatten(child, prefix ? `${prefix}.${key}` : key));
  }
  return out;
}

const command = args[0];
if (command === 'capture') {
  const [, name, input] = args;
  if (!name || !input) throw new Error('capture requires <name> and <url-or-json-file>');
  fs.mkdirSync(dir, { recursive: true });
  const data = stable(await load(input));
  const file = path.join(dir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ capturedAt: new Date().toISOString(), data }, null, 2));
  console.log(`Saved ${file}`);
} else if (command === 'diff') {
  const [, oldName, newName] = args;
  const oldData = JSON.parse(fs.readFileSync(path.join(dir, `${oldName}.json`), 'utf8')).data;
  const newData = JSON.parse(fs.readFileSync(path.join(dir, `${newName}.json`), 'utf8')).data;
  const oldFlat = flatten(oldData);
  const newFlat = flatten(newData);
  const added = Object.keys(newFlat).filter((key) => !(key in oldFlat));
  const removed = Object.keys(oldFlat).filter((key) => !(key in newFlat));
  const changed = Object.keys(newFlat).filter((key) => key in oldFlat && newFlat[key] !== oldFlat[key]);
  console.log(JSON.stringify({ added, removed, changedTypes: changed }, null, 2));
} else if (command === 'list') {
  if (!fs.existsSync(dir)) process.exit(0);
  console.log(fs.readdirSync(dir).filter((file) => file.endsWith('.json')).join('\n'));
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
