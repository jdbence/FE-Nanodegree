/**
* @description Model Singleton used for storing state data
* @constructor
*/
var Model = (function() {
    
    var data = {};
    var instance = function(){
    };
    
    /**
    * @description Sets a value to a key
    * @param {string} key - The property to store the value under
    * @param {number} value - The value of the key
    * @returns {*} The value of the key
    */
    instance.set = function(key, value){
         data[key] = value;
         return value;
    };
    
    /**
    * @description Returns the value set to the key
    * @returns {*} The value of the key
    */
    instance.get = function(key){
        return data[key];
    };
    
    return instance;
    
})();