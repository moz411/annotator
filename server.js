'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use('/favicon.ico', express.static('/favicon.ico'));
app.use('/lib', express.static('lib'));
app.use('/dataset', express.static('dataset'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
