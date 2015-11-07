'use strict';
/**
 * @description El Singleton used for manipulating DOM elements
 * @constructor
 */
var El = (function El() {
	var instance = function instance() {};

	/**
	 * @description Removes the className from each element in the array
	 * @param {array} elements - Array of DOM elements
	 * @param {string} className - Class to remove
	 */
	instance.removeClass = function removeClass(elements, className) {
		var i, c;
		if (elements) {
			if (!this.isHTMLCollection(elements)) {
				elements = [elements];
			}
			for (i = 0; i < elements.length; i++) {
				c = elements[i].className.replace(' ' + className, '');
				elements[i].className = c;
			}
		}
	};

	/**
	 * @description Adds the className on each element in the array
	 * @param {array} elements - Array of DOM elements
	 * @param {string} className - Class to add
	 */
	instance.addClass = function addClass(elements, className) {
		var i;

		if (elements) {
			if (!this.isHTMLCollection(elements)) {
				elements = [elements];
			}
			for (i = 0; i < elements.length; i++) {
				if (elements[i].className.indexOf(' ' + className) < 0) {
					elements[i].className += ' ' + className;
				}
			}
		}
	};

	/**
	 * @description Adds a listener on the element
	 * @param {array} elements - Array of DOM elements
	 * @param {string} event - Event to listen for
	 * @param {function} callback - Function to call when the event is captured
	 */
	instance.addListener = function addListener(elements, event, callback) {
		var i;

		if (elements) {
			if (elements.length === undefined) {
				elements = [elements];
			}
			for (i = 0; i < elements.length; i++) {
				elements[i].addEventListener(event, callback);
			}
		}
	};

	/**
	 * @description Removes the hidden class from the elements with the given className or #ID
	 * @param {string} identifier - The elements to find
	 */
	instance.show = function show(identifier) {
		this.removeClass(this.getElements(identifier), 'hidden');
	};

	/**
	 * @description Adds the hidden class on the elements with the given className or #ID
	 * @param {string} identifier - The elements to find
	 */
	instance.hide = function hide(identifier) {
		this.addClass(this.getElements(identifier), 'hidden');
	};

	/**
	 * @description Finds all the elements with the className or #ID
	 * @param {string} identifier - The elements to find
	 */
	instance.getElements = function getElements(identifier) {
		if (this.isString(identifier)) {
			if (identifier.indexOf('#') !== -1) {
				return document.getElementById(identifier);
			}
			return document.getElementsByClassName(identifier);
		}
		return null;
	};

	/**
	 * @description Checks if the variable is a string
	 * @param {string} variable - The variable to check
	 */
	instance.isString = function isString(variable) {
		return this.isType(variable, '[object String]');
	};

	/**
	 * @description Checks if the variable is a HTMLCollection
	 * @param {string} variable - The variable to check
	 */
	instance.isHTMLCollection = function isHTMLCollection(variable) {
		return this.isType(variable, '[object HTMLCollection]');
	};

	/**
	 * @description Checks if the variable is the type
	 * @param {string} variable - The variable to check
	 */
	instance.isType = function isType(variable, type) {
		return Object.prototype.toString.call(variable) === type;
	};

	return instance;
})();
