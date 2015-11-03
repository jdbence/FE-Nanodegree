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

Key.prototype.update = function(dt) {
    
    this.sensor.update(this.x, this.y);
    
    if(player && player.isAlive){
        if(Collision.isColliding(this.sensor, player.sensor)){
            player.hit("key");
        }
    }
};

Key.prototype.render = function(ctx) {
    this.renderer.render(ctx);
    this.sensor.render(ctx);
};