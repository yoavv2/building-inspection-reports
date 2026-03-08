const test = require('node:test');
const assert = require('node:assert/strict');
const { initializeDatabase } = require('../src/db/initDatabase');

test('projects repository supports CRUD with timestamps', () => {
  const { repositories } = initializeDatabase({ withSeeds: false });
  const created = repositories.projectsRepository.create({
    name: 'Project A',
    clientName: 'Client X',
    status: 'active'
  });

  assert.ok(created.id);
  assert.equal(created.name, 'Project A');
  assert.ok(created.createdAt);
  assert.ok(created.updatedAt);

  const updated = repositories.projectsRepository.update(created.id, { status: 'completed' });
  assert.equal(updated.status, 'completed');

  const fetched = repositories.projectsRepository.getById(created.id);
  assert.equal(fetched.id, created.id);

  const deleted = repositories.projectsRepository.delete(created.id);
  assert.equal(deleted, true);
  assert.equal(repositories.projectsRepository.getById(created.id), null);
});

test('areas repository keeps stable orderIndex after updates and deletes', () => {
  const { repositories } = initializeDatabase({ withSeeds: false });
  const project = repositories.projectsRepository.create({ name: 'Ordered Project' });

  const areaA = repositories.areasRepository.create({ projectId: project.id, name: 'A' });
  const areaB = repositories.areasRepository.create({ projectId: project.id, name: 'B' });
  const areaC = repositories.areasRepository.create({ projectId: project.id, name: 'C' });

  repositories.areasRepository.update(areaC.id, { orderIndex: 0 });

  const ordered = repositories.areasRepository.listByProject(project.id);
  assert.deepEqual(
    ordered.map((a) => a.name),
    ['C', 'A', 'B']
  );
  assert.deepEqual(
    ordered.map((a) => a.orderIndex),
    [0, 1, 2]
  );

  repositories.areasRepository.delete(areaA.id);
  const reordered = repositories.areasRepository.listByProject(project.id);
  assert.deepEqual(reordered.map((a) => a.orderIndex), [0, 1]);
  assert.equal(areaB.id !== areaC.id, true);
});

test('findings and images repositories preserve order and CRUD', () => {
  const { repositories } = initializeDatabase({ withSeeds: false });
  const project = repositories.projectsRepository.create({ name: 'P' });
  const area = repositories.areasRepository.create({ projectId: project.id, name: 'Area 1' });

  const finding1 = repositories.findingsRepository.create({
    projectId: project.id,
    areaId: area.id,
    title: 'Issue 1',
    severity: 'low'
  });
  const finding2 = repositories.findingsRepository.create({
    projectId: project.id,
    areaId: area.id,
    title: 'Issue 2',
    severity: 'high'
  });

  repositories.findingsRepository.update(finding2.id, { orderIndex: 0 });
  const findings = repositories.findingsRepository.listByArea(area.id);
  assert.deepEqual(findings.map((f) => f.title), ['Issue 2', 'Issue 1']);
  assert.deepEqual(findings.map((f) => f.orderIndex), [0, 1]);

  const img1 = repositories.findingImagesRepository.create({ findingId: finding1.id, uri: 'a.jpg' });
  const img2 = repositories.findingImagesRepository.create({ findingId: finding1.id, uri: 'b.jpg' });
  repositories.findingImagesRepository.update(img2.id, { orderIndex: 0 });

  const images = repositories.findingImagesRepository.listByFinding(finding1.id);
  assert.deepEqual(images.map((img) => img.uri), ['b.jpg', 'a.jpg']);
  assert.deepEqual(images.map((img) => img.orderIndex), [0, 1]);

  repositories.findingImagesRepository.delete(img1.id);
  const afterDelete = repositories.findingImagesRepository.listByFinding(finding1.id);
  assert.deepEqual(afterDelete.map((img) => img.orderIndex), [0]);
});

test('seeds load Hebrew standards, templates and area presets', () => {
  const { repositories } = initializeDatabase({ withSeeds: true });

  const standards = repositories.standardsRepository.list();
  assert.ok(standards.length >= 3);
  assert.ok(standards.every((s) => s.language === 'he'));

  const templates = repositories.templatesRepository.list('he');
  assert.ok(templates.length >= 3);

  const presets = repositories.settingsRepository.get('areaPresets');
  assert.ok(Array.isArray(presets.value));
  assert.ok(presets.value.length >= 3);
});
