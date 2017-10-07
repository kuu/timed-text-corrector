const config = require('config');
const mongoose = require('mongoose');

const MONGODB_HOST = (config.db && config.db.host) || '127.0.0.1';
const MONGODB_PORT = (config.db && config.db.port) || 27017;

mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/ttc`);

module.exports = mongoose;
