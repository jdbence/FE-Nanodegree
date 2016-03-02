function PhotosModel(items, search) {
  var ref = this;
  ref.items = items;
  ref.isVisible = ko.observable(false);
  ref.picked = ko.observable(items()[0]);
  ref.blank = ko.mapping.fromJS({images:[]});
  var pckry;
  
  // Wait frame
  setTimeout(function(){
    pckry = new Packery(document.querySelector('.grid'), {
      itemSelector: '.grid-item'
    });
  }, 0);
  
  // SearchFilter changed, show new information
  search.subscribe(function(newValue) {
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
          pckry.reloadItems();
        }
        ref.isVisible(true);
        return;
      }
    }
    ref.closeImage();
    ref.picked(ref.blank);
    ref.isVisible(false);
  });
  
  // Get Flickr images
  this.getFlickr = function (item, name){
    Util.getJSON('https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=' + name, function(response){
      if(response !== null){
        
        item.images(Util.map(response.items, function(item){
          return item.media.m;
        }));
        
        pckry.reloadItems();
        
      }else{
    	  item.images([]);
      }
    }, 'jsonFlickrFeed');
  };
  
  // Adjust image layout
  ref.imageLoaded = function() {
    pckry.layout();
  };
  
  // Return the images
  ref.images = ko.computed(function() {
    return ref.picked().images();
  });
  
  ref.selectImage = function (item) {
    ref.selectedImage(item);
  };
  
  ref.closeImage = function () {
    ref.selectedImage("");
  };
  
  ref.selectedImage = ko.observable("");
  
  ref.isPhotoViewerVisible = ko.computed(function() {
    return ref.selectedImage() !== "";
  });
}