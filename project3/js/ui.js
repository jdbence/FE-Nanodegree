var UI = function(row, col){
    this.keys = this.levelTime = this.time = 0;
};

UI.prototype.start = function(){
    this.keys = Model.get("level");
    this.levelTime = this.time = 15;
    this.levelTimer = new Timer(this.levelTime, 1);
    
    var ref = this;
    this.levelTimer.on("COMPLETE", function(){
        ref.time = 0;
        endGame();
    });
    
    this.levelTimer.on("UPDATE", function(){
        ref.time -= 1;
    });
    this.levelTimer.start();
};

UI.prototype.update = function(dt) {
    this.keys = Model.get("level");
    this.levelTimer.update(dt);
};

UI.prototype.formattedTime = function() {
    return "00:" + (this.time > 9 ? this.time : "0" + this.time);
};

UI.prototype.render = function(ctx) {
    this.text(ctx, "Keys: x" + this.keys, 0, 30);
    this.text(ctx, "Time: " + this.formattedTime(), Engine.width, 30, "right");
};

UI.prototype.text = function(ctx, text, x, y, align){
    ctx.save();
    ctx.font = "30px Comic Sans MS";
    if(align == "left" || align == "right" || align == "center"){
        ctx.textAlign = align;
    }
    ctx.fillText(text, x, y); 
    ctx.restore();
};