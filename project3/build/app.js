'use strict';
/**
 * @description El Singleton used for manipulating DOM elements
 * @constructor
 */
var El = (function El() {
	var instance = function instance() {};

	/**
	 * @description Removes the className from each element in the array
	 * @param {array} elements - Array of DOM elements
	 * @param {string} className - Class to remove
	 */
	instance.removeClass = function removeClass(elements, className) {
		var i, c;
		if (elements) {
			if (!this.isHTMLCollection(elements)) {
				elements = [elements];
			}
			for (i = 0; i < elements.length; i++) {
				c = elements[i].className.replace(' ' + className, '');
				elements[i].className = c;
			}
		}
	};

	/**
	 * @description Adds the className on each element in the array
	 * @param {array} elements - Array of DOM elements
	 * @param {string} className - Class to add
	 */
	instance.addClass = function addClass(elements, className) {
		var i;

		if (elements) {
			if (!this.isHTMLCollection(elements)) {
				elements = [elements];
			}
			for (i = 0; i < elements.length; i++) {
				if (elements[i].className.indexOf(' ' + className) < 0) {
					elements[i].className += ' ' + className;
				}
			}
		}
	};

	/**
	 * @description Adds a listener on the element
	 * @param {array} elements - Array of DOM elements
	 * @param {string} event - Event to listen for
	 * @param {function} callback - Function to call when the event is captured
	 */
	instance.addListener = function addListener(elements, event, callback) {
		var i;

		if (elements) {
			if (elements.length === undefined) {
				elements = [elements];
			}
			for (i = 0; i < elements.length; i++) {
				elements[i].addEventListener(event, callback);
			}
		}
	};

	/**
	 * @description Removes the hidden class from the elements with the given className or #ID
	 * @param {string} identifier - The elements to find
	 */
	instance.show = function show(identifier) {
		this.removeClass(this.getElements(identifier), 'hidden');
	};

	/**
	 * @description Adds the hidden class on the elements with the given className or #ID
	 * @param {string} identifier - The elements to find
	 */
	instance.hide = function hide(identifier) {
		this.addClass(this.getElements(identifier), 'hidden');
	};

	/**
	 * @description Finds all the elements with the className or #ID
	 * @param {string} identifier - The elements to find
	 */
	instance.getElements = function getElements(identifier) {
		if (this.isString(identifier)) {
			if (identifier.indexOf('#') !== -1) {
				return document.getElementById(identifier);
			}
			return document.getElementsByClassName(identifier);
		}
		return null;
	};

	/**
	 * @description Checks if the variable is a string
	 * @param {string} variable - The variable to check
	 */
	instance.isString = function isString(variable) {
		return this.isType(variable, '[object String]');
	};

	/**
	 * @description Checks if the variable is a HTMLCollection
	 * @param {string} variable - The variable to check
	 */
	instance.isHTMLCollection = function isHTMLCollection(variable) {
		return this.isType(variable, '[object HTMLCollection]');
	};

	/**
	 * @description Checks if the variable is the type
	 * @param {string} variable - The variable to check
	 */
	instance.isType = function isType(variable, type) {
		return Object.prototype.toString.call(variable) === type;
	};

	return instance;
})();

'use strict';
/**
* @description Entity sets all default variables to the owner
* @constructor
* @param {object} owner - The initial row
* @param {number} x - The initial x location
* @param {number} y - The initial y location
* @param {string} sprite - The display sprite
* @param {number} offsetX - The initial x offset
* @param {number} offsetY - The initial y offset
*/
var Entity = function Entity(owner, x, y, sprite, offsetX, offsetY) {
	this.owner = owner;
	owner.x = x;
	owner.y = y;
	owner.sprite = sprite || null;
	owner.offsetX = offsetX || 0;
	owner.offsetY = offsetY || 0;
	owner.flipped = false;
	owner.alpha = 1;
	owner.isAlive = true;
	owner.speed = 0;
	owner.angle = 0;
};

'use strict';
/* Resources.js
 * This is simple an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function Resources() {
	var resourceCache = {};
	var loading = [];
	var readyCallbacks = [];

	/* This function determines if all of the images that have been requested
	   * for loading have in fact been completed loaded.
	   */
	function isReady() {
		var ready = true;
		for (var k in resourceCache) {
			if (resourceCache.hasOwnProperty(k) &&
			!resourceCache[k]) {
				ready = false;
			}
		}
		return ready;
	}

	/* This is our private image loader function, it is
	   * called by the public image loader function.
	   */
	function _load(url) {
		if (!resourceCache[url]) {
			/* This URL has not been previously loaded and is not present
			       * within our cache; we'll need to load this image.
			       */
			var img = new Image();
			img.onload = function onImageLoad() {
				/* Once our image has properly loaded, add it to our cache
				         * so that we can simply return this image if the developer
				         * attempts to load this file in the future.
				         */
				resourceCache[url] = img;

				/* Once the image is actually loaded and properly cached,
				         * call all of the onReady() callbacks we have defined.
				         */
				if (isReady()) {
					readyCallbacks.forEach(function callCallbacks(func) { func(); });
				}
			};

			/* Set the initial cache value to false, this will change when
			       * the image's onload event handler is called. Finally, point
			       * the images src attribute to the passed in URL.
			       */
			resourceCache[url] = false;
			img.src = url;
		} else {
			return resourceCache[url];
		}
	}

	/* This is the publicly accessible image loading function. It accepts
	   * an array of strings pointing to image files or a string for a single
	   * image. It will then call our private image loading function accordingly.
	   */
	function load(urlOrArr) {
		if (urlOrArr instanceof Array) {
			/* If the developer passed in an array of images
			       * loop through each value and call our image
			       * loader on that image file
			       */
			urlOrArr.forEach(function loadURL(url) {
				_load(url);
			});
		} else {
			/* The developer did not pass an array to this function,
			       * assume the value is a string and call our image loader
			       * directly.
			       */
			_load(urlOrArr);
		}
	}

	/* This is used by developer's to grab references to images they know
	   * have been previously loaded. If an image is cached, this functions
	   * the same as calling load() on that URL.
	   */
	function get(url) {
		return resourceCache[url];
	}

	/* This function will add a function to the callback stack that is called
	   * when all requested images are properly loaded.
	   */
	function onReady(func) {
		readyCallbacks.push(func);
	}

	/* This object defines the publicly accessible functions available to
	   * developers by creating a global Resources object.
	   */
	window.Resources = {
		load: load,
		get: get,
		onReady: onReady,
		isReady: isReady
	};
})();

'use strict';
/**
 * @description Collision Singleton used for checking collision between two sensors
 * @constructor
 */
var Collision = (function Prototype() {
	var instance = function instance() {};
	/**
	 * @description Uses box collision to check if two sensors are touching
	 * @param {Senor} sensorA - Bounding rect A
	 * @param {Senor} sensorB - Bounding rect B
	 * @returns {boolean} based on sensor overlap
	 */
	instance.isColliding = function isColliding(sensorA, sensorB) {
		return (sensorA.x < sensorB.x + sensorB.width &&
			sensorA.x + sensorB.width > sensorB.x &&
			sensorA.y < sensorB.y + sensorB.height &&
			sensorA.height + sensorA.y > sensorB.y);
	};
	return instance;
})();

'use strict';
/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function Engine(global) {
	/* Predefine the variables we'll be using within this scope,
	 * create the canvas element, grab the 2D context for that canvas
	 * set the canvas elements height/width and add it to the DOM.
	 */
	var doc = global.document,
		win = global.window,
		canvas = doc.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		lastTime,
		running = false,
		instance = function instance() {};

	instance.entities = [];
	instance.width = canvas.width = 505;
	instance.height = canvas.height = 606;
	canvas.className += ' canvas-game';
	doc.getElementsByClassName('level')[0].appendChild(canvas);

	/* This is called by the update function  and loops through all of the
	 * objects within your instance.entities array as defined in app.js and calls
	 * their update() methods. It will then call the update function for your
	 * player object. These update methods should focus purely on updating
	 * the data/properties related to  the object. Do your drawing in your
	 * render methods.
	 */
	function updateEntities(dt) {
		instance.entities.forEach(function EachEnemy(enemy) {
			enemy.update(dt);
		});
		player.update(dt);
	}

	/* This function is called by main (our game loop) and itself calls all
	 * of the functions which may need to update entity's data. Based on how
	 * you implement your collision detection (when two entities occupy the
	 * same space, for instance when your character should die), you may find
	 * the need to add an additional function call here. For now, we've left
	 * it commented out - you may or may not want to implement this
	 * functionality this way (you could just implement collision detection
	 * on the entities themselves within your app.js file).
	 */
	function update(dt) {
		updateEntities(dt);
		// checkCollisions();
	}

	/* This function is called by the render function and is called on each game
	 * tick. It's purpose is to then call the render functions you have defined
	 * on your enemy and player entities within app.js
	 */
	function renderEntities() {
		/* Loop through all of the objects within the instance.entities array and call
		 * the render function you have defined.
		 */
		var i;
		for (i = 0; i < instance.entities.length; i++) {
			instance.entities[i].render(ctx);
		}

		player.render(ctx);
	}

	/* This function initially draws the "game level", it will then call
	 * the renderEntities function. Remember, this function is called every
	 * game tick (or loop of the game engine) because that's how games work -
	 * they are flipbooks creating the illusion of animation but in reality
	 * they are just drawing the entire screen over and over.
	 */
	function render() {
		/* This array holds the relative URL to the image used
		 * for that particular row of the game level.
		 */
		var rowImages = [
				'images/water-block.png', // Top row is water
				'images/stone-block.png', // Row 1 of 3 of stone
				'images/stone-block.png', // Row 2 of 3 of stone
				'images/stone-block.png', // Row 3 of 3 of stone
				'images/grass-block.png', // Row 1 of 2 of grass
				'images/grass-block.png' // Row 2 of 2 of grass
			],
			numRows = 6,
			numCols = 5,
			row, col;

		//  Clear the entire canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		/* Loop through the number of rows and columns we've defined above
		 * and, using the rowImages array, draw the correct image for that
		 * portion of the "grid"
		 */
		for (row = 0; row < numRows; row++) {
			for (col = 0; col < numCols; col++) {
				/* The drawImage function of the canvas' context element
				 * requires 3 parameters: the image to draw, the x coordinate
				 * to start drawing and the y coordinate to start drawing.
				 * We're using our Resources helpers to refer to our images
				 * so that we get the benefits of caching these images, since
				 * we're using them over and over.
				 */
				ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
			}
		}

		renderEntities();
	}

	/* This function serves as the kickoff point for the game loop itself
	 * and handles properly calling the update and render methods.
	 */
	function main() {
		if (running) {
			/* Get our time delta information which is required if your game
			 * requires smooth animation. Because everyone's computer processes
			 * instructions at different speeds we need a constant value that
			 * would be the same for everyone (regardless of how fast their
			 * computer is) - hurray time!
			 */
			var now = Date.now(),
				dt = (now - lastTime) / 1000.0;

			/* Call our update/render functions, pass along the time delta to
			 * our update function since it may be used for smooth animation.
			 */
			update(dt);
			render();

			/* Set our lastTime variable which is used to determine the time delta
			 * for the next time this function is called.
			 */
			lastTime = now;

			/* Use the browser's requestAnimationFrame function to call this
			 * function again as soon as the browser is able to draw another frame.
			 */
			win.requestAnimationFrame(main);
		}
	}

	/* This function does some initial setup that should only occur once,
	 * particularly setting the lastTime variable that is required for the
	 * game loop.
	 */
	function init() {
		instance.reset();
		running = true;
		lastTime = Date.now();
		main();
	}

	/* This function does nothing but it could have been a good place to
	 * handle game reset states - maybe a new game menu or a game over screen
	 * those sorts of things. It's only called once by the init() method.
	 */
	instance.reset = function reset() {
		running = false;
	};

	instance.pause = function pause() {
		running = false;
	};

	instance.preload = function preload() {
		/* Go ahead and load all of the images we know we're going to need to
		 * draw our game level. Then set init as the callback method, so that when
		 * all of these images are properly loaded our game will start.
		 */

		function locations(folder, format) {
			var resources = [
				'char-boy',
				'char-cat-girl',
				'char-horn-girl',
				'char-pink-girl',
				'char-princess-girl',
				'enemy-bug',
				'Gem Blue',
				'Gem Green',
				'Gem Orange',
				'grass-block',
				'Heart',
				'Key',
				'Rock',
				'Selector',
				'Star',
				'stone-block',
				'water-block'
			];
			return resources.map(function resourceMap(el) {
				return folder + el + '.' + format;
			});
		}
		Resources.load(locations('images/', 'png'));

		if (Resources.isReady()) {
			init();
		} else {
			Resources.onReady(init);
		}
	};

	/* Assign the canvas' context object to the global variable (the window
	 * object when run in a browser) so that developer's can use it more easily
	 * from within their app.js files.
	 */
	global.ctx = ctx;

	return instance;
})(this);

'use strict';
/**
* @description Model Singleton used for storing state data
* @constructor
*/
var Model = (function Model() {
	var data = {};
	var instance = function instance() {};

	/**
	 * @description Sets a value to a key
	 * @param {string} key - The property to store the value under
	 * @param {number} value - The value of the key
	 * @returns {*} The value of the key
	 */
	instance.set = function set(key, value) {
		data[key] = value;
		return value;
	};

	/**
	 * @description Returns the value set to the key
	 * @returns {*} The value of the key
	 */
	instance.get = function get(key) {
		return data[key];
	};

	return instance;
})();

'use strict';
/**
* @description A Timer class that updates manually using with delta time
* @constructor
*/
var Timer = function Timer(intervals, delay) {
	this.intervals = intervals;
	this.delay = delay;
	this.running = false;
	this.listeners = {};
	this.time = 0;
	this.laps = 0;
};

(function Prototype() {
	/**
	 * @description Resets the timer and flags it as running
	 */
	this.start = function start() {
		this.running = true;
		this.time = this.delay;
		this.laps = this.intervals;
	};

	/**
	 * @description Uses the delta time to manually update the timer
	 * @param {number} delta - Time since last update
	 */
	this.update = function update(delta) {
		if (this.running) {
			this.time = Math.max(0, this.time - delta);
			if (this.time === 0) {
				this.laps -= 1;
				if (this.laps <= 0) {
					this.running = false;
					this.dispatch('COMPLETE');
				}else {
					this.time = this.delay;
					this.dispatch('UPDATE');
				}
			}
		}
	};

	/**
	 * @description Adds a listener for the specified event
	 * @param {string} event - The event to listen for
	 * @param {function} listener - The callback function
	 */
	this.on = function on(event, listener) {
		if (!this.listeners.hasOwnProperty(event)) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	};

	/**
	 * @description Attempts to invoke a callback method for the given event
	 * @param {string} event - The event to dispatch
	 */
	this.dispatch = function dispatch(event) {
		var i;
		var list;
		if (this.listeners.hasOwnProperty(event)) {
			list = this.listeners[event];
			for (i = 0; i < list.length; i++) {
				list[i](this);
			}
		}
	};
}).call(Timer.prototype);

'use strict';
/**
* @description Grid Singleton used for positioning things on a Grid
* @constructor
*/
var Grid = (function Grid() {
	var instance = function instance() {};

	instance.cellWidth = 101;
	instance.cellHeight = 83;
	instance.columns = 5;
	instance.rows = 6;
	instance.offsetY = 50;

	/**
	 * @description Determines the x location based on the column
	 * @param {int} column - The column
	 * @returns {number} The screen x position
	 */
	instance.getXFromColumn = function getXFromColumn(column) {
		var col = Math.max(0, Math.min(column, instance.columns - 1));
		return col * instance.cellWidth;
	};

	/**
	 * @description Determines the y location based on the row
	 * @param {int} row - The row
	 * @returns {number} The screen y position
	 */
	instance.getYFromRow = function getYFromRow(row) {
		row = Math.max(0, Math.min(row, instance.rows - 1));
		return instance.offsetY + row * instance.cellHeight;
	};

	return instance;
})();

'use strict';
/**
* @description Handles level creation
* @constructor
*/
var Level = function Level() {
	this.reset();
};

(function Prototype() {
	/**
	 * @description Reset's level variables to original values
	 */
	this.reset = function reset() {
		this.level = Model.set('level', 0);
		this.lastLevel = 7;
		Model.set('level_total_time', 15);
		Model.set('level_complete', false);
	};

	/**
	 * @description Advances the current level by one
	 */
	this.next = function next() {
		this.level = Model.set('level', this.level + 1);
	};

	/**
	 * @description Creates all the entities for the current level
	 */
	this.addEntities = function addEntities() {
		var data = this.levelData();
		var i;
		Engine.entities = [];

		for (i = 0; i < data.length; i++) {
			if (data[i].hasOwnProperty('t')) {
				if (data[i].t === 'key') {
					Engine.entities.push(new Key(data[i].r, data[i].c));
				}else if (data[i].t === 'water') {
					Engine.entities.push(new Water(data[i].r, data[i].c));
				}
			}else {
				Engine.entities.push(new Enemy(data[i].r, data[i].c, data[i].s));
			}
		}
	};

	/**
	 * @description Returns the JSON entities for the given level
	 * @returns {array}
	 */
	this.levelData = function levelData() {
		//  Formatted so it's easier to see the levels (not following Udacity JS standards)
		//  jscs:disable
		if (this.level === 0) {
			return [
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 1) {
			return [
			{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 2) {
			return [
			{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 3) {
			return [
			{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 4) {
			return [
			{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
			{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 5) {
			return [
			{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
			{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}else if (this.level === 6) {
			return [
			{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
			{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
			{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
			];
		}
		//  jscs:disable
		return [
		{r: 1, c: 0, s: -100}, {r: 1, c: 1, s: -100}, {r: 1, c: 3, s: -100}, {r: 1, c: 4, s: -100},
		{r: 2, c: 0, s: 500}, {r: 2, c: 4, s: 600},
		{r: 3, c: 0, s: 200}, {r: 3, c: 2, s: 200}, {r: 3, c: 4, s: 200},
		{r: 0, c: 0, t: 'water'}, {r: 0, c: 1, t: 'water'}, {r: 0, c: 2, t: 'key'}, {r: 0, c: 3, t: 'water'}, {r: 0, c: 4, t: 'water'}
		];
	};
}).call(Level.prototype);

'use strict';
/**
 * @description Scene Singleton used for changing the scene view
 * @constructor
 */
var Scene = (function Scene() {
	var instance = function instance() {};
	var level = new Level();
	var onCharacterClicked = function onCharacterClicked(el) {
		var s = el.target.src;
		player.sprite = s.slice(s.indexOf('/images/') + 1, s.length);

		El.removeClass(El.getElements('selected-char'), 'selected-char');
		El.addClass(el.target, 'selected-char');
	};
	/**
	 * @description Shows the Character selection scene
	 */
	instance.startMenu = function startMenu() {
		var characters = document.getElementsByClassName('char');
		var i;

		for (i = 0; i < characters.length; i++) {
			characters[i].addEventListener('click', onCharacterClicked);
		}

		Engine.reset();

		El.show('char_select');
		El.hide('level');
		El.hide('gameover');
		El.hide('gamewin');
		scene = 'char_select';
	};

	/**
	 * @description Shows the Game scene
	 */
	instance.startGame = function startGame(reset) {
		reset = reset || false;

		if (reset) {
			level.reset();
		} else {
			Model.set('level_complete', false);
		}

		Engine.preload();
		player.respawn();

		level.addEntities();
		Engine.entities.push(ui);
		ui.start();

		El.show('level');
		El.hide('char_select');
		El.hide('gameover');
		El.hide('gamewin');
		scene = 'level';
	};

	/**
	 * @description Shows the Game Over popup
	 */
	instance.endGame = function endGame() {
		El.show('gameover');
		Engine.pause();
	};

	/**
	 * @description Shows the Game Win popup
	 */
	instance.winGame = function winGame() {
		El.show('gamewin');
		Engine.pause();
	};

	/**
	 * @description The player picked up the key. Show star explosion and advance level after timeout
	 */
	instance.levelComplete = function levelComplete() {
		Model.set('level_complete', true);
		Engine.entities.push(new Explosion(0, 2));
		setTimeout(instance.nextLevel, 1500);
	};

	/**
	 * @description Advance to the next level or end the game if no more levels
	 */
	instance.nextLevel = function nextLevel() {
		level.next();

		if (level.level > level.lastLevel) {
			instance.winGame();
		} else {
			instance.startGame();
		}
	};

	return instance;
})();

'use strict';
/**
* @description A sensor used as a collision box that can be rendered to the screen for testing
* @constructor
* @param {number} x - The x location
* @param {number} y - The y location
* @param {number} width - How long the sensor is
* @param {number} height - How tall the sensor is
* @param {number} offsetX - The offset in the x direction
* @param {number} offsetY - The offset in the y direction
*/
var Sensor = function Sensor(x, y, width, height, offsetX, offsetY) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.debug = false;
};

(function Prototype() {
	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		if (this.debug) {
			ctx.beginPath();
			ctx.strokeStyle = 'red';
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.stroke();
		}
	};

	/**
	 * @description Updates the sensor's position
	 * @param {int} x - The x location
	 * @param {int} y - The y location
	 */
	this.position = function position(x, y) {
		this.x = x + this.offsetX;
		this.y = y + this.offsetY;
	};
}).call(Sensor.prototype);

'use strict';
/**
* @description A component that renders the owners sprite according to position, alpha and direction
* @constructor
*/
var Render = function Render(owner) {
	this.owner = owner;
};

(function Prototype() {
	var p = {x: 0, y: 0};
	/**
	  * @description Renders the owner's sprite
	  * @param {context} ctx - The canvas's context
	  */
	this.render = function render(ctx) {
		var flipped = this.owner.flipped ? -1 : 1;
		var pos = this.getPosition();
		ctx.save();
		ctx.scale(flipped, 1);
		ctx.globalAlpha = this.owner.alpha || 1;
		ctx.drawImage(Resources.get(this.owner.sprite), pos.x, pos.y, 101, 171);
		ctx.restore();
	};

	/**
	  * @description Returns the formatted position
	  */
	this.getPosition = function getPosition() {
		var flipped = this.owner.flipped ? -1 : 1;
		p.x = (this.owner.x + this.owner.offsetX) * flipped;
		p.x += (flipped === 1 ? 0 : -101);
		p.y = this.owner.y + this.owner.offsetY;
		return p;
	};
}).call(Render.prototype);

'use strict';
/**
* @description The ingame information display
* @constructor
*/
var UI = function UI() {
	this.keys = 0;
	this.levelTime = 0;
	this.time = 0;
};

(function Prototype() {
	/**
	 * @description Resets the level information and starts the game timer
	 */
	this.start = function start() {
		this.keys = Model.get('level');
		this.levelTime = Model.get('level_total_time');

		this.levelTimer = new Timer(1, this.levelTime);
		this.levelTimer.on('COMPLETE', this.onTimerComplete);
		this.levelTimer.start();
	};

	/**
	 * @description The level timer has completed
	 */
	this.onTimerComplete = function onTimerComplete() {
		if (!Model.get('level_complete')) {
			Scene.endGame();
		}
	};

	/**
	 * @description Formated string of time left (expects >0 && <60 seconds)
	 * @returns {string} Seconds left on time
	 */
	this.formattedTime = function formattedTime() {
		var time = Math.round(this.levelTimer.time);
		return '00:' + (time > 9 ? time : '0' + time);
	};

	/**
	 * @description Renders text to the screen
	 * @param {context} ctx - The canvas's context
	 * @param {string} string - The string to display
	 * @param {number} x - The x location
	 * @param {number} y - The y location
	 * @param {string} align - The canvas's context
	 */
	this.text = function text(ctx, string, x, y, align) {
		ctx.save();
		ctx.font = '30px Comic Sans MS';
		if (align === 'left' || align === 'right' || align === 'center') {
			ctx.textAlign = align;
		}
		ctx.fillText(string, x, y);
		ctx.restore();
	};

	/**
	 * @description Updates the timer and key information
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		if (!Model.get('level_complete')) {
			this.keys = Model.get('level');
			this.levelTimer.update(dt);
		}
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.text(ctx, 'Keys: x' + this.keys, 0, 30);
		this.text(ctx, 'Time: ' + this.formattedTime(), Engine.width, 30, 'right');
	};
}).call(UI.prototype);

'use strict';
/**
* @description Key entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Key = function Key(row, col) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/Key.png',
		0,
		-(171 - 138) - Grid.offsetY);
	this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
	this.renderer = new Render(this);
};

(function Prototype() {
	/**
	 * @description Checks if this entity is colliding with the player
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.sensor.position(this.x, this.y);
		if (player && player.isAlive && this.isAlive) {
			if (Collision.isColliding(this.sensor, player.sensor)) {
				this.isAlive = false;
				player.hit('key');
			}
		}
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.renderer.render(ctx);
		this.sensor.render(ctx);
	};
}).call(Key.prototype);

'use strict';
/**
* @description Water entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Water = function Water(row, col) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/Key.png',
		0,
		-(171 - 138) - Grid.offsetY);
	this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
};

(function Prototype() {
	/**
	 * @description Checks if this entity is colliding with the player
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.sensor.position(this.x, this.y);

		if (player && player.isAlive) {
			if (Collision.isColliding(this.sensor, player.sensor)) {
				player.hit('water');
			}
		}
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.sensor.render(ctx);
	};
}).call(Water.prototype);

'use strict';
/**
 * @description Enemy entity
 * @constructor
 * @param {int} row - The initial row
 * @param {int} col - The initial column
 * @param {number} speed - The initial speed
 */
var Enemy = function Enemy(row, col, speed) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/enemy-bug.png',
		0, -(171 - 138) - Grid.offsetY);
	this.row = row;
	this.speed = speed;
	this.flipped = speed < 0;
	this.sensor = new Sensor(0, 0, 50, 50, 25, 12);
	this.renderer = new Render(this);
};

(function Prototype() {
	/**
	 * @description Checks if this entity is colliding with the player and keeps target on screen by wrapping x location
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.x += dt * this.speed;

		//  Wrap
		if (this.x > (Grid.columns * Grid.cellWidth) + Grid.cellWidth) {
			this.x = Grid.getXFromColumn(0) - Grid.cellWidth;
		} else if (this.x < -Grid.cellWidth) {
			this.x = (Grid.columns * Grid.cellWidth) + Grid.cellWidth;
		}

		this.sensor.position(this.x, this.y);
		if (player && player.isAlive) {
			if (Collision.isColliding(this.sensor, player.sensor)) {
				player.hit('enemy');
			}
		}
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.renderer.render(ctx);
		this.sensor.render(ctx);
	};
}).call(Enemy.prototype);

'use strict';
/**
* @description Player entity
* @constructor
*/
var Player = function Player() {
	this.entity = new Entity(this,
		0,
		0,
		'images/char-boy.png',
		0,
		-(171 - 138) - Grid.offsetY);
	this.isAlive = false;
	this.alpha = 0;
	this.sensor = new Sensor(0, 0, 50, 30, 25, 25);
	this.renderer = new Render(this);
	this.blinkTimer = new Timer(5, 0.2);

	var ref = this;

	var onBlinkTimerComplete = function onBlinkTimerComplete() {
		ref.alpha = 1;
		ref.isAlive = true;
	};

	var onBlinkTimerUpdate = function onBlinkTimerUpdate() {
		ref.alpha = (ref.alpha === 0.4 ? 1 : 0.4);
	};

	var onKeyUp = function onKeyUp(e) {
		ref.handleInput(e);
	};

	this.blinkTimer.on('COMPLETE', onBlinkTimerComplete);
	this.blinkTimer.on('UPDATE', onBlinkTimerUpdate);
	document.addEventListener('keyup', onKeyUp);

	this.respawn();
};

(function Prototype() {
	var inputMap = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	var inputResponseMap = {
		left: {axis: 'x', dir: -1},
		up: {axis: 'y', dir: -1},
		right: {axis: 'x', dir: 1},
		down: {axis: 'y', dir: 1}
	};

	/**
	 * @description Resets the player to the initial position
	 */
	this.respawn = function respawn() {
		this.sensor.x = this.x = Grid.getXFromColumn(2);
		this.sensor.y = this.y = Grid.getYFromRow(5);
		this.isAlive = false;
		this.alpha = 0.4;
		this.blinkTimer.start();
	};

	/**
	 * @description A entity has hit the player
	 * @param {string} invoker - Type of object that hit the player
	 */
	this.hit = function hit(invoker) {
		if (invoker === 'water' || invoker === 'enemy') {
			this.respawn();
		}else if (invoker === 'key') {
			Scene.levelComplete();
		}
	};

	/**
	 * @description Gets the position on the grid based on player's input
	 * @param {string} axis - The x or y axis
	 * @param {input} dir - The positive or negative direction
	 * @returns {number} The final position
	 */
	this.getMovement = function getMovement(axis, dir) {
		var v;

		if (axis === 'x') {
			v = Math.floor(this.x / Grid.cellWidth) + dir;
			return Grid.getXFromColumn(v);
		}

		v = Math.floor(this.y / Grid.cellHeight) + dir;
		return Grid.getYFromRow(v);
	};

	/**
	 * @description Changes the player position based on input
	 * @param {event} e - The event that occured
	 */
	this.handleInput = function handleInput(e) {
		var input = inputMap[e.keyCode];
		if (input && this.isAlive === true && !Model.get('level_complete')) {
			var map = inputResponseMap[input];

			//  Movement
			if (map.hasOwnProperty('axis')) {
				this[map.axis] = this.getMovement(map.axis, map.dir);
			}
		}
	};

	/**
	 * @description Updates the players timer and sensor
	 * @param {number} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.sensor.position(this.x, this.y);
		if (!this.isAlive) {
			this.blinkTimer.update(dt);
		}
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.renderer.render(ctx);
		this.sensor.render(ctx);
	};
}).call(Player.prototype);

'use strict';
/**
* @description Star entity
* @constructor
* @param {int} row - The initial row
* @param {int} col - The initial column
*/
var Star = function Star(row, col) {
	this.entity = new Entity(this,
		Grid.getXFromColumn(col),
		Grid.getYFromRow(row),
		'images/Star.png',
		0,
		-(171 - 138) - Grid.offsetY);
	this.renderer = new Render(this);
	this.speed = 500;
	this.angle = Math.round(Math.random() * 180) * Math.PI / 180;
};

(function Prototype() {
	/**
	 * @description Moves the star in the direction of the angle and lowers opacity
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.x += this.speed * Math.cos(this.angle) * dt;
		this.y += this.speed * Math.sin(this.angle) * dt;
		this.alpha = Math.max(0.01, this.alpha - 1 * dt);
	};

	/**
	 * @description Renders this entity to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		this.renderer.render(ctx);
	};
}).call(Star.prototype);

'use strict';
/**
 * @description Key entity
 * @constructor
 * @param {int} row - The initial row
 * @param {int} col - The initial column
 */
var Explosion = function Explosion(row, col) {
	this.stars = [];
	this.addStars(row, col, 10);
};

(function Prototype() {
	/**
	 * @description Adds the stars
	 * @param {int} row - The y location
	 * @param {int} col - The x location
	 * @param {int} total - Amount of stars
	 */
	this.addStars = function addStars(row, col, total) {
		var i;
		for (i = 0; i < total; i++) {
			this.stars.push(new Star(row, col));
		}
	};

	/**
	 * @description Moves all the stars
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		var total = this.stars.length;
		var i;
		if (total > 0) {
			if (this.stars[0].alpha <= 0.01) {
				this.stars = [];
			} else {
				for (i = 0; i < total; i++) {
					this.stars[i].update(dt);
				}
			}
		}
	};
	/**
	 * @description Renders the stars to the canvas
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		var total = this.stars.length;
		var i;
		for (i = 0; i < total; i++) {
			this.stars[i].render(ctx);
		}
	};
}).call(Explosion.prototype);

'use strict';
var player = new Player();
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
