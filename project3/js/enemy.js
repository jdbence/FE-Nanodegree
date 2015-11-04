/**
* @description Enemy entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
* @param {number} speed - The initial speed
*/
var Enemy = function(row, col, speed) {
    this.row = row;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
    this.x = Grid.getXFromColumn(col);
    this.y = Grid.getYFromRow(this.row);
    this.offsetY = -(171-138) - Grid.offsetY;
    this.sensor = new Sensor(0, 0, 50, 50, 25, 12);
    this.flipped = speed < 0;
    this.alpha = 1;
    this.renderer = new Render(this);
};

(function() {

    /**
    * @description Checks if this entity is colliding with the player and keeps target on screen by wrapping x location
    * @param {int} dt - Time since last update
    */
    this.update = function(dt) {
        
        this.x += dt * this.speed;
        
        //-- Wrap
        if(this.x > (Grid.columns * Grid.cellWidth) + Grid.cellWidth){
            this.x = Grid.getXFromColumn(0) - Grid.cellWidth;
        }else if(this.x < -Grid.cellWidth){
            this.x = (Grid.columns * Grid.cellWidth) + Grid.cellWidth;
        }
        
        this.sensor.position(this.x, this.y);
        if(player && player.isAlive){
            if(Collision.isColliding(this.sensor, player.sensor)){
                player.hit("enemy");
            }
        }
    };
    
    /**
    * @description Renders this entity to the canvas
    * @param {context} ctx - The canvas's context
    */
    this.render = function(ctx) {
        this.renderer.render(ctx);
        this.sensor.render(ctx);
    };

}).call(Enemy.prototype);