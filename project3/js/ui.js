/**
* @description The ingame information display
* @constructor
*/
var UI = function(){
    this.keys = 0;
    this.levelTime = 0;
    this.time = 0;
};

(function() {
    
    /**
    * @description Resets the level information and starts the game timer
    */
    this.start = function(){
        this.keys = Model.get("level");
        this.levelTime = 15;
        
        this.levelTimer = new Timer(1, this.levelTime);
        this.levelTimer.on("COMPLETE", this.onTimerComplete);
        this.levelTimer.start();
    };
    
    /**
    * @description The level timer has completed
    */
    this.onTimerComplete = function(){
         Scene.endGame();
    };
    
    /**
    * @description Formated string of time left (expects >0 && <60 seconds)
    * @returns {string} Seconds left on time
    */
    this.formattedTime = function() {
        var time = Math.round(this.levelTimer.time);
        return "00:" + (time > 9 ? time : "0" + time);
    };
    
    /**
    * @description Renders text to the screen
    * @param {context} ctx - The canvas's context
    * @param {string} text - The string to display
    * @param {number} x - The x location
    * @param {number} y - The y location
    * @param {string} align - The canvas's context
    */
    this.text = function(ctx, text, x, y, align){
        ctx.save();
        ctx.font = "30px Comic Sans MS";
        if(align == "left" || align == "right" || align == "center"){
            ctx.textAlign = align;
        }
        ctx.fillText(text, x, y); 
        ctx.restore();
    };
    
    /**
    * @description Updates the timer and key information
    * @param {int} dt - Time since last update
    */
    this.update = function(dt) {
        this.keys = Model.get("level");
        this.levelTimer.update(dt);
    };
    
    /**
    * @description Renders this entity to the canvas
    * @param {context} ctx - The canvas's context
    */
    this.render = function(ctx) {
        this.text(ctx, "Keys: x" + this.keys, 0, 30);
        this.text(ctx, "Time: " + this.formattedTime(), Engine.width, 30, "right");
    };
    
}).call(UI.prototype);