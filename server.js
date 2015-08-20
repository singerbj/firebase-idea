var app = require('express')();
var server = require('http').Server(app);
// var io = require('socket.io')(server);
var io = require('socket.io')(server, {origins:'*'});
var JsonDB = require('node-json-db');
var db = new JsonDB("myDB", true, false);

server.listen(80);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  io.emit('this', { will: 'be received by everyone'});

  socket.on('user', function (user) {
    console.log("user = " + user);
    io.emit('msg', "user = " + user);
  });
  socket.on('like', function (like) {
    console.log("like = " + like);
    io.emit('msg', "like = " + like);
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});
