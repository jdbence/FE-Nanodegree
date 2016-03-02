var LocalStorageModel = function(searchFilter, stateFilter) {
  var ref = this;
  ref.searchFilter = searchFilter;
  ref.stateFilter = stateFilter;
  
  // Save changes to local store
  ref.stateFilter.subscribe(function(newValue) {
    store.set('stateFilter', newValue);
  });
  
  // Save changes to local store
  ref.searchFilter.subscribe(function(newValue) {
    store.set('searchFilter', newValue);
  });
};