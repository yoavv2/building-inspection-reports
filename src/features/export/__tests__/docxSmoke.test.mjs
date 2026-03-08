import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const buildStubDocx = async (viewModel) => {
  const payload = {
    format: 'docx-stub',
    project: viewModel,
  };

  return new TextEncoder().encode(JSON.stringify(payload));
};

test('DOCX smoke fixture supports Hebrew title, mixed Hebrew + number text, and image reference', async () => {
  const fixturePath = new URL('./fixtures/docxSmokeFixture.json', import.meta.url);
  const raw = await readFile(fixturePath, 'utf-8');
  const viewModel = JSON.parse(raw);

  const bytes = await buildStubDocx(viewModel);
  const json = JSON.parse(new TextDecoder().decode(bytes));

  assert.equal(json.project.name, 'דו"ח בדיקה שנתי');
  assert.match(
    json.project.areas[0].findings[0].description,
    /2 מ"מ/,
    'Mixed Hebrew + number text must be preserved',
  );
  assert.equal(
    json.project.areas[0].findings[0].images[0].path,
    'fixtures/images/front-crack.jpg',
  );
});
