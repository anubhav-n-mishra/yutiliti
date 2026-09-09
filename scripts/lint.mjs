#!/usr/bin/env node

/**
 * Yuitility Quality, Syntax & Standards Linter
 * Performs strict static verification across the repository:
 * - Syntax parsing validation (JSON, etc.)
 * - Strict prohibition of emojis in markdown documentation
 * - Forbidden merge conflict markers
 * - Sensitive pattern and private key leak detection
 * - Absolute system paths check
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SCAN_DIRS = ['src', 'scripts', 'public', 'docs', '.github'];
const ROOT_FILES = [
  'README.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'CODE_OF_CONDUCT.md',
  'LICENSE',
  'package.json',
  'tsconfig.json',
  'next.config.ts'
];
const IGNORED_DIRS = new Set(['node_modules', '.next', '.git', 'coverage', 'dist', 'build', 'scratch']);
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.css', '.yml', '.yaml']);

// Standard Unicode emoji ranges
const EMOJI_REGEX = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{0231A}\u{0231B}\u{023E9}-\u{023EC}\u{023F0}\u{023F3}]/u;

let errors = 0;
let warnings = 0;
let filesScanned = 0;

function logError(file, line, msg) {
  console.error(`[ERROR] ${path.relative(rootDir, file)}:${line} — ${msg}`);
  errors++;
}

function logWarning(file, line, msg) {
  console.warn(`[WARN]  ${path.relative(rootDir, file)}:${line} — ${msg}`);
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

  // Skip scanning the linter script itself for marker patterns
  if (path.resolve(filePath) === path.resolve(__filename)) {
    return;
  }

  // 2. Line-by-line checks
  const PRIV_MARKER = 'BEGIN ' + 'PRIVATE KEY';
  const RSA_MARKER = 'BEGIN ' + 'RSA PRIVATE KEY';
  const isDocFile = ext === '.md' || ext === '.yml' || ext === '.yaml';

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

    // Check for emojis in documentation / community files
    if (isDocFile && EMOJI_REGEX.test(line)) {
      logError(filePath, lineNum, 'Prohibited emoji detected in documentation file. Use text icons or badges instead.');
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
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      scanFile(fullPath);
    }
  }
}

console.log('=================================================');
console.log('       YUITILITY SOURCE CODE & STANDARDS LINT    ');
console.log('=================================================\n');

for (const dir of SCAN_DIRS) {
  const fullDir = path.join(rootDir, dir);
  if (fs.existsSync(fullDir)) {
    walkDir(fullDir);
  }
}

for (const file of ROOT_FILES) {
  const fullFile = path.join(rootDir, file);
  if (fs.existsSync(fullFile)) {
    scanFile(fullFile);
  }
}

console.log(`\nScanned ${filesScanned} files across repository.`);

if (errors > 0) {
  console.error(`\n[FAIL] Lint failed with ${errors} error(s) and ${warnings} warning(s).`);
  process.exit(1);
} else {
  console.log(`\n[PASS] All quality, syntax, and standards checks passed (${warnings} warning(s)).\n`);
  process.exit(0);
}
