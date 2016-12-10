// var express = require('express');

// var app = express();


// /* GET home page. */
// app.get('/', function(req, res, next) {
//   //Path to your main file
//   res.status(200).sendFile(path.join(__dirname+'../public/index.html')); 
// });

// module.exports = app;

// "use strict";
var compression = require('compression')
var express = require('express')
var ip = require('ip') 
var path = require('path');

var HOST = ip.address();
var PORT = 8000;

// const E2E_PORT = require('./constants').E2E_PORT;
// const HOST = require('./constants').HOST;
// const PROD_PORT = require('./constants').PROD_PORT;

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

// app.use('/static',path.join(__dirname));
app.use(compression());
app.use('/static',express.static('./static'));

const renderIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
}

app.get('/*', renderIndex);

// let e2e;
// const ENV = process.env.npm_lifecycle_event;
// if (ENV === 'e2e:server') { e2e = E2E_PORT };
// const PORT = e2e || PROD_PORT;

app.listen(PORT, () => {
  console.log(`Listening on: http://${HOST}:${PORT}`);
});