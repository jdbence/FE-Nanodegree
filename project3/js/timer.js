var Timer = function(intervals, delay){
    this.intervals = intervals;
    this.delay = delay;
    this.running = false;
    this.listeners = {};
    this.time = 0;
    this.laps = 0;
};

Timer.prototype.start = function(){
    this.running = true;
    this.time = this.delay;
    this.laps = this.intervals;
};

Timer.prototype.update = function(delta){
    if(this.running){
        this.time = Math.max(0, this.time - delta);
        if(this.time == 0){
            this.laps -= 1;
            if(this.laps <= 0){
                this.running = false;
                this.dispatch("COMPLETE");
            }else{
                this.time = this.delay;
                this.dispatch("UPDATE");
            }
        }
    }
};

Timer.prototype.on = function(event, listener){
    if(!this.listeners.hasOwnProperty(event)){
        this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
};

Timer.prototype.dispatch = function(event){
    var i;
    var list;
    if(this.listeners.hasOwnProperty(event)){
        list = this.listeners[event];
        for(i=0; i<list.length; i++){
            list[i](this);
        }
    }
};