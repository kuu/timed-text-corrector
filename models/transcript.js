const mongoose = require('mongoose');
const debug = require('debug')('ttc');
const db = require('../libs/db');
const util = require('../libs/util');

const Schema = mongoose.Schema;

const Transcript = db.model('Transcript', new Schema({
  assetId: {type: String, index: true},
  text: [String]
}));

function find(assetId) {
  return new Promise((resolve, reject) => {
    Transcript.findOne({assetId}, (err, data) => {
      if (err) {
        return reject(err);
      }
      debug(`transcript.find: Found an asset: ${assetId}`);
      resolve(data);
    });
  });
}

function _update(doc, value) {
  return new Promise((resolve, reject) => {
    Transcript.update({_id: doc._id}, value, err => {
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

function add(assetId, text) {
  return find(assetId).then(doc => {
    if (!doc) {
      throw new Error(assetId);
    }
    const list = util.formalizeTranscript(text);
    debug(`transcript.add: Update ${assetId} with ${list.length} lines`);
    return _update(doc, {text: list});
  })
  .catch(err => {
    if (err.message !== assetId) {
      throw err;
    }
    const list = util.formalizeTranscript(text);
    debug(`transcript.add: Insert ${assetId} with ${list.length} lines`);
    const transcript = new Transcript({
      assetId,
      text: list
    });
    return _save(transcript);
  });
}

function remove(assetId) {
  return new Promise((resolve, reject) => {
    Transcript.deleteOne({assetId}, err => {
      if (err) {
        return reject(err);
      }
      debug(`transcript.remove: Deleted an asset: ${assetId}`);
      resolve();
    });
  });
}

module.exports = {
  find,
  add,
  remove
};
