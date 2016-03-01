var Util = (function() {
    return {
      // Map each item of array
      map: function(array, cb) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
          newArray.push(cb(array[i]));
        }
        return newArray;
      },
      // Makes a JSON request
      getJSON: function (url, callback, callbackName){
        callbackName = callbackName || ('jsonp' + Math.round(Math.random() * 99999999));
        var jsonpScript = document.createElement('script');
        var head = document.getElementsByTagName("head")[0];
        
        window[callbackName] = function(json){
          head.removeChild(jsonpScript);
          callback(json);
          delete window[callbackName];
        };
        
        jsonpScript.setAttribute("src", url += '&callback=' + callbackName);
        head.appendChild(jsonpScript);
      }
    };
})();