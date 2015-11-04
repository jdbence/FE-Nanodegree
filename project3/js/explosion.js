/**
* @description Key entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Explosion = function(row, col){
    this.stars = [];
    this.addStars(row, col, 10);
};

(function() {
    
    /**
    * @description Adds the stars
    * @param {int} row - The y location
    * @param {int} col - The x location
    * @param {int} total - Amount of stars
    */
    Explosion.prototype.addStars = function(row, col, total){
        var i;
        for(i=0; i<total; i++){
            this.stars.push(new Star(row, col));
        }
    }

    /**
    * @description Moves all the stars
    * @param {int} dt - Time since last update
    */
    Explosion.prototype.update = function(dt) {
        var total = this.stars.length;
        var i;
        if(total > 0){
            if(this.stars[0].alpha <= 0.01){
                this.stars = [];
            }else{
                for(i=0; i<total; i++){
                    this.stars[i].update(dt);
                }
            }
        }
    };
    
    /**
    * @description Renders the stars to the canvas
    * @param {context} ctx - The canvas's context
    */
    Explosion.prototype.render = function(ctx) {
        var total = this.stars.length;
        var i;
        for(i=0; i<total; i++){
            this.stars[i].render(ctx);
        }
    };

}).call(Explosion.prototype);