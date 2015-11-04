/**
* @description A component that renders the owners sprite according to position, alpha and direction
* @constructor
*/
var Render = function(owner){
    this.owner = owner;
};

(function() {

    /**
    * @description Renders the owner's sprite
    * @param {context} ctx - The canvas's context
    */
    this.render = function(ctx){
        var flipped = this.owner.flipped ? -1 : 1;
        var x = flipped == 1 ? this.owner.x * flipped : this.owner.x * flipped - 101;
        ctx.save();
        ctx.scale(flipped, 1);
        ctx.globalAlpha = this.owner.alpha || 1;
        ctx.drawImage(Resources.get(this.owner.sprite), x, this.owner.y + this.owner.offsetY, 101, 171);
        ctx.restore();
    };

}).call(Render.prototype);