import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.js';
test('real database migration, CRUD, validation, pagination and persistence across restart', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'films-'));
  let app = await createApp(join(dir, 'films.sqlite'), false);
  try {
    await app.listen(0, '127.0.0.1');
    let base = (await app.getUrl()) + '/api/movies';
    const request = (path = '', method = 'GET', body?: unknown) =>
      fetch(base + path, {
        method,
        headers: { 'content-type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    const movie = {
      title: 'A Quiet Orbit',
      description: 'A fictional crew finds a new way home.',
      release_date: '2024-06-10',
      length: 105,
    };
    for (const invalid of [
      { ...movie, title: ' ' },
      { ...movie, length: 0 },
      { ...movie, length: 1.5 },
      { ...movie, release_date: '2024-02-30' },
      { ...movie, unexpected: true },
    ])
      assert.equal((await request('', 'POST', invalid)).status, 400);
    const created = await request('', 'POST', movie);
    assert.equal(created.status, 201);
    const saved = await created.json();
    assert.match(saved.id, /^[a-f0-9-]+$/);
    assert.equal((await request('/' + saved.id, 'PATCH', {})).status, 400);
    assert.equal((await request('/' + saved.id, 'PATCH', { title: null })).status, 400);
    assert.equal((await request('/' + saved.id, 'PATCH', { title: 'An Open Orbit' })).status, 200);
    assert.equal((await (await request('?q=open&limit=1')).json()).total, 1);
    assert.equal((await request('?limit=101')).status, 400);
    assert.equal((await request('/not-uuid')).status, 400);
    await app.close();
    app = await createApp(join(dir, 'films.sqlite'), false);
    await app.listen(0, '127.0.0.1');
    base = (await app.getUrl()) + '/api/movies';
    const persisted = await (await request('/' + saved.id)).json();
    assert.equal(persisted.title, 'An Open Orbit');
    assert.equal(persisted.length, 105);
    assert.equal((await request('/' + saved.id, 'DELETE')).status, 204);
    assert.equal((await request('/' + saved.id)).status, 404);
    assert.equal((await request('/' + saved.id, 'PATCH', { title: 'X' })).status, 404);
    assert.equal((await request('/' + saved.id, 'DELETE')).status, 404);
    assert.equal((await fetch((await app.getUrl()) + '/docs-json')).status, 200);
  } finally {
    await app.close();
    await rm(dir, { recursive: true, force: true });
  }
});
