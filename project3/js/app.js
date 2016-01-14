'use strict';
//  var player = new Player();
var player = Blueprint.create('player', {r: 5, c: 2});
var ui = new UI();
var scene = '';
var App = (function App() {
	var onPlayClicked = function onPlayClicked() {
		Scene.startGame(true);
	};
	var onReplayClicked = function onReplayClicked() {
		Scene.startGame();
	};
	var onMenuClicked = function onMenuClicked() {
		Scene.startMenu();
	};

	El.addListener(El.getElements('btn-play')[0], 'click', onPlayClicked);
	El.addListener(El.getElements('btn-replay')[0], 'click', onReplayClicked);
	El.addListener(El.getElements('btn-menu'), 'click', onMenuClicked);

	//	Default show the start menu
	Scene.startMenu();
	//	Scene.startGame();
})();
