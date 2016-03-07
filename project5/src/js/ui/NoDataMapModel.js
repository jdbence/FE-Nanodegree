var NoDataMapModel = function (items, searchFilter, stateFilter) {
  var ref = this;
  var service = 'Google Maps';
  var fails = 0;
  var element = el.get('map');
  var waitingForResponse = false;
  
  ref.message = ko.observable(service + ' failed to load!');
  
  ref.removeListeners = function () {
    window.removeEventListener('GMAPS_LOAD_SUCCESS', ref.onSuccess);
  };
  
  // Google Maps loaded
  ref.onSuccess = function (){
    waitingForResponse = false;
    ref.removeListeners();
    ko.cleanNode(element);
    ko.applyBindings(new MapModel(items, searchFilter, stateFilter), element);
  };
  
  // Google Maps failed to load (track attempts)
  ref.onFailed = function (){
    waitingForResponse = false;
    fails++;
    ref.message(service + ' failed to load ' + fails + ' times!');
  };
  
  // User clicked the retry button
  ref.onClickRetry = function () {
    if(!waitingForResponse){
      var script = el.get("gmapScript").getElementsByTagName("script")[0];
      var src = script.getAttribute('src', 2);
      script.parentNode.removeChild(script);
      ref.addScript(src);
    }
  };
  
  // Create a new script tag
  ref.addScript = function (src) {
    var holder = el.get("gmapScript");
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onerror = ref.onFailed;
    holder.appendChild(script);
  };
  
  // Renders the HTML as a String
  ref.render = function () {
    return '<div id="loadMap"><h1 data-bind="text: message"></h1><div><button class="retry" data-bind="click: onClickRetry">Retry</button></div>';
  };
  
  // Setup the Dynamic element
  element.innerHTML = ref.render();
  el.removeClass(element, 'hide');
  window.addEventListener('GMAPS_LOAD_SUCCESS', ref.onSuccess, false);
};
