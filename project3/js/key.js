'use strict';
/**
* @description Key entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Key = function Key(row, col) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/Key.png',
		0,
		-(171 - 138) - Grid.offsetY);
	this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
	this.renderer = new Render(this);
};

(function Prototype() {
	/**
	 * @description Checks if this entity is colliding with the player
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.sensor.position(this.x, this.y);
		if (player && player.isAlive && this.isAlive) {
			if (Collision.isColliding(this.sensor, player.sensor)) {
				this.isAlive = false;
				player.hit('key');
			}
		}
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.renderer.render(ctx);
		this.sensor.render(ctx);
	};
}).call(Key.prototype);
