const test = require('ava');
const proxyquire = require('proxyquire');

const assetId = 'lxYjN5YzE6uh_xH3qoshLPi23u8rWOSc';

test.beforeEach(() => {
  delete require.cache[require.resolve('../../libs/job')];
});

test('job:startJob', async t => {
  const mockTimedtext = {
    find() {
      return Promise.resolve({assetId, data: require(`../../dummy/timedtext/${assetId}.json`)});
    }
  };
  const mockTranscript = {
    find() {
      return Promise.resolve({text: require(`../../dummy/transcript/${assetId}.json`)});
    }
  };
  const job = proxyquire('../../libs/job', {'../models/timedtext': mockTimedtext, '../models/transcript': mockTranscript});
  await job.startJob('abc')
  .then(() => {
    t.pass();
  })
  .catch(err => {
    t.fail(err.stack);
  });
});
