var StateFilterModel = function(items, filter) {
  var ref = this;
  
  // Get a unique list of all the state options
  ref.getUniqueValues = function(items){
    var a = [];
    for (var i = 0; i < items.length; i++) {
      if (a.indexOf(items[i].state) === -1) {
        a.push(items[i].state);
      }
    }
    a.sort();
    
    // Put All States at the top
    if(a.length > 0){
      a.unshift('All States');
    }
    return a;
  };
  
  ref.options = ref.getUniqueValues(items());
  ref.filter = filter;
};