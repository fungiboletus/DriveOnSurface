/*
 * A gamer (in real life)
 * This file is released under the CeCILL-B V1 licence.
 */

var BiggerEngine = require('./bonus/BiggerEngine'),
	Train = require('./bonus/Train'),
	Rabbit = require('./bonus/Rabbit'),
	Nails = require('./bonus/Nails');


var Gamer = function(name, game) {
	this.name = name;
	this.game = game;
	this.color = null;
	this.car = null;
	this.socket = null;
	this.currentBonus = null;
	this.rank = {turn:0, line: 0, pos: 0};

	// Create the bonus associated to the gamer
	this.bonus = {
		"biggerengine": new BiggerEngine(this),
		"train": new Train(this),
		"nails": new Nails(this),
		"rabbit": new Rabbit(this)
	};

	// Construct an array of the bonus keys
	this.bonusKeys = [];
	for (var key in this.bonus)
		if (this.bonus.hasOwnProperty(key))
			this.bonusKeys.push(key);
};

Gamer.prototype.createCar = function() {
	if (this.car !== null)
		this.car.removeFromTheWorld();

	this.car = this.game.newCar();
	this.car.associatedGamer = this;
};

Gamer.prototype.activateRandomBonus = function() {
	var bonus, key;

	// Select a random bonus, but different than the current bonus
	// so, it's not very random, but more fun
	do {
		key = this.bonusKeys[Math.floor(this.bonusKeys.length * Math.random())];
		bonus = this.bonus[key];
	} while (bonus === this.currentBonus);


	if (this.currentBonus && this.currentBonus.active)
		this.currentBonus.disable();

	this.currentBonus = bonus;
	bonus.enable();

	return bonus;
};

module.exports = Gamer;
