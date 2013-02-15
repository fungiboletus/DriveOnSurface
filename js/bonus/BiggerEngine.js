/* This file is released under the CeCILL-B V1 licence.*/
var Bonus = require('../Bonus');

var BiggerEngine = function(gamer) {
	this.newPower = 40;
	this.gamer = gamer;
};

BiggerEngine.prototype = new Bonus("BiggerEngine", 5000);

BiggerEngine.prototype.start = function(position, angle) {
	if (this.gamer.car)
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
	if (this.visible) {
		this.gamer.car.power = this.oldPower;
		this._stop();
	}
};

module.exports = BiggerEngine;
