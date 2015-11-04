/**
* @description Scene Singleton used for changing the scene view
* @constructor
*/
var Scene = (function() {
    
    var instance = function(){
    };
    
    var level = new Level();
    
    /**
    * @description Shows the Character selection scene
    */
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
    
    /**
    * @description Shows the Game scene
    */
    instance.startGame = function(reset){
        reset = reset || false;
        
        if(reset){
            level.reset();
        }else{
            Model.set("level_complete", false);
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
    
    /**
    * @description Shows the Game Over popup
    */
    instance.endGame = function(){
        El.show("gameover");
        Engine.pause();
    }
    
    /**
    * @description Shows the Game Win popup
    */
    instance.winGame = function(){
        El.show("gamewin");
        Engine.pause();
    }
    
    /**
    * @description The player picked up the key. Show star explosion and advance level after timeout
    */
    instance.levelComplete = function(){
        Model.set("level_complete", true);
        Engine.entities.push(new Explosion(0, 2));
        
        var ref = this;
        setTimeout(function(){
            ref.nextLevel();
        }, 1500);
    }
    
    /**
    * @description Advance to the next level or end the game if no more levels
    */
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