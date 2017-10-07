const test = require('ava');
const request = require('supertest');
const proxyquire = require('proxyquire');

test.beforeEach(() => {
  delete require.cache[require.resolve('../../app')];
});

test('[DELETE]/transcript/assetId:no-assetid', async t => {
  const app = require('../../app');
  const res = await request(app).delete('/api/transcript/');
  t.is(res.status, 404);
});

test('[DELETE]/transcript/assetId:not-found', async t => {
  const mockTranscript = {
    find() {
      return Promise.resolve(null);
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/transcript': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).delete('/api/transcript/abc');
  t.is(res.status, 404);
});

test('[DELETE]/transcript/assetId:write-error', async t => {
  const mockTranscript = {
    find() {
      return Promise.resolve({});
    },
    remove() {
      return Promise.reject(new Error());
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/transcript': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).delete('/api/transcript/def');
  t.is(res.status, 500);
});

test('[DELETE]/transcript/assetId:success', async t => {
  const mockTranscript = {
    find() {
      return Promise.resolve({});
    },
    remove() {
      return Promise.resolve();
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/transcript': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).delete('/api/transcript/ghi');
  t.is(res.status, 200);
});
