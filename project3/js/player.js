/**
* @description Player entity
* @constructor
*/
var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = this.y = 0;
    this.offsetY = -(171-138) - Grid.offsetY;
    this.offsetX = 0;
    this.isAlive = false;
    this.alpha = 0;
    this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
    this.renderer = new Render(this);
    this.blinkTimer = new Timer(5, 0.2);
    
    var ref = this;
    
    var onBlinkTimerComplete = function(){
        ref.alpha = 1;
        ref.isAlive = true;
    };
    
    var onBlinkTimerUpdate = function(){
        ref.alpha = (ref.alpha == 0.4 ? 1 : 0.4);
    };
    
    var onKeyUp = function(e){
        ref.handleInput(e);
    };
    
    this.blinkTimer.on("COMPLETE", onBlinkTimerComplete);
    this.blinkTimer.on("UPDATE", onBlinkTimerUpdate);
    document.addEventListener('keyup', onKeyUp);
    
    this.respawn();
};

(function() {
    
    var inputMap = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    
    var inputResponseMap = {
        "left":{"axis":"x", "dir":-1},
        "up":{"axis":"y", "dir":-1},
        "right":{"axis":"x", "dir":1},
        "down":{"axis":"y", "dir":1}
    };

    /**
    * @description Resets the player to the initial position
    */
    this.respawn = function(){
        this.sensor.x = this.x = Grid.getXFromColumn(2);
        this.sensor.y = this.y = Grid.getYFromRow(5);
        this.isAlive = false;
        this.alpha = 0.4;
        this.blinkTimer.start();
    };
    
    /**
    * @description A entity has hit the player
    * @param {string} invoker - Type of object that hit the player
    */
    this.hit = function(invoker){
        if(invoker == "water" || invoker == "enemy"){
            this.respawn();
        }else if(invoker == "key"){
            this.isAlive = false;
            Scene.nextLevel();
        }
    };
    
    /**
    * @description Gets the position on the grid based on player's input
    * @param {string} axis - The x or y axis
    * @param {input} dir - The positive or negative direction
    * @returns {number} The final position
    */
    this.getMovement = function(axis, dir){
        var v;
        
        if(axis == "x"){
            v = Math.floor(this.x / Grid.cellWidth) + dir;
            return Grid.getXFromColumn(v);
        }
        
        v = Math.floor(this.y / Grid.cellHeight) + dir;
        return Grid.getYFromRow(v);
    };
    
    /**
    * @description Changes the player position based on input
    * @param {event} e - The event that occured
    */
    this.handleInput = function(e) {
        var input = inputMap[e.keyCode];
        if(input && this.isAlive == true){
            var map = inputResponseMap[input];
            
            //-- Movement
            if(map.hasOwnProperty("axis")){
                this[map.axis] = this.getMovement(map.axis, map.dir);
            }
        }
    };
    
    /**
    * @description Updates the players timer and sensor
    * @param {number} dt - Time since last update
    */
    this.update = function(dt) {
        this.sensor.position(this.x, this.y);
        if(!this.isAlive){
            this.blinkTimer.update(dt);
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
    
}).call(Player.prototype);