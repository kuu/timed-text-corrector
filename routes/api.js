const express = require('express');
const debug = require('debug')('ttc');

const router = express.Router();

/* Registers a transcript for an asset */
router.put('/transcript/:assetId', (req, res) => {
  const assetId = req.params.assetId;
  debug(`[PUT] /transcript/${assetId}`);
  debug(`\tbody="${req.body}"`);
  // TODO
  res.send(`Associated the received transcript to the asset: ${assetId}`);
});

/* Retrieves a transcript */
router.get('/transcript/:assetId', (req, res) => {
  const assetId = req.params.assetId;
  debug(`[GET] /transcript/${assetId}`);
  // TODO
  res.json({});
});

/* Deletes a transcript */
router.delete('/transcript/:assetId', (req, res) => {
  const assetId = req.params.assetId;
  debug(`[DELETE] /transcript/${assetId}`);
  // TODO
  res.send(`Deleted the transcript for the asset: ${assetId}`);
});

/* Corrects a timed text using the existing transcript */
router.post('/timedtext', (req, res) => {
  debug('[POST] /timedtext');
  debug(`\tbody="${req.body}"`);
  // TODO
  res.json('job-id');
});

/* Retrieves a timed text state */
router.get('/timedtext/:jobId/state', (req, res) => {
  const jobId = req.params.jobId;
  debug(`[GET] /timedtext/${jobId}/state`);
  // TODO
  res.json({});
});

/* Retrieves a timed text */
router.get('/timedtext/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  debug(`[GET] /timedtext/${jobId}`);
  // TODO
  res.json({});
});

/* Deletes a timed text */
router.delete('/timedtext/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  debug(`[DELETE] /timedtext/${jobId}`);
  // TODO
  res.send(`Deleted the timed-text: ${jobId}`);
});

/* Retrieves all timed texts associated with an asset */
router.get('/timedtext/all/:assetId', (req, res) => {
  const assetId = req.params.assetId;
  debug(`[GET] /timedtext/all/${assetId}`);
  // TODO
  res.json([]);
});

module.exports = router;
