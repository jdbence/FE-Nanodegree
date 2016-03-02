var NavModel = function(isVisible) {
  var ref = this;
  ref.isVisible = isVisible;
  
  this.toggleSearchBar = function(){
    ref.isVisible(!ref.isVisible());
    
    // Change parent node class
    var nav = document.getElementsByTagName('nav')[0];
    if(ref.isVisible()){
      el.addClass(nav, 'show');
    }else{
      el.removeClass(nav, 'show');
    }
  };
  
  this.visibleClass = ko.pureComputed(function() {
    return ref.isVisible() ? 'show' : '';
  }, this);
};