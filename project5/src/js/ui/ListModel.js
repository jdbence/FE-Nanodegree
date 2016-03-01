var ListModel = function (items, search, stateFilter) {
  var ref = this;
  ref.listItems = items;
  ref.search = search;
  ref.stateFilter = stateFilter;
  
  // Toggle the list item selection
  ref.selectItem = function (item) {
    
    ref.search(item.label);
    
    var li = ref.listItems();
    for (var i = 0; i <li.length; i++) {
      if (li[i] === item) {
        
        // Toggle the selected item
        //item.isSelected(!item.isSelected());
        // item.isSelected(true);
        ref.search(item.label);
        
        // Change search to match item label
        //if (item.isSelected()) {
          //ref.search(item.label);
        //}
        
      } else if(li[i].isSelected() === true) {
        // li[i].isSelected(false);
      }
    }
  };
  
  // Only show the list if required
  ref.isVisible = ko.computed(function() {
    return ref.listItems().length > 1;
  });
  
  // Hide list items that don't match the search
  ref.filterBy = ko.computed(function() {
    var li = ref.listItems();
    var item;
    var visible = false;
    for (var i = 0; i < li.length; i++) {
      item = li[i];
      if(item.isVisible(item.isFiltered(ref.search(), ref.stateFilter()))){
        visible = true;
      }
    }
    if(visible){
      ref.isVisible(visible);
    }
  });
};