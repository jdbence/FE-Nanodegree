function DescriptionModel(items, search) {
  var ref = this;
  ref.items = items;
  ref.isVisible = ko.observable(false);
  ref.picked = ko.observable(items()[0]);
  
  // SearchFilter changed, show new information
  search.subscribe(function(newValue) {
    var val = newValue.toLowerCase();
    var items = ref.items();
    var item;
    for (var i = 0; i <items.length; i++) {
      item = items[i];
      if(item.label.toLowerCase() === val) {
        ref.picked(item);
        
        // Attempt to get local content
        if(item.content() === ''){
          ref.getWiki(item, encodeURIComponent(newValue));
        }
        
        ref.isVisible(true);
        return;
      }
    }
    ref.isVisible(false);
  });
  
  // Get information from wikipedia
  this.getWiki = function (item, name){
    Util.getJSON('https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=' + name, function(response){
      var pText = 'Sorry no more info is provided :/';
      if(response !== null){
          var pages = response.query.pages;
          for (var k in pages){
          if (pages.hasOwnProperty(k) && pages[k].extract !== undefined && pages[k].extract !== "") {
            pText = pages[k].extract;
            break;
          }
        }
      }
    	item.content(pText);
    });
  };
}