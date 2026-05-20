#!/usr/bin/env node
// Reads git log to get the last-commit date for each HTML file, then patches
// <lastmod> in sitemap.xml to match.  Run from the repo root:
//   node scripts/update-sitemap.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITEMAP = path.join(ROOT, 'sitemap.xml');

// Map clean-URL slug → HTML file (relative to repo root)
const SLUG_TO_FILE = {
  '':                                 'index.html',
  'services':                         'services.html',
  'blog':                             'blog.html',
  'biab-vs-gel-x':                    'biab-vs-gel-x.html',
  'best-nail-shapes-short-nails':     'best-nail-shapes-short-nails.html',
  'how-long-do-gel-x-nails-last':     'how-long-do-gel-x-nails-last.html',
  'why-private-nail-studios-are-better': 'why-private-nail-studios-are-better.html',
  'chrome-nails-austin':              'chrome-nails-austin.html',
  'gel-x-vs-acrylic':                 'gel-x-vs-acrylic.html',
  'nail-aftercare-tips':              'nail-aftercare-tips.html',
  'how-to-pick-a-nail-color':         'how-to-pick-a-nail-color.html',
  'pedicure-vs-manicure':             'pedicure-vs-manicure.html',
  'nail-vitamins-and-supplements':    'nail-vitamins-and-supplements.html',
  'what-to-eat-for-stronger-nails':   'what-to-eat-for-stronger-nails.html',
  'why-nails-break-and-peel':         'why-nails-break-and-peel.html',
};

function gitLastmod(file) {
  try {
    const date = execSync(
      `git log -1 --format=%cd --date=short -- "${file}"`,
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    return date || null;
  } catch {
    return null;
  }
}

function slugFromLoc(loc) {
  // https://www.nailsbythuy.com/some-slug  →  'some-slug'
  // https://www.nailsbythuy.com/           →  ''
  return loc.replace('https://www.nailsbythuy.com/', '').replace(/\/$/, '');
}

let xml = fs.readFileSync(SITEMAP, 'utf8');
let changed = 0;

xml = xml.replace(
  /(<loc>([^<]+)<\/loc>\s*<lastmod>)([^<]+)(<\/lastmod>)/g,
  (match, open, loc, oldDate, close) => {
    const slug = slugFromLoc(loc.trim());
    const file = SLUG_TO_FILE[slug];
    if (!file) {
      console.warn(`  [skip] No file mapping for slug: "${slug}"`);
      return match;
    }
    const newDate = gitLastmod(file);
    if (!newDate) {
      console.warn(`  [skip] No git history for: ${file}`);
      return match;
    }
    if (newDate !== oldDate) {
      console.log(`  ${file}: ${oldDate} → ${newDate}`);
      changed++;
      return `${open}${newDate}${close}`;
    }
    return match;
  }
);

fs.writeFileSync(SITEMAP, xml, 'utf8');
console.log(`\nDone. ${changed} lastmod date(s) updated in sitemap.xml`);
