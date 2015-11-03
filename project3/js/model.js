var Model = (function() {
    
    var data = {};
    var instance = function(){
    };
    
    instance.set = function(key, value){
         data[key] = value;
         return value;
    };
    
    instance.get = function(key){
        return data[key];
    };
    
    return instance;
    
})();