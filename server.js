var app = require('express')();
var server = require('http').Server(app);
var WebSocketServer = require('ws').Server;
var JsonDB = require('node-json-db');
var db = new JsonDB("myDB", true, false);

server.listen(1337);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var wss = new WebSocketServer({ port: 8081 });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.clients.forEach(function(ws){
        ws.send('received: ' + message);
    });
  });

  ws.on('close', function(){
    var i = wss.clients.indexOf(ws);
    if(wss.clients.indexOf(ws) > -1){
      delete wss.clients[i];
    }
  });

  ws.on('error', function(err){
    console.log(err);
  });
});
