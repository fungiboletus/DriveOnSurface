/* This file is released under the CeCILL-B V1 licence.*/

var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	game = require('./js/game'),
	Gamer = require('./js/Gamer'),
	settings = require('./js/Settings');

// For some reasons, it's difficult to use the canvas library on windows
// The library is only used for develpment, so let's be an option
try {

	var Canvas = require('canvas'),
		canvas = new Canvas(settings.canvasSize[0], settings.canvasSize[1]);
}
catch (e) {}

// Création of the server
var app = express(),
	server = http.createServer(app),
	io = io.listen(server);

if (settings.verboseLog)
	app.use(express.logger());

if (settings.compressREST)
	app.use(express.compress());

// Initialize statics file access
app.use('/', express.static(__dirname+'/assets'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/circuits', express.static(__dirname+'/circuits'));

// Start the server
server.listen(settings.port);

// Create the game variables
var gameInstance = game(canvas),
	gamers = {},
	nbGamers = 0,
	currentDate = +new Date(),
	positionDate = 0,
	ratio = 0.001;
	// gameInterval = 0;

// app.get('/start', function(req, res) {
// 	gameInterval = setInterval(function() {

// 	}, 42);
// 	res.send({ok: true});
// });*/


// Send a png image of the current game state
if (canvas)
{
	app.get('/canvas', function(req, res) {
		var newDate = +new Date(),
			diff = newDate - currentDate;

		currentDate = newDate;
		gameInstance.tick(diff*ratio);
		gameInstance.debugDraw();

		res.setHeader('pragma', 'no-cache');
		res.type('png');
		res.send(canvas.toBuffer());
	});
}


// Send a Json object representing the game state
app.get('/state', function(req, res) {

	// Calculating the games changes
	var newDate = +new Date(),
		diff = newDate - currentDate,
		sendPosition = false,
		positionsGamers = [];

	currentDate = newDate;
	gameInstance.tick(diff*ratio);

	// If the last tick is older than one second ago
	if (currentDate - positionDate > settings.sendingDelay) {
		positionDate = currentDate;

		// It's time to send the positions to gamers
		sendPosition = true;
	}

	// Variables for construct the REST result
	var state = {
		},
		state_joueurs = [],
		state_bonus = [],
		i, len, b;

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

			if (sendPosition) {
				positionsGamers.push(gamer);
				gamer.socket.emit('speed', speed);
			}

			// Show the bonus of the gamer
			for (var key in gamer.bonus) {
				b = gamer.bonus[key];
				if (b.visible) {
					state_bonus.push(
					{
						type: key+"",
						id: key+"_"+gamer.pseudo,
						position_x: b.position[0],
						position_y: b.position[1],
						angle: b.angle
					});
				}
			}
		}
	}

	if (sendPosition) {

		// Calcul the gamer ranking
		positionsGamers.sort(function(a, b) {
			var rankA = a.rank,
				rankB = b.rank;

			if (rankA.turn > rankB.turn)
				return -1;

			if (rankA.turn < rankB.turn)
				return 1;

			if (rankA.line > rankB.line)
				return -1;

			if (rankA.line < rankB.line)
				return 1;

			if (rankA.pos < rankB.pos)
				return -1;

			if (rankA.pos > rankB.pos)
				return 1;

			return 0;
		});

		// Building a string in order to prevent mixed output with socket.io debug
		var logPositions = "Positions : \n";
		for (i = 0, len = positionsGamers.length; i < len;) {
			var igamer = positionsGamers[i];
			logPositions += "\t" + igamer.name + " : " + (++i);
			igamer.socket.emit('rank', i);

			if (igamer.rank.turn > gameInstance.nbTurns)
				igamer.socket.emit('rankEnd', i);
		}

		if (settings.verboseLog)
			console.log(logPositions);
	}

	// Add the global game bonus
	var bonus = gameInstance.getBonus();
	for( i = 0, len = bonus.length; i < len; ++i) {
		b = bonus[i];
		if (b.visible) {
			state_bonus.push({
				type: "random",
				id: "random_"+i,
				position_x: b.position[0],
				position_y: b.position[1],
				angle: 0.0
			});
		}
	}

	state.joueurs = state_joueurs;
	state.bonus = state_bonus;

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

// REST API for the blob managment
app.get('/blob/:left/:top', function(req, res) {
	console.log("Blob", req.params);
	gameInstance.setBlobTarget(parseFloat(req.params.left), parseFloat(req.params.top));
	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});

// Track selection
app.get('/track/:name', function(req, res) {
	gameInstance.selectTrack(req.params.name);
	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});

// Game start
app.get('/start', function(req, res) {
	ratio = 1.0;
	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});

var dataTagCodes = settings.tagCodes;

// Get the bonus according to the key code
var getGoodBonus = function(code) {
	if (dataTagCodes.hasOwnProperty(code)) {
		var type = dataTagCodes[code][0],
			color = dataTagCodes[code][1];

		for (var pseudo in gamers) {

			var gamer = gamers[pseudo];
			if (gamer && gamer.color && gamer.color == color &&
				gamer.bonus.hasOwnProperty(type)) {
				return gamer.bonus[type];
			}
		}
	}

	return null;
};

// When the gamer add a tag
app.get('/put_tag/:code/:left/:top/:angle', function(req, res){
	console.log("Put_tag", req.params);
	var code =  parseInt(req.params.code, 10)),
		bonus = getGoodBonus(code);

	if (bonus) {
		// TODO pas maintenant bitch
		if (!bonus.active) {
			bonus.active = "true";
			console.log("OH YEAH");
		}

		if (bonus.active)
		{
			bonus.start([
				parseFloat(req.params.left),
				parseFloat(req.params.top)],
				parseFloat(req.params.angle));
			bonus.disable();
		}
		else
			console.log("**** YOU DON'T HAVE THE PERMISSION !!1");
	}
	else
		console.log("UNKNOWN TAG CODE: "+code);

	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});

// When the gamer remove a tag
app.get('/remove_tag/:code', function(req, res){
	console.log("remove_tag", req.params);
	console.log("ignored");

	/*var bonus = getGoodBonus(parseInt(req.params.code, 10));

	if (bonus)
		bonus.stop();
	else
		console.log("UNKNOWN TAG CODE");*/

	res.header("Access-Control-Allow-Origin", "*");
	res.send('ok');
});
//put_tag/:code/centreX(m)/centreY(m)/rotation?
//remove_tag/:code
//blob/centreX/centreY/larger/longueur

io.sockets.on('connection', function (socket) {
	console.log("Connection of a new gamer");

	var pseudo = null,
		gamer = null,
		car = null;

	// When the user send his pseudo
	socket.on('pseudo', function (data) {
		console.log(pseudo, "pseudo", data);
		pseudo = data;

		// Get back the gamer instance if a gamer
		// with the same pseudo already exist
		if (gamers.hasOwnProperty(pseudo))
			gamer = gamers[pseudo];
		else {
			// Create a new gamer
			gamer = new Gamer(pseudo, gameInstance);
			gamer.rank.pos = ++nbGamers;
			gamers[pseudo] = gamer;
		}

		// Save the socket on the gamer object
		// it could be used for sending informations
		// to the gamer in other parts of this program
		gamer.socket = socket;

		// When the user send his kart selection
		socket.on('kart', function(data) {
			console.log(pseudo, "kart", data);

			// Create a new car if necessary
			if (gamer.car === null)
				gamer.createCar();
			else
				console.log("A car is already associated with the gamer");

			// Set the color of the kart (the only one important information)
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
			 *           1 : UP, 0 :DOWN
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

				if (cmd[2] > 3)
					car.accelerate = cmd[1]  === 0 ? 2 : 1;
				else
					car.accelerate = 0;

				if (cmd[4] > 2)
					car.steer = cmd[3] === 0 ? 2 : 1;
				else
					car.steer = 0;

			});

			// When the user launcha bonus
			socket.on('bonus', function(data) {
				console.log(pseudo, "bonus", data);
				if (gamer.bonus.hasOwnProperty(data)) {
					var bonus = gamer.bonus[data];
					if (bonus.active)
					{
						bonus.start([0, 0], 0.0);
						bonus.disable();
					}
					else
						console.log("**** YOU DON'T HAVE THE PERMISSION !!1");
				} else {
					console.log("Unknown bonus");
				}
			});
		});
	});

	// On user disconnetion, it could be a network problem
	socket.on('disconnect', function() {
		console.log(pseudo, "user is disconnected");
		// Just set the car controls to nothing
		if (car) {
			car.accelerate = 0;
			car.steer = 0;
		}
	});

	// When the user send an explicit exit
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
