var Render = function(owner){
    this.owner = owner;
};

Render.prototype.render = function(ctx){
    if(this.owner.flipped){
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(Resources.get(this.owner.sprite), -this.owner.x, this.owner.y + this.owner.offsetY, 101*-1, 171);
        ctx.restore();
    }else{
        ctx.save();
        ctx.globalAlpha = this.owner.alpha;
        ctx.drawImage(Resources.get(this.owner.sprite), this.owner.x, this.owner.y + this.owner.offsetY);
        ctx.restore();
    }
};