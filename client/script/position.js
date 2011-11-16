var Position = function(pos) {
    this.i = null;
    this.x = null;
    this.y = null;

    this.set(pos);
};

Position.prototype.getI = function() {
    return i;
};
Position.prototype.getXY = function() {
    return { x: this.x, y: this.y };
};
Position.prototype.set = function(ixy) {
    if (ixy instanceof Position) {
        this.i = ixy.i;
        this.x = ixy.x;
        this.y = ixy.y;
    } else if (typeof(ixy) === 'object') {
        this.i = fc.xyToI(ixy.x, ixy.y);
        this.x = ixy.x;
        this.y = ixy.y;
    } else if (typeof(ixy) === 'string') {
        this.i = ixy;
        var xy = fc.iToXY(ixy);
        this.x = xy.x;
        this.y = xy.y;
    } else {
        throw new Error('Position.set: invalid ixy');
    }
};
