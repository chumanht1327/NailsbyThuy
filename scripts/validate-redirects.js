#!/usr/bin/env node
// Validates _redirects: checks every blog article rule targets an existing file
// and that the canonical URL in that file matches the slug.
//
// Usage: node scripts/validate-redirects.js

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REDIRECTS = path.join(ROOT, '_redirects');
const lines = fs.readFileSync(REDIRECTS, 'utf8').split('\n');

let errors = 0;
let checked = 0;

for (const raw of lines) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;

  // Only check 200-rewrite blog article rules (not section shortcuts or social links)
  const parts = line.split(/\s+/);
  if (parts.length < 3 || parts[2] !== '200') continue;
  const [slug, target] = parts;
  if (!target.endsWith('.html')) continue;

  // Skip non-article pages (services, blog hub)
  const targetFile = path.join(ROOT, target.replace(/^\//, ''));
  if (!fs.existsSync(targetFile)) {
    console.error(`✗ MISSING FILE: "${slug}" → "${target}" — file not found`);
    errors++;
    continue;
  }

  const content = fs.readFileSync(targetFile, 'utf8');

  // Check canonical URL matches the slug
  const canonicalMatch = content.match(/rel="canonical" href="https:\/\/www\.nailsbythuy\.com([^"]+)"/);
  if (!canonicalMatch) {
    console.error(`✗ NO CANONICAL: ${target}`);
    errors++;
    continue;
  }
  const canonicalPath = canonicalMatch[1];
  if (canonicalPath !== slug) {
    console.error(`✗ CANONICAL MISMATCH: redirect slug "${slug}" ≠ canonical "${canonicalPath}" in ${target}`);
    errors++;
    continue;
  }

  console.log(`✓ ${slug}`);
  checked++;
}

console.log(`\n${checked} redirects OK, ${errors} error(s).`);
if (errors > 0) process.exit(1);
