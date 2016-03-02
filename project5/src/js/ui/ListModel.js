var ListModel = function (items, search, stateFilter) {
  var ref = this;
  ref.listItems = items;
  ref.search = search;
  ref.stateFilter = stateFilter;
  ref.isVisible = ko.observable(false);
  
  // Toggle the list item selection
  ref.selectItem = function (item) {
    ref.search(item.label);
    ref.isVisible(false);
  };
  
  // Hide list items that don't match the search
  ref.filterBy = ko.computed(function() {
    var li = ref.listItems();
    var item;
    var count = 0;
    for (var i = 0; i < li.length; i++) {
      item = li[i];
      item.isVisible(!item.isFiltered(ref.search(), ref.stateFilter()));
      if(item.isVisible()){
        count++;
      }
    }
    
    // Hide the list if nothing found
    ref.isVisible(count > 0);
  });
};