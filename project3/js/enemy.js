'use strict';
/**
 * @description Enemy entity
 * @constructor
 * @param {int} row - The initial row
 * @param {int} col - The initial column
 * @param {number} speed - The initial speed
 */
var Enemy = function Enemy(row, col, speed) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/enemy-bug.png',
		0, -(171 - 138) - Grid.offsetY);
	this.row = row;
	this.speed = speed;
	this.flipped = speed < 0;
	this.sensor = new Sensor(0, 0, 50, 50, 25, 12);
	this.renderer = new Render(this);
};

(function Prototype() {

	/**
	 * @description Checks if this entity is colliding with the player and keeps target on screen by wrapping x location
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {

		this.x += dt * this.speed;

		//-- Wrap
		if (this.x > (Grid.columns * Grid.cellWidth) + Grid.cellWidth) {
			this.x = Grid.getXFromColumn(0) - Grid.cellWidth;
		} else if (this.x < -Grid.cellWidth) {
			this.x = (Grid.columns * Grid.cellWidth) + Grid.cellWidth;
		}

		this.sensor.position(this.x, this.y);
		if (player && player.isAlive) {
			if (Collision.isColliding(this.sensor, player.sensor)) {
				player.hit('enemy');
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

}).call(Enemy.prototype);
