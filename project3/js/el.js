/**
* @description El Singleton used for manipulating DOM elements
* @constructor
*/
var El = (function() {
    
    var instance = function(){
    };
    
    /**
    * @description Removes the className from each element in the array
    * @param {array} elements - Array of DOM elements
    * @param {string} className - Class to remove
    */
    instance.removeClass = function(elements, className){
        var i, c;
        if(elements){
            if(elements.length == undefined){
                elements = [elements];
            }
            for(i=0; i<elements.length; i++){
                c = elements[i].className.replace(" " + className, "");
                elements[i].className = c;
            }
        }
    }
    
    /**
    * @description Adds the className on each element in the array
    * @param {array} elements - Array of DOM elements
    * @param {string} className - Class to add
    */
    instance.addClass = function(elements, className){
        var i;
        
        if(elements){
            if(elements.length == undefined){
                elements = [elements];
            }
            for(i=0; i<elements.length; i++){
                if(elements[i].className.indexOf(" " + className) < 0){
                    elements[i].className += " " + className;
                }
            }
        }
    }
    
    /**
    * @description Adds a listener on the element
    * @param {array} elements - Array of DOM elements
    * @param {string} event - Event to listen for
    * @param {function} callback - Function to call when the event is captured
    */
    instance.addListener = function(elements, event, callback){
        var i;
        
        if(elements){
            if(elements.length == undefined){
                elements = [elements];
            }
            for(i=0; i<elements.length; i++){
                elements[i].addEventListener(event, callback);
            }
        }
    }
    
    /**
    * @description Removes the hidden class from the elements with the given className
    * @param {string} className - The elements to find
    */
    instance.show = function(className){
        this.removeClass(document.getElementsByClassName(className), "hidden");
    }
    
    /**
    * @description Adds the hidden class on the elements with the given className
    * @param {string} className - The elements to find
    */
    instance.hide = function(className){
        this.addClass(document.getElementsByClassName(className), "hidden");
    }
    
    return instance;
    
})();