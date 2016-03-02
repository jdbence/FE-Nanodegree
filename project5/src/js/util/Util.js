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
      },
      // Converts a String to a color
      stringColor: function(str){
        var colour = '#';
        var hash = 0;
        var i;
        var value;
        for (i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        for (i = 0; i < 3; i++) {
          value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }
    };
})();