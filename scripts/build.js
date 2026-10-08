const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const SOURCE_DIR = path.join(ROOT, 'src');
const OUTPUT_DIR = path.join(ROOT, 'dist');
const LOCALES = ['en', 'nl', 'fr', 'de'];
const CONTENT_TOKEN = '__SITE_CONTENT__';

const profileFields = [
  'name',
  'headline',
  'profileTitle',
  'profileText',
  'expertiseTitle',
  'expertiseIntro',
  'expertiseLabelSuffix',
  'expertise',
  'projectsTitle',
  'projectsIntro',
  'projectCompanyPrefix',
  'contactTitle',
  'roleLabel',
  'roleValue',
  'educationLabel',
  'educationValue',
  'locationLabel',
  'locationValue',
  'contactMessage',
  'navServices',
  'navProjects',
  'navTechnology',
  'navAbout',
  'navContact',
  'heroEyebrow',
  'heroTitle',
  'heroText',
  'heroPrimaryCta',
  'heroSecondaryCta',
  'servicesTitle',
  'services',
  'aboutEyebrow',
  'aboutTitle',
  'aboutText',
  'aboutLink',
  'technologiesTitle',
  'technologies',
  'contactCtaTitle',
  'contactCtaLabel',
  'copyrightText'
];

const projectFields = [
  'order',
  'title',
  'url',
  'description',
  'company',
  'companyUrl'
];

function fail(message) {
  throw new Error(message);
}

function loadYaml(filePath) {
  try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${path.relative(ROOT, filePath)}: ${error.message}`);
  }
}

function validateExactFields(value, requiredFields, source) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${source}: expected a YAML object`);
  }

  const missing = requiredFields.filter((field) => !(field in value));
  const unknown = Object.keys(value).filter((field) => !requiredFields.includes(field));

  if (missing.length > 0) {
    fail(`${source}: missing required fields: ${missing.join(', ')}`);
  }

  if (unknown.length > 0) {
    fail(`${source}: unknown fields: ${unknown.join(', ')}`);
  }
}

function validateString(value, source) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${source}: expected a non-empty string`);
  }
}

function validateUrl(value, source) {
  validateString(value, source);

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail(`${source}: expected a valid URL`);
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) {
    fail(`${source}: only http and https URLs are allowed`);
  }
}

function validateProfile(profile, source) {
  validateExactFields(profile, profileFields, source);

  for (const field of profileFields.filter(
    (field) => !['expertise', 'services', 'technologies'].includes(field)
  )) {
    validateString(profile[field], `${source}.${field}`);
  }

  if (!Array.isArray(profile.expertise) || profile.expertise.length === 0) {
    fail(`${source}.expertise: expected a non-empty list`);
  }

  profile.expertise.forEach((item, index) => {
    const itemSource = `${source}.expertise[${index}]`;
    validateExactFields(item, ['label', 'description'], itemSource);
    validateString(item.label, `${itemSource}.label`);
    validateString(item.description, `${itemSource}.description`);
  });

  if (!Array.isArray(profile.services) || profile.services.length !== 3) {
    fail(`${source}.services: expected exactly three service cards`);
  }

  profile.services.forEach((item, index) => {
    const itemSource = `${source}.services[${index}]`;
    validateExactFields(item, ['title', 'description'], itemSource);
    validateString(item.title, `${itemSource}.title`);
    validateString(item.description, `${itemSource}.description`);
  });

  if (!Array.isArray(profile.technologies) || profile.technologies.length === 0) {
    fail(`${source}.technologies: expected a non-empty list`);
  }

  profile.technologies.forEach((item, index) => {
    validateString(item, `${source}.technologies[${index}]`);
  });
}

function validateProject(project, source) {
  validateExactFields(project, projectFields, source);

  if (!Number.isInteger(project.order) || project.order < 0) {
    fail(`${source}.order: expected a non-negative integer`);
  }

  for (const field of ['title', 'description', 'company']) {
    validateString(project[field], `${source}.${field}`);
  }

  validateUrl(project.url, `${source}.url`);
  validateUrl(project.companyUrl, `${source}.companyUrl`);
}

function loadContent(contentDir = CONTENT_DIR) {
  const translations = {};
  const projectIdsByLocale = new Map();
  const projectOrdersByLocale = new Map();
  const localeDirectories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const unknownLocales = localeDirectories.filter((locale) => !LOCALES.includes(locale));

  if (unknownLocales.length > 0) {
    fail(`content: unsupported locale directories: ${unknownLocales.join(', ')}`);
  }

  for (const locale of LOCALES) {
    const localeDir = path.join(contentDir, locale);
    const profilePath = path.join(localeDir, 'profile.yaml');
    const projectDir = path.join(localeDir, 'projects');

    if (!fs.existsSync(profilePath)) {
      fail(`${path.relative(ROOT, profilePath)}: file does not exist`);
    }

    if (!fs.existsSync(projectDir)) {
      fail(`${path.relative(ROOT, projectDir)}: directory does not exist`);
    }

    const profileSource = path.relative(ROOT, profilePath);
    const profile = loadYaml(profilePath);
    validateProfile(profile, profileSource);

    const projectFiles = fs.readdirSync(projectDir)
      .filter((file) => file.endsWith('.yaml'))
      .sort();

    if (projectFiles.length === 0) {
      fail(`${path.relative(ROOT, projectDir)}: expected at least one project file`);
    }

    const seenOrders = new Set();
    const seenIds = new Set();
    const projects = projectFiles.map((file) => {
      const projectPath = path.join(projectDir, file);
      const source = path.relative(ROOT, projectPath);
      const id = path.basename(file, '.yaml');

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
        fail(`${source}: filename must be a lowercase kebab-case project identifier`);
      }

      if (seenIds.has(id)) {
        fail(`${source}: duplicate project identifier ${id}`);
      }

      seenIds.add(id);
      const project = loadYaml(projectPath);
      validateProject(project, source);

      if (seenOrders.has(project.order)) {
        fail(`${source}.order: duplicate order ${project.order} in locale ${locale}`);
      }

      seenOrders.add(project.order);
      return { id, ...project };
    });

    projects.sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
    projectIdsByLocale.set(locale, projects.map((project) => project.id).sort());
    projectOrdersByLocale.set(
      locale,
      new Map(projects.map((project) => [project.id, project.order]))
    );
    translations[locale] = { ...profile, projects };
  }

  const expectedProjectIds = projectIdsByLocale.get(LOCALES[0]);
  const expectedProjectOrders = projectOrdersByLocale.get(LOCALES[0]);
  const expectedExpertiseCount = translations.en.expertise.length;
  for (const locale of LOCALES.slice(1)) {
    const actualProjectIds = projectIdsByLocale.get(locale);
    const missing = expectedProjectIds.filter((id) => !actualProjectIds.includes(id));
    const extra = actualProjectIds.filter((id) => !expectedProjectIds.includes(id));

    if (missing.length > 0 || extra.length > 0) {
      const details = [
        missing.length > 0 ? `missing: ${missing.join(', ')}` : '',
        extra.length > 0 ? `extra: ${extra.join(', ')}` : ''
      ].filter(Boolean).join('; ');
      fail(`content/${locale}/projects: project identifiers differ from en (${details})`);
    }

    if (translations[locale].expertise.length !== expectedExpertiseCount) {
      fail(
        `content/${locale}/profile.yaml: expertise count differs from en ` +
        `(${translations[locale].expertise.length} instead of ${expectedExpertiseCount})`
      );
    }

    for (const id of expectedProjectIds) {
      const actualOrder = projectOrdersByLocale.get(locale).get(id);
      const expectedOrder = expectedProjectOrders.get(id);

      if (actualOrder !== expectedOrder) {
        fail(
          `content/${locale}/projects/${id}.yaml.order: differs from en ` +
          `(${actualOrder} instead of ${expectedOrder})`
        );
      }
    }
  }

  return translations;
}

function copySource(sourceDir, outputDir) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.cpSync(sourceDir, outputDir, { recursive: true });
}

function serializeForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function build() {
  const translations = loadContent();

  if (process.argv.includes('--validate-only')) {
    console.log(`Validated ${LOCALES.length} locales and ${translations.en.projects.length} projects.`);
    return;
  }

  copySource(SOURCE_DIR, OUTPUT_DIR);
  const indexPath = path.join(OUTPUT_DIR, 'index.html');
  const template = fs.readFileSync(indexPath, 'utf8');

  if (!template.includes(CONTENT_TOKEN)) {
    fail(`src/index.html: missing ${CONTENT_TOKEN} build token`);
  }

  const generatedHtml = template.replace(CONTENT_TOKEN, serializeForScript(translations));
  const script = generatedHtml.match(/<script>([\s\S]*?)<\/script>/);

  if (!script) {
    fail('src/index.html: expected one inline script');
  }

  try {
    new vm.Script(script[1]);
  } catch (error) {
    fail(`src/index.html: generated script is invalid: ${error.message}`);
  }

  fs.writeFileSync(indexPath, generatedHtml, 'utf8');

  console.log(`Built ${LOCALES.length} locales and ${translations.en.projects.length} projects into dist/.`);
}

if (require.main === module) {
  try {
    build();
  } catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  loadContent,
  validateProfile,
  validateProject
};
