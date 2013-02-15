/* This file is released under the CeCILL-B V1 licence. */
var Bonus = require('../Bonus'),
	Plot = require('../plot');

var Rabbit = function(gamer) {
	this.radius = 0.98;
	this.gamer = gamer;
};

Rabbit.prototype = new Bonus("Rabbit", 60000);

Rabbit.prototype.start = function(position, angle) {
	this._start(position, angle);

	this.body = new Plot(this.radius, position, 'dynamic', undefined, 0.35);
};

Rabbit.prototype.stop = function() {
	this._stop();
};

// The rabbit is a dynamic object
// his position could change, so lets get the position of the rabbit
// body from the physical engine
Rabbit.prototype.getPosition = function() {
	var pos = this.body.body.GetPosition();
	return [pos.x, pos.y];
};


module.exports = Rabbit;
