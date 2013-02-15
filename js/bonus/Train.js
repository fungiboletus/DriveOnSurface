/* This file is released under the CeCILL-B V1 licence. */
var Bonus = require('../Bonus'),
	Box = require('../boxprop');

var Train = function(gamer) {
	this.size = [20, 5];
	this.gamer = gamer;
};
	
Train.prototype = new Bonus("Train", 20000);

Train.prototype.start = function(position, angle) {
	this._start(position, angle);

	this.body = new Box(this.size, position, angle);
};

Train.prototype.stop = function() {
	this._stop();
};

module.exports = Train;
