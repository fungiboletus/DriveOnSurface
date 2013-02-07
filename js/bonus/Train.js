var Bonus = require('../Bonus'),
	Box = require('../boxprop');

var Train = function(gamer) {
	this.size = [20, 5];
	this.prototype = new Bonus("Train", gamer, 3500);
};

Train.prototype.start = function(postion, angle) {
	this.body = new Box(this.size, position, angle);

	this._start(position, angle);
};

Train.prototype.stop = function() {
	this._stop();
};

module.exports = Train;