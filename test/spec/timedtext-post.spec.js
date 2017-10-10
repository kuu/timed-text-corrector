const test = require('ava');
const request = require('supertest');
const proxyquire = require('proxyquire');
const videoIndexerResponse = require('../fixture/video-indexer.json');

test.beforeEach(() => {
  delete require.cache[require.resolve('../../app')];
});

test('[POST]/timedtext:invalid-request-body:undefined', async t => {
  const app = require('../../app');
  const res = await request(app).post('/api/timedtext/').send();
  t.is(res.status, 400);
});

test('[POST]/timedtext:invalid-request-body:no-id', async t => {
  const app = require('../../app');
  const res = await request(app).post('/api/timedtext/').send({data: {}});
  t.is(res.status, 400);
});

test('[POST]/timedtext:invalid-request-body:no-data', async t => {
  const app = require('../../app');
  const res = await request(app).post('/api/timedtext/').send({id: 'abc'});
  t.is(res.status, 400);
});

test('[POST]/timedtext:write-error', async t => {
  const mockTimedText = {
    add() {
      return Promise.reject(new Error());
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).post('/api/timedtext/').send({id: 'abc', data: videoIndexerResponse});
  t.is(res.status, 500);
});

test('[POST]/timedtext:success', async t => {
  const mockTimedText = {
    add() {
      return Promise.resolve();
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/timedtext': mockTimedText});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).post('/api/timedtext/').send({id: 'abc', data: videoIndexerResponse});
  t.is(res.status, 200);
});
