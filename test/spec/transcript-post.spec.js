const test = require('ava');
const request = require('supertest');
const proxyquire = require('proxyquire');

test.beforeEach(() => {
  delete require.cache[require.resolve('../../app')];
});

test('[POST]/transcript:invalid-request-body:undefined', async t => {
  const app = require('../../app');
  const res = await request(app).post('/api/transcript/').send();
  t.is(res.status, 400);
});

test('[POST]/transcript:invalid-request-body:no-id', async t => {
  const app = require('../../app');
  const res = await request(app).post('/api/transcript/').send({text: 'Transcript text'});
  t.is(res.status, 400);
});

test('[POST]/transcript:invalid-request-body:no-text', async t => {
  const app = require('../../app');
  const res = await request(app).post('/api/transcript/').send({id: 'abc'});
  t.is(res.status, 400);
});

test('[POST]/transcript:write-error', async t => {
  const mockTranscript = {
    add() {
      return Promise.reject(new Error());
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/transcript': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).post('/api/transcript/').send({id: 'abc', text: 'Transcript text'});
  t.is(res.status, 500);
});

test('[POST]/transcript:success', async t => {
  const mockTranscript = {
    add() {
      return Promise.resolve();
    }
  };
  const mockApi = proxyquire('../../routes/api', {'../models/transcript': mockTranscript});
  const app = proxyquire('../../app', {'./routes/api': mockApi});
  const res = await request(app).post('/api/transcript/').send({id: 'abc', text: 'Transcript text'});
  t.is(res.status, 200);
});
