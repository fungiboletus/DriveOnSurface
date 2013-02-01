var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	game = require('./js/game');

try {

	var Canvas = require('canvas'),
		canvas = new Canvas(960, 540);
}
catch (e) {}

var app = express(),
	server = http.createServer(app),
	io = io.listen(server);

// app.use(express.logger());
// app.use(express.compress());

server.listen(3333);

var toolsGame = game(canvas);


var currentDate = +new Date();
	// gameInterval = 0;

// app.get('/start', function(req, res) {
// 	gameInterval = setInterval(function() {

// 	}, 42);
// 	res.send({ok: true});
// });*/

var joueurs = [],
	nbJoueurs = 0;

if (canvas)
{
	app.get('/', function(req, res) {
		// game.tick(250);
		var newDate = +new Date(),
			diff = newDate - currentDate;

		currentDate = newDate;
		toolsGame.tick(diff);
		toolsGame.debugDraw();
		res.type('png');
		// res.setHeader('pragma', 'no-cache');
		res.send(canvas.toBuffer());
	});
}

app.get('/state', function(req, res) {
	var newDate = +new Date(),
		diff = newDate - currentDate;

	currentDate = newDate;
	toolsGame.tick(diff);

	var state = {},
		state_joueurs = [];

	for (var i = 0; i < nbJoueurs; ++i) {
		var joueur = joueurs[i],
			car = joueur.car;
		if (car && car.couleur) {
			var	body = car.body,
				pos = body.GetPosition();

			state_joueurs.push({
				pseudo: joueur.pseudo,
				color: car.couleur,
				speed: car.getSpeedKMH(),
				position_x: pos.x * 8,
				position_y: pos.y * 8,
				angle: body.GetAngle()
			});
		}
	}

	state.joueurs = state_joueurs;

	res.header("Access-Control-Allow-Origin", "*");
	res.send(state);

	// res.send({ok: true});
});

app.get('/box/:width/:height/:left/:top/:angle', function(req, res) {
	toolsGame.newBox(req.params);
	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});
app.get('/plot/:radius/:left/:top', function(req, res) {
	toolsGame.newPlot(req.params);
	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});

io.sockets.on('data', function(data) {
	console.log(data);
});
io.sockets.on('truc', function(data)	{
	console.log("truc");
	console.log(data);
});


io.sockets.on('connection', function (socket) {
	console.log("connexion");
	joueurs.push(socket);
	++nbJoueurs;

	var car = null;

	socket.pseudo = "joueur " + nbJoueurs;

	socket.on('pseudo', function (data) {
		for (var i = 0; i < nbJoueurs; ++i)
			if (joueurs[i].pseudo == data)
				data += ' ' + nbJoueurs;
			
		console.log(socket.pseudo, "pseudo", data);
		socket.pseudo = data;
	});

	socket.on('kart', function(data) {
		console.log(socket.pseudo, "kart", data);

		car = toolsGame.newCar();
		car.couleur = data;
		socket.car = car;

		socket.on('direction', function(data) {
			console.log(socket.pseudo, "direction", data);

			if (data < 0)
				car.steer = 2;
			else if (data > 0)
				car.steer = 1;
			else
				car.steer = 0;
		});

		socket.on('acceleration', function(data) {
			console.log(socket.pseudo, "acceleration", data);

			if (data < 0)
				car.accelerate = 2;
			else if (data > 0)
				car.accelerate = 1;
			else
				car.accelerate = 0;
		});

		socket.on('commande', function(data) {
			console.log(socket.pseudo, "commande", data);
		});
	});

});