var html = require('fs').readFileSync(__dirname+'/client.html');
var app = require('http').createServer(function(req, res){ res.end(html); });
app.listen(3000);
var io = require("socket.io");
var io = io.listen(app);
io.sockets.on('connection', function (socket) {
	console.log("client connecte");
    socket.emit('update', 'coucou');
});