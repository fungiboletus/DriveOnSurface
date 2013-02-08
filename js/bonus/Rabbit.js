var Bonus = require('../Bonus'),
	Plot = require('../plot');

var Rabbit = function(gamer) {
	this.radius = 1;
	this.gamer = gamer;
};

Rabbit.prototype = new Bonus("Rabbit", 20000);

Rabbit.prototype.start = function(position, angle) {
	this.body = new Plot(this.radius, position, undefined, undefined, 0.25);

	this._start(position, angle);
};

Rabbit.prototype.stop = function() {
	this._stop();
};

module.exports = Rabbit;