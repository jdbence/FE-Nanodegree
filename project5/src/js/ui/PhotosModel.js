function PhotosModel(items, search) {
  var ref = this;
  ref.items = items;
  ref.isPhotoErrorVisible = ko.observable(false);
  ref.isVisible = ko.observable(false);
  ref.picked = ko.observable(items()[0]);
  ref.blank = ko.mapping.fromJS({images:[]});
  ref.selectedImage = ko.observable("");
  ref.pckry;
  
  // Wait frame
  setTimeout(function(){
    ref.pckry = new Packery(document.querySelector('.grid'), {
      itemSelector: '.grid-item'
    });
  }, 0);
  
  // SearchFilter changed, show new information
  ref.onSearchUpdated = function(newValue) {
    var val = newValue.toLowerCase();
    var items = ref.items();
    var item;
    for (var i = 0; i <items.length; i++) {
      item = items[i];
      if(item.label.toLowerCase() === val) {
        ref.picked(item);
        ref.closeImage();
        
        // Attempt to get local images
        if(item.images().length === 0){
          ref.getFlickr(item, encodeURIComponent(newValue));
        } else {
          ref.pckry.reloadItems();
        }
        ref.isVisible(true);
        return;
      }
    }
    ref.closeImage();
    ref.picked(ref.blank);
    ref.isVisible(false);
  };
  
  // SearchFilter changed
  search.subscribe(ref.onSearchUpdated);
  
  // Get Flickr images
  ref.getFlickr = function (item, name){
    Util.getJSONP('https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=' + name, 'jsonFlickrFeed').then(
      function(response) {
        ref.isPhotoErrorVisible(false);
        item.images(Util.map(response.items, function(item){
          return item.media.m;
        }));
        ref.pckry.reloadItems();
      }, function(error) {
        item.images([]);
        ref.isPhotoErrorVisible(true);
      }
    );
  };
  
  // Adjust image layout
  ref.imageLoaded = function() {
    ref.pckry.layout();
  };
  
  // Return the images
  ref.images = ko.computed(function() {
    return ref.picked().images();
  });
  
  // Remove the selected image
  ref.closeImage = function () {
    ref.selectedImage("");
  };
  
  // Determines if PhotoViewer is shown
  ref.isPhotoViewerVisible = ko.computed(function() {
    return ref.selectedImage() !== "";
  });
  
  // Sets image to the larger version of the thumbnail
  ref.viewImage = function(src) {
    ref.selectedImage(src.slice(0, -5) + 'z' + src.slice(-4));
  };
}