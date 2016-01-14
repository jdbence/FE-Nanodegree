'use strict';
/**
* @description Handles level creation
* @constructor
*/
var Level = function Level() {
	this.reset();
};

(function Prototype() {
	/**
	 * @description Reset's level variables to original values
	 */
	this.reset = function reset() {
		this.level = Model.set('level', 0);
		this.lastLevel = 7;
		Model.set('level_total_time', 15);
		Model.set('level_complete', false);
	};

	/**
	 * @description Advances the current level by one
	 */
	this.next = function next() {
		this.level = Model.set('level', this.level + 1);
	};

	/**
	 * @description Creates all the entities for the current level
	 */
	this.addEntities = function addEntities() {
		var data = this.levelData();
		var i;
		Engine.entities = [];

		for (i = 0; i < data.length; i++) {
			if (data[i].hasOwnProperty('t')) {
				Blueprint.create(data[i].t, data[i]);
			}else {
				Blueprint.create("enemy", data[i]);
			}
		}
	};

	/**
	 * @description Returns the JSON entities for the given level
	 * @returns {array}
	 */
	this.levelData = function levelData() {
		//  Formatted so it's easier to see the levels (not following Udacity JS standards)
		//  jscs:disable
		if (this.level === 0) {
			return [
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 1) {
			return [
			{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 2) {
			return [
			{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 3) {
			return [
			{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 4) {
			return [
			{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
			{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 5) {
			return [
			{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
			{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 6) {
			return [
			{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
			{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}
		//  jscs:disable
		return [
		{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
		{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
		{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
		{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
		];
	};
}).call(Level.prototype);
