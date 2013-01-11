var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	game = require('./js/game'),
	Canvas = require('canvas');

var app = express(),
	server = http.createServer(app),
	io = io.listen(server);

server.listen(3333);

var canvas = new Canvas(1024, 768);
var a = game(canvas);

app.get('/', function(req, res) {
	res.type('png');
	res.send(canvas.toBuffer());
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});