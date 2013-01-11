var express = require('express'),
	io = require('socket.io'),
	http = require('http');

var app = express(),
	server = http.createServer(app),
	io = io.listen(server);

server.listen(3333);

app.get('/', function(req, res) {
	res.send("canard");
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});