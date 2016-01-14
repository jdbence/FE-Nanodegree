'use strict';
/**
* @description A component that renders the owners sprite according to position, alpha and direction
* @constructor
*/
var Movement = function Movement() {
	this.wrap = false;
};

(function Prototype() {
	/**
	 * @description Checks if this entity is colliding with the player and keeps target on screen by wrapping x location
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.owner.x += this.owner.speed * Math.cos(this.owner.angle) * dt;
		this.owner.y += this.owner.speed * Math.sin(this.owner.angle) * dt;
		
		//  Wrap
		if(this.wrap){
    		if (this.owner.x > (Grid.columns * Grid.cellWidth) + Grid.cellWidth) {
    			this.owner.x = Grid.getXFromColumn(0) - Grid.cellWidth;
    		} else if (this.owner.x < -Grid.cellWidth) {
    			this.owner.x = (Grid.columns * Grid.cellWidth) + Grid.cellWidth;
    		}
		}
	};
	
	this.render = function render(ctx) {
	};
}).call(Movement.prototype);
