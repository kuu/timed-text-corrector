const test = require('ava');
const request = require('supertest');
const proxyquire = require('proxyquire');

test.beforeEach(() => {
  delete require.cache[require.resolve('../../app')];
});

test('[GET]/timedtext/jobId/state:not-found', async t => {
  const mockTimedText = {
    find() {
      return Promise.resolve(null);
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/abc/state');
  t.is(res.status, 404);
});

test('[GET]/timedtext/jobId/state:read-error', async t => {
  const mockTimedText = {
    find() {
      return Promise.reject(new Error());
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/def/state');
  t.is(res.status, 500);
});

test('[GET]/timedtext/jobId/state:success', async t => {
  const mockTimedText = {
    find() {
      return Promise.resolve({});
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/ghi/state');
  t.is(res.status, 200);
});
