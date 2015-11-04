/**
* @description Star entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Star = function(row, col){
    this.x = Grid.getXFromColumn(col);
    this.y = Grid.getYFromRow(row);
    this.sprite = 'images/Star.png';
    this.offsetY = -(171-138) - Grid.offsetY;
    this.offsetX = 0;
    this.isAlive = true;
    this.alpha = 1;
    this.flipped = false;
    this.renderer = new Render(this);
    this.speed = 500;
    this.angle = Math.round(Math.random()*180) * Math.PI / 180;
};

(function() {

    /**
    * @description Moves the star in the direction of the angle and lowers opacity
    * @param {int} dt - Time since last update
    */
    Star.prototype.update = function(dt) {
        this.x += this.speed * Math.cos(this.angle) * dt;
        this.y += this.speed * Math.sin(this.angle) * dt;
        this.alpha = Math.max(0.01, this.alpha - 1 * dt);
    };
    
    /**
    * @description Renders this entity to the canvas
    * @param {context} ctx - The canvas's context
    */
    Star.prototype.render = function(ctx) {
        this.renderer.render(ctx);
    };

}).call(Star.prototype);