/**
 * Virtual line for a race.
 *
 * This file is released under the CeCILL-B V1 licence.
 */

var BoxProp = require('./boxprop');

var Line = function(size, position, angle, lineNumber, lastLine) {

	this.box = new BoxProp(size, position, angle, 'sensor');
	this.lineNumber = lineNumber;
	this.lastLine = lastLine;

	var obj = this;
	this.box.body.onContact = function(car){
		console.log("*CANARD CANADR CARAD CANARD CANARD CANARD");
		obj.onContact(car);
	};

	// Array of gamers who have passed the line
	this.nbVisitors = 0;
};


// Update the rank of a gamer with a very intelligent algorithm
// it's important to notice that with this algorithm, if a gamer
// take very often shortcuts, the gamers position could be buggy
Line.prototype.onContact = function(car) {
	var gamer = car.associatedGamer;

	console.log(gamer.name, gamer.rank, this.lineNumber);

	if (gamer.rank.line < this.lineNumber) {

		gamer.rank.line = this.lineNumber;

		if (this.lastLine)
			++gamer.rank.turn;

		++this.nbVisitors;

		gamer.rank.pos = this.nbVisitors;
	}
};

module.exports = Line;
