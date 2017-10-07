const test = require('ava');
const request = require('supertest');
const proxyquire = require('proxyquire');

test.beforeEach(() => {
  delete require.cache[require.resolve('../../app')];
});

test('[GET]/timedtext/jobId:no-jobid', async t => {
  const app = require('../../app');
  const res = await request(app).get('/api/timedtext/');
  t.is(res.status, 404);
});

test('[GET]/timedtext/jobId:not-found', async t => {
  const mockTimedText = {
    find() {
      return Promise.resolve(null);
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/abc');
  t.is(res.status, 404);
});

test('[GET]/timedtext/jobId:read-error', async t => {
  const mockTimedText = {
    find() {
      return Promise.reject(new Error());
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/def');
  t.is(res.status, 500);
});

test('[GET]/timedtext/jobId:success', async t => {
  const mockTimedText = {
    find() {
      return Promise.resolve({});
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/ghi');
  t.is(res.status, 200);
});
