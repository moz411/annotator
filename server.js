'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '127.0.0.1';

// App
const app = express();
app.use('/favicon.ico', express.static('client/favicon.ico'));
app.use('/lib', express.static('client/lib'));
app.use('/dataset', express.static('dataset'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
