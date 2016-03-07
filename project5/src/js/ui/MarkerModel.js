var MarkerModel = function(map, infoWindow, elevator, data, searchFilter) {
  var ref = this;
  
  ref.pinIcon = function(type) {
    return {
      url: 'img/icons/' + type + '.svg',
      scale: 1,
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 46)
    };
  };
  
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.pos[0], data.pos[1]),
    map: map,
    icon: ref.pinIcon(data.type),
    state: data.state,
    visible: data.isVisible()
  });
  
  // Asks the service find information about it
  var requestElevation = function() {
    elevator.getElevationForLocations({
        'locations': [marker.position]
      }, function(results, status) {
        if (status === google.maps.ElevationStatus.OK) {
          if(results[0]){
            ref.elevation(Math.round(results[0].elevation) + ' meters');
          }
        }
    });
  };
  
  // Marker was clicked
  google.maps.event.addListener(marker, 'click', function () {
    searchFilter(data.label);
  });
  
  // Keep marker visiblity in sync with Model
  data.isVisible.subscribe(function(newValue) {
    marker.setVisible(newValue);
  });
  
  // Marker visibilty
  ref.isVisible = data.isVisible;
  
  // Check if it should be filtered
  ref.isFiltered = data.isFiltered;
  
  // Toggles selected state
  ref.isSelected = data.isSelected;
  
  // Elevation of marker
  ref.elevation = data.elevation;
  
  // Map location
  ref.getPosition = function() {
    return marker.getPosition();
  };
  
  // Check if label matches
  this.isLabel = function(label) {
    return data.label === label;
  };
  
  // Show info about the marker
  ref.showInfo = function() {
    marker.setAnimation(google.maps.Animation.DROP);
    infoWindow.open(map, marker);
    infoWindow.setContent('<h3>' + data.label + '</h3>');
  };
};