function removeClass(elements, className){
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

function addClass(elements, className){
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

function addListener(elements, event, callback){
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

function show(element){
    removeClass(document.getElementsByClassName(element), "hidden");
}

function hide(element){
    addClass(document.getElementsByClassName(element), "hidden");
}