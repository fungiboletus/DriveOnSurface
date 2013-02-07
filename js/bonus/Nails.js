var Bonus = require('../Bonus'),
	Plot = require('../plot');

var Nails = function(gamer) {
	this.newPower = 40;
	this.radius = 10;
	this.prototype = new Bonus("Nails", gamer, 10000);
};

Nails.prototype.start = function(postion, angle) {
	// List of cars wich touch the nails
	this.victims = [];
	this.body = new Plot(this.radius, position, 'sensor');

	var obj = this;
	this.body.onContact = function(car){
		obj.onContactAction(car);
	};

	this._start(position, angle);
};

Nails.prototype.stop = function() {

	// Restore the olds linear damping values
	for (var i = 0, len = this.victims.length; i < len; ++i)
	{
		var car = this.victims[i];
		car.linearDamping = car.oldLinearDamping;
		delete car.oldLinearDamping;
	}

	this._stop();
};

Nails.prototype.onContactAction = function(car) {
	this.victims.push(car);
	car.oldLinearDamping = car.linearDamping;
	// Very important linear damping
	car.linearDamping = 1.66;
};

module.exports = Nails;