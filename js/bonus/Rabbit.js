var Bonus = require('../Bonus'),
	Plot = require('../plot');

var Rabbit = function(gamer) {
	this.radius = 1.2;
	this.prototype = new Bonus("Rabbit", gamer, 30000);
};

Rabbit.prototype.start = function(postion, angle) {
	this.body = new Plot(this.radius, position);

	this._start(position, angle);
};

Rabbit.prototype.stop = function() {
	this._stop();
};

module.exports = Rabbit;