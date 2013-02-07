var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	game = require('./js/game'),
	Gamer = require('./js/Gamer');

// For some reasons, it's difficult to use the canvas library on windows
// The library is only used for develpment, so let's be an option
try {

	var Canvas = require('canvas'),
		canvas = new Canvas(960, 540);
}
catch (e) {}

// Création of the server
var app = express(),
	server = http.createServer(app),
	io = io.listen(server);

// app.use(express.logger());
// app.use(express.compress());

app.use('/', express.static(__dirname+'/assets'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/circuits', express.static(__dirname+'/circuits'));

server.listen(3333);

var gameInstance = game(canvas),
	gamers = {},
	nbGamers = 0,
	currentDate = +new Date(),
	positionDate = 0;
	// gameInterval = 0;

// app.get('/start', function(req, res) {
// 	gameInterval = setInterval(function() {

// 	}, 42);
// 	res.send({ok: true});
// });*/

// Object representings the gamers


// Send a png image of the current game state
if (canvas)
{
	app.get('/canvas', function(req, res) {
		var newDate = +new Date(),
			diff = newDate - currentDate;

		currentDate = newDate;
		gameInstance.tick(diff);
		gameInstance.debugDraw();

		// res.setHeader('pragma', 'no-cache');
		res.type('png');
		res.send(canvas.toBuffer());
	});
}

// Send a Json object representing the game state
app.get('/state', function(req, res) {

	// Calculating the games changes
	var newDate = +new Date(),
		diff = newDate - currentDate,
		sendPosition = false;

	currentDate = newDate;
	gameInstance.tick(diff);

	if (currentDate - positionDate > 1000) {
		positionDate = currentDate;
		// sendPosition = true;
	}

	var state = {},
		state_joueurs = [];

	for (var pseudo in gamers) {

		var gamer = gamers[pseudo];

		// The gamer color is a sort of a registration
		if (gamer && gamer.color) {
			var	car = gamer.car,
				body = car.body,
				pos = body.GetPosition(),
				angle = body.GetAngle(),
				speed = car.getSpeedKMH();

			state_joueurs.push({
				pseudo: pseudo,
				color: gamer.color,
				speed: speed,
				position_x: pos.x,
				position_y: pos.y,
				angle: angle
			});

			if (sendPosition)
				// Send the speed of the car and the gamer rank
				gamer.socket.emit('speed', speed)
					.emit('rank', gamer.rank);
		}
	}

	state.joueurs = state_joueurs;

	res.header("Access-Control-Allow-Origin", "*");
	res.send(state);
});

// REST API for add boxes and plot on the ground
app.get('/box/:width/:height/:left/:top/:angle/:type', function(req, res) {
	gameInstance.newBox(req.params, req.params.type);
	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});
app.get('/plot/:radius/:left/:top/:type', function(req, res) {
	gameInstance.newPlot(req.params, req.params.type);
	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});


io.sockets.on('connection', function (socket) {
	console.log("Connection of a new gamer");

	var pseudo = null,
		gamer = null,
		car = null;

	socket.on('pseudo', function (data) {
		console.log(pseudo, "pseudo", data);
		pseudo = data;

		if (gamers.hasOwnProperty(pseudo))
			gamer = gamers[pseudo];
		else {
			gamer = new Gamer(pseudo, gameInstance);
			gamer.rank = ++nbGamers;
			gamers[pseudo] = gamer;
		}

		// Save the socket on the gamer object
		// it could be used for sending informations
		// to the gamer in other parts of this program
		gamer.socket = socket;

		socket.on('kart', function(data) {
			console.log(pseudo, "kart", data);

			if (gamer.car === null)
				gamer.createCar();
			else
				console.log("A car is already attached to the gamer");

			gamer.color = data;
			car = gamer.car;

			socket.on('direction', function(data) {
				console.log(pseudo, "direction", data);

				if (data < 0)
					car.steer = 2;
				else if (data > 0)
					car.steer = 1;
				else
					car.steer = 0;
			});

			socket.on('acceleration', function(data) {
				console.log(pseudo, "acceleration", data);

				if (data < 0)
					car.accelerate = 2;
				else if (data > 0)
					car.accelerate = 1;
				else
					car.accelerate = 0;
			});

			/**
			 * cmds : tableau de commandes pour contrôler la voiture
			 *  cmds[0] : état du jeu actif ou pas
			 *            0 : STOP , 1 : GO
			 *  cmds[1] : position : avancer ou reculer
			 *           0 : UP, 1 :DOWN
			 *  cmds[2] : vitesse : entre 0 et 10
			 *  cmds[3] : direction pour tourner
			 *          0 : LEFT, 1 : RIGHT
			 *  cmds[4] : vitesse de rotation : entre 0 et 5
			 * */
			socket.on('commande', function(data) {
				console.log(pseudo, "commande", data);

				// The data is a array stored in a string
				var cmd = data.substr(1, data.length-2).split(', ');

				// Parsing the array
				for (var i = 0; i < 5;++i)
					cmd[i] = parseInt(cmd[i], 10);

				if (cmd[2] > 5)
					car.accelerate = cmd[1]  === 0 ? 2 : 1;
				else
					car.accelerate = 0;

				if (cmd[4] > 2)
					car.steer = cmd[3] === 0 ? 2 : 1;
				else
					car.steer = 0;

			});
		});
	});

	socket.on('disconnect', function() {
		console.log(pseudo, "user is disconnected");
		if (car) {
			car.accelerate = 0;
			car.steer = 0;
		}
	});

	socket.on('exit', function() {
		console.log(pseudo, "exit");

		if (pseudo !== null) {
			delete gamers[pseudo];
			if (car !== null) {
				car.removeFromTheWorld();
			}
		}
	});

});