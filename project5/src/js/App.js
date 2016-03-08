(function App() {
  var ref = this;
  ref.initialize = function(mapClass) {
    var items = ko.observableArray(Util.map(Constants.LIST, function(item) { return new ListItemModel(item) }));
    var searchFilter = ko.observable('');
    var stateFilter = ko.observable('California');
    var isNavOpen = ko.observable(false);
    var local = new LocalStorageModel(searchFilter, stateFilter);
    
    ko.applyBindings(new NavModel(isNavOpen), el.get('menu'));
    ko.applyBindings(new mapClass(items, searchFilter, stateFilter), el.get('map'));
    ko.applyBindings(new ListModel(items, searchFilter, stateFilter), el.get('list'));
    ko.applyBindings(new SearchModel(searchFilter, stateFilter), el.get('search'));
    ko.applyBindings(new StateFilterModel(items, stateFilter), el.get('state'));
    ko.applyBindings(new DescriptionModel(items, searchFilter), el.get('description'));
    ko.applyBindings(new PhotosModel(items, searchFilter), el.get('photos'));
    
    // Remove startup listeners
    window.removeEventListener('GMAPS_LOAD_SUCCESS', ref.onMapSuccess);
    window.removeEventListener('GMAPS_LOAD_FAILED', ref.onMapFailed);
  };
  
  // GoogleMaps failed to load
  ref.onMapFailed = function() {
    ref.initialize(NoDataMapModel);
  };
  
  // GoogleMaps sucessfully loaded
  ref.onMapSuccess = function() {
    ref.initialize(MapModel);
  };
  
  // GoogleMaps ready
  if(typeof google !== "undefined") {
    ref.onMapSuccess();
  }
  // Issue with app
  else if (typeof appstatus !== "undefined") {
    if (appstatus === "GMAPS_LOAD_SUCCESS") {
      ref.onMapSuccess();
    } else {
      ref.onMapFailed();
    }
  } else {
    // Listen for events from script loader
    window.addEventListener('GMAPS_LOAD_SUCCESS', ref.onMapSuccess, false);
    window.addEventListener('GMAPS_LOAD_FAILED', ref.onMapFailed, false);
  }
})();