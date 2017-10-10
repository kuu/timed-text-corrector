const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');
const TTML = require('ttml');
const debug = require('debug')('ttc');
const timedtext = require('../models/timedtext');
const transcript = require('../models/transcript');
const util = require('../libs/util');

const fuseOptions = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2
};

if (process.env.TTC_DUMMY) {
  // Import dummy transcripts
  const filenames = fs.readdirSync(path.join(__dirname, '../dummy/transcript'));
  filenames.forEach(filename => {
    if (filename.endsWith('.json')) {
      const assetId = path.basename(filename, '.json');
      transcript.add(assetId, require(`../dummy/transcript/${filename}`));
    }
  });
}

function startJobDummy(jobId) {
  return timedtext.find(jobId)
  .then(() => {
    const data = require(`../dummy/timedtext/Mary_Elizabeth_Winstead.json`);
    if (!data) {
      throw new Error('No dummy timedtext data!');
    }
    setTimeout(() => {
      const ttml = TTML.stringify(data);
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

function startJob(jobId) {
  return timedtext.find(jobId)
  .then(({assetId, data}) => {
    if (!data) {
      throw new Error('No timedtext data!');
    }
    transcript.find(assetId)
    .then(({text}) => {
      const fuse = new Fuse(text, fuseOptions);
      const lines = util.safePropAccess(data, 'languages.en.lines');
      for (const {text} of lines) {
        const result = fuse.search(text);
        // TODO
        console.log(result);
      }
    });
  });
}

module.exports = {
  startJob: (process.env.TTC_DUMMY ? startJobDummy : startJob)
};
