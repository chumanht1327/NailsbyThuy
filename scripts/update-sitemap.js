#!/usr/bin/env node
// Reads git log to get the last-commit date for each HTML file, then patches
// <lastmod> in sitemap.xml to match.  Run from the repo root:
//   node scripts/update-sitemap.js
//
// Slug → file resolution is automatic: slug.html if the file exists, index.html
// for the root. No hardcoded map — new articles added to sitemap.xml are picked
// up automatically as long as the matching .html file exists.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITEMAP = path.join(ROOT, 'sitemap.xml');

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

function fileFromSlug(slug) {
  if (slug === '') return 'index.html';
  const candidate = slug + '.html';
  return fs.existsSync(path.join(ROOT, candidate)) ? candidate : null;
}

let xml = fs.readFileSync(SITEMAP, 'utf8');
let changed = 0;

xml = xml.replace(
  /(<loc>([^<]+)<\/loc>\s*<lastmod>)([^<]+)(<\/lastmod>)/g,
  (match, open, loc, oldDate, close) => {
    const slug = slugFromLoc(loc.trim());
    const file = fileFromSlug(slug);
    if (!file) {
      console.warn(`  [skip] No .html file found for slug: "${slug}"`);
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
