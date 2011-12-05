var fc = {
    iToXY : function(index) {
        var array = index.split(',');
        return { x: parseInt(array[0], 10), y: parseInt(array[1], 10) };
    },
    xyToI : function(x, y) {
        return x + ',' + y;
    },
    getNowStamp : function() {
        return Date.now();
    },
    fix : function(d) {
        return typeof(d) === 'number' ? parseInt(d.toFixed(), 10) : d;
    },
    clone : function(obj) {
        var clone = {};
        for (var i in obj) {
            if (typeof(obj[i]) === 'object') {
                clone[i] = this.clone(obj[i]);
            } else {
                clone[i] = obj[i];
            }
        }
        return clone;
    }
};
