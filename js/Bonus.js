/*
 * Bonus for a gamer.
 */

var Bonus = function(name, gamer, duration) {
	this.name = name;
	this.gamer = gamer;
	this.active = false;
	this.duration = duration;
	this.position = [0.0, 0.0];
	this.angle = 0.0;
	this.visible = false;

	// Sensor by default
	this.sensor = true;

	// If dynamic, remove sensor property
	this.dynamic = false;
};

Bonus.prototype.enable = function() {
	this.active = true;
	this.gamer.socket.emit('enableBonus', this.name);
};

Bonus.prototype.disable = function() {
	this.active = false;
	this.gamer.socket.emit('disableBonus', this.name);
};

/** This methods should be overidded if necessary */
Bonus.prototype.start = function(position, angle) {
	this._start(position, angle);
};

Bonus.prototype.stop = function() {
	this._stop();
};

/** Classical methods for start and stop bonus. */
Bonus.prototype._start = function(position, angle) {
	console.log("Start bonus " + this.name);
	this.position = position;
	this.angle = angle;
	this.visible = true;

	var obj = this;
	window.setTimeout(function() {
		obj.stop();
	}, this.duration);
};

Bonus.prototype._stop = function() {
	console.log("End bonus " + this.name);
	this.visible = false;
	console.log(this.body);

	if (this.body)
		b2world.DestroyBody(this.body);
};

module.exports = Bonus;
