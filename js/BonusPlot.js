/**
 * Virtual line for a race.
 */

var Plot = require('./plot');

var BonusPlot = function(position) {

	this.box = new Plot(1, position, 'sensor');
	this.visible = true;
	this.respawnTime = 3000;
	this.position = position;

	var obj = this;
	this.box.body.onContact = function(car){
		obj.onContact(car);
	};
};


// Update the rank of a gamer with a very intelligent algorithm
// it's important to notice that with this algorithm, if a gamer
// take very often shortcuts, the gamers position could be buggy
BonusPlot.prototype.onContact = function(car) {
	if (this.visible) {

		this.visible = false;

		var gamer = car.associatedGamer;

		console.log(gamer.name, "BONUS");
		gamer.activateRandomBonus();

		var obj = this;
		setTimeout(function() {
			obj.visible = true;
		}, this.respawnTime);
	}
};

module.exports = BonusPlot;