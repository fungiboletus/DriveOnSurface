var Bonus = require('../Bonus');

var BiggerEngine = function(gamer) {
	this.newPower = 40;
	this.prototype = new Bonus("BiggerEngine", gamer, 5000);
};

BiggerEngine.prototype.start = function(position, angle) {
	if (gamer.car)
	{
		this._start(position, angle);
		this.oldPower = this.gamer.car.power;
		this.gamer.car.power =  this.newPower;
	}
	else
	{
		console.log("The BiggerEngine bonus can't be applied to a gamer without a car");
	}
};

BiggerEngine.prototype.stop = function() {
	this.gamer.car.power = this.oldPower;
	this._stop();
};

module.exports = BiggerEngine;