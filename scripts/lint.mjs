#!/usr/bin/env node

/**
 * Yuitility Quality & Syntax Linter
 * Performs fast static verification across the repository:
 * - Syntax parsing validation
 * - Forbidden merge conflict markers
 * - Sensitive pattern / secret leak detection
 * - Absolute system paths check
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SCAN_DIRS = ['src', 'scripts', 'public', 'docs'];
const IGNORED_DIRS = new Set(['node_modules', '.next', '.git', 'coverage', 'dist', 'build']);
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.css']);

let errors = 0;
let warnings = 0;
let filesScanned = 0;

function logError(file, line, msg) {
  console.error(`❌ [ERROR] ${path.relative(rootDir, file)}:${line} — ${msg}`);
  errors++;
}

function logWarning(file, line, msg) {
  console.warn(`⚠️  [WARN] ${path.relative(rootDir, file)}:${line} — ${msg}`);
  warnings++;
}

function scanFile(filePath) {
  filesScanned++;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const ext = path.extname(filePath);

  // 1. Validate JSON syntax
  if (ext === '.json') {
    try {
      JSON.parse(content);
    } catch (err) {
      logError(filePath, 1, `Invalid JSON syntax: ${err.message}`);
    }
  }

  // Skip scanning the linter script itself
  if (path.resolve(filePath) === path.resolve(__filename)) {
    return;
  }

  // 2. Line-by-line checks
  const PRIV_MARKER = 'BEGIN ' + 'PRIVATE KEY';
  const RSA_MARKER = 'BEGIN ' + 'RSA PRIVATE KEY';
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    // Check for git merge conflict markers
    if (/^(<{7}|={7}|>{7})(\s|$)/.test(line)) {
      logError(filePath, lineNum, 'Found unresolved git merge conflict marker');
    }

    // Check for private keys
    if (line.includes(PRIV_MARKER) || line.includes(RSA_MARKER)) {
      logError(filePath, lineNum, 'Potential private key detected');
    }

    // Check for local file system absolute path leak in client code
    if (filePath.includes(path.sep + 'src' + path.sep)) {
      if (/[A-Za-z]:\\[Uu]sers\\/.test(line) || /\/Users\/[a-zA-Z0-9_-]+\//.test(line)) {
        logWarning(filePath, lineNum, 'Detected local developer machine absolute path in source code');
      }
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      scanFile(fullPath);
    }
  }
}

console.log('=================================================');
console.log('       YUITILITY SOURCE CODE & SYNTAX LINT       ');
console.log('=================================================\n');

for (const dir of SCAN_DIRS) {
  const fullDir = path.join(rootDir, dir);
  if (fs.existsSync(fullDir)) {
    walkDir(fullDir);
  }
}

console.log(`\nScanned ${filesScanned} files across repository.`);

if (errors > 0) {
  console.error(`\n❌ Lint failed with ${errors} error(s) and ${warnings} warning(s).`);
  process.exit(1);
} else {
  console.log(`\n✓ All lint and syntax checks passed (${warnings} warning(s)).\n`);
  process.exit(0);
}
