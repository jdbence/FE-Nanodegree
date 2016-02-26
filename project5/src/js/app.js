(function () {
  
  var infoWindow = new google.maps.InfoWindow();
  var db = [
      {pos: [37.8651011,-119.5405181], content: '<h1>Yosemite National Park</h1>'},
      {pos: [36.5053891,-117.0815965], content: '<h1>Death Valley National Park</h1>'},
      {pos: [36.4863668,-118.5679403], content: '<h1>Sequoia National Park</h1>'},
      {pos: [41.2131788,-124.0068163], content: '<h1>Redwood National and State Parks</h1>'},
      {pos: [33.873415,-115.903181], content: '<h1>Joshua Tree National Park</h1>'},
      {pos: [36.7999904,-118.5675565,], content: '<h1>Kings Canyon National Park</h1>'},
      {pos: [40.49766,-121.4228439], content: '<h1>Lassen Volcanic National Park</h1>'},
      {pos: [33.9960737,-119.7713519], content: '<h1>Channel Islands National Park</h1>'},
      {pos: [36.4905655,-121.1846812], content: '<h1>Pinnacles National Park</h1>'}
    ];
  
  function initialize () {
    var map = createMap();
    var markers = createMarkers(map, db);
    adjustMapBounds(map, markers);
  }
  
  function createMap () {
    return new google.maps.Map(document.getElementById('map'), {
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
  }
  
  function createMarker (map, data) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.pos[0], data.pos[1]),
      map: map
    });
    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent(data.content);
      infoWindow.open(map, this);
    });
    return marker;
  }
  
  function createMarkers (map, data) {
    var markers = [];
    for(var i=0; i<data.length; i++){
      markers.push(createMarker(map, data[i]))
    }
    return markers;
  }
  
  function adjustMapBounds (map, markers) {
    var bounds = new google.maps.LatLngBounds();
    for(var i=0; i<markers.length; i++) {
       bounds.extend(markers[i].getPosition());
    }
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    map.setZoom(map.getZoom() - 1);
  }
  
  // Run the initialize function when the window has finished loading.
  google.maps.event.addDomListener(window, 'load', initialize);
})();