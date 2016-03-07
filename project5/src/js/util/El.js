var el = (function() {
    return {
      addClass: function(element, className) {
        element.className += (' ' + className);
      },
      removeClass: function(element, className, delay) {
        delay = delay || 0;
        if(delay > 0) {
          setTimeout(function(){
            element.className = element.className.replace(new RegExp(className, 'g'), '');
          }, delay);
        }else{
          element.className = element.className.replace(new RegExp(className, 'g'), '');
        }
      },
      get: function(className) {
        return document.getElementsByClassName(className)[0];
      }
    };
})();