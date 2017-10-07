const TTML = require('ttml');
const debug = require('debug')('ttc');
const timedtext = require('../models/timedtext');
const transcript = require('../models/transcript');
const dummyTTObj = require('./dummy-timedtext.json');
const dummyTranscriptStr = require('./dummy-transcript.json');

transcript.add('05dTl3YzE6gkKPU35hdAIpI3WwszlHzm', dummyTranscriptStr);

function startJob(jobId) {
  setTimeout(() => {
    const ttml = TTML.stringify(dummyTTObj);
    timedtext.update(jobId, 'processed', ttml)
    .then(() => {
      debug(`Succeeded to update job: ${jobId}`);
    })
    .catch(err => {
      debug(`Failed to update job: ${err.stack}`);
    });
  }, 80000);
}

module.exports = {
  startJob
};
