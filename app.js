/**
* App entrypoint.
*/
'use strict';
const express = require('express');
const app = express();
const router = require('./server/routes/index.js');  // Import your router
const exceptionHandler = require('./server/handlers/exceptionHandler.js');
const PORT = 3000;

// Set up Express.
require('./server/setup/express')(app);

// Set up MongoDB.
require('./server/setup/mongoose')();

// Set up routes.
app.use('/', router);

// Start app.
app.listen(PORT, function() {
  console.log('App now listening on port ' + PORT);
});

app.use(exceptionHandler); 

module.exports = app;