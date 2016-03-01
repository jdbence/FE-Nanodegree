function ListItemModel(data) {
  var ref = this;
  
  this.label = data.label;
  this.pos = data.pos;
  this.state = data.state;
  this.isSelected = ko.observable(data.isSelected || false);
  this.isVisible = ko.observable(data.isVisible || true);
  this.content = ko.observable('');
  this.elevation = ko.observable(0);
  this.images = ko.observableArray(data.images || []);
  
  this.selectedClass = ko.pureComputed(function() {
    return ref.isSelected() ? 'selected' : '';
  }, this);
  
  // Checks if the item should be filtered from the view
  this.isFiltered = function(search, state) {
    var st = ref.state.toLowerCase();
    var lb = ref.label.toLowerCase();
    search = search.toLowerCase();
    state = state.toLowerCase();
    return lb.indexOf(search) !== -1 && (st === state || state.indexOf('all') !== -1);
  };
}