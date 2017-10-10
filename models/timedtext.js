const mongoose = require('mongoose');
const debug = require('debug')('ttc');
const db = require('../libs/db');
const util = require('../libs/util');

const Schema = mongoose.Schema;

const TimedText = db.model('TimedText', new Schema({
  jobId: {type: String, index: true},
  assetId: {type: String, index: true},
  state: {type: String, default: 'processing'},
  data: Object
}));

function find(jobId) {
  return new Promise((resolve, reject) => {
    TimedText.findOne({jobId}, (err, data) => {
      if (err) {
        return reject(err);
      }
      debug(`timedtext.find: Found a job: ${jobId}`);
      resolve(data);
    });
  });
}

function findAll(assetId) {
  return new Promise((resolve, reject) => {
    TimedText.find({assetId}, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function _update(doc, value) {
  return new Promise((resolve, reject) => {
    TimedText.update({_id: doc._id}, value, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function _save(doc) {
  return new Promise((resolve, reject) => {
    doc.save(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function add(jobId, assetId, data) {
  const tt = util.formalizeTimedText(data);
  if (!tt) {
    throw new Error(`Invalid Timed Text: ${data}`);
  }
  debug(`timedtext.add: Insert a job ${jobId} for asset ${assetId}`);
  const timedtext = new TimedText({
    jobId,
    assetId,
    data: tt
  });
  return _save(timedtext);
}

function remove(jobId) {
  return new Promise((resolve, reject) => {
    TimedText.deleteOne({jobId}, err => {
      if (err) {
        return reject(err);
      }
      debug(`timedtext.remove: Deleted a job: ${jobId}`);
      resolve();
    });
  });
}

function update(jobId, state, data) {
  return find(jobId).then(doc => {
    if (!doc) {
      throw new Error();
    }
    debug(`timedtext.update: Updated ${jobId} with new state ${state}`);
    return _update(doc, {state, data});
  });
}

module.exports = {
  find,
  findAll,
  add,
  remove,
  update
};
