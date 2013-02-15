/* This file is released under the CeCILL-B V1 licence. */
var Bonus = require('../Bonus'),
	Plot = require('../plot');

var Nails = function(gamer) {
	this.radius = 5;
	this.gamer = gamer;
};

Nails.prototype = new Bonus("Nails", 60000);

Nails.prototype.start = function(position, angle) {
	this._start(position, angle);

	// List of cars wich touch the nails
	this.body = new Plot(this.radius, position, 'sensor');

	var obj = this;
	this.body.body.onContact = function(car){
		obj.onContact(car);
	};
};

Nails.prototype.onContact = function(car) {
	if (car.nails_active) {
		delete car.nails_active;
		return;
	}

	var oldLinearDamping = car.body.GetLinearDamping(),
		oldPower = car.power;

	// Very important linear damping
	car.body.SetLinearDamping(2.5);
	car.power = 7.0;
	car.nails_active = true;

	setTimeout(function() {
		car.body.SetLinearDamping(oldLinearDamping);
		car.power = oldPower;
		delete car.nails_active;
	}, 10000);
};

module.exports = Nails;
