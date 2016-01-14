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
* @param {number} x - The initial x location
* @param {number} y - The initial y location
* @param {string} sprite - The display sprite
* @param {number} offsetX - The initial x offset
* @param {number} offsetY - The initial y offset
*/
var Entity = function Entity(x, y, sprite, offsetX, offsetY) {
	this.x = x;
	this.y = y;
	this.sprite = sprite || null;
	this.offsetX = offsetX || 0;
	this.offsetY = offsetY || 0;
	this.flipped = false;
	this.alpha = 1;
	this.isAlive = true;
	this.speed = 0;
	this.angle = 0;
	this.components = [];
	this.type = "";
};

(function Prototype() {
	/**
	 * @description Adds a component that will updated and rendered with the Entity
	 * @param {int} dt - Time since last update
	 * @return {Component} component - The Component to add
	 */
	this.addComponent = function addComponent(component) {
		if(this.components.indexOf(component) === -1){
			component.owner = this;
			this.components.push(component);
		}
		return component;
	};
	
	/**
	 * @description Call update on all entity components
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		var i, t = this.components.length;
		for (i = 0; i < t; i++) {
			this.components[i].update(dt);
		}
	};

	/**
	 * @description Call render on all entity components
	 * @param {context} ctx - The canvas's context
	 */
	this.render = function render(ctx) {
		var i, t = this.components.length;
		for (i = 0; i < t; i++) {
			this.components[i].render(ctx);
		}
	};
}).call(Entity.prototype);

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
				Blueprint.create(data[i].t, data[i]);
			}else {
				Blueprint.create("enemy", data[i]);
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
	var timeout;
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
		var characters = El.getElements('char');
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

		player.respawn(false);
		
		if (reset) {
			level.reset();
		} else {
			Model.set('level_complete', false);
		}

		Engine.preload();
		

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
		clearTimeout(timeout);
		timeout = setTimeout(instance.nextLevel, 1500);
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
	this.owner = null;
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
	 * @description Updates the sensor position
	 * @param {number} dt - Time since last update
	 */
	this.update = function update(dt) {
		if(this.owner) {
			this.position(this.owner.x, this.owner.y);
			var target = this.owner.target;
			if (target && target.isAlive && !Model.get('level_complete')) {
				if (Collision.isColliding(this, target.sensor)) {
					target.hit(this.owner.type);
				}
			}
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
var Render = function Render() {
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
	 * @description Update
	 * @param {number} dt - Time since last update
	 */
	this.update = function update(dt) {
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
* @description A component that renders the owners sprite according to position, alpha and direction
* @constructor
*/
var KeyboardInput = function KeyboardInput() {
	var ref = this;
	var onKeyUp = function onKeyUp(event) {
		ref.handleInput(event);
	};
	var start = {x:0, y:0};
	var end = {x:0, y:0};
	
	var distance = function distance(x1, x2, y1, y2) {
		return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
	};
	
	document.addEventListener('keyup', onKeyUp);
	document.addEventListener("touchstart", function(event) {
		start.x = event.changedTouches[0].pageX;
		start.y = event.changedTouches[0].pageY;
	});
	document.addEventListener("touchend", function(event) {
		end.x = event.changedTouches[0].pageX;
		end.y = event.changedTouches[0].pageY;
		var angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI + 180;
		var d = distance(start.x, end.x, start.y, end.y);
		
		if(d > 5){
			if(angle >= 45 && angle <= 135){
				ref.handleInput({keyCode:38});
			}else if(angle >= 135 && angle <= 225){
				ref.handleInput({keyCode:39});
			}else if(angle >= 225 && angle <= 315){
				ref.handleInput({keyCode:40});
			}else{
				ref.handleInput({keyCode:37});
			}
		}else{
			ref.handleInput({keyCode:38});
		}
	});
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
	 * @description Gets the position on the grid based on player's input
	 * @param {string} axis - The x or y axis
	 * @param {input} dir - The positive or negative direction
	 * @returns {number} The final position
	 */
	this.getMovement = function getMovement(axis, dir) {
		var v;

		if (axis === 'x') {
			v = Math.floor(this.owner.x / Grid.cellWidth) + dir;
			return Grid.getXFromColumn(v);
		}

		v = Math.floor(this.owner.y / Grid.cellHeight) + dir;
		return Grid.getYFromRow(v);
	};
	
	/**
	 * @description Changes the player position based on input
	 * @param {event} event - The event that occured
	 */
	this.handleInput = function handleInput(event) {
		var input = inputMap[event.keyCode];
		
		if (input && this.owner.isAlive === true && !Model.get('level_complete')) {
			var map = inputResponseMap[input];

			//  Movement
			if (map.hasOwnProperty('axis')) {
				this.owner[map.axis] = this.getMovement(map.axis, map.dir);
			}
		}
	};
    
	/**
	 * @description Checks if this entity is colliding with the player and keeps target on screen by wrapping x location
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
	};
	
	this.render = function render(ctx) {
	};
}).call(KeyboardInput.prototype);

'use strict';
/**
* @description A component that renders the owners sprite according to position, alpha and direction
* @constructor
*/
var Movement = function Movement() {
	this.wrap = false;
};

(function Prototype() {
	/**
	 * @description Checks if this entity is colliding with the player and keeps target on screen by wrapping x location
	 * @param {int} dt - Time since last update
	 */
	this.update = function update(dt) {
		this.owner.x += this.owner.speed * Math.cos(this.owner.angle) * dt;
		this.owner.y += this.owner.speed * Math.sin(this.owner.angle) * dt;
		
		//  Wrap
		if(this.wrap){
    		if (this.owner.x > (Grid.columns * Grid.cellWidth) + Grid.cellWidth) {
    			this.owner.x = Grid.getXFromColumn(0) - Grid.cellWidth;
    		} else if (this.owner.x < -Grid.cellWidth) {
    			this.owner.x = (Grid.columns * Grid.cellWidth) + Grid.cellWidth;
    		}
		}
	};
	
	this.render = function render(ctx) {
	};
}).call(Movement.prototype);

'use strict';
/**
* @description Blueprint Singleton used for creating Entity's
* @constructor
*/
var Blueprint = (function Blueprint() {
	var prints = {};
	var instance = function instance() {};

	/**
	 * @description Creates an entity based on the Blueprint and adds it to the Engine
	 * @param {string} key - The type of Entity to create
	 * @returns {Entity} The generated entity
	 */
	instance.create = function create(type, data) {
		var entity = null;
		if(prints.hasOwnProperty(type)){
		    entity = prints[type](data);
		    entity.type = type;
		    Engine.entities.push(entity);
		}
		return entity;
	};
	
	prints['key'] = function createKey(data) {
		var x = Grid.getXFromColumn(data.c);
		var y = Grid.getYFromRow(data.r);
	    var entity = new Entity(x, y, "images/Key.png", 0, -(171 - 138) - Grid.offsetY);
	    entity.addComponent(new Render());
	    entity.addComponent(new Sensor(0, 0, 50, 50, 25, 12));
	    entity.target = player;
	    return entity;
	};
	
	prints['star'] = function createStar(data) {
		var x = Grid.getXFromColumn(data.c);
		var y = Grid.getYFromRow(data.r);
	    var entity = new Entity(x, y, "images/Star.png", 0, -(171 - 138) - Grid.offsetY);
	    entity.addComponent(new Render());
	    entity.addComponent(new Movement());
	    entity.speed = 400;
	    entity.angle = Math.round(Math.random() * 180) * Math.PI / 180;
	    
	    //  monkey-patch to add the blink timer update
	    var entityUpdate = entity.update;
	    entity.update = function update(dt) {
	    	entityUpdate.apply(this, arguments);
	    	entity.alpha = Math.max(0.01, entity.alpha - 1 * dt);
	    };
	    
	    return entity;
	};
	
	prints['water'] = function createWater(data) {
		var x = Grid.getXFromColumn(data.c);
		var y = Grid.getYFromRow(data.r);
	    var entity = new Entity(x, y, "", 0, -(171 - 138) - Grid.offsetY);
	    entity.addComponent(new Sensor(0, 0, 50, 50, 25, 12));
	    entity.target = player;
	    return entity;
	};
	
	prints['enemy'] = function createEnemy(data) {
	    var x = Grid.getXFromColumn(data.c);
		var y = Grid.getYFromRow(data.r);
	    var entity = new Entity(x, y, "images/enemy-bug.png", 0, -(171 - 138) - Grid.offsetY);
	    entity.addComponent(new Render());
	    entity.addComponent(new Movement()).wrap = true;
	    entity.addComponent(new Sensor(0, 0, 50, 50, 25, 12));
	    entity.row = data.r;
	    entity.speed = data.s;
	    entity.flipped = entity.speed < 0;
	    entity.target = player;
	    return entity;
	};
	
	prints['player'] = function createjPlayer(data) {
	    var x = Grid.getXFromColumn(data.c);
		var y = Grid.getYFromRow(data.r);
	    var entity = new Entity(x, y, "images/char-boy.png", 0, -(171 - 138) - Grid.offsetY);
	    entity.addComponent(new Render());
	    entity.sensor = entity.addComponent(new Sensor(0, 0, 50, 50, 25, 12));
	    entity.addComponent(new KeyboardInput());
	    
	    entity.blinkTimer = new Timer(5, 0.2);

		var onBlinkTimerComplete = function onBlinkTimerComplete() {
			entity.alpha = 1;
			entity.isAlive = true;
		};
	
		var onBlinkTimerUpdate = function onBlinkTimerUpdate() {
			entity.alpha = (entity.alpha === 0.4 ? 1 : 0.4);
		};
	
		entity.blinkTimer.on('COMPLETE', onBlinkTimerComplete);
		entity.blinkTimer.on('UPDATE', onBlinkTimerUpdate);
	    
	    //  monkey-patch to add the blink timer update
	    var entityUpdate = entity.update;
	    entity.update = function update(dt) {
	    	entityUpdate.apply(this, arguments);
	    	entity.blinkTimer.update(dt);
	    };
	    
	    entity.respawn = function respawn(alive) {
    		this.x = entity.sensor.x = Grid.getXFromColumn(2);
    		this.y = entity.sensor.y = Grid.getYFromRow(5);
    		this.isAlive = alive;// || true
    		
			if(!this.isAlive){
				entity.alpha = 0.4;
				entity.blinkTimer.start();
		    }
	    };
	    
	    /**
		 * @description A entity has hit the player
		 * @param {string} invoker - Type of object that hit the player
		 */
		entity.hit = function hit(invoker) {
			if (invoker === 'water' || invoker === 'enemy') {
				this.respawn(false);
			}else if (invoker === 'key') {
				Scene.levelComplete();
			}
		};
	    
	    return entity;
	};

	return instance;
})();

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
		var data = {r: row, c: col};
		for (i = 0; i < total; i++) {
			//this.stars.push(new Star(row, col));
			this.stars.push(Blueprint.create("star", data));
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
//var player = new Player();
var player = Blueprint.create("player", {r:5, c:2});
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsLmpzIiwiZW50aXR5LmpzIiwicmVzb3VyY2VzLmpzIiwiY29sbGlzaW9uLmpzIiwiZW5naW5lLmpzIiwibW9kZWwuanMiLCJ0aW1lci5qcyIsImdyaWQuanMiLCJsZXZlbC5qcyIsInNjZW5lLmpzIiwic2Vuc29yLmpzIiwicmVuZGVyLmpzIiwia2V5Ym9hcmRJbnB1dC5qcyIsIm1vdmVtZW50LmpzIiwiYmx1ZXByaW50LmpzIiwidWkuanMiLCJrZXkuanMiLCJ3YXRlci5qcyIsImVuZW15LmpzIiwicGxheWVyLmpzIiwic3Rhci5qcyIsImV4cGxvc2lvbi5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFbCBTaW5nbGV0b24gdXNlZCBmb3IgbWFuaXB1bGF0aW5nIERPTSBlbGVtZW50c1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBFbCA9IChmdW5jdGlvbiBFbCgpIHtcblx0dmFyIGluc3RhbmNlID0gZnVuY3Rpb24gaW5zdGFuY2UoKSB7fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgdGhlIGNsYXNzTmFtZSBmcm9tIGVhY2ggZWxlbWVudCBpbiB0aGUgYXJyYXlcblx0ICogQHBhcmFtIHthcnJheX0gZWxlbWVudHMgLSBBcnJheSBvZiBET00gZWxlbWVudHNcblx0ICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIENsYXNzIHRvIHJlbW92ZVxuXHQgKi9cblx0aW5zdGFuY2UucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50cywgY2xhc3NOYW1lKSB7XG5cdFx0dmFyIGksIGM7XG5cdFx0aWYgKGVsZW1lbnRzKSB7XG5cdFx0XHRpZiAoIXRoaXMuaXNIVE1MQ29sbGVjdGlvbihlbGVtZW50cykpIHtcblx0XHRcdFx0ZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGMgPSBlbGVtZW50c1tpXS5jbGFzc05hbWUucmVwbGFjZSgnICcgKyBjbGFzc05hbWUsICcnKTtcblx0XHRcdFx0ZWxlbWVudHNbaV0uY2xhc3NOYW1lID0gYztcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBBZGRzIHRoZSBjbGFzc05hbWUgb24gZWFjaCBlbGVtZW50IGluIHRoZSBhcnJheVxuXHQgKiBAcGFyYW0ge2FycmF5fSBlbGVtZW50cyAtIEFycmF5IG9mIERPTSBlbGVtZW50c1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIC0gQ2xhc3MgdG8gYWRkXG5cdCAqL1xuXHRpbnN0YW5jZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIGFkZENsYXNzKGVsZW1lbnRzLCBjbGFzc05hbWUpIHtcblx0XHR2YXIgaTtcblxuXHRcdGlmIChlbGVtZW50cykge1xuXHRcdFx0aWYgKCF0aGlzLmlzSFRNTENvbGxlY3Rpb24oZWxlbWVudHMpKSB7XG5cdFx0XHRcdGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcblx0XHRcdH1cblx0XHRcdGZvciAoaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZWxlbWVudHNbaV0uY2xhc3NOYW1lLmluZGV4T2YoJyAnICsgY2xhc3NOYW1lKSA8IDApIHtcblx0XHRcdFx0XHRlbGVtZW50c1tpXS5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQWRkcyBhIGxpc3RlbmVyIG9uIHRoZSBlbGVtZW50XG5cdCAqIEBwYXJhbSB7YXJyYXl9IGVsZW1lbnRzIC0gQXJyYXkgb2YgRE9NIGVsZW1lbnRzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIEV2ZW50IHRvIGxpc3RlbiBmb3Jcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50IGlzIGNhcHR1cmVkXG5cdCAqL1xuXHRpbnN0YW5jZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGVsZW1lbnRzLCBldmVudCwgY2FsbGJhY2spIHtcblx0XHR2YXIgaTtcblxuXHRcdGlmIChlbGVtZW50cykge1xuXHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcblx0XHRcdH1cblx0XHRcdGZvciAoaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRlbGVtZW50c1tpXS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjayk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gUmVtb3ZlcyB0aGUgaGlkZGVuIGNsYXNzIGZyb20gdGhlIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIGNsYXNzTmFtZSBvciAjSURcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkZW50aWZpZXIgLSBUaGUgZWxlbWVudHMgdG8gZmluZFxuXHQgKi9cblx0aW5zdGFuY2Uuc2hvdyA9IGZ1bmN0aW9uIHNob3coaWRlbnRpZmllcikge1xuXHRcdHRoaXMucmVtb3ZlQ2xhc3ModGhpcy5nZXRFbGVtZW50cyhpZGVudGlmaWVyKSwgJ2hpZGRlbicpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQWRkcyB0aGUgaGlkZGVuIGNsYXNzIG9uIHRoZSBlbGVtZW50cyB3aXRoIHRoZSBnaXZlbiBjbGFzc05hbWUgb3IgI0lEXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpZGVudGlmaWVyIC0gVGhlIGVsZW1lbnRzIHRvIGZpbmRcblx0ICovXG5cdGluc3RhbmNlLmhpZGUgPSBmdW5jdGlvbiBoaWRlKGlkZW50aWZpZXIpIHtcblx0XHR0aGlzLmFkZENsYXNzKHRoaXMuZ2V0RWxlbWVudHMoaWRlbnRpZmllciksICdoaWRkZW4nKTtcblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIEZpbmRzIGFsbCB0aGUgZWxlbWVudHMgd2l0aCB0aGUgY2xhc3NOYW1lIG9yICNJRFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaWRlbnRpZmllciAtIFRoZSBlbGVtZW50cyB0byBmaW5kXG5cdCAqL1xuXHRpbnN0YW5jZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIGdldEVsZW1lbnRzKGlkZW50aWZpZXIpIHtcblx0XHRpZiAodGhpcy5pc1N0cmluZyhpZGVudGlmaWVyKSkge1xuXHRcdFx0aWYgKGlkZW50aWZpZXIuaW5kZXhPZignIycpICE9PSAtMSkge1xuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRlbnRpZmllcik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShpZGVudGlmaWVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBDaGVja3MgaWYgdGhlIHZhcmlhYmxlIGlzIGEgc3RyaW5nXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB2YXJpYWJsZSAtIFRoZSB2YXJpYWJsZSB0byBjaGVja1xuXHQgKi9cblx0aW5zdGFuY2UuaXNTdHJpbmcgPSBmdW5jdGlvbiBpc1N0cmluZyh2YXJpYWJsZSkge1xuXHRcdHJldHVybiB0aGlzLmlzVHlwZSh2YXJpYWJsZSwgJ1tvYmplY3QgU3RyaW5nXScpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQ2hlY2tzIGlmIHRoZSB2YXJpYWJsZSBpcyBhIEhUTUxDb2xsZWN0aW9uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB2YXJpYWJsZSAtIFRoZSB2YXJpYWJsZSB0byBjaGVja1xuXHQgKi9cblx0aW5zdGFuY2UuaXNIVE1MQ29sbGVjdGlvbiA9IGZ1bmN0aW9uIGlzSFRNTENvbGxlY3Rpb24odmFyaWFibGUpIHtcblx0XHRyZXR1cm4gdGhpcy5pc1R5cGUodmFyaWFibGUsICdbb2JqZWN0IEhUTUxDb2xsZWN0aW9uXScpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQ2hlY2tzIGlmIHRoZSB2YXJpYWJsZSBpcyB0aGUgdHlwZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdmFyaWFibGUgLSBUaGUgdmFyaWFibGUgdG8gY2hlY2tcblx0ICovXG5cdGluc3RhbmNlLmlzVHlwZSA9IGZ1bmN0aW9uIGlzVHlwZSh2YXJpYWJsZSwgdHlwZSkge1xuXHRcdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSB0eXBlO1xuXHR9O1xuXG5cdHJldHVybiBpbnN0YW5jZTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiogQGRlc2NyaXB0aW9uIEVudGl0eSBzZXRzIGFsbCBkZWZhdWx0IHZhcmlhYmxlcyB0byB0aGUgb3duZXJcbiogQGNvbnN0cnVjdG9yXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIGluaXRpYWwgeCBsb2NhdGlvblxuKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBpbml0aWFsIHkgbG9jYXRpb25cbiogQHBhcmFtIHtzdHJpbmd9IHNwcml0ZSAtIFRoZSBkaXNwbGF5IHNwcml0ZVxuKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0WCAtIFRoZSBpbml0aWFsIHggb2Zmc2V0XG4qIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXRZIC0gVGhlIGluaXRpYWwgeSBvZmZzZXRcbiovXG52YXIgRW50aXR5ID0gZnVuY3Rpb24gRW50aXR5KHgsIHksIHNwcml0ZSwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xuXHR0aGlzLnggPSB4O1xuXHR0aGlzLnkgPSB5O1xuXHR0aGlzLnNwcml0ZSA9IHNwcml0ZSB8fCBudWxsO1xuXHR0aGlzLm9mZnNldFggPSBvZmZzZXRYIHx8IDA7XG5cdHRoaXMub2Zmc2V0WSA9IG9mZnNldFkgfHwgMDtcblx0dGhpcy5mbGlwcGVkID0gZmFsc2U7XG5cdHRoaXMuYWxwaGEgPSAxO1xuXHR0aGlzLmlzQWxpdmUgPSB0cnVlO1xuXHR0aGlzLnNwZWVkID0gMDtcblx0dGhpcy5hbmdsZSA9IDA7XG5cdHRoaXMuY29tcG9uZW50cyA9IFtdO1xuXHR0aGlzLnR5cGUgPSBcIlwiO1xufTtcblxuKGZ1bmN0aW9uIFByb3RvdHlwZSgpIHtcblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBBZGRzIGEgY29tcG9uZW50IHRoYXQgd2lsbCB1cGRhdGVkIGFuZCByZW5kZXJlZCB3aXRoIHRoZSBFbnRpdHlcblx0ICogQHBhcmFtIHtpbnR9IGR0IC0gVGltZSBzaW5jZSBsYXN0IHVwZGF0ZVxuXHQgKiBAcmV0dXJuIHtDb21wb25lbnR9IGNvbXBvbmVudCAtIFRoZSBDb21wb25lbnQgdG8gYWRkXG5cdCAqL1xuXHR0aGlzLmFkZENvbXBvbmVudCA9IGZ1bmN0aW9uIGFkZENvbXBvbmVudChjb21wb25lbnQpIHtcblx0XHRpZih0aGlzLmNvbXBvbmVudHMuaW5kZXhPZihjb21wb25lbnQpID09PSAtMSl7XG5cdFx0XHRjb21wb25lbnQub3duZXIgPSB0aGlzO1xuXHRcdFx0dGhpcy5jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbXBvbmVudDtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQ2FsbCB1cGRhdGUgb24gYWxsIGVudGl0eSBjb21wb25lbnRzXG5cdCAqIEBwYXJhbSB7aW50fSBkdCAtIFRpbWUgc2luY2UgbGFzdCB1cGRhdGVcblx0ICovXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0dmFyIGksIHQgPSB0aGlzLmNvbXBvbmVudHMubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDA7IGkgPCB0OyBpKyspIHtcblx0XHRcdHRoaXMuY29tcG9uZW50c1tpXS51cGRhdGUoZHQpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIENhbGwgcmVuZGVyIG9uIGFsbCBlbnRpdHkgY29tcG9uZW50c1xuXHQgKiBAcGFyYW0ge2NvbnRleHR9IGN0eCAtIFRoZSBjYW52YXMncyBjb250ZXh0XG5cdCAqL1xuXHR0aGlzLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihjdHgpIHtcblx0XHR2YXIgaSwgdCA9IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7XG5cdFx0Zm9yIChpID0gMDsgaSA8IHQ7IGkrKykge1xuXHRcdFx0dGhpcy5jb21wb25lbnRzW2ldLnJlbmRlcihjdHgpO1xuXHRcdH1cblx0fTtcbn0pLmNhbGwoRW50aXR5LnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBSZXNvdXJjZXMuanNcbiAqIFRoaXMgaXMgc2ltcGxlIGFuIGltYWdlIGxvYWRpbmcgdXRpbGl0eS4gSXQgZWFzZXMgdGhlIHByb2Nlc3Mgb2YgbG9hZGluZ1xuICogaW1hZ2UgZmlsZXMgc28gdGhhdCB0aGV5IGNhbiBiZSB1c2VkIHdpdGhpbiB5b3VyIGdhbWUuIEl0IGFsc28gaW5jbHVkZXNcbiAqIGEgc2ltcGxlIFwiY2FjaGluZ1wiIGxheWVyIHNvIGl0IHdpbGwgcmV1c2UgY2FjaGVkIGltYWdlcyBpZiB5b3UgYXR0ZW1wdFxuICogdG8gbG9hZCB0aGUgc2FtZSBpbWFnZSBtdWx0aXBsZSB0aW1lcy5cbiAqL1xuKGZ1bmN0aW9uIFJlc291cmNlcygpIHtcblx0dmFyIHJlc291cmNlQ2FjaGUgPSB7fTtcblx0dmFyIGxvYWRpbmcgPSBbXTtcblx0dmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XG5cblx0LyogVGhpcyBmdW5jdGlvbiBkZXRlcm1pbmVzIGlmIGFsbCBvZiB0aGUgaW1hZ2VzIHRoYXQgaGF2ZSBiZWVuIHJlcXVlc3RlZFxuXHQgICAqIGZvciBsb2FkaW5nIGhhdmUgaW4gZmFjdCBiZWVuIGNvbXBsZXRlZCBsb2FkZWQuXG5cdCAgICovXG5cdGZ1bmN0aW9uIGlzUmVhZHkoKSB7XG5cdFx0dmFyIHJlYWR5ID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBrIGluIHJlc291cmNlQ2FjaGUpIHtcblx0XHRcdGlmIChyZXNvdXJjZUNhY2hlLmhhc093blByb3BlcnR5KGspICYmXG5cdFx0XHQhcmVzb3VyY2VDYWNoZVtrXSkge1xuXHRcdFx0XHRyZWFkeSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVhZHk7XG5cdH1cblxuXHQvKiBUaGlzIGlzIG91ciBwcml2YXRlIGltYWdlIGxvYWRlciBmdW5jdGlvbiwgaXQgaXNcblx0ICAgKiBjYWxsZWQgYnkgdGhlIHB1YmxpYyBpbWFnZSBsb2FkZXIgZnVuY3Rpb24uXG5cdCAgICovXG5cdGZ1bmN0aW9uIF9sb2FkKHVybCkge1xuXHRcdGlmICghcmVzb3VyY2VDYWNoZVt1cmxdKSB7XG5cdFx0XHQvKiBUaGlzIFVSTCBoYXMgbm90IGJlZW4gcHJldmlvdXNseSBsb2FkZWQgYW5kIGlzIG5vdCBwcmVzZW50XG5cdFx0XHQgICAgICAgKiB3aXRoaW4gb3VyIGNhY2hlOyB3ZSdsbCBuZWVkIHRvIGxvYWQgdGhpcyBpbWFnZS5cblx0XHRcdCAgICAgICAqL1xuXHRcdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uIG9uSW1hZ2VMb2FkKCkge1xuXHRcdFx0XHQvKiBPbmNlIG91ciBpbWFnZSBoYXMgcHJvcGVybHkgbG9hZGVkLCBhZGQgaXQgdG8gb3VyIGNhY2hlXG5cdFx0XHRcdCAgICAgICAgICogc28gdGhhdCB3ZSBjYW4gc2ltcGx5IHJldHVybiB0aGlzIGltYWdlIGlmIHRoZSBkZXZlbG9wZXJcblx0XHRcdFx0ICAgICAgICAgKiBhdHRlbXB0cyB0byBsb2FkIHRoaXMgZmlsZSBpbiB0aGUgZnV0dXJlLlxuXHRcdFx0XHQgICAgICAgICAqL1xuXHRcdFx0XHRyZXNvdXJjZUNhY2hlW3VybF0gPSBpbWc7XG5cblx0XHRcdFx0LyogT25jZSB0aGUgaW1hZ2UgaXMgYWN0dWFsbHkgbG9hZGVkIGFuZCBwcm9wZXJseSBjYWNoZWQsXG5cdFx0XHRcdCAgICAgICAgICogY2FsbCBhbGwgb2YgdGhlIG9uUmVhZHkoKSBjYWxsYmFja3Mgd2UgaGF2ZSBkZWZpbmVkLlxuXHRcdFx0XHQgICAgICAgICAqL1xuXHRcdFx0XHRpZiAoaXNSZWFkeSgpKSB7XG5cdFx0XHRcdFx0cmVhZHlDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiBjYWxsQ2FsbGJhY2tzKGZ1bmMpIHsgZnVuYygpOyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0LyogU2V0IHRoZSBpbml0aWFsIGNhY2hlIHZhbHVlIHRvIGZhbHNlLCB0aGlzIHdpbGwgY2hhbmdlIHdoZW5cblx0XHRcdCAgICAgICAqIHRoZSBpbWFnZSdzIG9ubG9hZCBldmVudCBoYW5kbGVyIGlzIGNhbGxlZC4gRmluYWxseSwgcG9pbnRcblx0XHRcdCAgICAgICAqIHRoZSBpbWFnZXMgc3JjIGF0dHJpYnV0ZSB0byB0aGUgcGFzc2VkIGluIFVSTC5cblx0XHRcdCAgICAgICAqL1xuXHRcdFx0cmVzb3VyY2VDYWNoZVt1cmxdID0gZmFsc2U7XG5cdFx0XHRpbWcuc3JjID0gdXJsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xuXHRcdH1cblx0fVxuXG5cdC8qIFRoaXMgaXMgdGhlIHB1YmxpY2x5IGFjY2Vzc2libGUgaW1hZ2UgbG9hZGluZyBmdW5jdGlvbi4gSXQgYWNjZXB0c1xuXHQgICAqIGFuIGFycmF5IG9mIHN0cmluZ3MgcG9pbnRpbmcgdG8gaW1hZ2UgZmlsZXMgb3IgYSBzdHJpbmcgZm9yIGEgc2luZ2xlXG5cdCAgICogaW1hZ2UuIEl0IHdpbGwgdGhlbiBjYWxsIG91ciBwcml2YXRlIGltYWdlIGxvYWRpbmcgZnVuY3Rpb24gYWNjb3JkaW5nbHkuXG5cdCAgICovXG5cdGZ1bmN0aW9uIGxvYWQodXJsT3JBcnIpIHtcblx0XHRpZiAodXJsT3JBcnIgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0LyogSWYgdGhlIGRldmVsb3BlciBwYXNzZWQgaW4gYW4gYXJyYXkgb2YgaW1hZ2VzXG5cdFx0XHQgICAgICAgKiBsb29wIHRocm91Z2ggZWFjaCB2YWx1ZSBhbmQgY2FsbCBvdXIgaW1hZ2Vcblx0XHRcdCAgICAgICAqIGxvYWRlciBvbiB0aGF0IGltYWdlIGZpbGVcblx0XHRcdCAgICAgICAqL1xuXHRcdFx0dXJsT3JBcnIuZm9yRWFjaChmdW5jdGlvbiBsb2FkVVJMKHVybCkge1xuXHRcdFx0XHRfbG9hZCh1cmwpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8qIFRoZSBkZXZlbG9wZXIgZGlkIG5vdCBwYXNzIGFuIGFycmF5IHRvIHRoaXMgZnVuY3Rpb24sXG5cdFx0XHQgICAgICAgKiBhc3N1bWUgdGhlIHZhbHVlIGlzIGEgc3RyaW5nIGFuZCBjYWxsIG91ciBpbWFnZSBsb2FkZXJcblx0XHRcdCAgICAgICAqIGRpcmVjdGx5LlxuXHRcdFx0ICAgICAgICovXG5cdFx0XHRfbG9hZCh1cmxPckFycik7XG5cdFx0fVxuXHR9XG5cblx0LyogVGhpcyBpcyB1c2VkIGJ5IGRldmVsb3BlcidzIHRvIGdyYWIgcmVmZXJlbmNlcyB0byBpbWFnZXMgdGhleSBrbm93XG5cdCAgICogaGF2ZSBiZWVuIHByZXZpb3VzbHkgbG9hZGVkLiBJZiBhbiBpbWFnZSBpcyBjYWNoZWQsIHRoaXMgZnVuY3Rpb25zXG5cdCAgICogdGhlIHNhbWUgYXMgY2FsbGluZyBsb2FkKCkgb24gdGhhdCBVUkwuXG5cdCAgICovXG5cdGZ1bmN0aW9uIGdldCh1cmwpIHtcblx0XHRyZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xuXHR9XG5cblx0LyogVGhpcyBmdW5jdGlvbiB3aWxsIGFkZCBhIGZ1bmN0aW9uIHRvIHRoZSBjYWxsYmFjayBzdGFjayB0aGF0IGlzIGNhbGxlZFxuXHQgICAqIHdoZW4gYWxsIHJlcXVlc3RlZCBpbWFnZXMgYXJlIHByb3Blcmx5IGxvYWRlZC5cblx0ICAgKi9cblx0ZnVuY3Rpb24gb25SZWFkeShmdW5jKSB7XG5cdFx0cmVhZHlDYWxsYmFja3MucHVzaChmdW5jKTtcblx0fVxuXG5cdC8qIFRoaXMgb2JqZWN0IGRlZmluZXMgdGhlIHB1YmxpY2x5IGFjY2Vzc2libGUgZnVuY3Rpb25zIGF2YWlsYWJsZSB0b1xuXHQgICAqIGRldmVsb3BlcnMgYnkgY3JlYXRpbmcgYSBnbG9iYWwgUmVzb3VyY2VzIG9iamVjdC5cblx0ICAgKi9cblx0d2luZG93LlJlc291cmNlcyA9IHtcblx0XHRsb2FkOiBsb2FkLFxuXHRcdGdldDogZ2V0LFxuXHRcdG9uUmVhZHk6IG9uUmVhZHksXG5cdFx0aXNSZWFkeTogaXNSZWFkeVxuXHR9O1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbGxpc2lvbiBTaW5nbGV0b24gdXNlZCBmb3IgY2hlY2tpbmcgY29sbGlzaW9uIGJldHdlZW4gdHdvIHNlbnNvcnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgQ29sbGlzaW9uID0gKGZ1bmN0aW9uIFByb3RvdHlwZSgpIHtcblx0dmFyIGluc3RhbmNlID0gZnVuY3Rpb24gaW5zdGFuY2UoKSB7fTtcblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBVc2VzIGJveCBjb2xsaXNpb24gdG8gY2hlY2sgaWYgdHdvIHNlbnNvcnMgYXJlIHRvdWNoaW5nXG5cdCAqIEBwYXJhbSB7U2Vub3J9IHNlbnNvckEgLSBCb3VuZGluZyByZWN0IEFcblx0ICogQHBhcmFtIHtTZW5vcn0gc2Vuc29yQiAtIEJvdW5kaW5nIHJlY3QgQlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYmFzZWQgb24gc2Vuc29yIG92ZXJsYXBcblx0ICovXG5cdGluc3RhbmNlLmlzQ29sbGlkaW5nID0gZnVuY3Rpb24gaXNDb2xsaWRpbmcoc2Vuc29yQSwgc2Vuc29yQikge1xuXHRcdHJldHVybiAoc2Vuc29yQS54IDwgc2Vuc29yQi54ICsgc2Vuc29yQi53aWR0aCAmJlxuXHRcdFx0c2Vuc29yQS54ICsgc2Vuc29yQi53aWR0aCA+IHNlbnNvckIueCAmJlxuXHRcdFx0c2Vuc29yQS55IDwgc2Vuc29yQi55ICsgc2Vuc29yQi5oZWlnaHQgJiZcblx0XHRcdHNlbnNvckEuaGVpZ2h0ICsgc2Vuc29yQS55ID4gc2Vuc29yQi55KTtcblx0fTtcblx0cmV0dXJuIGluc3RhbmNlO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIEVuZ2luZS5qc1xuICogVGhpcyBmaWxlIHByb3ZpZGVzIHRoZSBnYW1lIGxvb3AgZnVuY3Rpb25hbGl0eSAodXBkYXRlIGVudGl0aWVzIGFuZCByZW5kZXIpLFxuICogZHJhd3MgdGhlIGluaXRpYWwgZ2FtZSBib2FyZCBvbiB0aGUgc2NyZWVuLCBhbmQgdGhlbiBjYWxscyB0aGUgdXBkYXRlIGFuZFxuICogcmVuZGVyIG1ldGhvZHMgb24geW91ciBwbGF5ZXIgYW5kIGVuZW15IG9iamVjdHMgKGRlZmluZWQgaW4geW91ciBhcHAuanMpLlxuICpcbiAqIEEgZ2FtZSBlbmdpbmUgd29ya3MgYnkgZHJhd2luZyB0aGUgZW50aXJlIGdhbWUgc2NyZWVuIG92ZXIgYW5kIG92ZXIsIGtpbmQgb2ZcbiAqIGxpa2UgYSBmbGlwYm9vayB5b3UgbWF5IGhhdmUgY3JlYXRlZCBhcyBhIGtpZC4gV2hlbiB5b3VyIHBsYXllciBtb3ZlcyBhY3Jvc3NcbiAqIHRoZSBzY3JlZW4sIGl0IG1heSBsb29rIGxpa2UganVzdCB0aGF0IGltYWdlL2NoYXJhY3RlciBpcyBtb3Zpbmcgb3IgYmVpbmdcbiAqIGRyYXduIGJ1dCB0aGF0IGlzIG5vdCB0aGUgY2FzZS4gV2hhdCdzIHJlYWxseSBoYXBwZW5pbmcgaXMgdGhlIGVudGlyZSBcInNjZW5lXCJcbiAqIGlzIGJlaW5nIGRyYXduIG92ZXIgYW5kIG92ZXIsIHByZXNlbnRpbmcgdGhlIGlsbHVzaW9uIG9mIGFuaW1hdGlvbi5cbiAqXG4gKiBUaGlzIGVuZ2luZSBpcyBhdmFpbGFibGUgZ2xvYmFsbHkgdmlhIHRoZSBFbmdpbmUgdmFyaWFibGUgYW5kIGl0IGFsc28gbWFrZXNcbiAqIHRoZSBjYW52YXMnIGNvbnRleHQgKGN0eCkgb2JqZWN0IGdsb2JhbGx5IGF2YWlsYWJsZSB0byBtYWtlIHdyaXRpbmcgYXBwLmpzXG4gKiBhIGxpdHRsZSBzaW1wbGVyIHRvIHdvcmsgd2l0aC5cbiAqL1xuXG52YXIgRW5naW5lID0gKGZ1bmN0aW9uIEVuZ2luZShnbG9iYWwpIHtcblx0LyogUHJlZGVmaW5lIHRoZSB2YXJpYWJsZXMgd2UnbGwgYmUgdXNpbmcgd2l0aGluIHRoaXMgc2NvcGUsXG5cdCAqIGNyZWF0ZSB0aGUgY2FudmFzIGVsZW1lbnQsIGdyYWIgdGhlIDJEIGNvbnRleHQgZm9yIHRoYXQgY2FudmFzXG5cdCAqIHNldCB0aGUgY2FudmFzIGVsZW1lbnRzIGhlaWdodC93aWR0aCBhbmQgYWRkIGl0IHRvIHRoZSBET00uXG5cdCAqL1xuXHR2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50LFxuXHRcdHdpbiA9IGdsb2JhbC53aW5kb3csXG5cdFx0Y2FudmFzID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLFxuXHRcdGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLFxuXHRcdGxhc3RUaW1lLFxuXHRcdHJ1bm5pbmcgPSBmYWxzZSxcblx0XHRpbnN0YW5jZSA9IGZ1bmN0aW9uIGluc3RhbmNlKCkge307XG5cblx0aW5zdGFuY2UuZW50aXRpZXMgPSBbXTtcblx0aW5zdGFuY2Uud2lkdGggPSBjYW52YXMud2lkdGggPSA1MDU7XG5cdGluc3RhbmNlLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQgPSA2MDY7XG5cdGNhbnZhcy5jbGFzc05hbWUgKz0gJyBjYW52YXMtZ2FtZSc7XG5cdGRvYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdsZXZlbCcpWzBdLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cblx0LyogVGhpcyBpcyBjYWxsZWQgYnkgdGhlIHVwZGF0ZSBmdW5jdGlvbiAgYW5kIGxvb3BzIHRocm91Z2ggYWxsIG9mIHRoZVxuXHQgKiBvYmplY3RzIHdpdGhpbiB5b3VyIGluc3RhbmNlLmVudGl0aWVzIGFycmF5IGFzIGRlZmluZWQgaW4gYXBwLmpzIGFuZCBjYWxsc1xuXHQgKiB0aGVpciB1cGRhdGUoKSBtZXRob2RzLiBJdCB3aWxsIHRoZW4gY2FsbCB0aGUgdXBkYXRlIGZ1bmN0aW9uIGZvciB5b3VyXG5cdCAqIHBsYXllciBvYmplY3QuIFRoZXNlIHVwZGF0ZSBtZXRob2RzIHNob3VsZCBmb2N1cyBwdXJlbHkgb24gdXBkYXRpbmdcblx0ICogdGhlIGRhdGEvcHJvcGVydGllcyByZWxhdGVkIHRvICB0aGUgb2JqZWN0LiBEbyB5b3VyIGRyYXdpbmcgaW4geW91clxuXHQgKiByZW5kZXIgbWV0aG9kcy5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZUVudGl0aWVzKGR0KSB7XG5cdFx0aW5zdGFuY2UuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiBFYWNoRW5lbXkoZW5lbXkpIHtcblx0XHRcdGVuZW15LnVwZGF0ZShkdCk7XG5cdFx0fSk7XG5cdFx0cGxheWVyLnVwZGF0ZShkdCk7XG5cdH1cblxuXHQvKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBieSBtYWluIChvdXIgZ2FtZSBsb29wKSBhbmQgaXRzZWxmIGNhbGxzIGFsbFxuXHQgKiBvZiB0aGUgZnVuY3Rpb25zIHdoaWNoIG1heSBuZWVkIHRvIHVwZGF0ZSBlbnRpdHkncyBkYXRhLiBCYXNlZCBvbiBob3dcblx0ICogeW91IGltcGxlbWVudCB5b3VyIGNvbGxpc2lvbiBkZXRlY3Rpb24gKHdoZW4gdHdvIGVudGl0aWVzIG9jY3VweSB0aGVcblx0ICogc2FtZSBzcGFjZSwgZm9yIGluc3RhbmNlIHdoZW4geW91ciBjaGFyYWN0ZXIgc2hvdWxkIGRpZSksIHlvdSBtYXkgZmluZFxuXHQgKiB0aGUgbmVlZCB0byBhZGQgYW4gYWRkaXRpb25hbCBmdW5jdGlvbiBjYWxsIGhlcmUuIEZvciBub3csIHdlJ3ZlIGxlZnRcblx0ICogaXQgY29tbWVudGVkIG91dCAtIHlvdSBtYXkgb3IgbWF5IG5vdCB3YW50IHRvIGltcGxlbWVudCB0aGlzXG5cdCAqIGZ1bmN0aW9uYWxpdHkgdGhpcyB3YXkgKHlvdSBjb3VsZCBqdXN0IGltcGxlbWVudCBjb2xsaXNpb24gZGV0ZWN0aW9uXG5cdCAqIG9uIHRoZSBlbnRpdGllcyB0aGVtc2VsdmVzIHdpdGhpbiB5b3VyIGFwcC5qcyBmaWxlKS5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXHRcdHVwZGF0ZUVudGl0aWVzKGR0KTtcblx0XHQvLyBjaGVja0NvbGxpc2lvbnMoKTtcblx0fVxuXG5cdC8qIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGJ5IHRoZSByZW5kZXIgZnVuY3Rpb24gYW5kIGlzIGNhbGxlZCBvbiBlYWNoIGdhbWVcblx0ICogdGljay4gSXQncyBwdXJwb3NlIGlzIHRvIHRoZW4gY2FsbCB0aGUgcmVuZGVyIGZ1bmN0aW9ucyB5b3UgaGF2ZSBkZWZpbmVkXG5cdCAqIG9uIHlvdXIgZW5lbXkgYW5kIHBsYXllciBlbnRpdGllcyB3aXRoaW4gYXBwLmpzXG5cdCAqL1xuXHRmdW5jdGlvbiByZW5kZXJFbnRpdGllcygpIHtcblx0XHQvKiBMb29wIHRocm91Z2ggYWxsIG9mIHRoZSBvYmplY3RzIHdpdGhpbiB0aGUgaW5zdGFuY2UuZW50aXRpZXMgYXJyYXkgYW5kIGNhbGxcblx0XHQgKiB0aGUgcmVuZGVyIGZ1bmN0aW9uIHlvdSBoYXZlIGRlZmluZWQuXG5cdFx0ICovXG5cdFx0dmFyIGk7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGluc3RhbmNlLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpbnN0YW5jZS5lbnRpdGllc1tpXS5yZW5kZXIoY3R4KTtcblx0XHR9XG5cblx0XHRwbGF5ZXIucmVuZGVyKGN0eCk7XG5cdH1cblxuXHQvKiBUaGlzIGZ1bmN0aW9uIGluaXRpYWxseSBkcmF3cyB0aGUgXCJnYW1lIGxldmVsXCIsIGl0IHdpbGwgdGhlbiBjYWxsXG5cdCAqIHRoZSByZW5kZXJFbnRpdGllcyBmdW5jdGlvbi4gUmVtZW1iZXIsIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGV2ZXJ5XG5cdCAqIGdhbWUgdGljayAob3IgbG9vcCBvZiB0aGUgZ2FtZSBlbmdpbmUpIGJlY2F1c2UgdGhhdCdzIGhvdyBnYW1lcyB3b3JrIC1cblx0ICogdGhleSBhcmUgZmxpcGJvb2tzIGNyZWF0aW5nIHRoZSBpbGx1c2lvbiBvZiBhbmltYXRpb24gYnV0IGluIHJlYWxpdHlcblx0ICogdGhleSBhcmUganVzdCBkcmF3aW5nIHRoZSBlbnRpcmUgc2NyZWVuIG92ZXIgYW5kIG92ZXIuXG5cdCAqL1xuXHRmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0LyogVGhpcyBhcnJheSBob2xkcyB0aGUgcmVsYXRpdmUgVVJMIHRvIHRoZSBpbWFnZSB1c2VkXG5cdFx0ICogZm9yIHRoYXQgcGFydGljdWxhciByb3cgb2YgdGhlIGdhbWUgbGV2ZWwuXG5cdFx0ICovXG5cdFx0dmFyIHJvd0ltYWdlcyA9IFtcblx0XHRcdFx0J2ltYWdlcy93YXRlci1ibG9jay5wbmcnLCAvLyBUb3Agcm93IGlzIHdhdGVyXG5cdFx0XHRcdCdpbWFnZXMvc3RvbmUtYmxvY2sucG5nJywgLy8gUm93IDEgb2YgMyBvZiBzdG9uZVxuXHRcdFx0XHQnaW1hZ2VzL3N0b25lLWJsb2NrLnBuZycsIC8vIFJvdyAyIG9mIDMgb2Ygc3RvbmVcblx0XHRcdFx0J2ltYWdlcy9zdG9uZS1ibG9jay5wbmcnLCAvLyBSb3cgMyBvZiAzIG9mIHN0b25lXG5cdFx0XHRcdCdpbWFnZXMvZ3Jhc3MtYmxvY2sucG5nJywgLy8gUm93IDEgb2YgMiBvZiBncmFzc1xuXHRcdFx0XHQnaW1hZ2VzL2dyYXNzLWJsb2NrLnBuZycgLy8gUm93IDIgb2YgMiBvZiBncmFzc1xuXHRcdFx0XSxcblx0XHRcdG51bVJvd3MgPSA2LFxuXHRcdFx0bnVtQ29scyA9IDUsXG5cdFx0XHRyb3csIGNvbDtcblxuXHRcdC8vICBDbGVhciB0aGUgZW50aXJlIGNhbnZhc1xuXHRcdGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuXHRcdC8qIExvb3AgdGhyb3VnaCB0aGUgbnVtYmVyIG9mIHJvd3MgYW5kIGNvbHVtbnMgd2UndmUgZGVmaW5lZCBhYm92ZVxuXHRcdCAqIGFuZCwgdXNpbmcgdGhlIHJvd0ltYWdlcyBhcnJheSwgZHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhhdFxuXHRcdCAqIHBvcnRpb24gb2YgdGhlIFwiZ3JpZFwiXG5cdFx0ICovXG5cdFx0Zm9yIChyb3cgPSAwOyByb3cgPCBudW1Sb3dzOyByb3crKykge1xuXHRcdFx0Zm9yIChjb2wgPSAwOyBjb2wgPCBudW1Db2xzOyBjb2wrKykge1xuXHRcdFx0XHQvKiBUaGUgZHJhd0ltYWdlIGZ1bmN0aW9uIG9mIHRoZSBjYW52YXMnIGNvbnRleHQgZWxlbWVudFxuXHRcdFx0XHQgKiByZXF1aXJlcyAzIHBhcmFtZXRlcnM6IHRoZSBpbWFnZSB0byBkcmF3LCB0aGUgeCBjb29yZGluYXRlXG5cdFx0XHRcdCAqIHRvIHN0YXJ0IGRyYXdpbmcgYW5kIHRoZSB5IGNvb3JkaW5hdGUgdG8gc3RhcnQgZHJhd2luZy5cblx0XHRcdFx0ICogV2UncmUgdXNpbmcgb3VyIFJlc291cmNlcyBoZWxwZXJzIHRvIHJlZmVyIHRvIG91ciBpbWFnZXNcblx0XHRcdFx0ICogc28gdGhhdCB3ZSBnZXQgdGhlIGJlbmVmaXRzIG9mIGNhY2hpbmcgdGhlc2UgaW1hZ2VzLCBzaW5jZVxuXHRcdFx0XHQgKiB3ZSdyZSB1c2luZyB0aGVtIG92ZXIgYW5kIG92ZXIuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRjdHguZHJhd0ltYWdlKFJlc291cmNlcy5nZXQocm93SW1hZ2VzW3Jvd10pLCBjb2wgKiAxMDEsIHJvdyAqIDgzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZW5kZXJFbnRpdGllcygpO1xuXHR9XG5cblx0LyogVGhpcyBmdW5jdGlvbiBzZXJ2ZXMgYXMgdGhlIGtpY2tvZmYgcG9pbnQgZm9yIHRoZSBnYW1lIGxvb3AgaXRzZWxmXG5cdCAqIGFuZCBoYW5kbGVzIHByb3Blcmx5IGNhbGxpbmcgdGhlIHVwZGF0ZSBhbmQgcmVuZGVyIG1ldGhvZHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBtYWluKCkge1xuXHRcdGlmIChydW5uaW5nKSB7XG5cdFx0XHQvKiBHZXQgb3VyIHRpbWUgZGVsdGEgaW5mb3JtYXRpb24gd2hpY2ggaXMgcmVxdWlyZWQgaWYgeW91ciBnYW1lXG5cdFx0XHQgKiByZXF1aXJlcyBzbW9vdGggYW5pbWF0aW9uLiBCZWNhdXNlIGV2ZXJ5b25lJ3MgY29tcHV0ZXIgcHJvY2Vzc2VzXG5cdFx0XHQgKiBpbnN0cnVjdGlvbnMgYXQgZGlmZmVyZW50IHNwZWVkcyB3ZSBuZWVkIGEgY29uc3RhbnQgdmFsdWUgdGhhdFxuXHRcdFx0ICogd291bGQgYmUgdGhlIHNhbWUgZm9yIGV2ZXJ5b25lIChyZWdhcmRsZXNzIG9mIGhvdyBmYXN0IHRoZWlyXG5cdFx0XHQgKiBjb21wdXRlciBpcykgLSBodXJyYXkgdGltZSFcblx0XHRcdCAqL1xuXHRcdFx0dmFyIG5vdyA9IERhdGUubm93KCksXG5cdFx0XHRcdGR0ID0gKG5vdyAtIGxhc3RUaW1lKSAvIDEwMDAuMDtcblxuXHRcdFx0LyogQ2FsbCBvdXIgdXBkYXRlL3JlbmRlciBmdW5jdGlvbnMsIHBhc3MgYWxvbmcgdGhlIHRpbWUgZGVsdGEgdG9cblx0XHRcdCAqIG91ciB1cGRhdGUgZnVuY3Rpb24gc2luY2UgaXQgbWF5IGJlIHVzZWQgZm9yIHNtb290aCBhbmltYXRpb24uXG5cdFx0XHQgKi9cblx0XHRcdHVwZGF0ZShkdCk7XG5cdFx0XHRyZW5kZXIoKTtcblxuXHRcdFx0LyogU2V0IG91ciBsYXN0VGltZSB2YXJpYWJsZSB3aGljaCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdGltZSBkZWx0YVxuXHRcdFx0ICogZm9yIHRoZSBuZXh0IHRpbWUgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQuXG5cdFx0XHQgKi9cblx0XHRcdGxhc3RUaW1lID0gbm93O1xuXG5cdFx0XHQvKiBVc2UgdGhlIGJyb3dzZXIncyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZnVuY3Rpb24gdG8gY2FsbCB0aGlzXG5cdFx0XHQgKiBmdW5jdGlvbiBhZ2FpbiBhcyBzb29uIGFzIHRoZSBicm93c2VyIGlzIGFibGUgdG8gZHJhdyBhbm90aGVyIGZyYW1lLlxuXHRcdFx0ICovXG5cdFx0XHR3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xuXHRcdH1cblx0fVxuXG5cdC8qIFRoaXMgZnVuY3Rpb24gZG9lcyBzb21lIGluaXRpYWwgc2V0dXAgdGhhdCBzaG91bGQgb25seSBvY2N1ciBvbmNlLFxuXHQgKiBwYXJ0aWN1bGFybHkgc2V0dGluZyB0aGUgbGFzdFRpbWUgdmFyaWFibGUgdGhhdCBpcyByZXF1aXJlZCBmb3IgdGhlXG5cdCAqIGdhbWUgbG9vcC5cblx0ICovXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0aW5zdGFuY2UucmVzZXQoKTtcblx0XHRydW5uaW5nID0gdHJ1ZTtcblx0XHRsYXN0VGltZSA9IERhdGUubm93KCk7XG5cdFx0bWFpbigpO1xuXHR9XG5cblx0LyogVGhpcyBmdW5jdGlvbiBkb2VzIG5vdGhpbmcgYnV0IGl0IGNvdWxkIGhhdmUgYmVlbiBhIGdvb2QgcGxhY2UgdG9cblx0ICogaGFuZGxlIGdhbWUgcmVzZXQgc3RhdGVzIC0gbWF5YmUgYSBuZXcgZ2FtZSBtZW51IG9yIGEgZ2FtZSBvdmVyIHNjcmVlblxuXHQgKiB0aG9zZSBzb3J0cyBvZiB0aGluZ3MuIEl0J3Mgb25seSBjYWxsZWQgb25jZSBieSB0aGUgaW5pdCgpIG1ldGhvZC5cblx0ICovXG5cdGluc3RhbmNlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG5cdFx0cnVubmluZyA9IGZhbHNlO1xuXHR9O1xuXG5cdGluc3RhbmNlLnBhdXNlID0gZnVuY3Rpb24gcGF1c2UoKSB7XG5cdFx0cnVubmluZyA9IGZhbHNlO1xuXHR9O1xuXG5cdGluc3RhbmNlLnByZWxvYWQgPSBmdW5jdGlvbiBwcmVsb2FkKCkge1xuXHRcdC8qIEdvIGFoZWFkIGFuZCBsb2FkIGFsbCBvZiB0aGUgaW1hZ2VzIHdlIGtub3cgd2UncmUgZ29pbmcgdG8gbmVlZCB0b1xuXHRcdCAqIGRyYXcgb3VyIGdhbWUgbGV2ZWwuIFRoZW4gc2V0IGluaXQgYXMgdGhlIGNhbGxiYWNrIG1ldGhvZCwgc28gdGhhdCB3aGVuXG5cdFx0ICogYWxsIG9mIHRoZXNlIGltYWdlcyBhcmUgcHJvcGVybHkgbG9hZGVkIG91ciBnYW1lIHdpbGwgc3RhcnQuXG5cdFx0ICovXG5cblx0XHRmdW5jdGlvbiBsb2NhdGlvbnMoZm9sZGVyLCBmb3JtYXQpIHtcblx0XHRcdHZhciByZXNvdXJjZXMgPSBbXG5cdFx0XHRcdCdjaGFyLWJveScsXG5cdFx0XHRcdCdjaGFyLWNhdC1naXJsJyxcblx0XHRcdFx0J2NoYXItaG9ybi1naXJsJyxcblx0XHRcdFx0J2NoYXItcGluay1naXJsJyxcblx0XHRcdFx0J2NoYXItcHJpbmNlc3MtZ2lybCcsXG5cdFx0XHRcdCdlbmVteS1idWcnLFxuXHRcdFx0XHQnR2VtIEJsdWUnLFxuXHRcdFx0XHQnR2VtIEdyZWVuJyxcblx0XHRcdFx0J0dlbSBPcmFuZ2UnLFxuXHRcdFx0XHQnZ3Jhc3MtYmxvY2snLFxuXHRcdFx0XHQnSGVhcnQnLFxuXHRcdFx0XHQnS2V5Jyxcblx0XHRcdFx0J1JvY2snLFxuXHRcdFx0XHQnU2VsZWN0b3InLFxuXHRcdFx0XHQnU3RhcicsXG5cdFx0XHRcdCdzdG9uZS1ibG9jaycsXG5cdFx0XHRcdCd3YXRlci1ibG9jaydcblx0XHRcdF07XG5cdFx0XHRyZXR1cm4gcmVzb3VyY2VzLm1hcChmdW5jdGlvbiByZXNvdXJjZU1hcChlbCkge1xuXHRcdFx0XHRyZXR1cm4gZm9sZGVyICsgZWwgKyAnLicgKyBmb3JtYXQ7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0UmVzb3VyY2VzLmxvYWQobG9jYXRpb25zKCdpbWFnZXMvJywgJ3BuZycpKTtcblxuXHRcdGlmIChSZXNvdXJjZXMuaXNSZWFkeSgpKSB7XG5cdFx0XHRpbml0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFJlc291cmNlcy5vblJlYWR5KGluaXQpO1xuXHRcdH1cblx0fTtcblxuXHQvKiBBc3NpZ24gdGhlIGNhbnZhcycgY29udGV4dCBvYmplY3QgdG8gdGhlIGdsb2JhbCB2YXJpYWJsZSAodGhlIHdpbmRvd1xuXHQgKiBvYmplY3Qgd2hlbiBydW4gaW4gYSBicm93c2VyKSBzbyB0aGF0IGRldmVsb3BlcidzIGNhbiB1c2UgaXQgbW9yZSBlYXNpbHlcblx0ICogZnJvbSB3aXRoaW4gdGhlaXIgYXBwLmpzIGZpbGVzLlxuXHQgKi9cblx0Z2xvYmFsLmN0eCA9IGN0eDtcblxuXHRyZXR1cm4gaW5zdGFuY2U7XG59KSh0aGlzKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBAZGVzY3JpcHRpb24gTW9kZWwgU2luZ2xldG9uIHVzZWQgZm9yIHN0b3Jpbmcgc3RhdGUgZGF0YVxuKiBAY29uc3RydWN0b3JcbiovXG52YXIgTW9kZWwgPSAoZnVuY3Rpb24gTW9kZWwoKSB7XG5cdHZhciBkYXRhID0ge307XG5cdHZhciBpbnN0YW5jZSA9IGZ1bmN0aW9uIGluc3RhbmNlKCkge307XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBTZXRzIGEgdmFsdWUgdG8gYSBrZXlcblx0ICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBwcm9wZXJ0eSB0byBzdG9yZSB0aGUgdmFsdWUgdW5kZXJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIHZhbHVlIG9mIHRoZSBrZXlcblx0ICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSBvZiB0aGUga2V5XG5cdCAqL1xuXHRpbnN0YW5jZS5zZXQgPSBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuXHRcdGRhdGFba2V5XSA9IHZhbHVlO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIHZhbHVlIHNldCB0byB0aGUga2V5XG5cdCAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWUgb2YgdGhlIGtleVxuXHQgKi9cblx0aW5zdGFuY2UuZ2V0ID0gZnVuY3Rpb24gZ2V0KGtleSkge1xuXHRcdHJldHVybiBkYXRhW2tleV07XG5cdH07XG5cblx0cmV0dXJuIGluc3RhbmNlO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBAZGVzY3JpcHRpb24gQSBUaW1lciBjbGFzcyB0aGF0IHVwZGF0ZXMgbWFudWFsbHkgdXNpbmcgd2l0aCBkZWx0YSB0aW1lXG4qIEBjb25zdHJ1Y3RvclxuKi9cbnZhciBUaW1lciA9IGZ1bmN0aW9uIFRpbWVyKGludGVydmFscywgZGVsYXkpIHtcblx0dGhpcy5pbnRlcnZhbHMgPSBpbnRlcnZhbHM7XG5cdHRoaXMuZGVsYXkgPSBkZWxheTtcblx0dGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cdHRoaXMubGlzdGVuZXJzID0ge307XG5cdHRoaXMudGltZSA9IDA7XG5cdHRoaXMubGFwcyA9IDA7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFJlc2V0cyB0aGUgdGltZXIgYW5kIGZsYWdzIGl0IGFzIHJ1bm5pbmdcblx0ICovXG5cdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiBzdGFydCgpIHtcblx0XHR0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuXHRcdHRoaXMudGltZSA9IHRoaXMuZGVsYXk7XG5cdFx0dGhpcy5sYXBzID0gdGhpcy5pbnRlcnZhbHM7XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBVc2VzIHRoZSBkZWx0YSB0aW1lIHRvIG1hbnVhbGx5IHVwZGF0ZSB0aGUgdGltZXJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGRlbHRhIC0gVGltZSBzaW5jZSBsYXN0IHVwZGF0ZVxuXHQgKi9cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoZGVsdGEpIHtcblx0XHRpZiAodGhpcy5ydW5uaW5nKSB7XG5cdFx0XHR0aGlzLnRpbWUgPSBNYXRoLm1heCgwLCB0aGlzLnRpbWUgLSBkZWx0YSk7XG5cdFx0XHRpZiAodGhpcy50aW1lID09PSAwKSB7XG5cdFx0XHRcdHRoaXMubGFwcyAtPSAxO1xuXHRcdFx0XHRpZiAodGhpcy5sYXBzIDw9IDApIHtcblx0XHRcdFx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR0aGlzLmRpc3BhdGNoKCdDT01QTEVURScpO1xuXHRcdFx0XHR9ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy50aW1lID0gdGhpcy5kZWxheTtcblx0XHRcdFx0XHR0aGlzLmRpc3BhdGNoKCdVUERBVEUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIEFkZHMgYSBsaXN0ZW5lciBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBUaGUgZXZlbnQgdG8gbGlzdGVuIGZvclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuXHQgKi9cblx0dGhpcy5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBsaXN0ZW5lcikge1xuXHRcdGlmICghdGhpcy5saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG5cdFx0XHR0aGlzLmxpc3RlbmVyc1tldmVudF0gPSBbXTtcblx0XHR9XG5cdFx0dGhpcy5saXN0ZW5lcnNbZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQXR0ZW1wdHMgdG8gaW52b2tlIGEgY2FsbGJhY2sgbWV0aG9kIGZvciB0aGUgZ2l2ZW4gZXZlbnRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gVGhlIGV2ZW50IHRvIGRpc3BhdGNoXG5cdCAqL1xuXHR0aGlzLmRpc3BhdGNoID0gZnVuY3Rpb24gZGlzcGF0Y2goZXZlbnQpIHtcblx0XHR2YXIgaTtcblx0XHR2YXIgbGlzdDtcblx0XHRpZiAodGhpcy5saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG5cdFx0XHRsaXN0ID0gdGhpcy5saXN0ZW5lcnNbZXZlbnRdO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGlzdFtpXSh0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59KS5jYWxsKFRpbWVyLnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiogQGRlc2NyaXB0aW9uIEdyaWQgU2luZ2xldG9uIHVzZWQgZm9yIHBvc2l0aW9uaW5nIHRoaW5ncyBvbiBhIEdyaWRcbiogQGNvbnN0cnVjdG9yXG4qL1xudmFyIEdyaWQgPSAoZnVuY3Rpb24gR3JpZCgpIHtcblx0dmFyIGluc3RhbmNlID0gZnVuY3Rpb24gaW5zdGFuY2UoKSB7fTtcblxuXHRpbnN0YW5jZS5jZWxsV2lkdGggPSAxMDE7XG5cdGluc3RhbmNlLmNlbGxIZWlnaHQgPSA4Mztcblx0aW5zdGFuY2UuY29sdW1ucyA9IDU7XG5cdGluc3RhbmNlLnJvd3MgPSA2O1xuXHRpbnN0YW5jZS5vZmZzZXRZID0gNTA7XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBEZXRlcm1pbmVzIHRoZSB4IGxvY2F0aW9uIGJhc2VkIG9uIHRoZSBjb2x1bW5cblx0ICogQHBhcmFtIHtpbnR9IGNvbHVtbiAtIFRoZSBjb2x1bW5cblx0ICogQHJldHVybnMge251bWJlcn0gVGhlIHNjcmVlbiB4IHBvc2l0aW9uXG5cdCAqL1xuXHRpbnN0YW5jZS5nZXRYRnJvbUNvbHVtbiA9IGZ1bmN0aW9uIGdldFhGcm9tQ29sdW1uKGNvbHVtbikge1xuXHRcdHZhciBjb2wgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihjb2x1bW4sIGluc3RhbmNlLmNvbHVtbnMgLSAxKSk7XG5cdFx0cmV0dXJuIGNvbCAqIGluc3RhbmNlLmNlbGxXaWR0aDtcblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIERldGVybWluZXMgdGhlIHkgbG9jYXRpb24gYmFzZWQgb24gdGhlIHJvd1xuXHQgKiBAcGFyYW0ge2ludH0gcm93IC0gVGhlIHJvd1xuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc2NyZWVuIHkgcG9zaXRpb25cblx0ICovXG5cdGluc3RhbmNlLmdldFlGcm9tUm93ID0gZnVuY3Rpb24gZ2V0WUZyb21Sb3cocm93KSB7XG5cdFx0cm93ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ocm93LCBpbnN0YW5jZS5yb3dzIC0gMSkpO1xuXHRcdHJldHVybiBpbnN0YW5jZS5vZmZzZXRZICsgcm93ICogaW5zdGFuY2UuY2VsbEhlaWdodDtcblx0fTtcblxuXHRyZXR1cm4gaW5zdGFuY2U7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4qIEBkZXNjcmlwdGlvbiBIYW5kbGVzIGxldmVsIGNyZWF0aW9uXG4qIEBjb25zdHJ1Y3RvclxuKi9cbnZhciBMZXZlbCA9IGZ1bmN0aW9uIExldmVsKCkge1xuXHR0aGlzLnJlc2V0KCk7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFJlc2V0J3MgbGV2ZWwgdmFyaWFibGVzIHRvIG9yaWdpbmFsIHZhbHVlc1xuXHQgKi9cblx0dGhpcy5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuXHRcdHRoaXMubGV2ZWwgPSBNb2RlbC5zZXQoJ2xldmVsJywgMCk7XG5cdFx0dGhpcy5sYXN0TGV2ZWwgPSA3O1xuXHRcdE1vZGVsLnNldCgnbGV2ZWxfdG90YWxfdGltZScsIDE1KTtcblx0XHRNb2RlbC5zZXQoJ2xldmVsX2NvbXBsZXRlJywgZmFsc2UpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQWR2YW5jZXMgdGhlIGN1cnJlbnQgbGV2ZWwgYnkgb25lXG5cdCAqL1xuXHR0aGlzLm5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuXHRcdHRoaXMubGV2ZWwgPSBNb2RlbC5zZXQoJ2xldmVsJywgdGhpcy5sZXZlbCArIDEpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhbGwgdGhlIGVudGl0aWVzIGZvciB0aGUgY3VycmVudCBsZXZlbFxuXHQgKi9cblx0dGhpcy5hZGRFbnRpdGllcyA9IGZ1bmN0aW9uIGFkZEVudGl0aWVzKCkge1xuXHRcdHZhciBkYXRhID0gdGhpcy5sZXZlbERhdGEoKTtcblx0XHR2YXIgaTtcblx0XHRFbmdpbmUuZW50aXRpZXMgPSBbXTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoZGF0YVtpXS5oYXNPd25Qcm9wZXJ0eSgndCcpKSB7XG5cdFx0XHRcdEJsdWVwcmludC5jcmVhdGUoZGF0YVtpXS50LCBkYXRhW2ldKTtcblx0XHRcdH1lbHNlIHtcblx0XHRcdFx0Qmx1ZXByaW50LmNyZWF0ZShcImVuZW15XCIsIGRhdGFbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIEpTT04gZW50aXRpZXMgZm9yIHRoZSBnaXZlbiBsZXZlbFxuXHQgKiBAcmV0dXJucyB7YXJyYXl9XG5cdCAqL1xuXHR0aGlzLmxldmVsRGF0YSA9IGZ1bmN0aW9uIGxldmVsRGF0YSgpIHtcblx0XHQvLyAgRm9ybWF0dGVkIHNvIGl0J3MgZWFzaWVyIHRvIHNlZSB0aGUgbGV2ZWxzIChub3QgZm9sbG93aW5nIFVkYWNpdHkgSlMgc3RhbmRhcmRzKVxuXHRcdC8vICBqc2NzOmRpc2FibGVcblx0XHRpZiAodGhpcy5sZXZlbCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdHtyOiAwLCBjOiAwLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDEsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogMiwgdDogJ2tleSd9LCB7cjogMCwgYzogMywgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiA0LCB0OiAnd2F0ZXInfVxuXHRcdFx0XTtcblx0XHR9ZWxzZSBpZiAodGhpcy5sZXZlbCA9PT0gMSkge1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdHtyOiAzLCBjOiAwLCBzOiAyMDB9LCB7cjogMywgYzogMiwgczogMjAwfSwge3I6IDMsIGM6IDQsIHM6IDIwMH0sXG5cdFx0XHR7cjogMCwgYzogMCwgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiAxLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDIsIHQ6ICdrZXknfSwge3I6IDAsIGM6IDMsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogNCwgdDogJ3dhdGVyJ31cblx0XHRcdF07XG5cdFx0fWVsc2UgaWYgKHRoaXMubGV2ZWwgPT09IDIpIHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHR7cjogMSwgYzogMCwgczogLTEwMH0sIHtyOiAxLCBjOiAxLCBzOiAtMTAwfSwge3I6IDEsIGM6IDMsIHM6IC0xMDB9LCB7cjogMSwgYzogNCwgczogLTEwMH0sXG5cdFx0XHR7cjogMCwgYzogMCwgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiAxLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDIsIHQ6ICdrZXknfSwge3I6IDAsIGM6IDMsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogNCwgdDogJ3dhdGVyJ31cblx0XHRcdF07XG5cdFx0fWVsc2UgaWYgKHRoaXMubGV2ZWwgPT09IDMpIHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHR7cjogMiwgYzogMCwgczogNTAwfSwge3I6IDIsIGM6IDQsIHM6IDYwMH0sXG5cdFx0XHR7cjogMCwgYzogMCwgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiAxLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDIsIHQ6ICdrZXknfSwge3I6IDAsIGM6IDMsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogNCwgdDogJ3dhdGVyJ31cblx0XHRcdF07XG5cdFx0fWVsc2UgaWYgKHRoaXMubGV2ZWwgPT09IDQpIHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHR7cjogMSwgYzogMCwgczogLTEwMH0sIHtyOiAxLCBjOiAxLCBzOiAtMTAwfSwge3I6IDEsIGM6IDMsIHM6IC0xMDB9LCB7cjogMSwgYzogNCwgczogLTEwMH0sXG5cdFx0XHR7cjogMywgYzogMCwgczogMjAwfSwge3I6IDMsIGM6IDIsIHM6IDIwMH0sIHtyOiAzLCBjOiA0LCBzOiAyMDB9LFxuXHRcdFx0e3I6IDAsIGM6IDAsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogMSwgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiAyLCB0OiAna2V5J30sIHtyOiAwLCBjOiAzLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDQsIHQ6ICd3YXRlcid9XG5cdFx0XHRdO1xuXHRcdH1lbHNlIGlmICh0aGlzLmxldmVsID09PSA1KSB7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0e3I6IDIsIGM6IDAsIHM6IDUwMH0sIHtyOiAyLCBjOiA0LCBzOiA2MDB9LFxuXHRcdFx0e3I6IDMsIGM6IDAsIHM6IDIwMH0sIHtyOiAzLCBjOiAyLCBzOiAyMDB9LCB7cjogMywgYzogNCwgczogMjAwfSxcblx0XHRcdHtyOiAwLCBjOiAwLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDEsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogMiwgdDogJ2tleSd9LCB7cjogMCwgYzogMywgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiA0LCB0OiAnd2F0ZXInfVxuXHRcdFx0XTtcblx0XHR9ZWxzZSBpZiAodGhpcy5sZXZlbCA9PT0gNikge1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdHtyOiAxLCBjOiAwLCBzOiAtMTAwfSwge3I6IDEsIGM6IDEsIHM6IC0xMDB9LCB7cjogMSwgYzogMywgczogLTEwMH0sIHtyOiAxLCBjOiA0LCBzOiAtMTAwfSxcblx0XHRcdHtyOiAyLCBjOiAwLCBzOiA1MDB9LCB7cjogMiwgYzogNCwgczogNjAwfSxcblx0XHRcdHtyOiAwLCBjOiAwLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDEsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogMiwgdDogJ2tleSd9LCB7cjogMCwgYzogMywgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiA0LCB0OiAnd2F0ZXInfVxuXHRcdFx0XTtcblx0XHR9XG5cdFx0Ly8gIGpzY3M6ZGlzYWJsZVxuXHRcdHJldHVybiBbXG5cdFx0e3I6IDEsIGM6IDAsIHM6IC0xMDB9LCB7cjogMSwgYzogMSwgczogLTEwMH0sIHtyOiAxLCBjOiAzLCBzOiAtMTAwfSwge3I6IDEsIGM6IDQsIHM6IC0xMDB9LFxuXHRcdHtyOiAyLCBjOiAwLCBzOiA1MDB9LCB7cjogMiwgYzogNCwgczogNjAwfSxcblx0XHR7cjogMywgYzogMCwgczogMjAwfSwge3I6IDMsIGM6IDIsIHM6IDIwMH0sIHtyOiAzLCBjOiA0LCBzOiAyMDB9LFxuXHRcdHtyOiAwLCBjOiAwLCB0OiAnd2F0ZXInfSwge3I6IDAsIGM6IDEsIHQ6ICd3YXRlcid9LCB7cjogMCwgYzogMiwgdDogJ2tleSd9LCB7cjogMCwgYzogMywgdDogJ3dhdGVyJ30sIHtyOiAwLCBjOiA0LCB0OiAnd2F0ZXInfVxuXHRcdF07XG5cdH07XG59KS5jYWxsKExldmVsLnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBTY2VuZSBTaW5nbGV0b24gdXNlZCBmb3IgY2hhbmdpbmcgdGhlIHNjZW5lIHZpZXdcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgU2NlbmUgPSAoZnVuY3Rpb24gU2NlbmUoKSB7XG5cdHZhciBpbnN0YW5jZSA9IGZ1bmN0aW9uIGluc3RhbmNlKCkge307XG5cdHZhciBsZXZlbCA9IG5ldyBMZXZlbCgpO1xuXHR2YXIgdGltZW91dDtcblx0dmFyIG9uQ2hhcmFjdGVyQ2xpY2tlZCA9IGZ1bmN0aW9uIG9uQ2hhcmFjdGVyQ2xpY2tlZChlbCkge1xuXHRcdHZhciBzID0gZWwudGFyZ2V0LnNyYztcblx0XHRwbGF5ZXIuc3ByaXRlID0gcy5zbGljZShzLmluZGV4T2YoJy9pbWFnZXMvJykgKyAxLCBzLmxlbmd0aCk7XG5cblx0XHRFbC5yZW1vdmVDbGFzcyhFbC5nZXRFbGVtZW50cygnc2VsZWN0ZWQtY2hhcicpLCAnc2VsZWN0ZWQtY2hhcicpO1xuXHRcdEVsLmFkZENsYXNzKGVsLnRhcmdldCwgJ3NlbGVjdGVkLWNoYXInKTtcblx0fTtcblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBTaG93cyB0aGUgQ2hhcmFjdGVyIHNlbGVjdGlvbiBzY2VuZVxuXHQgKi9cblx0aW5zdGFuY2Uuc3RhcnRNZW51ID0gZnVuY3Rpb24gc3RhcnRNZW51KCkge1xuXHRcdHZhciBjaGFyYWN0ZXJzID0gRWwuZ2V0RWxlbWVudHMoJ2NoYXInKTtcblx0XHR2YXIgaTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBjaGFyYWN0ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjaGFyYWN0ZXJzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DaGFyYWN0ZXJDbGlja2VkKTtcblx0XHR9XG5cblx0XHRFbmdpbmUucmVzZXQoKTtcblxuXHRcdEVsLnNob3coJ2NoYXJfc2VsZWN0Jyk7XG5cdFx0RWwuaGlkZSgnbGV2ZWwnKTtcblx0XHRFbC5oaWRlKCdnYW1lb3ZlcicpO1xuXHRcdEVsLmhpZGUoJ2dhbWV3aW4nKTtcblx0XHRzY2VuZSA9ICdjaGFyX3NlbGVjdCc7XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBTaG93cyB0aGUgR2FtZSBzY2VuZVxuXHQgKi9cblx0aW5zdGFuY2Uuc3RhcnRHYW1lID0gZnVuY3Rpb24gc3RhcnRHYW1lKHJlc2V0KSB7XG5cdFx0cmVzZXQgPSByZXNldCB8fCBmYWxzZTtcblxuXHRcdHBsYXllci5yZXNwYXduKGZhbHNlKTtcblx0XHRcblx0XHRpZiAocmVzZXQpIHtcblx0XHRcdGxldmVsLnJlc2V0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdE1vZGVsLnNldCgnbGV2ZWxfY29tcGxldGUnLCBmYWxzZSk7XG5cdFx0fVxuXG5cdFx0RW5naW5lLnByZWxvYWQoKTtcblx0XHRcblxuXHRcdGxldmVsLmFkZEVudGl0aWVzKCk7XG5cdFx0RW5naW5lLmVudGl0aWVzLnB1c2godWkpO1xuXHRcdHVpLnN0YXJ0KCk7XG5cblx0XHRFbC5zaG93KCdsZXZlbCcpO1xuXHRcdEVsLmhpZGUoJ2NoYXJfc2VsZWN0Jyk7XG5cdFx0RWwuaGlkZSgnZ2FtZW92ZXInKTtcblx0XHRFbC5oaWRlKCdnYW1ld2luJyk7XG5cdFx0c2NlbmUgPSAnbGV2ZWwnO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gU2hvd3MgdGhlIEdhbWUgT3ZlciBwb3B1cFxuXHQgKi9cblx0aW5zdGFuY2UuZW5kR2FtZSA9IGZ1bmN0aW9uIGVuZEdhbWUoKSB7XG5cdFx0RWwuc2hvdygnZ2FtZW92ZXInKTtcblx0XHRFbmdpbmUucGF1c2UoKTtcblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFNob3dzIHRoZSBHYW1lIFdpbiBwb3B1cFxuXHQgKi9cblx0aW5zdGFuY2Uud2luR2FtZSA9IGZ1bmN0aW9uIHdpbkdhbWUoKSB7XG5cdFx0RWwuc2hvdygnZ2FtZXdpbicpO1xuXHRcdEVuZ2luZS5wYXVzZSgpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gVGhlIHBsYXllciBwaWNrZWQgdXAgdGhlIGtleS4gU2hvdyBzdGFyIGV4cGxvc2lvbiBhbmQgYWR2YW5jZSBsZXZlbCBhZnRlciB0aW1lb3V0XG5cdCAqL1xuXHRpbnN0YW5jZS5sZXZlbENvbXBsZXRlID0gZnVuY3Rpb24gbGV2ZWxDb21wbGV0ZSgpIHtcblx0XHRNb2RlbC5zZXQoJ2xldmVsX2NvbXBsZXRlJywgdHJ1ZSk7XG5cdFx0RW5naW5lLmVudGl0aWVzLnB1c2gobmV3IEV4cGxvc2lvbigwLCAyKSk7XG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGluc3RhbmNlLm5leHRMZXZlbCwgMTUwMCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBBZHZhbmNlIHRvIHRoZSBuZXh0IGxldmVsIG9yIGVuZCB0aGUgZ2FtZSBpZiBubyBtb3JlIGxldmVsc1xuXHQgKi9cblx0aW5zdGFuY2UubmV4dExldmVsID0gZnVuY3Rpb24gbmV4dExldmVsKCkge1xuXHRcdGxldmVsLm5leHQoKTtcblxuXHRcdGlmIChsZXZlbC5sZXZlbCA+IGxldmVsLmxhc3RMZXZlbCkge1xuXHRcdFx0aW5zdGFuY2Uud2luR2FtZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpbnN0YW5jZS5zdGFydEdhbWUoKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGluc3RhbmNlO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBAZGVzY3JpcHRpb24gQSBzZW5zb3IgdXNlZCBhcyBhIGNvbGxpc2lvbiBib3ggdGhhdCBjYW4gYmUgcmVuZGVyZWQgdG8gdGhlIHNjcmVlbiBmb3IgdGVzdGluZ1xuKiBAY29uc3RydWN0b3JcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBsb2NhdGlvblxuKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGxvY2F0aW9uXG4qIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIEhvdyBsb25nIHRoZSBzZW5zb3IgaXNcbiogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIEhvdyB0YWxsIHRoZSBzZW5zb3IgaXNcbiogQHBhcmFtIHtudW1iZXJ9IG9mZnNldFggLSBUaGUgb2Zmc2V0IGluIHRoZSB4IGRpcmVjdGlvblxuKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0WSAtIFRoZSBvZmZzZXQgaW4gdGhlIHkgZGlyZWN0aW9uXG4qL1xudmFyIFNlbnNvciA9IGZ1bmN0aW9uIFNlbnNvcih4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvZmZzZXRYLCBvZmZzZXRZKSB7XG5cdHRoaXMueCA9IHg7XG5cdHRoaXMueSA9IHk7XG5cdHRoaXMud2lkdGggPSB3aWR0aDtcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdHRoaXMub2Zmc2V0WCA9IG9mZnNldFg7XG5cdHRoaXMub2Zmc2V0WSA9IG9mZnNldFk7XG5cdHRoaXMuZGVidWcgPSBmYWxzZTtcblx0dGhpcy5vd25lciA9IG51bGw7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFJlbmRlcnMgdGhpcyBlbnRpdHkgdG8gdGhlIGNhbnZhc1xuXHQgKiBAcGFyYW0ge2NvbnRleHR9IGN0eCAtIFRoZSBjYW52YXMncyBjb250ZXh0XG5cdCAqL1xuXHR0aGlzLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihjdHgpIHtcblx0XHRpZiAodGhpcy5kZWJ1Zykge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3JlZCc7XG5cdFx0XHRjdHgucmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlcyB0aGUgc2Vuc29yIHBvc2l0aW9uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkdCAtIFRpbWUgc2luY2UgbGFzdCB1cGRhdGVcblx0ICovXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0aWYodGhpcy5vd25lcikge1xuXHRcdFx0dGhpcy5wb3NpdGlvbih0aGlzLm93bmVyLngsIHRoaXMub3duZXIueSk7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gdGhpcy5vd25lci50YXJnZXQ7XG5cdFx0XHRpZiAodGFyZ2V0ICYmIHRhcmdldC5pc0FsaXZlICYmICFNb2RlbC5nZXQoJ2xldmVsX2NvbXBsZXRlJykpIHtcblx0XHRcdFx0aWYgKENvbGxpc2lvbi5pc0NvbGxpZGluZyh0aGlzLCB0YXJnZXQuc2Vuc29yKSkge1xuXHRcdFx0XHRcdHRhcmdldC5oaXQodGhpcy5vd25lci50eXBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFVwZGF0ZXMgdGhlIHNlbnNvcidzIHBvc2l0aW9uXG5cdCAqIEBwYXJhbSB7aW50fSB4IC0gVGhlIHggbG9jYXRpb25cblx0ICogQHBhcmFtIHtpbnR9IHkgLSBUaGUgeSBsb2NhdGlvblxuXHQgKi9cblx0dGhpcy5wb3NpdGlvbiA9IGZ1bmN0aW9uIHBvc2l0aW9uKHgsIHkpIHtcblx0XHR0aGlzLnggPSB4ICsgdGhpcy5vZmZzZXRYO1xuXHRcdHRoaXMueSA9IHkgKyB0aGlzLm9mZnNldFk7XG5cdH07XG59KS5jYWxsKFNlbnNvci5wcm90b3R5cGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4qIEBkZXNjcmlwdGlvbiBBIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgdGhlIG93bmVycyBzcHJpdGUgYWNjb3JkaW5nIHRvIHBvc2l0aW9uLCBhbHBoYSBhbmQgZGlyZWN0aW9uXG4qIEBjb25zdHJ1Y3RvclxuKi9cbnZhciBSZW5kZXIgPSBmdW5jdGlvbiBSZW5kZXIoKSB7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHR2YXIgcCA9IHt4OiAwLCB5OiAwfTtcblx0LyoqXG5cdCAgKiBAZGVzY3JpcHRpb24gUmVuZGVycyB0aGUgb3duZXIncyBzcHJpdGVcblx0ICAqIEBwYXJhbSB7Y29udGV4dH0gY3R4IC0gVGhlIGNhbnZhcydzIGNvbnRleHRcblx0ICAqL1xuXHR0aGlzLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihjdHgpIHtcblx0XHR2YXIgZmxpcHBlZCA9IHRoaXMub3duZXIuZmxpcHBlZCA/IC0xIDogMTtcblx0XHR2YXIgcG9zID0gdGhpcy5nZXRQb3NpdGlvbigpO1xuXHRcdGN0eC5zYXZlKCk7XG5cdFx0Y3R4LnNjYWxlKGZsaXBwZWQsIDEpO1xuXHRcdGN0eC5nbG9iYWxBbHBoYSA9IHRoaXMub3duZXIuYWxwaGEgfHwgMTtcblx0XHRjdHguZHJhd0ltYWdlKFJlc291cmNlcy5nZXQodGhpcy5vd25lci5zcHJpdGUpLCBwb3MueCwgcG9zLnksIDEwMSwgMTcxKTtcblx0XHRjdHgucmVzdG9yZSgpO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBVcGRhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IGR0IC0gVGltZSBzaW5jZSBsYXN0IHVwZGF0ZVxuXHQgKi9cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblx0fTtcblxuXHQvKipcblx0ICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBmb3JtYXR0ZWQgcG9zaXRpb25cblx0ICAqL1xuXHR0aGlzLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gZ2V0UG9zaXRpb24oKSB7XG5cdFx0dmFyIGZsaXBwZWQgPSB0aGlzLm93bmVyLmZsaXBwZWQgPyAtMSA6IDE7XG5cdFx0cC54ID0gKHRoaXMub3duZXIueCArIHRoaXMub3duZXIub2Zmc2V0WCkgKiBmbGlwcGVkO1xuXHRcdHAueCArPSAoZmxpcHBlZCA9PT0gMSA/IDAgOiAtMTAxKTtcblx0XHRwLnkgPSB0aGlzLm93bmVyLnkgKyB0aGlzLm93bmVyLm9mZnNldFk7XG5cdFx0cmV0dXJuIHA7XG5cdH07XG59KS5jYWxsKFJlbmRlci5wcm90b3R5cGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4qIEBkZXNjcmlwdGlvbiBBIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgdGhlIG93bmVycyBzcHJpdGUgYWNjb3JkaW5nIHRvIHBvc2l0aW9uLCBhbHBoYSBhbmQgZGlyZWN0aW9uXG4qIEBjb25zdHJ1Y3RvclxuKi9cbnZhciBLZXlib2FyZElucHV0ID0gZnVuY3Rpb24gS2V5Ym9hcmRJbnB1dCgpIHtcblx0dmFyIHJlZiA9IHRoaXM7XG5cdHZhciBvbktleVVwID0gZnVuY3Rpb24gb25LZXlVcChldmVudCkge1xuXHRcdHJlZi5oYW5kbGVJbnB1dChldmVudCk7XG5cdH07XG5cdHZhciBzdGFydCA9IHt4OjAsIHk6MH07XG5cdHZhciBlbmQgPSB7eDowLCB5OjB9O1xuXHRcblx0dmFyIGRpc3RhbmNlID0gZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHgyLCB5MSwgeTIpIHtcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCAoeDEteDIpKih4MS14MikgKyAoeTEteTIpKih5MS15MikgKTtcblx0fTtcblx0XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25LZXlVcCk7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0c3RhcnQueCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuXHRcdHN0YXJ0LnkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcblx0fSk7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbihldmVudCkge1xuXHRcdGVuZC54ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG5cdFx0ZW5kLnkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcblx0XHR2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKGVuZC55IC0gc3RhcnQueSwgZW5kLnggLSBzdGFydC54KSAqIDE4MCAvIE1hdGguUEkgKyAxODA7XG5cdFx0dmFyIGQgPSBkaXN0YW5jZShzdGFydC54LCBlbmQueCwgc3RhcnQueSwgZW5kLnkpO1xuXHRcdFxuXHRcdGlmKGQgPiA1KXtcblx0XHRcdGlmKGFuZ2xlID49IDQ1ICYmIGFuZ2xlIDw9IDEzNSl7XG5cdFx0XHRcdHJlZi5oYW5kbGVJbnB1dCh7a2V5Q29kZTozOH0pO1xuXHRcdFx0fWVsc2UgaWYoYW5nbGUgPj0gMTM1ICYmIGFuZ2xlIDw9IDIyNSl7XG5cdFx0XHRcdHJlZi5oYW5kbGVJbnB1dCh7a2V5Q29kZTozOX0pO1xuXHRcdFx0fWVsc2UgaWYoYW5nbGUgPj0gMjI1ICYmIGFuZ2xlIDw9IDMxNSl7XG5cdFx0XHRcdHJlZi5oYW5kbGVJbnB1dCh7a2V5Q29kZTo0MH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJlZi5oYW5kbGVJbnB1dCh7a2V5Q29kZTozN30pO1xuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0cmVmLmhhbmRsZUlucHV0KHtrZXlDb2RlOjM4fSk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbihmdW5jdGlvbiBQcm90b3R5cGUoKSB7XG4gICAgdmFyIGlucHV0TWFwID0ge1xuXHRcdDM3OiAnbGVmdCcsXG5cdFx0Mzg6ICd1cCcsXG5cdFx0Mzk6ICdyaWdodCcsXG5cdFx0NDA6ICdkb3duJ1xuXHR9O1xuXG5cdHZhciBpbnB1dFJlc3BvbnNlTWFwID0ge1xuXHRcdGxlZnQ6IHtheGlzOiAneCcsIGRpcjogLTF9LFxuXHRcdHVwOiB7YXhpczogJ3knLCBkaXI6IC0xfSxcblx0XHRyaWdodDoge2F4aXM6ICd4JywgZGlyOiAxfSxcblx0XHRkb3duOiB7YXhpczogJ3knLCBkaXI6IDF9XG5cdH07XG5cdFxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIEdldHMgdGhlIHBvc2l0aW9uIG9uIHRoZSBncmlkIGJhc2VkIG9uIHBsYXllcidzIGlucHV0XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBheGlzIC0gVGhlIHggb3IgeSBheGlzXG5cdCAqIEBwYXJhbSB7aW5wdXR9IGRpciAtIFRoZSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBkaXJlY3Rpb25cblx0ICogQHJldHVybnMge251bWJlcn0gVGhlIGZpbmFsIHBvc2l0aW9uXG5cdCAqL1xuXHR0aGlzLmdldE1vdmVtZW50ID0gZnVuY3Rpb24gZ2V0TW92ZW1lbnQoYXhpcywgZGlyKSB7XG5cdFx0dmFyIHY7XG5cblx0XHRpZiAoYXhpcyA9PT0gJ3gnKSB7XG5cdFx0XHR2ID0gTWF0aC5mbG9vcih0aGlzLm93bmVyLnggLyBHcmlkLmNlbGxXaWR0aCkgKyBkaXI7XG5cdFx0XHRyZXR1cm4gR3JpZC5nZXRYRnJvbUNvbHVtbih2KTtcblx0XHR9XG5cblx0XHR2ID0gTWF0aC5mbG9vcih0aGlzLm93bmVyLnkgLyBHcmlkLmNlbGxIZWlnaHQpICsgZGlyO1xuXHRcdHJldHVybiBHcmlkLmdldFlGcm9tUm93KHYpO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBDaGFuZ2VzIHRoZSBwbGF5ZXIgcG9zaXRpb24gYmFzZWQgb24gaW5wdXRcblx0ICogQHBhcmFtIHtldmVudH0gZXZlbnQgLSBUaGUgZXZlbnQgdGhhdCBvY2N1cmVkXG5cdCAqL1xuXHR0aGlzLmhhbmRsZUlucHV0ID0gZnVuY3Rpb24gaGFuZGxlSW5wdXQoZXZlbnQpIHtcblx0XHR2YXIgaW5wdXQgPSBpbnB1dE1hcFtldmVudC5rZXlDb2RlXTtcblx0XHRcblx0XHRpZiAoaW5wdXQgJiYgdGhpcy5vd25lci5pc0FsaXZlID09PSB0cnVlICYmICFNb2RlbC5nZXQoJ2xldmVsX2NvbXBsZXRlJykpIHtcblx0XHRcdHZhciBtYXAgPSBpbnB1dFJlc3BvbnNlTWFwW2lucHV0XTtcblxuXHRcdFx0Ly8gIE1vdmVtZW50XG5cdFx0XHRpZiAobWFwLmhhc093blByb3BlcnR5KCdheGlzJykpIHtcblx0XHRcdFx0dGhpcy5vd25lclttYXAuYXhpc10gPSB0aGlzLmdldE1vdmVtZW50KG1hcC5heGlzLCBtYXAuZGlyKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG4gICAgXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQ2hlY2tzIGlmIHRoaXMgZW50aXR5IGlzIGNvbGxpZGluZyB3aXRoIHRoZSBwbGF5ZXIgYW5kIGtlZXBzIHRhcmdldCBvbiBzY3JlZW4gYnkgd3JhcHBpbmcgeCBsb2NhdGlvblxuXHQgKiBAcGFyYW0ge2ludH0gZHQgLSBUaW1lIHNpbmNlIGxhc3QgdXBkYXRlXG5cdCAqL1xuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXHR9O1xuXHRcblx0dGhpcy5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoY3R4KSB7XG5cdH07XG59KS5jYWxsKEtleWJvYXJkSW5wdXQucHJvdG90eXBlKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBAZGVzY3JpcHRpb24gQSBjb21wb25lbnQgdGhhdCByZW5kZXJzIHRoZSBvd25lcnMgc3ByaXRlIGFjY29yZGluZyB0byBwb3NpdGlvbiwgYWxwaGEgYW5kIGRpcmVjdGlvblxuKiBAY29uc3RydWN0b3JcbiovXG52YXIgTW92ZW1lbnQgPSBmdW5jdGlvbiBNb3ZlbWVudCgpIHtcblx0dGhpcy53cmFwID0gZmFsc2U7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIENoZWNrcyBpZiB0aGlzIGVudGl0eSBpcyBjb2xsaWRpbmcgd2l0aCB0aGUgcGxheWVyIGFuZCBrZWVwcyB0YXJnZXQgb24gc2NyZWVuIGJ5IHdyYXBwaW5nIHggbG9jYXRpb25cblx0ICogQHBhcmFtIHtpbnR9IGR0IC0gVGltZSBzaW5jZSBsYXN0IHVwZGF0ZVxuXHQgKi9cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblx0XHR0aGlzLm93bmVyLnggKz0gdGhpcy5vd25lci5zcGVlZCAqIE1hdGguY29zKHRoaXMub3duZXIuYW5nbGUpICogZHQ7XG5cdFx0dGhpcy5vd25lci55ICs9IHRoaXMub3duZXIuc3BlZWQgKiBNYXRoLnNpbih0aGlzLm93bmVyLmFuZ2xlKSAqIGR0O1xuXHRcdFxuXHRcdC8vICBXcmFwXG5cdFx0aWYodGhpcy53cmFwKXtcbiAgICBcdFx0aWYgKHRoaXMub3duZXIueCA+IChHcmlkLmNvbHVtbnMgKiBHcmlkLmNlbGxXaWR0aCkgKyBHcmlkLmNlbGxXaWR0aCkge1xuICAgIFx0XHRcdHRoaXMub3duZXIueCA9IEdyaWQuZ2V0WEZyb21Db2x1bW4oMCkgLSBHcmlkLmNlbGxXaWR0aDtcbiAgICBcdFx0fSBlbHNlIGlmICh0aGlzLm93bmVyLnggPCAtR3JpZC5jZWxsV2lkdGgpIHtcbiAgICBcdFx0XHR0aGlzLm93bmVyLnggPSAoR3JpZC5jb2x1bW5zICogR3JpZC5jZWxsV2lkdGgpICsgR3JpZC5jZWxsV2lkdGg7XG4gICAgXHRcdH1cblx0XHR9XG5cdH07XG5cdFxuXHR0aGlzLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihjdHgpIHtcblx0fTtcbn0pLmNhbGwoTW92ZW1lbnQucHJvdG90eXBlKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBAZGVzY3JpcHRpb24gQmx1ZXByaW50IFNpbmdsZXRvbiB1c2VkIGZvciBjcmVhdGluZyBFbnRpdHknc1xuKiBAY29uc3RydWN0b3JcbiovXG52YXIgQmx1ZXByaW50ID0gKGZ1bmN0aW9uIEJsdWVwcmludCgpIHtcblx0dmFyIHByaW50cyA9IHt9O1xuXHR2YXIgaW5zdGFuY2UgPSBmdW5jdGlvbiBpbnN0YW5jZSgpIHt9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhbiBlbnRpdHkgYmFzZWQgb24gdGhlIEJsdWVwcmludCBhbmQgYWRkcyBpdCB0byB0aGUgRW5naW5lXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUgdHlwZSBvZiBFbnRpdHkgdG8gY3JlYXRlXG5cdCAqIEByZXR1cm5zIHtFbnRpdHl9IFRoZSBnZW5lcmF0ZWQgZW50aXR5XG5cdCAqL1xuXHRpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUodHlwZSwgZGF0YSkge1xuXHRcdHZhciBlbnRpdHkgPSBudWxsO1xuXHRcdGlmKHByaW50cy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSl7XG5cdFx0ICAgIGVudGl0eSA9IHByaW50c1t0eXBlXShkYXRhKTtcblx0XHQgICAgZW50aXR5LnR5cGUgPSB0eXBlO1xuXHRcdCAgICBFbmdpbmUuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZW50aXR5O1xuXHR9O1xuXHRcblx0cHJpbnRzWydrZXknXSA9IGZ1bmN0aW9uIGNyZWF0ZUtleShkYXRhKSB7XG5cdFx0dmFyIHggPSBHcmlkLmdldFhGcm9tQ29sdW1uKGRhdGEuYyk7XG5cdFx0dmFyIHkgPSBHcmlkLmdldFlGcm9tUm93KGRhdGEucik7XG5cdCAgICB2YXIgZW50aXR5ID0gbmV3IEVudGl0eSh4LCB5LCBcImltYWdlcy9LZXkucG5nXCIsIDAsIC0oMTcxIC0gMTM4KSAtIEdyaWQub2Zmc2V0WSk7XG5cdCAgICBlbnRpdHkuYWRkQ29tcG9uZW50KG5ldyBSZW5kZXIoKSk7XG5cdCAgICBlbnRpdHkuYWRkQ29tcG9uZW50KG5ldyBTZW5zb3IoMCwgMCwgNTAsIDUwLCAyNSwgMTIpKTtcblx0ICAgIGVudGl0eS50YXJnZXQgPSBwbGF5ZXI7XG5cdCAgICByZXR1cm4gZW50aXR5O1xuXHR9O1xuXHRcblx0cHJpbnRzWydzdGFyJ10gPSBmdW5jdGlvbiBjcmVhdGVTdGFyKGRhdGEpIHtcblx0XHR2YXIgeCA9IEdyaWQuZ2V0WEZyb21Db2x1bW4oZGF0YS5jKTtcblx0XHR2YXIgeSA9IEdyaWQuZ2V0WUZyb21Sb3coZGF0YS5yKTtcblx0ICAgIHZhciBlbnRpdHkgPSBuZXcgRW50aXR5KHgsIHksIFwiaW1hZ2VzL1N0YXIucG5nXCIsIDAsIC0oMTcxIC0gMTM4KSAtIEdyaWQub2Zmc2V0WSk7XG5cdCAgICBlbnRpdHkuYWRkQ29tcG9uZW50KG5ldyBSZW5kZXIoKSk7XG5cdCAgICBlbnRpdHkuYWRkQ29tcG9uZW50KG5ldyBNb3ZlbWVudCgpKTtcblx0ICAgIGVudGl0eS5zcGVlZCA9IDQwMDtcblx0ICAgIGVudGl0eS5hbmdsZSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE4MCkgKiBNYXRoLlBJIC8gMTgwO1xuXHQgICAgXG5cdCAgICAvLyAgbW9ua2V5LXBhdGNoIHRvIGFkZCB0aGUgYmxpbmsgdGltZXIgdXBkYXRlXG5cdCAgICB2YXIgZW50aXR5VXBkYXRlID0gZW50aXR5LnVwZGF0ZTtcblx0ICAgIGVudGl0eS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblx0ICAgIFx0ZW50aXR5VXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICBcdGVudGl0eS5hbHBoYSA9IE1hdGgubWF4KDAuMDEsIGVudGl0eS5hbHBoYSAtIDEgKiBkdCk7XG5cdCAgICB9O1xuXHQgICAgXG5cdCAgICByZXR1cm4gZW50aXR5O1xuXHR9O1xuXHRcblx0cHJpbnRzWyd3YXRlciddID0gZnVuY3Rpb24gY3JlYXRlV2F0ZXIoZGF0YSkge1xuXHRcdHZhciB4ID0gR3JpZC5nZXRYRnJvbUNvbHVtbihkYXRhLmMpO1xuXHRcdHZhciB5ID0gR3JpZC5nZXRZRnJvbVJvdyhkYXRhLnIpO1xuXHQgICAgdmFyIGVudGl0eSA9IG5ldyBFbnRpdHkoeCwgeSwgXCJcIiwgMCwgLSgxNzEgLSAxMzgpIC0gR3JpZC5vZmZzZXRZKTtcblx0ICAgIGVudGl0eS5hZGRDb21wb25lbnQobmV3IFNlbnNvcigwLCAwLCA1MCwgNTAsIDI1LCAxMikpO1xuXHQgICAgZW50aXR5LnRhcmdldCA9IHBsYXllcjtcblx0ICAgIHJldHVybiBlbnRpdHk7XG5cdH07XG5cdFxuXHRwcmludHNbJ2VuZW15J10gPSBmdW5jdGlvbiBjcmVhdGVFbmVteShkYXRhKSB7XG5cdCAgICB2YXIgeCA9IEdyaWQuZ2V0WEZyb21Db2x1bW4oZGF0YS5jKTtcblx0XHR2YXIgeSA9IEdyaWQuZ2V0WUZyb21Sb3coZGF0YS5yKTtcblx0ICAgIHZhciBlbnRpdHkgPSBuZXcgRW50aXR5KHgsIHksIFwiaW1hZ2VzL2VuZW15LWJ1Zy5wbmdcIiwgMCwgLSgxNzEgLSAxMzgpIC0gR3JpZC5vZmZzZXRZKTtcblx0ICAgIGVudGl0eS5hZGRDb21wb25lbnQobmV3IFJlbmRlcigpKTtcblx0ICAgIGVudGl0eS5hZGRDb21wb25lbnQobmV3IE1vdmVtZW50KCkpLndyYXAgPSB0cnVlO1xuXHQgICAgZW50aXR5LmFkZENvbXBvbmVudChuZXcgU2Vuc29yKDAsIDAsIDUwLCA1MCwgMjUsIDEyKSk7XG5cdCAgICBlbnRpdHkucm93ID0gZGF0YS5yO1xuXHQgICAgZW50aXR5LnNwZWVkID0gZGF0YS5zO1xuXHQgICAgZW50aXR5LmZsaXBwZWQgPSBlbnRpdHkuc3BlZWQgPCAwO1xuXHQgICAgZW50aXR5LnRhcmdldCA9IHBsYXllcjtcblx0ICAgIHJldHVybiBlbnRpdHk7XG5cdH07XG5cdFxuXHRwcmludHNbJ3BsYXllciddID0gZnVuY3Rpb24gY3JlYXRlalBsYXllcihkYXRhKSB7XG5cdCAgICB2YXIgeCA9IEdyaWQuZ2V0WEZyb21Db2x1bW4oZGF0YS5jKTtcblx0XHR2YXIgeSA9IEdyaWQuZ2V0WUZyb21Sb3coZGF0YS5yKTtcblx0ICAgIHZhciBlbnRpdHkgPSBuZXcgRW50aXR5KHgsIHksIFwiaW1hZ2VzL2NoYXItYm95LnBuZ1wiLCAwLCAtKDE3MSAtIDEzOCkgLSBHcmlkLm9mZnNldFkpO1xuXHQgICAgZW50aXR5LmFkZENvbXBvbmVudChuZXcgUmVuZGVyKCkpO1xuXHQgICAgZW50aXR5LnNlbnNvciA9IGVudGl0eS5hZGRDb21wb25lbnQobmV3IFNlbnNvcigwLCAwLCA1MCwgNTAsIDI1LCAxMikpO1xuXHQgICAgZW50aXR5LmFkZENvbXBvbmVudChuZXcgS2V5Ym9hcmRJbnB1dCgpKTtcblx0ICAgIFxuXHQgICAgZW50aXR5LmJsaW5rVGltZXIgPSBuZXcgVGltZXIoNSwgMC4yKTtcblxuXHRcdHZhciBvbkJsaW5rVGltZXJDb21wbGV0ZSA9IGZ1bmN0aW9uIG9uQmxpbmtUaW1lckNvbXBsZXRlKCkge1xuXHRcdFx0ZW50aXR5LmFscGhhID0gMTtcblx0XHRcdGVudGl0eS5pc0FsaXZlID0gdHJ1ZTtcblx0XHR9O1xuXHRcblx0XHR2YXIgb25CbGlua1RpbWVyVXBkYXRlID0gZnVuY3Rpb24gb25CbGlua1RpbWVyVXBkYXRlKCkge1xuXHRcdFx0ZW50aXR5LmFscGhhID0gKGVudGl0eS5hbHBoYSA9PT0gMC40ID8gMSA6IDAuNCk7XG5cdFx0fTtcblx0XG5cdFx0ZW50aXR5LmJsaW5rVGltZXIub24oJ0NPTVBMRVRFJywgb25CbGlua1RpbWVyQ29tcGxldGUpO1xuXHRcdGVudGl0eS5ibGlua1RpbWVyLm9uKCdVUERBVEUnLCBvbkJsaW5rVGltZXJVcGRhdGUpO1xuXHQgICAgXG5cdCAgICAvLyAgbW9ua2V5LXBhdGNoIHRvIGFkZCB0aGUgYmxpbmsgdGltZXIgdXBkYXRlXG5cdCAgICB2YXIgZW50aXR5VXBkYXRlID0gZW50aXR5LnVwZGF0ZTtcblx0ICAgIGVudGl0eS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblx0ICAgIFx0ZW50aXR5VXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICBcdGVudGl0eS5ibGlua1RpbWVyLnVwZGF0ZShkdCk7XG5cdCAgICB9O1xuXHQgICAgXG5cdCAgICBlbnRpdHkucmVzcGF3biA9IGZ1bmN0aW9uIHJlc3Bhd24oYWxpdmUpIHtcbiAgICBcdFx0dGhpcy54ID0gZW50aXR5LnNlbnNvci54ID0gR3JpZC5nZXRYRnJvbUNvbHVtbigyKTtcbiAgICBcdFx0dGhpcy55ID0gZW50aXR5LnNlbnNvci55ID0gR3JpZC5nZXRZRnJvbVJvdyg1KTtcbiAgICBcdFx0dGhpcy5pc0FsaXZlID0gYWxpdmU7Ly8gfHwgdHJ1ZVxuICAgIFx0XHRcblx0XHRcdGlmKCF0aGlzLmlzQWxpdmUpe1xuXHRcdFx0XHRlbnRpdHkuYWxwaGEgPSAwLjQ7XG5cdFx0XHRcdGVudGl0eS5ibGlua1RpbWVyLnN0YXJ0KCk7XG5cdFx0ICAgIH1cblx0ICAgIH07XG5cdCAgICBcblx0ICAgIC8qKlxuXHRcdCAqIEBkZXNjcmlwdGlvbiBBIGVudGl0eSBoYXMgaGl0IHRoZSBwbGF5ZXJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaW52b2tlciAtIFR5cGUgb2Ygb2JqZWN0IHRoYXQgaGl0IHRoZSBwbGF5ZXJcblx0XHQgKi9cblx0XHRlbnRpdHkuaGl0ID0gZnVuY3Rpb24gaGl0KGludm9rZXIpIHtcblx0XHRcdGlmIChpbnZva2VyID09PSAnd2F0ZXInIHx8IGludm9rZXIgPT09ICdlbmVteScpIHtcblx0XHRcdFx0dGhpcy5yZXNwYXduKGZhbHNlKTtcblx0XHRcdH1lbHNlIGlmIChpbnZva2VyID09PSAna2V5Jykge1xuXHRcdFx0XHRTY2VuZS5sZXZlbENvbXBsZXRlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0ICAgIFxuXHQgICAgcmV0dXJuIGVudGl0eTtcblx0fTtcblxuXHRyZXR1cm4gaW5zdGFuY2U7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4qIEBkZXNjcmlwdGlvbiBUaGUgaW5nYW1lIGluZm9ybWF0aW9uIGRpc3BsYXlcbiogQGNvbnN0cnVjdG9yXG4qL1xudmFyIFVJID0gZnVuY3Rpb24gVUkoKSB7XG5cdHRoaXMua2V5cyA9IDA7XG5cdHRoaXMubGV2ZWxUaW1lID0gMDtcblx0dGhpcy50aW1lID0gMDtcbn07XG5cbihmdW5jdGlvbiBQcm90b3R5cGUoKSB7XG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gUmVzZXRzIHRoZSBsZXZlbCBpbmZvcm1hdGlvbiBhbmQgc3RhcnRzIHRoZSBnYW1lIHRpbWVyXG5cdCAqL1xuXHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoKSB7XG5cdFx0dGhpcy5rZXlzID0gTW9kZWwuZ2V0KCdsZXZlbCcpO1xuXHRcdHRoaXMubGV2ZWxUaW1lID0gTW9kZWwuZ2V0KCdsZXZlbF90b3RhbF90aW1lJyk7XG5cblx0XHR0aGlzLmxldmVsVGltZXIgPSBuZXcgVGltZXIoMSwgdGhpcy5sZXZlbFRpbWUpO1xuXHRcdHRoaXMubGV2ZWxUaW1lci5vbignQ09NUExFVEUnLCB0aGlzLm9uVGltZXJDb21wbGV0ZSk7XG5cdFx0dGhpcy5sZXZlbFRpbWVyLnN0YXJ0KCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBUaGUgbGV2ZWwgdGltZXIgaGFzIGNvbXBsZXRlZFxuXHQgKi9cblx0dGhpcy5vblRpbWVyQ29tcGxldGUgPSBmdW5jdGlvbiBvblRpbWVyQ29tcGxldGUoKSB7XG5cdFx0aWYgKCFNb2RlbC5nZXQoJ2xldmVsX2NvbXBsZXRlJykpIHtcblx0XHRcdFNjZW5lLmVuZEdhbWUoKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBGb3JtYXRlZCBzdHJpbmcgb2YgdGltZSBsZWZ0IChleHBlY3RzID4wICYmIDw2MCBzZWNvbmRzKVxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBTZWNvbmRzIGxlZnQgb24gdGltZVxuXHQgKi9cblx0dGhpcy5mb3JtYXR0ZWRUaW1lID0gZnVuY3Rpb24gZm9ybWF0dGVkVGltZSgpIHtcblx0XHR2YXIgdGltZSA9IE1hdGgucm91bmQodGhpcy5sZXZlbFRpbWVyLnRpbWUpO1xuXHRcdHJldHVybiAnMDA6JyArICh0aW1lID4gOSA/IHRpbWUgOiAnMCcgKyB0aW1lKTtcblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFJlbmRlcnMgdGV4dCB0byB0aGUgc2NyZWVuXG5cdCAqIEBwYXJhbSB7Y29udGV4dH0gY3R4IC0gVGhlIGNhbnZhcydzIGNvbnRleHRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgdG8gZGlzcGxheVxuXHQgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGxvY2F0aW9uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgbG9jYXRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IGFsaWduIC0gVGhlIGNhbnZhcydzIGNvbnRleHRcblx0ICovXG5cdHRoaXMudGV4dCA9IGZ1bmN0aW9uIHRleHQoY3R4LCBzdHJpbmcsIHgsIHksIGFsaWduKSB7XG5cdFx0Y3R4LnNhdmUoKTtcblx0XHRjdHguZm9udCA9ICczMHB4IENvbWljIFNhbnMgTVMnO1xuXHRcdGlmIChhbGlnbiA9PT0gJ2xlZnQnIHx8IGFsaWduID09PSAncmlnaHQnIHx8IGFsaWduID09PSAnY2VudGVyJykge1xuXHRcdFx0Y3R4LnRleHRBbGlnbiA9IGFsaWduO1xuXHRcdH1cblx0XHRjdHguZmlsbFRleHQoc3RyaW5nLCB4LCB5KTtcblx0XHRjdHgucmVzdG9yZSgpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlcyB0aGUgdGltZXIgYW5kIGtleSBpbmZvcm1hdGlvblxuXHQgKiBAcGFyYW0ge2ludH0gZHQgLSBUaW1lIHNpbmNlIGxhc3QgdXBkYXRlXG5cdCAqL1xuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXHRcdGlmICghTW9kZWwuZ2V0KCdsZXZlbF9jb21wbGV0ZScpKSB7XG5cdFx0XHR0aGlzLmtleXMgPSBNb2RlbC5nZXQoJ2xldmVsJyk7XG5cdFx0XHR0aGlzLmxldmVsVGltZXIudXBkYXRlKGR0KTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBSZW5kZXJzIHRoaXMgZW50aXR5IHRvIHRoZSBjYW52YXNcblx0ICogQHBhcmFtIHtjb250ZXh0fSBjdHggLSBUaGUgY2FudmFzJ3MgY29udGV4dFxuXHQgKi9cblx0dGhpcy5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoY3R4KSB7XG5cdFx0dGhpcy50ZXh0KGN0eCwgJ0tleXM6IHgnICsgdGhpcy5rZXlzLCAwLCAzMCk7XG5cdFx0dGhpcy50ZXh0KGN0eCwgJ1RpbWU6ICcgKyB0aGlzLmZvcm1hdHRlZFRpbWUoKSwgRW5naW5lLndpZHRoLCAzMCwgJ3JpZ2h0Jyk7XG5cdH07XG59KS5jYWxsKFVJLnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiogQGRlc2NyaXB0aW9uIEtleSBlbnRpdHlcbiogQGNvbnN0cnVjdG9yXG4qIEBwYXJhbSB7aW50fSByb3cgLSBUaGUgaW5pdGlhbCByb3dcbiogQHBhcmFtIHtpbnR9IGNvbCAtIFRoZSBpbml0aWFsIGNvbHVtblxuKi9cbnZhciBLZXkgPSBmdW5jdGlvbiBLZXkocm93LCBjb2wpIHtcblx0dGhpcy5lbnRpdHkgPSBuZXcgRW50aXR5KHRoaXMsXG5cdFx0R3JpZC5nZXRYRnJvbUNvbHVtbihjb2wpLFxuXHRcdEdyaWQuZ2V0WUZyb21Sb3cocm93KSxcblx0XHQnaW1hZ2VzL0tleS5wbmcnLFxuXHRcdDAsXG5cdFx0LSgxNzEgLSAxMzgpIC0gR3JpZC5vZmZzZXRZKTtcblx0dGhpcy5zZW5zb3IgPSBuZXcgU2Vuc29yKDAsIDAsIDUwLCAzMCwgMjUsIDI1KTtcblx0dGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXIodGhpcyk7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIENoZWNrcyBpZiB0aGlzIGVudGl0eSBpcyBjb2xsaWRpbmcgd2l0aCB0aGUgcGxheWVyXG5cdCAqIEBwYXJhbSB7aW50fSBkdCAtIFRpbWUgc2luY2UgbGFzdCB1cGRhdGVcblx0ICovXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0dGhpcy5zZW5zb3IucG9zaXRpb24odGhpcy54LCB0aGlzLnkpO1xuXHRcdGlmIChwbGF5ZXIgJiYgcGxheWVyLmlzQWxpdmUgJiYgdGhpcy5pc0FsaXZlKSB7XG5cdFx0XHRpZiAoQ29sbGlzaW9uLmlzQ29sbGlkaW5nKHRoaXMuc2Vuc29yLCBwbGF5ZXIuc2Vuc29yKSkge1xuXHRcdFx0XHR0aGlzLmlzQWxpdmUgPSBmYWxzZTtcblx0XHRcdFx0cGxheWVyLmhpdCgna2V5Jyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gUmVuZGVycyB0aGlzIGVudGl0eSB0byB0aGUgY2FudmFzXG5cdCAqIEBwYXJhbSB7Y29udGV4dH0gY3R4IC0gVGhlIGNhbnZhcydzIGNvbnRleHRcblx0ICovXG5cdHRoaXMucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKGN0eCkge1xuXHRcdHRoaXMucmVuZGVyZXIucmVuZGVyKGN0eCk7XG5cdFx0dGhpcy5zZW5zb3IucmVuZGVyKGN0eCk7XG5cdH07XG59KS5jYWxsKEtleS5wcm90b3R5cGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4qIEBkZXNjcmlwdGlvbiBXYXRlciBlbnRpdHlcbiogQGNvbnN0cnVjdG9yXG4qIEBwYXJhbSB7aW50fSByb3cgLSBUaGUgaW5pdGlhbCByb3dcbiogQHBhcmFtIHtpbnR9IGNvbCAtIFRoZSBpbml0aWFsIGNvbHVtblxuKi9cbnZhciBXYXRlciA9IGZ1bmN0aW9uIFdhdGVyKHJvdywgY29sKSB7XG5cdHRoaXMuZW50aXR5ID0gbmV3IEVudGl0eSh0aGlzLFxuXHRcdEdyaWQuZ2V0WEZyb21Db2x1bW4oY29sKSxcblx0XHRHcmlkLmdldFlGcm9tUm93KHJvdyksXG5cdFx0J2ltYWdlcy9LZXkucG5nJyxcblx0XHQwLFxuXHRcdC0oMTcxIC0gMTM4KSAtIEdyaWQub2Zmc2V0WSk7XG5cdHRoaXMuc2Vuc29yID0gbmV3IFNlbnNvcigwLCAwLCA1MCwgMzAsIDI1LCAyNSk7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIENoZWNrcyBpZiB0aGlzIGVudGl0eSBpcyBjb2xsaWRpbmcgd2l0aCB0aGUgcGxheWVyXG5cdCAqIEBwYXJhbSB7aW50fSBkdCAtIFRpbWUgc2luY2UgbGFzdCB1cGRhdGVcblx0ICovXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0dGhpcy5zZW5zb3IucG9zaXRpb24odGhpcy54LCB0aGlzLnkpO1xuXG5cdFx0aWYgKHBsYXllciAmJiBwbGF5ZXIuaXNBbGl2ZSkge1xuXHRcdFx0aWYgKENvbGxpc2lvbi5pc0NvbGxpZGluZyh0aGlzLnNlbnNvciwgcGxheWVyLnNlbnNvcikpIHtcblx0XHRcdFx0cGxheWVyLmhpdCgnd2F0ZXInKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBSZW5kZXJzIHRoaXMgZW50aXR5IHRvIHRoZSBjYW52YXNcblx0ICogQHBhcmFtIHtjb250ZXh0fSBjdHggLSBUaGUgY2FudmFzJ3MgY29udGV4dFxuXHQgKi9cblx0dGhpcy5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoY3R4KSB7XG5cdFx0dGhpcy5zZW5zb3IucmVuZGVyKGN0eCk7XG5cdH07XG59KS5jYWxsKFdhdGVyLnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFbmVteSBlbnRpdHlcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtpbnR9IHJvdyAtIFRoZSBpbml0aWFsIHJvd1xuICogQHBhcmFtIHtpbnR9IGNvbCAtIFRoZSBpbml0aWFsIGNvbHVtblxuICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIC0gVGhlIGluaXRpYWwgc3BlZWRcbiAqL1xudmFyIEVuZW15ID0gZnVuY3Rpb24gRW5lbXkocm93LCBjb2wsIHNwZWVkKSB7XG5cdHRoaXMuZW50aXR5ID0gbmV3IEVudGl0eSh0aGlzLFxuXHRcdEdyaWQuZ2V0WEZyb21Db2x1bW4oY29sKSxcblx0XHRHcmlkLmdldFlGcm9tUm93KHJvdyksXG5cdFx0J2ltYWdlcy9lbmVteS1idWcucG5nJyxcblx0XHQwLCAtKDE3MSAtIDEzOCkgLSBHcmlkLm9mZnNldFkpO1xuXHR0aGlzLnJvdyA9IHJvdztcblx0dGhpcy5zcGVlZCA9IHNwZWVkO1xuXHR0aGlzLmZsaXBwZWQgPSBzcGVlZCA8IDA7XG5cdHRoaXMuc2Vuc29yID0gbmV3IFNlbnNvcigwLCAwLCA1MCwgNTAsIDI1LCAxMik7XG5cdHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyKHRoaXMpO1xufTtcblxuKGZ1bmN0aW9uIFByb3RvdHlwZSgpIHtcblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBDaGVja3MgaWYgdGhpcyBlbnRpdHkgaXMgY29sbGlkaW5nIHdpdGggdGhlIHBsYXllciBhbmQga2VlcHMgdGFyZ2V0IG9uIHNjcmVlbiBieSB3cmFwcGluZyB4IGxvY2F0aW9uXG5cdCAqIEBwYXJhbSB7aW50fSBkdCAtIFRpbWUgc2luY2UgbGFzdCB1cGRhdGVcblx0ICovXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0dGhpcy54ICs9IGR0ICogdGhpcy5zcGVlZDtcblxuXHRcdC8vICBXcmFwXG5cdFx0aWYgKHRoaXMueCA+IChHcmlkLmNvbHVtbnMgKiBHcmlkLmNlbGxXaWR0aCkgKyBHcmlkLmNlbGxXaWR0aCkge1xuXHRcdFx0dGhpcy54ID0gR3JpZC5nZXRYRnJvbUNvbHVtbigwKSAtIEdyaWQuY2VsbFdpZHRoO1xuXHRcdH0gZWxzZSBpZiAodGhpcy54IDwgLUdyaWQuY2VsbFdpZHRoKSB7XG5cdFx0XHR0aGlzLnggPSAoR3JpZC5jb2x1bW5zICogR3JpZC5jZWxsV2lkdGgpICsgR3JpZC5jZWxsV2lkdGg7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZW5zb3IucG9zaXRpb24odGhpcy54LCB0aGlzLnkpO1xuXHRcdGlmIChwbGF5ZXIgJiYgcGxheWVyLmlzQWxpdmUpIHtcblx0XHRcdGlmIChDb2xsaXNpb24uaXNDb2xsaWRpbmcodGhpcy5zZW5zb3IsIHBsYXllci5zZW5zb3IpKSB7XG5cdFx0XHRcdHBsYXllci5oaXQoJ2VuZW15Jyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gUmVuZGVycyB0aGlzIGVudGl0eSB0byB0aGUgY2FudmFzXG5cdCAqIEBwYXJhbSB7Y29udGV4dH0gY3R4IC0gVGhlIGNhbnZhcydzIGNvbnRleHRcblx0ICovXG5cdHRoaXMucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKGN0eCkge1xuXHRcdHRoaXMucmVuZGVyZXIucmVuZGVyKGN0eCk7XG5cdFx0dGhpcy5zZW5zb3IucmVuZGVyKGN0eCk7XG5cdH07XG59KS5jYWxsKEVuZW15LnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiogQGRlc2NyaXB0aW9uIFBsYXllciBlbnRpdHlcbiogQGNvbnN0cnVjdG9yXG4qL1xudmFyIFBsYXllciA9IGZ1bmN0aW9uIFBsYXllcigpIHtcblx0dGhpcy5lbnRpdHkgPSBuZXcgRW50aXR5KHRoaXMsXG5cdFx0MCxcblx0XHQwLFxuXHRcdCdpbWFnZXMvY2hhci1ib3kucG5nJyxcblx0XHQwLFxuXHRcdC0oMTcxIC0gMTM4KSAtIEdyaWQub2Zmc2V0WSk7XG5cdHRoaXMuaXNBbGl2ZSA9IGZhbHNlO1xuXHR0aGlzLmFscGhhID0gMDtcblx0dGhpcy5zZW5zb3IgPSBuZXcgU2Vuc29yKDAsIDAsIDUwLCAzMCwgMjUsIDI1KTtcblx0dGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXIodGhpcyk7XG5cdHRoaXMuYmxpbmtUaW1lciA9IG5ldyBUaW1lcig1LCAwLjIpO1xuXG5cdHZhciByZWYgPSB0aGlzO1xuXG5cdHZhciBvbkJsaW5rVGltZXJDb21wbGV0ZSA9IGZ1bmN0aW9uIG9uQmxpbmtUaW1lckNvbXBsZXRlKCkge1xuXHRcdHJlZi5hbHBoYSA9IDE7XG5cdFx0cmVmLmlzQWxpdmUgPSB0cnVlO1xuXHR9O1xuXG5cdHZhciBvbkJsaW5rVGltZXJVcGRhdGUgPSBmdW5jdGlvbiBvbkJsaW5rVGltZXJVcGRhdGUoKSB7XG5cdFx0cmVmLmFscGhhID0gKHJlZi5hbHBoYSA9PT0gMC40ID8gMSA6IDAuNCk7XG5cdH07XG5cblx0dmFyIG9uS2V5VXAgPSBmdW5jdGlvbiBvbktleVVwKGUpIHtcblx0XHRyZWYuaGFuZGxlSW5wdXQoZSk7XG5cdH07XG5cblx0dGhpcy5ibGlua1RpbWVyLm9uKCdDT01QTEVURScsIG9uQmxpbmtUaW1lckNvbXBsZXRlKTtcblx0dGhpcy5ibGlua1RpbWVyLm9uKCdVUERBVEUnLCBvbkJsaW5rVGltZXJVcGRhdGUpO1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXApO1xuXG5cdHRoaXMucmVzcGF3bigpO1xufTtcblxuKGZ1bmN0aW9uIFByb3RvdHlwZSgpIHtcblx0dmFyIGlucHV0TWFwID0ge1xuXHRcdDM3OiAnbGVmdCcsXG5cdFx0Mzg6ICd1cCcsXG5cdFx0Mzk6ICdyaWdodCcsXG5cdFx0NDA6ICdkb3duJ1xuXHR9O1xuXG5cdHZhciBpbnB1dFJlc3BvbnNlTWFwID0ge1xuXHRcdGxlZnQ6IHtheGlzOiAneCcsIGRpcjogLTF9LFxuXHRcdHVwOiB7YXhpczogJ3knLCBkaXI6IC0xfSxcblx0XHRyaWdodDoge2F4aXM6ICd4JywgZGlyOiAxfSxcblx0XHRkb3duOiB7YXhpczogJ3knLCBkaXI6IDF9XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBSZXNldHMgdGhlIHBsYXllciB0byB0aGUgaW5pdGlhbCBwb3NpdGlvblxuXHQgKi9cblx0dGhpcy5yZXNwYXduID0gZnVuY3Rpb24gcmVzcGF3bigpIHtcblx0XHR0aGlzLnNlbnNvci54ID0gdGhpcy54ID0gR3JpZC5nZXRYRnJvbUNvbHVtbigyKTtcblx0XHR0aGlzLnNlbnNvci55ID0gdGhpcy55ID0gR3JpZC5nZXRZRnJvbVJvdyg1KTtcblx0XHR0aGlzLmlzQWxpdmUgPSBmYWxzZTtcblx0XHR0aGlzLmFscGhhID0gMC40O1xuXHRcdHRoaXMuYmxpbmtUaW1lci5zdGFydCgpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQSBlbnRpdHkgaGFzIGhpdCB0aGUgcGxheWVyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpbnZva2VyIC0gVHlwZSBvZiBvYmplY3QgdGhhdCBoaXQgdGhlIHBsYXllclxuXHQgKi9cblx0dGhpcy5oaXQgPSBmdW5jdGlvbiBoaXQoaW52b2tlcikge1xuXHRcdGlmIChpbnZva2VyID09PSAnd2F0ZXInIHx8IGludm9rZXIgPT09ICdlbmVteScpIHtcblx0XHRcdHRoaXMucmVzcGF3bigpO1xuXHRcdH1lbHNlIGlmIChpbnZva2VyID09PSAna2V5Jykge1xuXHRcdFx0U2NlbmUubGV2ZWxDb21wbGV0ZSgpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIEdldHMgdGhlIHBvc2l0aW9uIG9uIHRoZSBncmlkIGJhc2VkIG9uIHBsYXllcidzIGlucHV0XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBheGlzIC0gVGhlIHggb3IgeSBheGlzXG5cdCAqIEBwYXJhbSB7aW5wdXR9IGRpciAtIFRoZSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBkaXJlY3Rpb25cblx0ICogQHJldHVybnMge251bWJlcn0gVGhlIGZpbmFsIHBvc2l0aW9uXG5cdCAqL1xuXHR0aGlzLmdldE1vdmVtZW50ID0gZnVuY3Rpb24gZ2V0TW92ZW1lbnQoYXhpcywgZGlyKSB7XG5cdFx0dmFyIHY7XG5cblx0XHRpZiAoYXhpcyA9PT0gJ3gnKSB7XG5cdFx0XHR2ID0gTWF0aC5mbG9vcih0aGlzLnggLyBHcmlkLmNlbGxXaWR0aCkgKyBkaXI7XG5cdFx0XHRyZXR1cm4gR3JpZC5nZXRYRnJvbUNvbHVtbih2KTtcblx0XHR9XG5cblx0XHR2ID0gTWF0aC5mbG9vcih0aGlzLnkgLyBHcmlkLmNlbGxIZWlnaHQpICsgZGlyO1xuXHRcdHJldHVybiBHcmlkLmdldFlGcm9tUm93KHYpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQ2hhbmdlcyB0aGUgcGxheWVyIHBvc2l0aW9uIGJhc2VkIG9uIGlucHV0XG5cdCAqIEBwYXJhbSB7ZXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCBvY2N1cmVkXG5cdCAqL1xuXHR0aGlzLmhhbmRsZUlucHV0ID0gZnVuY3Rpb24gaGFuZGxlSW5wdXQoZSkge1xuXHRcdHZhciBpbnB1dCA9IGlucHV0TWFwW2Uua2V5Q29kZV07XG5cdFx0aWYgKGlucHV0ICYmIHRoaXMuaXNBbGl2ZSA9PT0gdHJ1ZSAmJiAhTW9kZWwuZ2V0KCdsZXZlbF9jb21wbGV0ZScpKSB7XG5cdFx0XHR2YXIgbWFwID0gaW5wdXRSZXNwb25zZU1hcFtpbnB1dF07XG5cblx0XHRcdC8vICBNb3ZlbWVudFxuXHRcdFx0aWYgKG1hcC5oYXNPd25Qcm9wZXJ0eSgnYXhpcycpKSB7XG5cdFx0XHRcdHRoaXNbbWFwLmF4aXNdID0gdGhpcy5nZXRNb3ZlbWVudChtYXAuYXhpcywgbWFwLmRpcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gVXBkYXRlcyB0aGUgcGxheWVycyB0aW1lciBhbmQgc2Vuc29yXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkdCAtIFRpbWUgc2luY2UgbGFzdCB1cGRhdGVcblx0ICovXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cdFx0dGhpcy5zZW5zb3IucG9zaXRpb24odGhpcy54LCB0aGlzLnkpO1xuXHRcdGlmICghdGhpcy5pc0FsaXZlKSB7XG5cdFx0XHR0aGlzLmJsaW5rVGltZXIudXBkYXRlKGR0KTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBSZW5kZXJzIHRoaXMgZW50aXR5IHRvIHRoZSBjYW52YXNcblx0ICogQHBhcmFtIHtjb250ZXh0fSBjdHggLSBUaGUgY2FudmFzJ3MgY29udGV4dFxuXHQgKi9cblx0dGhpcy5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoY3R4KSB7XG5cdFx0dGhpcy5yZW5kZXJlci5yZW5kZXIoY3R4KTtcblx0XHR0aGlzLnNlbnNvci5yZW5kZXIoY3R4KTtcblx0fTtcbn0pLmNhbGwoUGxheWVyLnByb3RvdHlwZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiogQGRlc2NyaXB0aW9uIFN0YXIgZW50aXR5XG4qIEBjb25zdHJ1Y3RvclxuKiBAcGFyYW0ge2ludH0gcm93IC0gVGhlIGluaXRpYWwgcm93XG4qIEBwYXJhbSB7aW50fSBjb2wgLSBUaGUgaW5pdGlhbCBjb2x1bW5cbiovXG52YXIgU3RhciA9IGZ1bmN0aW9uIFN0YXIocm93LCBjb2wpIHtcblx0dGhpcy5lbnRpdHkgPSBuZXcgRW50aXR5KHRoaXMsXG5cdFx0R3JpZC5nZXRYRnJvbUNvbHVtbihjb2wpLFxuXHRcdEdyaWQuZ2V0WUZyb21Sb3cocm93KSxcblx0XHQnaW1hZ2VzL1N0YXIucG5nJyxcblx0XHQwLFxuXHRcdC0oMTcxIC0gMTM4KSAtIEdyaWQub2Zmc2V0WSk7XG5cdHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyKHRoaXMpO1xuXHR0aGlzLnNwZWVkID0gNTAwO1xuXHR0aGlzLmFuZ2xlID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTgwKSAqIE1hdGguUEkgLyAxODA7XG59O1xuXG4oZnVuY3Rpb24gUHJvdG90eXBlKCkge1xuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIE1vdmVzIHRoZSBzdGFyIGluIHRoZSBkaXJlY3Rpb24gb2YgdGhlIGFuZ2xlIGFuZCBsb3dlcnMgb3BhY2l0eVxuXHQgKiBAcGFyYW0ge2ludH0gZHQgLSBUaW1lIHNpbmNlIGxhc3QgdXBkYXRlXG5cdCAqL1xuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXHRcdHRoaXMueCArPSB0aGlzLnNwZWVkICogTWF0aC5jb3ModGhpcy5hbmdsZSkgKiBkdDtcblx0XHR0aGlzLnkgKz0gdGhpcy5zcGVlZCAqIE1hdGguc2luKHRoaXMuYW5nbGUpICogZHQ7XG5cdFx0dGhpcy5hbHBoYSA9IE1hdGgubWF4KDAuMDEsIHRoaXMuYWxwaGEgLSAxICogZHQpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gUmVuZGVycyB0aGlzIGVudGl0eSB0byB0aGUgY2FudmFzXG5cdCAqIEBwYXJhbSB7Y29udGV4dH0gY3R4IC0gVGhlIGNhbnZhcydzIGNvbnRleHRcblx0ICovXG5cdHRoaXMucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKGN0eCkge1xuXHRcdHRoaXMucmVuZGVyZXIucmVuZGVyKGN0eCk7XG5cdH07XG59KS5jYWxsKFN0YXIucHJvdG90eXBlKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQGRlc2NyaXB0aW9uIEtleSBlbnRpdHlcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtpbnR9IHJvdyAtIFRoZSBpbml0aWFsIHJvd1xuICogQHBhcmFtIHtpbnR9IGNvbCAtIFRoZSBpbml0aWFsIGNvbHVtblxuICovXG52YXIgRXhwbG9zaW9uID0gZnVuY3Rpb24gRXhwbG9zaW9uKHJvdywgY29sKSB7XG5cdHRoaXMuc3RhcnMgPSBbXTtcblx0dGhpcy5hZGRTdGFycyhyb3csIGNvbCwgMTApO1xufTtcblxuKGZ1bmN0aW9uIFByb3RvdHlwZSgpIHtcblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBBZGRzIHRoZSBzdGFyc1xuXHQgKiBAcGFyYW0ge2ludH0gcm93IC0gVGhlIHkgbG9jYXRpb25cblx0ICogQHBhcmFtIHtpbnR9IGNvbCAtIFRoZSB4IGxvY2F0aW9uXG5cdCAqIEBwYXJhbSB7aW50fSB0b3RhbCAtIEFtb3VudCBvZiBzdGFyc1xuXHQgKi9cblx0dGhpcy5hZGRTdGFycyA9IGZ1bmN0aW9uIGFkZFN0YXJzKHJvdywgY29sLCB0b3RhbCkge1xuXHRcdHZhciBpO1xuXHRcdHZhciBkYXRhID0ge3I6IHJvdywgYzogY29sfTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0Ly90aGlzLnN0YXJzLnB1c2gobmV3IFN0YXIocm93LCBjb2wpKTtcblx0XHRcdHRoaXMuc3RhcnMucHVzaChCbHVlcHJpbnQuY3JlYXRlKFwic3RhclwiLCBkYXRhKSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gTW92ZXMgYWxsIHRoZSBzdGFyc1xuXHQgKiBAcGFyYW0ge2ludH0gZHQgLSBUaW1lIHNpbmNlIGxhc3QgdXBkYXRlXG5cdCAqL1xuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXHRcdHZhciB0b3RhbCA9IHRoaXMuc3RhcnMubGVuZ3RoO1xuXHRcdHZhciBpO1xuXHRcdGlmICh0b3RhbCA+IDApIHtcblx0XHRcdGlmICh0aGlzLnN0YXJzWzBdLmFscGhhIDw9IDAuMDEpIHtcblx0XHRcdFx0dGhpcy5zdGFycyA9IFtdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzLnN0YXJzW2ldLnVwZGF0ZShkdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gUmVuZGVycyB0aGUgc3RhcnMgdG8gdGhlIGNhbnZhc1xuXHQgKiBAcGFyYW0ge2NvbnRleHR9IGN0eCAtIFRoZSBjYW52YXMncyBjb250ZXh0XG5cdCAqL1xuXHR0aGlzLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihjdHgpIHtcblx0XHR2YXIgdG90YWwgPSB0aGlzLnN0YXJzLmxlbmd0aDtcblx0XHR2YXIgaTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0dGhpcy5zdGFyc1tpXS5yZW5kZXIoY3R4KTtcblx0XHR9XG5cdH07XG59KS5jYWxsKEV4cGxvc2lvbi5wcm90b3R5cGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy92YXIgcGxheWVyID0gbmV3IFBsYXllcigpO1xudmFyIHBsYXllciA9IEJsdWVwcmludC5jcmVhdGUoXCJwbGF5ZXJcIiwge3I6NSwgYzoyfSk7XG52YXIgdWkgPSBuZXcgVUkoKTtcbnZhciBzY2VuZSA9ICcnO1xudmFyIEFwcCA9IChmdW5jdGlvbiBBcHAoKSB7XG5cdHZhciBvblBsYXlDbGlja2VkID0gZnVuY3Rpb24gb25QbGF5Q2xpY2tlZCgpIHtcblx0XHRTY2VuZS5zdGFydEdhbWUodHJ1ZSk7XG5cdH07XG5cdHZhciBvblJlcGxheUNsaWNrZWQgPSBmdW5jdGlvbiBvblJlcGxheUNsaWNrZWQoKSB7XG5cdFx0U2NlbmUuc3RhcnRHYW1lKCk7XG5cdH07XG5cdHZhciBvbk1lbnVDbGlja2VkID0gZnVuY3Rpb24gb25NZW51Q2xpY2tlZCgpIHtcblx0XHRTY2VuZS5zdGFydE1lbnUoKTtcblx0fTtcblxuXHRFbC5hZGRMaXN0ZW5lcihFbC5nZXRFbGVtZW50cygnYnRuLXBsYXknKVswXSwgJ2NsaWNrJywgb25QbGF5Q2xpY2tlZCk7XG5cdEVsLmFkZExpc3RlbmVyKEVsLmdldEVsZW1lbnRzKCdidG4tcmVwbGF5JylbMF0sICdjbGljaycsIG9uUmVwbGF5Q2xpY2tlZCk7XG5cdEVsLmFkZExpc3RlbmVyKEVsLmdldEVsZW1lbnRzKCdidG4tbWVudScpLCAnY2xpY2snLCBvbk1lbnVDbGlja2VkKTtcblxuXHQvL1x0RGVmYXVsdCBzaG93IHRoZSBzdGFydCBtZW51XG5cdFNjZW5lLnN0YXJ0TWVudSgpO1xuXHQvL1x0U2NlbmUuc3RhcnRHYW1lKCk7XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
