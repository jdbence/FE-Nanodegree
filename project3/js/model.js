'use strict';
/**
* @description Model Singleton used for storing state data
* @constructor
*/
var Model = (function Model() {
	var data = {};
	var instance = function instance() {};

	/**
	 * @description Sets a value to a key
	 * @param {string} key - The property to store the value under
	 * @param {number} value - The value of the key
	 * @returns {*} The value of the key
	 */
	instance.set = function set(key, value) {
		data[key] = value;
		return value;
	};

	/**
	 * @description Returns the value set to the key
	 * @returns {*} The value of the key
	 */
	instance.get = function get(key) {
		return data[key];
	};

	return instance;
})();
