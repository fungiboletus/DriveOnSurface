/* This file is released under the CeCILL-B V1 licence. */
var Bonus = require('../Bonus'),
	Plot = require('../plot');

var Nails = function(gamer) {
	this.radius = 5;
	this.gamer = gamer;
};

Nails.prototype = new Bonus("Nails", 120000);

Nails.prototype.start = function(position, angle) {
	// List of cars wich touch the nails
	this.victims = [];
	this.body = new Plot(this.radius, position, 'sensor');

	var obj = this;
	this.body.onContact = function(car){
		obj.onContact(car);
	};

	this._start(position, angle);
};

Nails.prototype.stop = function() {
	if (this.visible) {
		// Restore the olds linear damping values
		for (var i = 0, len = this.victims.length; i < len; ++i)
		{
			var car = this.victims[i];
			car.linearDamping = car.oldLinearDamping;
			delete car.oldLinearDamping;
		}

		this._stop();
	}
};

Nails.prototype.onContact = function(car) {
	this.victims.push(car);
	car.oldLinearDamping = car.linearDamping;
	// Very important linear damping
	car.linearDamping = 2.66;
};

module.exports = Nails;
