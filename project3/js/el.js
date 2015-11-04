/**
* @description El Singleton used for manipulating DOM elements
* @constructor
*/
var El = (function() {
    
    var instance = function(){
    };
    
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
    
    instance.show = function(element){
        this.removeClass(document.getElementsByClassName(element), "hidden");
    }
    
    instance.hide = function(element){
        this.addClass(document.getElementsByClassName(element), "hidden");
    }
    
    return instance;
    
})();