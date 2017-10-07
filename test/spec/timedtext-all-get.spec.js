const test = require('ava');
const request = require('supertest');
const proxyquire = require('proxyquire');

test.beforeEach(() => {
  delete require.cache[require.resolve('../../app')];
});

test('[GET]/timedtext/all/assetId:no-assetid', async t => {
  const app = require('../../app');
  const res = await request(app).get('/api/timedtext/all/');
  t.is(res.status, 404);
});

test('[GET]/timedtext/all/assetId:not-found', async t => {
  const mockTimedText = {
    findAll() {
      return Promise.resolve(null);
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/all/abc');
  t.is(res.status, 404);
});

test('[GET]/timedtext/all/assetId:read-error', async t => {
  const mockTimedText = {
    findAll() {
      return Promise.reject(new Error());
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/all/def');
  t.is(res.status, 500);
});

test('[GET]/timedtext/all/assetId:success', async t => {
  const mockTimedText = {
    findAll() {
      return Promise.resolve([{jobId: 'abc'}, {jobId: 'def'}, {jobId: 'ghi'}]);
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).get('/api/timedtext/all/ghi');
  t.is(res.status, 200);
});
