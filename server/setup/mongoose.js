let mongoose = require('mongoose');
const DATABASE_URL = 'mongodb://root:root@localhost:27017/AirportAI?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';

module.exports = setup;

function setup() {
  mongoose.connection.on('connected', function () {
    console.log('MongoDB connected to database.');
  });
  mongoose.connection.on('open', function () {
    console.log('MongoDB connection opened!');
  });
  mongoose.connection.on('error', function () {
    console.error('MongoDB connection error! Disconnecting...');
    mongoose.disconnect();
  });
  mongoose.connection.on('disconnected', function () {
    console.error('MongoDB disconnected! Attempting to reconnect...');
    connectToDb();
  });
  mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });
  mongoose.connection.on('close', function () {
    console.error('MongoDB closed!');
  });

  return connectToDb().then(function() {
    require('../models');
    return;
  });
};

function connectToDb() {
  mongoose.Promise = global.Promise;

  const mongoConnectOpts = {
    sslValidate: true,
    checkServerIdentity: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
    ha: true,
    haInterval: 10000,
  };

  return mongoose.connect(DATABASE_URL, mongoConnectOpts).catch(function(err) {
    console.error('Unable to connect MongoDB. If problem persists, please restart the server. Error: ' + err);
  });
}
