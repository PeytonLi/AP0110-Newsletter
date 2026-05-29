# CalCompute Newsletter

Generates a branded HTML email newsletter from a Markdown file.

## Usage

```bash
npm install
npm run build        # writes dist/newsletter.html
```

Open `dist/newsletter.html` in a browser to preview, then send via your email client or ESP.

## Writing a newsletter

Edit `newsletter.md`. Supports optional YAML front-matter at the top:

```markdown
---
title: "CalCompute — Issue 2: Update Title"
preheader: "Short preview text shown in inbox before opening the email."
unsubscribe: "https://your-list-provider.com/unsubscribe/{{id}}"
---

# Your newsletter content here...
```

Supported markdown: headings (h1–h3), paragraphs, bold/italic, lists, blockquotes, horizontal rules, links. Wrap any CTA link in a `<p class="cta">` for centered button styling, e.g.:

```html
<p class="cta"><a href="https://californiacompute.org" class="btn">Request Early Access →</a></p>
```

## Reuse

Drop a new `newsletter.md` and run `npm run build` for each issue. `template.html` is the reusable template — edit it to update branding or layout for all future issues.

## Files

| File | Purpose |
|---|---|
| `template.html` | Master email template (brand, layout, styles) |
| `newsletter.md` | Content for the current issue (overwrite each time) |
| `build.js` | Build script: md → html → juice → dist/ |
| `dist/newsletter.html` | Generated output (send this) |
