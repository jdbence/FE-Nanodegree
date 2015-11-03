var Sensor = function(x, y, width, height, offsetX, offsetY){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.debug = false;
};

Sensor.prototype.render = function(ctx){
    if(this.debug){
        ctx.beginPath();
        ctx.strokeStyle="red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
};

Sensor.prototype.update = function(x, y){
    this.x = x + this.offsetX;
    this.y = y + this.offsetY;
};