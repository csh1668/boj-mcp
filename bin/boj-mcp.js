#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const entryPath = path.resolve(__dirname, '..', 'dist', 'index.js');
const entryUrl = pathToFileURL(entryPath);

try {
  await import(entryUrl.href);
} catch (error) {
  console.error(error);
  process.exit(1);
}

