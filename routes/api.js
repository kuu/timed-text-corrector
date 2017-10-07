const crypto = require('crypto');
const express = require('express');
const debug = require('debug')('ttc');
const transcript = require('../models/transcript');
const timedtext = require('../models/timedtext');
const job = require('../libs/job');

const router = express.Router();

/* Adds a transcript for an asset */
router.post('/transcript', (req, res) => {
  debug('[POST] /transcript');
  const obj = req.body;
  if (!obj || !obj.id || !obj.text || !obj.text.trim()) {
    return res.status(400).send('Invalid request body');
  }
  const assetId = obj.id;
  const text = obj.text;
  debug('\t{');
  debug(`\t\tid: ${assetId},`);
  debug(`\t\ttext: "${text}"`);
  debug('\t}');
  transcript.add(assetId, text).then(() => {
    res.send('Transcript ingested');
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

/* Retrieves a transcript */
router.get('/transcript/:assetId', (req, res) => {
  const assetId = req.params.assetId;
  debug(`[GET] /transcript/${assetId}`);
  transcript.find(assetId).then(item => {
    if (!item) {
      return res.status(404).send(`No such asset: ${assetId}`);
    }
    res.json(item.text);
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

/* Deletes a transcript */
router.delete('/transcript/:assetId', (req, res) => {
  const assetId = req.params.assetId;
  debug(`[DELETE] /transcript/${assetId}`);
  transcript.find(assetId).then(item => {
    if (!item) {
      return 404;
    }
    return transcript.remove(assetId);
  })
  .then(statusCode => {
    if (statusCode === 404) {
      res.status(404).send(`No such asset: ${assetId}`);
    } else {
      res.send(`Deleted the transcript for the asset: ${assetId}`);
    }
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

/* Corrects a timed text using the existing transcript */
router.post('/timedtext', (req, res) => {
  debug('[POST] /timedtext');
  const obj = req.body;
  if (!obj || !obj.id || !obj.data) {
    return res.status(400).send('Invalid request body');
  }
  const jobId = crypto.randomBytes(20).toString('hex');
  const assetId = obj.id;
  const data = obj.data;
  debug('\t{');
  debug(`\t\tid: ${assetId},`);
  debug(`\t\tdata: "${data}"`);
  debug('\t}');
  timedtext.add(jobId, assetId, data).then(() => {
    job.startJob(jobId);
    res.json(jobId);
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

/* Retrieves a timed text state */
router.get('/timedtext/:jobId/state', (req, res) => {
  const jobId = req.params.jobId;
  debug(`[GET] /timedtext/${jobId}/state`);
  timedtext.find(jobId).then(item => {
    if (!item) {
      return res.status(404).send(`No such job: ${jobId}`);
    }
    debug(`Return job state: ${item.state}`);
    res.json(item.state);
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

/* Retrieves a timed text */
router.get('/timedtext/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  debug(`[GET] /timedtext/${jobId}`);
  timedtext.find(jobId).then(item => {
    if (!item) {
      return res.status(404).send(`No such job: ${jobId}`);
    }
    debug(`Return TTML: ${item.data}`);
    res.json({
      id: item.assetId,
      state: item.state,
      data: item.data
    });
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

/* Deletes a timed text */
router.delete('/timedtext/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  debug(`[DELETE] /timedtext/${jobId}`);
  timedtext.find(jobId).then(item => {
    if (!item) {
      return 404;
    }
    return timedtext.remove(jobId);
  })
  .then(statusCode => {
    if (statusCode === 404) {
      res.status(404).send(`No such job: ${jobId}`);
    } else {
      res.send(`Deleted the timedtext for the job: ${jobId}`);
    }
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

/* Retrieves all timed texts associated with an asset */
router.get('/timedtext/all/:assetId', (req, res) => {
  const assetId = req.params.assetId;
  debug(`[GET] /timedtext/all/${assetId}`);
  timedtext.findAll(assetId).then(array => {
    if (!array) {
      return res.status(404).send(`No job for such asset: ${assetId}`);
    }
    res.json(array.map(item => item.jobId));
  })
  .catch(err => {
    res.status(500).send(`${err.stack}`);
  });
});

module.exports = router;
