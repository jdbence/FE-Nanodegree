'use strict';
/**
* @description Entity sets all default variables to the owner
* @constructor
* @param {number} x - The initial x location
* @param {number} y - The initial y location
* @param {string} sprite - The display sprite
* @param {number} offsetX - The initial x offset
* @param {number} offsetY - The initial y offset
*/
var Entity = function Entity(x, y, sprite, offsetX, offsetY) {
	this.x = x;
	this.y = y;
	this.sprite = sprite || null;
	this.offsetX = offsetX || 0;
	this.offsetY = offsetY || 0;
	this.flipped = false;
	this.alpha = 1;
	this.isAlive = true;
	this.speed = 0;
	this.angle = 0;
	this.components = [];
	this.type = "";
};

(function Prototype() {
	/**
	 * @description Adds a component that will updated and rendered with the Entity
	 * @param {int} dt - Time since last update
	 * @return {Component} component - The Component to add
	 */
	this.addComponent = function addComponent(component) {
		if(this.components.indexOf(component) === -1){
			component.owner = this;
			this.components.push(component);
		}
		return component;
	};
	
	/**
	 * @description Call update on all entity components
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		var i, t = this.components.length;
		for (i = 0; i < t; i++) {
			this.components[i].update(dt);
		}
	};

	/**
	 * @description Call render on all entity components
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		var i, t = this.components.length;
		for (i = 0; i < t; i++) {
			this.components[i].render(ctx);
		}
	};
}).call(Entity.prototype);
