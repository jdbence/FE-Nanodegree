'use strict';
/**
* @description A sensor used as a collision box that can be rendered to the screen for testing
* @constructor
* @param {number} x - The x location
* @param {number} y - The y location
* @param {number} width - How long the sensor is
* @param {number} height - How tall the sensor is
* @param {number} offsetX - The offset in the x direction
* @param {number} offsetY - The offset in the y direction
*/
var Sensor = function Sensor(x, y, width, height, offsetX, offsetY) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.debug = false;
};

(function Prototype() {
	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		if (this.debug) {
			ctx.beginPath();
			ctx.strokeStyle = 'red';
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.stroke();
		}
	};

	/**
	 * @description Updates the sensor's position
	 * @param {int} x - The x location
	 * @param {int} y - The y location
	 */
	this.position = function position(x, y) {
		this.x = x + this.offsetX;
		this.y = y + this.offsetY;
	};
}).call(Sensor.prototype);
