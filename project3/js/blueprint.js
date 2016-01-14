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
