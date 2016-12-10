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
var http = require('http');
var server = http.createServer().listen(4000);
var io = require('socket.io').listen(server);
var cookie_reader = require('cookie');
var querystring = require('querystring');
 
// var redis = require('socket.io/node_modules/redis');
var redis = require('redis');
var sub = redis.createClient();
 
//Subscribe to the Redis chat channel
sub.subscribe('code');
 
//Configure socket.io to store cookie set by Django
// io.configure(function(){
//     io.set('authorization', function(data, accept){
//         if(data.headers.cookie){
//             data.cookie = cookie_reader.parse(data.headers.cookie);
//             return accept(null, true);
//         }
//         return accept('error', false);
//     });
//     io.set('log level', 1);
// });
 
io.sockets.on('connection', function (socket) {
    
    //Grab message from Redis and send to client
    sub.on('message', function(channel, message){
    	socket.send(message);
    	// console.log("hello");
    });
    
    //Client is sending message through socket.io
    socket.on('send_code', function (message) {
        values = querystring.stringify({
            comment: message,
            sessionid: socket.handshake.cookie['sessionid'],
        });
        
        var options = {
            host: 'localhost',
            port: 8001,
            path: '/redis',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': values.length
            }
        };
        
        //Send message to Django server
        var req = http.get(options, function(res){
            res.setEncoding('utf8');
            
            //Print out error message
            res.on('data', function(message){
                console.log(message);
            });
        });
        
        req.write(values);
        req.end();
    });
});