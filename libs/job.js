const TTML = require('ttml');
const debug = require('debug')('ttc');
const timedtext = require('../models/timedtext');
const transcript = require('../models/transcript');

transcript.add('05dTl3YzE6gkKPU35hdAIpI3WwszlHzm', require('./dummy-transcript.json'));
transcript.add('05dTl3YzE6gkKPU35hdAIpI3WwszlHzm', require('./dummy-transcript-02.json'));

const ttObjList = {};
ttObjList['05dTl3YzE6gkKPU35hdAIpI3WwszlHzm'] = require('./dummy-timedtext.json');
ttObjList['lxYjN5YzE6uh_xH3qoshLPi23u8rWOSc'] = require('./dummy-timedtext-02.json');

function startJob(jobId) {
  timedtext.find(jobId)
  .then(data => {
    const assetId = data.assetId;
    const dummyTTObj = ttObjList[assetId];
    if (!dummyTTObj) {
      throw new Error('No dummy timedtext object!');
    }
    setTimeout(() => {
      const ttml = TTML.stringify(dummyTTObj);
      timedtext.update(jobId, 'processed', ttml)
      .then(() => {
        debug(`Succeeded to update job: ${jobId}`);
      })
      .catch(err => {
        debug(`Failed to update job: ${err.stack}`);
      });
    }, 70000);
  });
}

module.exports = {
  startJob
};
