const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function createNode(tagName = '') {
  return {
    tagName,
    children: [],
    textContent: '',
    get firstElementChild() {
      return this.children[0];
    },
    append(...children) {
      this.children.push(...children);
    },
    replaceChildren(...children) {
      this.children = children;
    }
  };
}

test('generated page renders localized landing-page content', () => {
  const build = spawnSync(process.execPath, [path.join(root, 'scripts', 'build.js')], {
    cwd: root,
    encoding: 'utf8'
  });

  assert.equal(build.status, 0, build.stderr);

  const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch);

  const elementIds = [
    'nav-services',
    'nav-projects',
    'nav-technology',
    'nav-about',
    'nav-contact',
    'header-contact',
    'hero-eyebrow',
    'hero-title',
    'hero-text',
    'hero-primary-cta',
    'hero-secondary-cta',
    'services-title',
    'service-title-1',
    'service-title-2',
    'service-title-3',
    'service-description-1',
    'service-description-2',
    'service-description-3',
    'projects-title',
    'projects-intro',
    'project-list',
    'about-eyebrow',
    'about-title',
    'about-text',
    'about-link',
    'technologies-title',
    'technology-list',
    'contact-cta-title',
    'contact-cta-link',
    'copyright-text',
    'language-select'
  ];
  const elements = Object.fromEntries(elementIds.map((id) => [id, createNode()]));
  elements['hero-primary-cta'].append(createNode('span'), createNode('span'));
  elements['contact-cta-link'].append(createNode('span'), createNode('span'));
  let changeHandler;
  elements['language-select'].addEventListener = (eventName, handler) => {
    if (eventName === 'change') changeHandler = handler;
  };

  const document = {
    title: '',
    documentElement: {},
    getElementById: (id) => elements[id],
    createElement: (tagName) => createNode(tagName),
    createTextNode: (textContent) => ({ textContent })
  };
  const savedValues = new Map();

  vm.runInNewContext(scriptMatch[1], {
    document,
    localStorage: {
      getItem: () => null,
      setItem: (key, value) => savedValues.set(key, value)
    },
    navigator: {
      languages: ['en-US'],
      language: 'en-US'
    },
  });

  assert.equal(document.documentElement.lang, 'en');
  assert.equal(document.title, 'Jens Malfait | Thoughtful software. Strong architecture.');
  assert.equal(elements['hero-title'].textContent, 'Thoughtful software. Strong architecture.');
  assert.equal(elements['service-title-1'].textContent, 'Software development');
  assert.equal(
    elements['service-title-3'].textContent,
    'DevOps & automation'
  );
  assert.equal(elements['technology-list'].children.length, 6);
  assert.equal(elements['contact-cta-title'].textContent, 'Have an idea or technical challenge?');
  assert.match(elements['copyright-text'].textContent, /^© \d{4} kodevelop\.be\./);
  assert.match(html, /id="services"/);
  assert.equal(elements['projects-title'].textContent, 'Selected Projects');
  assert.equal(elements['project-list'].children.length, 4);
  assert.equal(
    elements['project-list'].children[0].children[0].children[0].href,
    'https://acm-tt.trustteam.be/'
  );
  assert.match(
    elements['project-list'].children[0].children[1].textContent,
    /Belgian insurance market/
  );
  assert.equal(elements['nav-projects'].textContent, 'Projects');
  assert.equal((html.match(/class="service-card"/g) || []).length, 3);

  changeHandler({ target: { value: 'nl' } });
  assert.equal(document.documentElement.lang, 'nl');
  assert.equal(elements['hero-title'].textContent, 'Doordachte software. Sterke architectuur.');
  assert.equal(elements['projects-title'].textContent, 'Geselecteerde projecten');
  assert.equal(elements['nav-projects'].textContent, 'Projecten');
  assert.equal(savedValues.get('kde-language'), 'nl');
});
