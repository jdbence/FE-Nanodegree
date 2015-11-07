'use strict';
/**
 * @description Collision Singleton used for checking collision between two sensors
 * @constructor
 */
var Collision = (function Prototype() {
	var instance = function instance() {};
	/**
	 * @description Uses box collision to check if two sensors are touching
	 * @param {Senor} sensorA - Bounding rect A
	 * @param {Senor} sensorB - Bounding rect B
	 * @returns {boolean} based on sensor overlap
	 */
	instance.isColliding = function isColliding(sensorA, sensorB) {
		return (sensorA.x < sensorB.x + sensorB.width &&
			sensorA.x + sensorB.width > sensorB.x &&
			sensorA.y < sensorB.y + sensorB.height &&
			sensorA.height + sensorA.y > sensorB.y);
	};
	return instance;
})();
