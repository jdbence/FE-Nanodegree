'use strict';
/**
* @description Star entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Star = function Star(row, col) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/Star.png',
		0,
		-(171 - 138) - Grid.offsetY);
	this.renderer = new Render(this);
	this.speed = 500;
	this.angle = Math.round(Math.random() * 180) * Math.PI / 180;
};

(function Prototype() {
	/**
	 * @description Moves the star in the direction of the angle and lowers opacity
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.x += this.speed * Math.cos(this.angle) * dt;
		this.y += this.speed * Math.sin(this.angle) * dt;
		this.alpha = Math.max(0.01, this.alpha - 1 * dt);
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.renderer.render(ctx);
	};
}).call(Star.prototype);
