var MapModel = function (data, searchFilter, stateFilter) {
  var infoWindow = new google.maps.InfoWindow();
  var elevator = new google.maps.ElevationService;
  var map = createMap();
  var markers = createMarkers(map, data);
  
  // Apply Default values
  adjustMapBounds(map, visibleMarkers(searchFilter(), stateFilter(), markers));
  
  // SearchFilter changed
  searchFilter.subscribe(function(newValue) {
    infoWindow.close();
    el.addClass(document.getElementById('map'), 'hide');
    
    // Wait a frame
    setTimeout(function(){
      el.removeClass(document.getElementById('map'), 'hide');
      adjustMapBounds(map, visibleMarkers(searchFilter(), stateFilter(), markers));
      
      // Show only the matching markers (if one is found)
      if(newValue != ""){
        showMarkerInfo(newValue);
      }
    }, 250);
  });
  
  // StateFilter changed
  stateFilter.subscribe(function(newValue) {
    infoWindow.close();
    // Wait a frame before updating map bounds
    setTimeout(function(){
      adjustMapBounds(map, visibleMarkers(searchFilter(), newValue, markers));
    }, 250);
  });
  
  // InfoWindow closed
  google.maps.event.addListener(infoWindow,'closeclick',function(){
    searchFilter('');
  });
  
  // Get Elevation for markers
  function requestElevation (locMarkers) {
    var loc = Util.map(locMarkers, function(m){ return m.getPosition() });
    elevator.getElevationForLocations({
        'locations': loc
      }, function(results, status) {
        if (status === google.maps.ElevationStatus.OK) {
          for(var i=0; i<results.length; i++){
            if(results[i]){
              locMarkers[i].elevation(Math.round(results[i].elevation) + ' meters');
            }
          }
        }
    });
  }
  
  // Filter markers and return the visible ones
  function visibleMarkers (search, state, markers) {
    var a = [];
    for(var i = 0; i < markers.length; i++) {
      if(markers[i].isFiltered(search, state)){
        markers[i].isVisible(true);
        a.push(markers[i]);
      }else{
        markers[i].isVisible(false);
      }
    }
    return a;
  }
  
  function showMarkerInfo(label){
    for(var i = 0; i < markers.length; i++) {
      if(markers[i].isLabel(label)){
        markers[i].showInfo();
        if(isNaN(markers[i].elevation)){
          requestElevation([markers[i]]);
        }
        break;
      }
    }
  }
  
  function createMap () {
    var element = document.getElementById('map');
    var maxZoom = 10;
    var map = new google.maps.Map(element, {
      zoom: 1,
      maxZoom: maxZoom,
      minZoom: 3,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      mapTypeControl:  true,
      streetViewControl: false,
      zoomControl: false
    });
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(event) {
      el.removeClass(element, 'hide');
      el.addClass(element, 'show');
    });
    google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
      map.setZoom(map.getZoom() - 1);
      if (this.getZoom() > maxZoom) {
        this.setZoom(maxZoom);
      }
    });
    return map;
  }
  
  function createMarkers (map, data) {
    var markers = [];
    data = data();
    for(var i=0; i<data.length; i++){
      markers.push(new MarkerModel(map, infoWindow, elevator, data[i], searchFilter));
    }
    return markers;
  }
  
  function adjustMapBounds (map, markers) {
    if(markers.length > 0){
      var bounds = new google.maps.LatLngBounds();
      for(var i=0; i<markers.length; i++) {
         bounds.extend(markers[i].getPosition());
      }
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
      map.setZoom(map.getZoom() - 1);
    }
  }
};