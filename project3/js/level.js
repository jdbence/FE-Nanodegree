/**
* @description Handles level creation
* @constructor
*/
var Level = function(){
    this.reset();
};

(function() {

    /**
    * @description Reset's level variables to original values
    */
    this.reset = function(){
        this.level = Model.set("level", 0);
        this.lastLevel = 7;
        Model.set("level_total_time", 15);
        Model.set("level_complete", false);
    };
    
    
    /**
    * @description Advances the current level by one
    */
    this.next = function(){
        this.level = Model.set("level", this.level + 1);
    };
    
    /**
    * @description Creates all the entities for the current level
    */
    this.addEntities = function(){
        var data = this.levelData();
        
        Engine.entities = [];
        
        for(i=0; i<data.length; i++){
            if(data[i].hasOwnProperty("t")){
                if(data[i].t == "key"){
                    Engine.entities.push(new Key(data[i].r, data[i].c));
                }else if(data[i].t == "water"){
                    Engine.entities.push(new Water(data[i].r, data[i].c));
                }
            }else{
                Engine.entities.push(new Enemy(data[i].r, data[i].c, data[i].s));
            }
        }
    };
    
    /**
    * @description Returns the JSON entities for the given level
    * @returns {array}
    */
    this.levelData = function(){
        
        //Formatted so it's easier to see the levels (not following Udacity JS standards)
        if(this.level == 0){
            return [
                {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
            ];
        }else if(this.level == 1){
            return [
                {"r":3,"c":0,"s":200},{"r":3,"c":2,"s":200},{"r":3,"c":4,"s":200},
                {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
            ];
        }else if(this.level == 2){
            return [
                {"r":1,"c":0,"s":-100},{"r":1,"c":1,"s":-100},{"r":1,"c":3,"s":-100},{"r":1,"c":4,"s":-100},
                {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
            ];
        }else if(this.level == 3){
            return [
                {"r":2,"c":0,"s":500},{"r":2,"c":4,"s":600},
                {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
            ];
        }else if(this.level == 4){
            return [
                {"r":1,"c":0,"s":-100},{"r":1,"c":1,"s":-100},{"r":1,"c":3,"s":-100},{"r":1,"c":4,"s":-100},
                {"r":3,"c":0,"s":200},{"r":3,"c":2,"s":200},{"r":3,"c":4,"s":200},
                {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
            ];
        }else if(this.level == 5){
            return [
                {"r":2,"c":0,"s":500},{"r":2,"c":4,"s":600},
                {"r":3,"c":0,"s":200},{"r":3,"c":2,"s":200},{"r":3,"c":4,"s":200},
                {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
            ];
        }else if(this.level == 6){
            return [
                {"r":1,"c":0,"s":-100},{"r":1,"c":1,"s":-100},{"r":1,"c":3,"s":-100},{"r":1,"c":4,"s":-100},
                {"r":2,"c":0,"s":500},{"r":2,"c":4,"s":600},
                {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
            ];
        }
        
        return [
            {"r":1,"c":0,"s":-100},{"r":1,"c":1,"s":-100},{"r":1,"c":3,"s":-100},{"r":1,"c":4,"s":-100},
            {"r":2,"c":0,"s":500},{"r":2,"c":4,"s":600},
            {"r":3,"c":0,"s":200},{"r":3,"c":2,"s":200},{"r":3,"c":4,"s":200},
            {"r":0,"c":0,"t":"water"},{"r":0,"c":1,"t":"water"},{"r":0,"c":2,"t":"key"},{"r":0,"c":3,"t":"water"},{"r":0,"c":4,"t":"water"}
        ];
    };

}).call(Level.prototype);