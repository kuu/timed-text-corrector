const test = require('ava');
const request = require('supertest');
const proxyquire = require('proxyquire');

test.beforeEach(() => {
  delete require.cache[require.resolve('../../app')];
});

test('[DELETE]/timedtext/jobId:no-jobid', async t => {
  const app = require('../../app');
  const res = await request(app).delete('/api/timedtext/');
  t.is(res.status, 404);
});

test('[DELETE]/timedtext/jobId:not-found', async t => {
  const mockTranscript = {
    find() {
      return Promise.resolve(null);
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).delete('/api/timedtext/abc');
  t.is(res.status, 404);
});

test('[DELETE]/timedtext/jobId:write-error', async t => {
  const mockTranscript = {
    find() {
      return Promise.resolve({});
    },
    remove() {
      return Promise.reject(new Error());
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).delete('/api/timedtext/def');
  t.is(res.status, 500);
});

test('[DELETE]/timedtext/jobId:success', async t => {
  const mockTranscript = {
    find() {
      return Promise.resolve({});
    },
    remove() {
      return Promise.resolve();
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).delete('/api/timedtext/ghi');
  t.is(res.status, 200);
});
