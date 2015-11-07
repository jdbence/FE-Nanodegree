'use strict';
/**
* @description Grid Singleton used for positioning things on a Grid
* @constructor
*/
var Grid = (function Grid() {
	var instance = function instance() {};

	instance.cellWidth = 101;
	instance.cellHeight = 83;
	instance.columns = 5;
	instance.rows = 6;
	instance.offsetY = 50;

	/**
	 * @description Determines the x location based on the column
	 * @param {int} column - The column
	 * @returns {number} The screen x position
	 */
	instance.getXFromColumn = function getXFromColumn(column) {
		var col = Math.max(0, Math.min(column, instance.columns - 1));
		return col * instance.cellWidth;
	};

	/**
	 * @description Determines the y location based on the row
	 * @param {int} row - The row
	 * @returns {number} The screen y position
	 */
	instance.getYFromRow = function getYFromRow(row) {
		row = Math.max(0, Math.min(row, instance.rows - 1));
		return instance.offsetY + row * instance.cellHeight;
	};

	return instance;
})();
