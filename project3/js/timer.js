'use strict';
/**
* @description A Timer class that updates manually using with delta time
* @constructor
*/
var Timer = function Timer(intervals, delay) {
	this.intervals = intervals;
	this.delay = delay;
	this.running = false;
	this.listeners = {};
	this.time = 0;
	this.laps = 0;
};

(function Prototype() {
	/**
	 * @description Resets the timer and flags it as running
	 */
	this.start = function start() {
		this.running = true;
		this.time = this.delay;
		this.laps = this.intervals;
	};

	/**
	 * @description Uses the delta time to manually update the timer
	 * @param {number} delta - Time since last update
	 */
	this.update = function update(delta) {
		if (this.running) {
			this.time = Math.max(0, this.time - delta);
			if (this.time === 0) {
				this.laps -= 1;
				if (this.laps <= 0) {
					this.running = false;
					this.dispatch('COMPLETE');
				}else {
					this.time = this.delay;
					this.dispatch('UPDATE');
				}
			}
		}
	};

	/**
	 * @description Adds a listener for the specified event
	 * @param {string} event - The event to listen for
	 * @param {function} listener - The callback function
	 */
	this.on = function on(event, listener) {
		if (!this.listeners.hasOwnProperty(event)) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	};

	/**
	 * @description Attempts to invoke a callback method for the given event
	 * @param {string} event - The event to dispatch
	 */
	this.dispatch = function dispatch(event) {
		var i;
		var list;
		if (this.listeners.hasOwnProperty(event)) {
			list = this.listeners[event];
			for (i = 0; i < list.length; i++) {
				list[i](this);
			}
		}
	};
}).call(Timer.prototype);
