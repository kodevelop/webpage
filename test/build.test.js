const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const yaml = require('js-yaml');
const { loadContent } = require('../scripts/build');

const locales = ['en', 'nl', 'fr', 'de'];

const profile = {
  name: 'Name',
  headline: 'Headline',
  profileTitle: 'Profile',
  profileText: 'Profile text',
  expertiseTitle: 'Expertise',
  expertiseIntro: 'Expertise intro',
  expertiseLabelSuffix: ':',
  expertise: [{ label: 'Label', description: 'Description' }],
  projectsTitle: 'Projects',
  projectsIntro: 'Projects intro',
  projectCompanyPrefix: 'for',
  contactTitle: 'Contact',
  roleLabel: 'Role',
  roleValue: 'Developer',
  educationLabel: 'Education',
  educationValue: 'Degree',
  locationLabel: 'Location',
  locationValue: 'Belgium',
  contactMessage: 'Message',
  navServices: 'Services',
  navProjects: 'Projects',
  navTechnology: 'Technology',
  navAbout: 'About me',
  navContact: 'Contact',
  heroEyebrow: 'SOFTWARE & ARCHITECTURE',
  heroTitle: 'Thoughtful software. Strong architecture.',
  heroText: 'Intro',
  heroPrimaryCta: 'Discuss your project',
  heroSecondaryCta: 'View services',
  servicesTitle: 'Services',
  services: [
    { title: 'Development', description: 'Description' },
    { title: 'Architecture', description: 'Description' },
    { title: 'DevOps', description: 'Description' }
  ],
  aboutEyebrow: 'ABOUT ME',
  aboutTitle: 'Pragmatic and technical',
  aboutText: 'About',
  aboutLink: 'More about me',
  technologiesTitle: 'TECHNOLOGIES',
  technologies: ['.NET', 'React', 'Node.js'],
  contactCtaTitle: 'Have an idea?',
  contactCtaLabel: 'Get in touch',
  copyrightText: 'kodevelop.be. All rights reserved.'
};

const project = {
  order: 1,
  title: 'Project',
  url: 'https://example.com/project',
  description: 'Description',
  company: 'Company',
  companyUrl: 'https://example.com'
};

function createContent() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kodevelop-content-'));

  for (const locale of locales) {
    const localeDir = path.join(directory, locale);
    const projectDir = path.join(localeDir, 'projects');
    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(localeDir, 'profile.yaml'), yaml.dump(profile));
    fs.writeFileSync(path.join(projectDir, 'project.yaml'), yaml.dump(project));
  }

  return directory;
}

test('loads aligned locale content', () => {
  const directory = createContent();
  assert.equal(loadContent(directory).de.projects[0].id, 'project');
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects a project missing from one locale', () => {
  const directory = createContent();
  fs.rmSync(path.join(directory, 'fr', 'projects', 'project.yaml'));
  fs.writeFileSync(
    path.join(directory, 'fr', 'projects', 'other.yaml'),
    yaml.dump({ ...project, title: 'Other' })
  );

  assert.throws(() => loadContent(directory), /project identifiers differ from en/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects unsafe project URLs', () => {
  const directory = createContent();
  fs.writeFileSync(
    path.join(directory, 'nl', 'projects', 'project.yaml'),
    yaml.dump({ ...project, url: 'javascript:alert(1)' })
  );

  assert.throws(() => loadContent(directory), /only http and https URLs are allowed/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects unsupported locale directories', () => {
  const directory = createContent();
  fs.mkdirSync(path.join(directory, 'es'));

  assert.throws(() => loadContent(directory), /unsupported locale directories: es/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects inconsistent project ordering', () => {
  const directory = createContent();
  fs.writeFileSync(
    path.join(directory, 'de', 'projects', 'project.yaml'),
    yaml.dump({ ...project, order: 2 })
  );

  assert.throws(() => loadContent(directory), /order: differs from en/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects a service list that does not match the three-card layout', () => {
  const directory = createContent();
  fs.writeFileSync(
    path.join(directory, 'nl', 'profile.yaml'),
    yaml.dump({ ...profile, services: profile.services.slice(0, 2) })
  );

  assert.throws(() => loadContent(directory), /services: expected exactly three service cards/);
  fs.rmSync(directory, { recursive: true, force: true });
});
