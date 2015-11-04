/**
* @description Key entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Key = function(row, col){
    this.x = Grid.getXFromColumn(col);
    this.y = Grid.getYFromRow(row);
    this.sprite = 'images/Key.png';
    this.offsetY = -(171-138) - Grid.offsetY;
    this.offsetX = 0;
    this.isAlive = true;
    this.alpha = 1;
    this.flipped = false;
    this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
    this.renderer = new Render(this);
};

(function() {

    /**
    * @description Checks if this entity is colliding with the player
    * @param {int} dt - Time since last update
    */
    Key.prototype.update = function(dt) {
        this.sensor.position(this.x, this.y);
        if(player && player.isAlive && this.isAlive){
            if(Collision.isColliding(this.sensor, player.sensor)){
                this.isAlive = false;
                player.hit("key");
            }
        }
    };
    
    /**
    * @description Renders this entity to the canvas
    * @param {context} ctx - The canvas's context
    */
    Key.prototype.render = function(ctx) {
        this.renderer.render(ctx);
        this.sensor.render(ctx);
    };

}).call(Key.prototype);