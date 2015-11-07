'use strict';
/**
* @description Entity sets all default variables to the owner
* @constructor
* @param {object} owner - The initial row
* @param {number} x - The initial x location
* @param {number} y - The initial y location
* @param {string} sprite - The display sprite
* @param {number} offsetX - The initial x offset
* @param {number} offsetY - The initial y offset
*/
var Entity = function Entity(owner, x, y, sprite, offsetX, offsetY) {
	this.owner = owner;
	owner.x = x;
	owner.y = y;
	owner.sprite = sprite || null;
	owner.offsetX = offsetX || 0;
	owner.offsetY = offsetY || 0;
	owner.flipped = false;
	owner.alpha = 1;
	owner.isAlive = true;
	owner.speed = 0;
	owner.angle = 0;
};
