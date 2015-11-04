var player = new Player();
var ui = new UI();
var scene = "";

var App = (function(){
    
    var onPlayClicked = function(){
        Scene.startGame(true);
    };
    
    var onReplayClicked = function(){
        Scene.startGame();
    };
    
    var onMenuClicked = function(){
        Scene.startMenu();
    };
    
    El.addListener(document.getElementsByClassName("btn-play")[0], "click", onPlayClicked);
    El.addListener(document.getElementsByClassName("btn-replay")[0], "click", onReplayClicked);
    El.addListener(document.getElementsByClassName("btn-menu"), "click", onMenuClicked);
    
    //-- Default show the start menu
    Scene.startMenu();
    //Scene.startGame();
})();