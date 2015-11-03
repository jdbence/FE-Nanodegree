// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = this.y = 0;
    this.offsetY = -(171-138) - Grid.offsetY;
    this.offsetX = 0;
    this.isAlive = false;
    this.alpha = 0;
    this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
    this.renderer = new Render(this);
   
    var ref = this;
    this.blinkTimer = new Timer(5, 0.2);
    this.blinkTimer.on("COMPLETE", function(){
        ref.alpha = 1;
        ref.isAlive = true;
    });
    
    this.blinkTimer.on("UPDATE", function(){
        ref.alpha = (ref.alpha == 0.4 ? 1 : 0.4);
    });
    
    this.respawn();
};

Player.prototype.respawn = function(){
    this.sensor.x = this.x = Grid.getXFromColumn(2);
    this.sensor.y = this.y = Grid.getYFromRow(5);
    this.isAlive = false;
    this.alpha = 0.4;
    this.blinkTimer.start();
};

Player.prototype.hit = function(invoker){
    if(invoker == "water" || invoker == "enemy"){
        this.respawn();
    }else if(invoker == "key"){
        this.isAlive = false;
        nextLevel();
    }
};

Player.prototype.update = function(dt) {
    
    this.sensor.update(this.x, this.y);
    
    if(!this.isAlive){
        this.blinkTimer.update(dt);
    }
};

Player.prototype.render = function(ctx) {
    this.renderer.render(ctx);
    this.sensor.render(ctx);
};

Player.prototype.getMovement = function(axis, dir){
    var v;
    
    if(axis == "x"){
        v = Math.floor(this.x / Grid.cellWidth) + dir;
        return Grid.getXFromColumn(v);
    }
    
    v = Math.floor(this.y / Grid.cellHeight) + dir;
    return Grid.getYFromRow(v);
};

Player.prototype.handleInput = function(input) {
    if(input && this.isAlive == true){
        var map = inputResponseMap[input];
        
        //-- Movement
        if(map.hasOwnProperty("axis")){
            this[map.axis] = this.getMovement(map.axis, map.dir);
        }
    }
};