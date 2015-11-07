'use strict';
/**
* @description Water entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Water = function Water(row, col) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/Key.png',
		0,
		-(171 - 138) - Grid.offsetY);
	this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
};

(function Prototype() {
	/**
	 * @description Checks if this entity is colliding with the player
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.sensor.position(this.x, this.y);

		if (player && player.isAlive) {
			if (Collision.isColliding(this.sensor, player.sensor)) {
				player.hit('water');
			}
		}
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.sensor.render(ctx);
	};
}).call(Water.prototype);
