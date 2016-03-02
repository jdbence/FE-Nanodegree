var MarkerModel = function(map, infoWindow, elevator, data, searchFilter) {
  var ref = this;
  
  ref.pinIcon = function(color) {
    return {
      path: 'M256,0C167.625,0,96,71.625,96,160c0,23.875,5.25,46.563,14.594,66.875l121.875,264.469,C238.313,504.063,246.688,512,256,512s17.688-7.938,23.531-20.625l121.875-264.5C410.781,206.563,416,183.875,416,160,C416,71.625,344.375,0,256,0z M256,256c-53,0-96-43-96-96s43-96,96-96s96,43,96,96S309,256,256,256z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: 'none',
      strokeWeight: 2,
      scale: 0.09,
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(256, 512),
      labelOrigin: new google.maps.Point(256, 170)
   };
  };
  
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.pos[0], data.pos[1]),
    map: map,
    icon: ref.pinIcon(Util.stringColor(data.label)),
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