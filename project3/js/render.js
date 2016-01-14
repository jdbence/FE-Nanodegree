'use strict';
/**
* @description A component that renders the owners sprite according to position, alpha and direction
* @constructor
*/
var Render = function Render() {
};

(function Prototype() {
	var p = {x: 0, y: 0};
	/**
	  * @description Renders the owner's sprite
	  * @param {context} ctx - The canvas's context
	  */
	this.render = function render(ctx) {
		var flipped = this.owner.flipped ? -1 : 1;
		var pos = this.getPosition();
		ctx.save();
		ctx.scale(flipped, 1);
		ctx.globalAlpha = this.owner.alpha || 1;
		ctx.drawImage(Resources.get(this.owner.sprite), pos.x, pos.y, 101, 171);
		ctx.restore();
	};
	
	/**
	 * @description Update
	 * @param {number} dt - Time since last update
	 */
	this.update = function update(dt) {
	};

	/**
	  * @description Returns the formatted position
	  */
	this.getPosition = function getPosition() {
		var flipped = this.owner.flipped ? -1 : 1;
		p.x = (this.owner.x + this.owner.offsetX) * flipped;
		p.x += (flipped === 1 ? 0 : -101);
		p.y = this.owner.y + this.owner.offsetY;
		return p;
	};
}).call(Render.prototype);
