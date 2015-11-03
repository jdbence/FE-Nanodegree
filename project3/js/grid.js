var Grid = (function() {
    
    var instance = function(){
        
    };
    
    instance.cellWidth = 101;
    instance.cellHeight = 83;
    instance.columns = 5;
    instance.rows = 6;
    instance.offsetY = 50;
    
    instance.getXFromColumn = function(column){
        var col = Math.max(0, Math.min(column, instance.columns - 1));
        return col * instance.cellWidth;
    }
    
    instance.getYFromRow = function(row){
        var row = Math.max(0, Math.min(row, instance.rows - 1));
        return instance.offsetY + row * instance.cellHeight;
    };
    
    return instance;
    
})();