const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { marked } = require('marked');
const juice = require('juice');
const path = require('path');

const mdPath = path.join(__dirname, 'newsletter.md');
const templatePath = path.join(__dirname, 'template.html');
const outDir = path.join(__dirname, 'dist');

const raw = readFileSync(mdPath, 'utf8');

// Parse optional YAML front-matter (--- key: value ---)
let fm = {};
let content = raw;
if (raw.startsWith('---')) {
  const end = raw.indexOf('\n---', 3);
  if (end !== -1) {
    raw.slice(3, end).trim().split('\n').forEach(line => {
      const colon = line.indexOf(':');
      if (colon !== -1) {
        const k = line.slice(0, colon).trim();
        const v = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
        fm[k] = v;
      }
    });
    content = raw.slice(end + 4).trim();
  }
}

const htmlContent = marked.parse(content);
const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const title = fm.title || 'CalCompute Newsletter';
const preheader = fm.preheader || title;

let template = readFileSync(templatePath, 'utf8');
template = template
  .replace('{{TITLE}}', title)
  .replace('{{DATE}}', date)
  .replace('{{PREHEADER}}', preheader)
  .replace('<!-- CONTENT -->', htmlContent)
  .replace('{{UNSUBSCRIBE}}', fm.unsubscribe || '#');

// juice (via cheerio) double-escapes HTML entities — restore them
const inlined = juice(template).replace(/&amp;([#a-zA-Z][a-zA-Z0-9]*;)/g, '&$1');

mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'newsletter.html'), inlined, 'utf8');
console.log('Built: dist/newsletter.html');
