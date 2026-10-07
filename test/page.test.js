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
    append(...children) {
      this.children.push(...children);
    },
    replaceChildren(...children) {
      this.children = children;
    }
  };
}

test('generated page renders localized profile and project content', () => {
  const build = spawnSync(process.execPath, [path.join(root, 'scripts', 'build.js')], {
    cwd: root,
    encoding: 'utf8'
  });

  assert.equal(build.status, 0, build.stderr);

  const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch);

  const elementIds = [
    'profile-name',
    'profile-headline',
    'profile-title',
    'profile-text',
    'expertise-title',
    'expertise-intro',
    'expertise-list',
    'projects-title',
    'projects-intro',
    'projects-list',
    'contact-title',
    'role-label',
    'role-value',
    'education-label',
    'education-value',
    'location-label',
    'location-value',
    'contact-message',
    'language-select'
  ];
  const elements = Object.fromEntries(elementIds.map((id) => [id, createNode()]));
  elements['language-select'].addEventListener = () => {};

  const document = {
    title: '',
    documentElement: {},
    getElementById: (id) => elements[id],
    createElement: (tagName) => createNode(tagName),
    createTextNode: (textContent) => ({ textContent })
  };

  vm.runInNewContext(scriptMatch[1], {
    document,
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    },
    navigator: {
      languages: ['en-US'],
      language: 'en-US'
    },
    URL
  });

  assert.equal(document.documentElement.lang, 'en');
  assert.equal(elements['profile-name'].textContent, 'Jens Malfait');
  assert.equal(elements['expertise-list'].children.length, 7);
  assert.equal(
    elements['expertise-list'].children[0].children[0].textContent,
    'Back-End Development:'
  );
  assert.equal(elements['projects-list'].children.length, 4);
  assert.equal(
    elements['projects-list'].children[0].children[0].href,
    'https://acm-tt.trustteam.be/'
  );
  assert.match(
    elements['projects-list'].children[0].children[1].textContent,
    /case handling for /
  );
});
