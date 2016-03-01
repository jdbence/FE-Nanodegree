var MarkerModel = function(map, infoWindow, elevator, data, searchFilter) {
  var ref = this;
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.pos[0], data.pos[1]),
    map: map,
    state: data.state,
    label: data.label,
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
  this.isVisible = data.isVisible;
  
  // Check if it should be filtered
  this.isFiltered = data.isFiltered;
  
  // Toggles selected state
  this.isSelected = data.isSelected;
  
  // Elevation of marker
  this.elevation = data.elevation;
  
  // Map location
  this.getPosition = function() {
    return marker.getPosition();
  };
  
  // Check if label matches
  this.isLabel = function(label) {
    return data.label === label;
  };
  
  // Show info about the marker
  this.showInfo = function() {
    marker.setAnimation(google.maps.Animation.DROP);
    infoWindow.open(map, marker);
    infoWindow.setContent('<h3>' + data.label + '</h3>');
  };
};