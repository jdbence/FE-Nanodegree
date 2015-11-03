var Collision = (function() {
    
    var instance = function(){
    };
    
    instance.isColliding = function(sensorA, sensorB){
        return (sensorA.x < sensorB.x + sensorB.width &&
           sensorA.x + sensorB.width > sensorB.x &&
           sensorA.y < sensorB.y + sensorB.height &&
           sensorA.height + sensorA.y > sensorB.y);
    };
    
    return instance;
    
})();