import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const data = JSON.parse(readFileSync(root + 'content/workshop.json', 'utf8'));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Copy blocks keep editorial text separate from the fixed page layout.
const readCopy = path => {
  const blocks = new Map();
  let key = null;
  let lines = [];
  const finish = () => {
    if (key === null) return;
    const value = lines.join('\n').trim();
    if (!value) throw new Error(`Empty text block "${key}" in ${path}`);
    blocks.set(key, value.replace(/\s*\n\s*/g, ' '));
  };
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const heading = /^## ([a-z0-9]+(?:-[a-z0-9]+)*)\s*$/.exec(line);
    if (heading) {
      finish();
      key = heading[1];
      if (blocks.has(key)) throw new Error(`Duplicate text block "${key}" in ${path}`);
      lines = [];
    } else if (key !== null) {
      if (/^##/.test(line)) throw new Error(`Invalid text block heading in ${path}: ${line}`);
      lines.push(line);
    } else if (line.trim() && !/^# /.test(line)) {
      throw new Error(`Unexpected text before the first block in ${path}`);
    }
  }
  finish();
  return blocks;
};
const copy = readCopy(root + 'content/page.md');
const raw = key => {
  if (!copy.has(key)) throw new Error(`Missing text block "${key}" in content/page.md`);
  return copy.get(key);
};
const text = key => escape(raw(key));
// Check every expected block, including text used only once details are confirmed.
const requiredCopy = ["document-title", "document-description", "skip-link", "brand-name", "brand-year", "menu-label", "menu-close-label", "programme-heading", "venue-navigation", "registration-heading", "contact-navigation", "hero-title", "hero-subtitle", "hero-dates", "hero-location", "hero-region", "hero-photo-description", "about-heading", "about-introduction", "about-paragraph-one", "about-paragraph-two", "programme-note", "speaker-pending", "abstracts-link", "abstracts-pending", "venue-heading", "venue-introduction", "venue-photo-description", "getting-there", "hiking-emphasis", "hiking-paragraph", "accommodation", "monday-routes", "weather-note", "registration-introduction", "registration-details", "registration-link", "registration-pending", "committee-heading", "committee-pending", "contact-introduction", "contact-pending", "footer-identity", "back-to-top", "supporter-introduction", "photography-introduction", "photography-by", "photography-note", "label-registration-fee", "label-registration-inclusions", "label-registration-deadline", "label-application-deadline", "label-payment", "label-cancellation", "label-hiking-distance", "label-hiking-elevation", "label-hiking-time", "label-hiking-difficulty", "label-hiking-footwear", "label-hiking-equipment"];
for (const key of requiredCopy) raw(key);
for (const key of copy.keys()) {
  if (!requiredCopy.includes(key)) throw new Error(`Unknown text block "${key}" in content/page.md`);
}
// A repository Pages site can use BASE_PATH=/repository-name; a user or
// organisation Pages site uses an empty BASE_PATH. No hosting is activated here.
const inputBasePath = process.env.BASE_PATH || '';
if (inputBasePath && (!/^\/?[A-Za-z0-9._/-]+\/?$/.test(inputBasePath) || inputBasePath.split('/').some(part => part === '.' || part === '..'))) {
  throw new Error('BASE_PATH must be a site path such as /alpine-bnp-2027');
}
const basePath = inputBasePath.replace(/^\/+|\/+$/g, '');
const withBasePath = html => html.replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attribute, path) => `${attribute}="/${basePath ? basePath + '/' : ''}${path}"`);

const link = value => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? escape(url.href) : null; }
  catch { return null; }
};
const registrationFields = [[raw('label-registration-fee'), 'fee'], [raw('label-registration-inclusions'), 'inclusions'], [raw('label-registration-deadline'), 'registrationDeadline'], [raw('label-application-deadline'), 'applicationDeadline'], [raw('label-payment'), 'paymentInstructions'], [raw('label-cancellation'), 'cancellationPolicy']];
const hikingFields = [[raw('label-hiking-distance'), 'distance'], [raw('label-hiking-elevation'), 'elevationGain'], [raw('label-hiking-time'), 'hikingTime'], [raw('label-hiking-difficulty'), 'difficulty'], [raw('label-hiking-footwear'), 'footwear'], [raw('label-hiking-equipment'), 'equipment']];
const confirmedFields = (fields, values) => fields.filter(([, key]) => values[key]).map(([label, key]) => `<div><dt>${escape(label)}</dt><dd>${escape(values[key])}</dd></div>`).join('');
const hikingDetails = confirmedFields(hikingFields, data.hiking);
const registrationDetails = confirmedFields(registrationFields, data.registration);
const organisers = data.organisers.filter(o => o.name);
const supporters = data.supporters.filter(s => s.confirmed);
const email = data.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail) ? data.contactEmail : null;

function eventRow(event) {
  const talks = (event.talks || []).filter(t => t.speaker || t.title).map(t => `<p class="talk">${escape(t.speaker || raw('speaker-pending'))}${t.title ? ` · ${escape(t.title)}` : ''}</p>`).join('');
  return `<li><span class="period">${escape(event.period)}</span><div><span class="event-title">${escape(event.title)}</span>${event.description ? `<p class="event-description">${escape(event.description)}</p>` : ''}${talks}</div></li>`;
}

const html = `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${text('document-title')}</title>
  <meta name="description" content="${text('document-description')}">
  <meta name="theme-color" content="#244d43">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='5' fill='%23244d43'/%3E%3Cpath d='M5 31 17 9l8 15 4-7 7 14H5Z' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="/assets/site.css">
  <script src="/assets/site.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">${text('skip-link')}</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="#top">${text('brand-name')} <span>${text('brand-year')}</span></a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="navigation" data-close-label="${text('menu-close-label')}">${text('menu-label')}</button>
      <nav id="navigation" aria-label="Main navigation">
        <a href="#programme">${text('programme-heading')}</a>
        <a href="#venue">${text('venue-navigation')}</a>
        <a href="#registration">${text('registration-heading')}</a>
        <a href="#contact">${text('contact-navigation')}</a>
      </nav>
    </div>
  </header>
  <main id="main">
    <div class="wrap hero" id="top">
      <div class="hero-heading">
        <div>
          <h1>${text('hero-title')}</h1>
          <p class="subtitle">${text('hero-subtitle')}</p>
        </div>
        <p class="event-meta"><strong>${text('hero-dates')}</strong><br>${text('hero-location')}<br>${text('hero-region')}</p>
      </div>
      <img class="hero-photo" src="/assets/hero.jpg" width="1920" height="1080" alt="${text('hero-photo-description')}" fetchpriority="high">
    </div>

    <div class="wrap page-content">
      <section class="section intro" id="about" aria-labelledby="about-title">
        <h2 id="about-title">${text('about-heading')}</h2>
        <div class="section-content prose">
          <p class="lead">${text('about-introduction')}</p>
          <p>${text('about-paragraph-one')}</p>
          <p>${text('about-paragraph-two')}</p>
        </div>
      </section>

      <section class="section" id="programme" aria-labelledby="programme-title">
        <h2 id="programme-title">${text('programme-heading')}</h2>
        <div class="section-content">
          <p class="section-note">${text('programme-note')}</p>
          <div class="schedule">${data.days.map(d => `
            <div class="schedule-day">
              <p class="day-date"><strong>${escape(d.name)}</strong><span>${escape(d.date.replace(' 2027', ''))}</span></p>
              <ul class="event-list">${d.events.map(eventRow).join('')}</ul>
            </div>`).join('')}
          </div>
          ${link(data.abstractsUrl) ? `<p class="after-schedule"><a href="${link(data.abstractsUrl)}">${text('abstracts-link')}</a></p>` : `<p class="section-note after-schedule">${text('abstracts-pending')}</p>`}
        </div>
      </section>

      <section class="section" id="venue" aria-labelledby="venue-title">
        <h2 id="venue-title">${text('venue-heading')}</h2>
        <div class="section-content prose">
          <p class="lead">${text('venue-introduction')}</p>
          <img class="venue-photo" src="/assets/rifugio.jpg" width="1400" height="960" alt="${text('venue-photo-description')}" loading="lazy">
          <p>${text('getting-there')}</p>
          <p><strong>${text('hiking-emphasis')}</strong> ${text('hiking-paragraph')}</p>
          ${hikingDetails ? `<dl class="confirmed-details">${hikingDetails}</dl>` : ''}
          <p>${text('accommodation')}</p>
          <p>${text('monday-routes')}</p>
          <p class="section-note">${text('weather-note')}</p>
        </div>
      </section>

      <section class="section" id="registration" aria-labelledby="registration-title">
        <h2 id="registration-title">${text('registration-heading')}</h2>
        <div class="section-content prose">
          <p>${text('registration-introduction')}</p>
          <p>${text('registration-details')}</p>
          ${registrationDetails ? `<dl class="confirmed-details">${registrationDetails}</dl>` : ''}
          ${link(data.registration.formUrl) ? `<p><a class="button" href="${link(data.registration.formUrl)}">${text('registration-link')}</a></p>` : `<p class="registration-status">${text('registration-pending')}</p>`}
        </div>
      </section>

      <section class="section" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">${text('committee-heading')}</h2>
        <div class="section-content prose">
          ${organisers.length ? `<ul class="organisers">${organisers.map(o => `<li>${o.photo ? `<img src="${escape(o.photo)}" width="64" height="64" loading="lazy" alt="${escape(o.name)}">` : ''}<div><strong>${link(o.webpage) ? `<a href="${link(o.webpage)}">${escape(o.name)}</a>` : escape(o.name)}</strong>${o.institution ? `<span>${escape(o.institution)}</span>` : ''}</div></li>`).join('')}</ul>` : `<p>${text('committee-pending')}</p>`}
          ${email ? `<p>${text('contact-introduction')} <a href="mailto:${escape(email)}">${escape(email)}</a>.</p>` : `<p>${text('contact-pending')}</p>`}
        </div>
      </section>
    </div>
  </main>
  <footer class="wrap site-footer">
    <div class="footer-top"><span>${text('footer-identity')}</span><a href="#top">${text('back-to-top')}</a></div>
    ${supporters.length ? `<p class="supporters">${text('supporter-introduction')} ${supporters.map(s => s.logo ? `<img src="${escape(s.logo)}" alt="${escape(s.label)}" loading="lazy">` : escape(s.label)).join(' · ')}</p>` : ''}
    <p class="photo-credits">${text('photography-introduction')} ${data.photographs.map(p => `<a href="${link(p.source)}" target="_blank" rel="noopener noreferrer">${escape(p.title)}</a> ${text('photography-by')} ${escape(p.author)} · <a href="${link(p.licenceUrl)}" target="_blank" rel="noopener noreferrer">${escape(p.licence)}</a>`).join('; ')}. ${text('photography-note')}</p>
  </footer>
</body>
</html>`;

rmSync(root + 'dist', { recursive: true, force: true });
mkdirSync(root + 'dist', { recursive: true });
cpSync(root + 'assets', root + 'dist/assets', { recursive: true });
writeFileSync(root + 'dist/index.html', withBasePath(html));
console.log('Built the Alpine BNP 2027 single-page website.');
