'use strict';
/**
* @description A component that renders the owners sprite according to position, alpha and direction
* @constructor
*/
var KeyboardInput = function KeyboardInput() {
	var ref = this;
	var onKeyUp = function onKeyUp(event) {
		ref.handleInput(event);
	};
	var start = {x:0, y:0};
	var end = {x:0, y:0};
	
	var distance = function distance(x1, x2, y1, y2) {
		return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
	};
	
	document.addEventListener('keyup', onKeyUp);
	document.addEventListener("touchstart", function(event) {
		start.x = event.changedTouches[0].pageX;
		start.y = event.changedTouches[0].pageY;
	});
	document.addEventListener("touchend", function(event) {
		end.x = event.changedTouches[0].pageX;
		end.y = event.changedTouches[0].pageY;
		var angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI + 180;
		var d = distance(start.x, end.x, start.y, end.y);
		
		if(d > 5){
			if(angle >= 45 && angle <= 135){
				ref.handleInput({keyCode:38});
			}else if(angle >= 135 && angle <= 225){
				ref.handleInput({keyCode:39});
			}else if(angle >= 225 && angle <= 315){
				ref.handleInput({keyCode:40});
			}else{
				ref.handleInput({keyCode:37});
			}
		}else{
			ref.handleInput({keyCode:38});
		}
	});
};

(function Prototype() {
    var inputMap = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	var inputResponseMap = {
		left: {axis: 'x', dir: -1},
		up: {axis: 'y', dir: -1},
		right: {axis: 'x', dir: 1},
		down: {axis: 'y', dir: 1}
	};
	
	/**
	 * @description Gets the position on the grid based on player's input
	 * @param {string} axis - The x or y axis
	 * @param {input} dir - The positive or negative direction
	 * @returns {number} The final position
	 */
	this.getMovement = function getMovement(axis, dir) {
		var v;

		if (axis === 'x') {
			v = Math.floor(this.owner.x / Grid.cellWidth) + dir;
			return Grid.getXFromColumn(v);
		}

		v = Math.floor(this.owner.y / Grid.cellHeight) + dir;
		return Grid.getYFromRow(v);
	};
	
	/**
	 * @description Changes the player position based on input
	 * @param {event} event - The event that occured
	 */
	this.handleInput = function handleInput(event) {
		var input = inputMap[event.keyCode];
		
		if (input && this.owner.isAlive === true && !Model.get('level_complete')) {
			var map = inputResponseMap[input];

			//  Movement
			if (map.hasOwnProperty('axis')) {
				this.owner[map.axis] = this.getMovement(map.axis, map.dir);
			}
		}
	};
    
	/**
	 * @description Checks if this entity is colliding with the player and keeps target on screen by wrapping x location
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
	};
	
	this.render = function render(ctx) {
	};
}).call(KeyboardInput.prototype);
