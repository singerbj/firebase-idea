var app = require('express')();
var server = require('http').Server(app);
var WebSocketServer = require('ws').Server;
var JsonDB = require('node-json-db');
var db = new JsonDB("myDB", true, false);

server.listen(1337);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var usersInc = 0;
var likesInc = 0;
var users = {};
var likes = {};

var wss = new WebSocketServer({ port: 8081 });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: ' + message);

    var obj = JSON.parse(message);
    if(obj.type === 'user'){
        usersInc += 1;
        obj.id = usersInc;
        delete obj.type;
        users[usersInc] = obj;
    }else if(obj.type === 'like'){
        likesInc += 1;
        obj.id = likesInc;
        delete obj.type;
        likes[likesInc] = obj;
    }

    wss.clients.forEach(function(ws){
        var data = { users: users, likes: likes };
        ws.send(JSON.stringify(data));
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
