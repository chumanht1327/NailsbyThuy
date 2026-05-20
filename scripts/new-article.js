#!/usr/bin/env node
// Scaffolds a new blog article and patches all 5 required files automatically.
//
// Usage (interactive):
//   node scripts/new-article.js
//
// Usage (flags — skip prompts):
//   node scripts/new-article.js \
//     --slug="my-new-topic" \
//     --title="My New Topic — Austin TX" \
//     --headline="My New Topic Guide from an Austin Nail Artist" \
//     --description="Short meta description 140-160 chars." \
//     --category="Nail Care" \
//     --keywords="keyword1, keyword2, Austin TX" \
//     --excerpt="One paragraph lead-in for the blog card." \
//     --read-time="5 min read" \
//     --og-image="chrome-nails-austin-01-900.webp" \
//     --about="Chrome Nails"
//
// What this script does automatically:
//   1. Creates <slug>.html from _templates/article-template.html
//   2. Appends the 200-rewrite rule to _redirects
//   3. Appends a <url> entry to sitemap.xml
//   4. Adds to blog.html SEED_ARTICLES array + JSON-LD ItemList
//
// What you still need to do manually (printed as a reminder):
//   - Write the actual article content in <slug>.html
//   - Replace the TODO FAQ questions with real ones
//   - Add an Article entry to index.html JSON-LD @graph (if featured in guides grid)

'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);

// ── Parse CLI flags ──────────────────────────────────────────────────────────
function flag(name, def = '') {
  const arg = process.argv.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : def;
}

// ── Interactive prompt ───────────────────────────────────────────────────────
function prompt(rl, question, defaultVal = '') {
  return new Promise(resolve => {
    const q = defaultVal ? `${question} [${defaultVal}]: ` : `${question}: `;
    rl.question(q, answer => resolve(answer.trim() || defaultVal));
  });
}

async function gather() {
  const preSlug = flag('slug');
  if (preSlug && flag('title') && flag('headline') && flag('description') && flag('category')) {
    return {
      slug:        preSlug,
      title:       flag('title'),
      headline:    flag('headline'),
      description: flag('description'),
      category:    flag('category'),
      keywords:    flag('keywords', `${preSlug.replace(/-/g,' ')}, Austin TX`),
      excerpt:     flag('excerpt', flag('description')),
      readTime:    flag('read-time', '5 min read'),
      ogImage:     flag('og-image', 'chrome-nails-austin-01-900.webp'),
      about:       flag('about', 'Nail Care'),
    };
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('\nNew article generator — Nails by Thuy\n');

  const slug        = await prompt(rl, 'Slug (URL path, no slashes)', preSlug || 'my-new-article');
  const title       = await prompt(rl, '<title> tag (under 60 chars)', `${slug.replace(/-/g,' ')} — Nails by Thuy Austin TX`);
  const headline    = await prompt(rl, 'Article headline (h1)', title);
  const description = await prompt(rl, 'Meta description (140-160 chars)');
  const category    = await prompt(rl, 'Category (e.g. Nail Care, Gel Nails, Nail Art)', 'Nail Care');
  const keywords    = await prompt(rl, 'Keywords (comma-separated)', `${slug.replace(/-/g,' ')}, Austin TX`);
  const excerpt     = await prompt(rl, 'Blog card excerpt (1-2 sentences)', description);
  const readTime    = await prompt(rl, 'Read time', '5 min read');
  const ogImage     = await prompt(rl, 'OG image filename from /images/', 'chrome-nails-austin-01-900.webp');
  const about       = await prompt(rl, 'Schema "about" topic (e.g. Chrome Nails)', category);

  rl.close();
  return { slug, title, headline, description, category, keywords, excerpt, readTime, ogImage, about };
}

function toTitleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}, ${y}`;
}

async function main() {
  const fields = await gather();
  const { slug, title, headline, description, category, keywords, excerpt, readTime, ogImage, about } = fields;
  const breadcrumb = toTitleCase(slug);

  // 1. Create article HTML ───────────────────────────────────────────────────
  const templatePath = path.join(ROOT, '_templates', 'article-template.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found: _templates/article-template.html');
    process.exit(1);
  }
  let html = fs.readFileSync(templatePath, 'utf8');
  const replacements = {
    '{{SLUG}}':            slug,
    '{{PAGE_TITLE}}':      title,
    '{{HEADLINE}}':        headline,
    '{{META_DESCRIPTION}}': description,
    '{{OG_TITLE}}':        title,
    '{{OG_DESCRIPTION}}':  description.slice(0, 120),
    '{{OG_IMAGE}}':        ogImage,
    '{{CATEGORY}}':        category,
    '{{KEYWORDS}}':        keywords,
    '{{BREADCRUMB_LABEL}}': breadcrumb,
    '{{EXCERPT}}':         excerpt,
    '{{READ_TIME}}':       readTime,
    '{{DATE}}':            TODAY,
    '{{DATE_DISPLAY}}':    formatDate(TODAY),
    '{{ABOUT_TOPIC}}':     about,
  };
  for (const [k, v] of Object.entries(replacements)) {
    html = html.split(k).join(v);
  }
  const articlePath = path.join(ROOT, `${slug}.html`);
  if (fs.existsSync(articlePath)) {
    console.error(`\nERROR: ${slug}.html already exists. Choose a different slug.`);
    process.exit(1);
  }
  fs.writeFileSync(articlePath, html, 'utf8');
  console.log(`\n✓ Created ${slug}.html`);

  // 2. Append to _redirects ─────────────────────────────────────────────────
  const redirectsPath = path.join(ROOT, '_redirects');
  const redirectLine = `/${slug.padEnd(44)} /${slug}.html${' '.repeat(Math.max(0, 44-slug.length))} 200\n`;
  // Insert before the final wildcard 404 catch-all
  let redirects = fs.readFileSync(redirectsPath, 'utf8');
  const catchAll = '\n# ── 404';
  if (redirects.includes(catchAll)) {
    redirects = redirects.replace(catchAll, redirectLine + catchAll);
  } else {
    redirects += redirectLine;
  }
  fs.writeFileSync(redirectsPath, redirects, 'utf8');
  console.log(`✓ Added redirect: /${slug} → /${slug}.html 200`);

  // 3. Append to sitemap.xml ────────────────────────────────────────────────
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapEntry = `
  <url>
    <loc>https://www.nailsbythuy.com/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;
  sitemap = sitemap.replace('</urlset>', sitemapEntry + '</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`✓ Added to sitemap.xml`);

  // 4. Patch blog.html ──────────────────────────────────────────────────────
  const blogPath = path.join(ROOT, 'blog.html');
  let blog = fs.readFileSync(blogPath, 'utf8');

  // 4a. SEED_ARTICLES: insert before the closing ];
  const seedEntry = `  {
    id: '${slug}',
    slug: '/${slug}',
    category: '${category}',
    title: '${title.replace(/'/g, "\\'")}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    readTime: '${readTime}',
    isStatic: true,
  },\n`;
  blog = blog.replace('\n];', '\n' + seedEntry + '];');

  // 4b. JSON-LD ItemList: increment numberOfItems and append ListItem
  blog = blog.replace(/"numberOfItems": (\d+)/, (_, n) => `"numberOfItems": ${parseInt(n, 10) + 1}`);
  const lastItem = blog.lastIndexOf('"@type": "ListItem"');
  const lastPos  = blog.indexOf('}', lastItem);
  const currentPos = parseInt((blog.match(/"position": (\d+)/g) || []).pop().match(/\d+/)[0], 10);
  const newItem = `,\n        {"@type": "ListItem", "position": ${currentPos + 1}, "name": "${toTitleCase(slug)}", "url": "https://www.nailsbythuy.com/${slug}"}`;
  blog = blog.slice(0, lastPos + 1) + newItem + blog.slice(lastPos + 1);

  fs.writeFileSync(blogPath, blog, 'utf8');
  console.log(`✓ Patched blog.html (SEED_ARTICLES + JSON-LD ItemList, numberOfItems → ${currentPos + 1})`);

  // 5. Print manual reminders ───────────────────────────────────────────────
  console.log(`
─────────────────────────────────────────────
STILL TO DO (manual steps):
  1. Write the article content in ${slug}.html
     Replace all TODO sections with real copy.
  2. Replace FAQ TODO placeholders with real Q&A.
     Also update the JSON-LD FAQPage in the <head>.
  3. Add an Article entry to index.html JSON-LD @graph
     (copy the pattern from an existing Article entry).
─────────────────────────────────────────────
`);
}

main().catch(e => { console.error(e); process.exit(1); });
