/**
* @description Scene Singleton used for changing the scene view
* @constructor
*/
var Scene = (function() {
    
    var instance = function(){
    };
    
    var level = new Level();
    
    instance.startMenu = function(){
        var characters = document.getElementsByClassName("char");
        var i;
        
        for(i=0; i<characters.length; i++){
            characters[i].addEventListener("click", function(el){
                var s = el.target.src;
                player.sprite = s.slice(s.indexOf("/images/")+1, s.length);
                
                El.removeClass(document.getElementsByClassName("selected-char"), "selected-char");
                El.addClass(el.target, "selected-char");
            });
        }
        
        Engine.reset();
        
        El.show("char_select");
        El.hide("level");
        El.hide("gameover");
        El.hide("gamewin");
        scene = "char_select";
    }
    
    instance.startGame = function(reset){
        reset = reset || false;
        
        if(reset){
            level.reset();
        }
        
        Engine.preload();
        player.respawn();
        
        level.addEntities();
        Engine.entities.push(ui);
        ui.start();
        
        El.show("level");
        El.hide("char_select");
        El.hide("gameover");
        El.hide("gamewin");
        scene = "level";
    }
    
    instance.endGame = function(){
        El.show("gameover");
        Engine.pause();
    }
    
    instance.winGame = function(){
        El.show("gamewin");
        Engine.pause();
    }
    
    instance.nextLevel = function(){
        level.next();
        
        if(level.level > level.lastLevel){
            this.winGame();
        }else{
            this.startGame();
        }
    }
    
    return instance;
    
})();