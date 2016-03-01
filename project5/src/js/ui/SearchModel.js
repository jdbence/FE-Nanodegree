var SearchModel = function(search, stateFilter) {
  this.search = search;
  
  // StateFilter changed
  stateFilter.subscribe(function(newValue) {
    search('');
  });
  
  this.clearSearch = function(){
    search('');
  };
};