#!/usr/bin/env node
// Stamps shared fragments into all article pages.
// Run whenever nav or tokens change: node scripts/stamp.js
//
// Markers used:
//   <!-- NAV:START --> ... <!-- NAV:END -->  in article HTML files
//
// Usage:
//   node scripts/stamp.js          # stamp nav into all article pages
//   node scripts/stamp.js --check  # dry-run, report which files would change

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const NAV_FRAGMENT = path.join(ROOT, '_fragments', 'nav-article.html');
const navHtml = fs.readFileSync(NAV_FRAGMENT, 'utf8').trimEnd();

const ARTICLE_PAGES = [
  'biab-vs-gel-x.html',
  'best-nail-shapes-short-nails.html',
  'how-long-do-gel-x-nails-last.html',
  'why-private-nail-studios-are-better.html',
  'chrome-nails-austin.html',
  'gel-x-vs-acrylic.html',
  'nail-aftercare-tips.html',
  'how-to-pick-a-nail-color.html',
  'pedicure-vs-manicure.html',
  'nail-vitamins-and-supplements.html',
  'what-to-eat-for-stronger-nails.html',
  'why-nails-break-and-peel.html',
];

const NAV_RE = /<!-- NAV:START -->[\s\S]*?<!-- NAV:END -->/;

let changed = 0;
for (const file of ARTICLE_PAGES) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  SKIP (not found): ${file}`);
    continue;
  }
  const original = fs.readFileSync(filePath, 'utf8');
  if (!NAV_RE.test(original)) {
    console.warn(`  SKIP (no NAV markers): ${file}`);
    continue;
  }
  const replacement = `<!-- NAV:START -->\n${navHtml}\n<!-- NAV:END -->`;
  const updated = original.replace(NAV_RE, replacement);
  if (updated === original) {
    console.log(`  OK (unchanged): ${file}`);
  } else if (CHECK) {
    console.log(`  WOULD UPDATE: ${file}`);
    changed++;
  } else {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`  UPDATED: ${file}`);
    changed++;
  }
}

if (CHECK) {
  console.log(`\n${changed} file(s) would be updated.`);
} else {
  console.log(`\nDone. ${changed} file(s) updated.`);
}
