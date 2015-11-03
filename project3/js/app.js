var player = new Player();
var level = new Level();
var ui = new UI();
var scene = "";

var inputResponseMap = {
    "left":{"axis":"x", "dir":-1},
    "up":{"axis":"y", "dir":-1},
    "right":{"axis":"x", "dir":1},
    "down":{"axis":"y", "dir":1}
};

var inputMap = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

//-- Default show the start menu
startMenu();


addListener(document.getElementsByClassName("btn-play")[0], "click", onMenuStartGame);
addListener(document.getElementsByClassName("btn-replay")[0], "click", startGame);
addListener(document.getElementsByClassName("btn-menu"), "click", startMenu);

function onMenuStartGame(){
    level.reset();
    startGame();
}

function startMenu(){
    var characters = document.getElementsByClassName("char");
    var i;
    
    for(i=0; i<characters.length; i++){
        characters[i].addEventListener("click", function(el){
            var s = el.target.src;
            player.sprite = s.slice(s.indexOf("/images/")+1, s.length);
            
            removeClass(document.getElementsByClassName("selected-char"), "selected-char");
            addClass(el.target, "selected-char");
        });
    }
    
    Engine.reset();
    
    show("char_select");
    hide("level");
    hide("gameover");
    hide("gamewin");
    scene = "char_select";
}

function startGame(){
    Engine.preload();
    player.respawn();
    
    level.addEntities();
    Engine.entities.push(ui);
    ui.start();
    
    show("level");
    hide("char_select");
    hide("gameover");
    hide("gamewin");
    scene = "level";
}

function endGame(){
    show("gameover");
    Engine.pause();
}

function winGame(){
    show("gamewin");
    Engine.pause();
}

function nextLevel(){
    level.next();
    
    if(level.level > level.lastLevel){
        winGame();
    }else{
        startGame();
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    
    if(scene == "level"){
        player.handleInput(inputMap[e.keyCode]);
    }
    
});
