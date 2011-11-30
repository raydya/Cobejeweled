var Matrix = function() {
    this.list = [];
};

Matrix.prototype.add = function(jewel) {
    this.list.push(jewel);
    objects.push(jewel.object);
};
Matrix.prototype.get = function(pos) {
    for (var i = 0; i < this.list.length; ++i) {
        if (this.list[i].position.i === pos.i) return this.list[i];
    }
};
Matrix.prototype.getI = function(pos) {
    for (var i = 0; i < this.list.length; ++i) {
        if (this.list[i].position.i === pos.i) return i;
    }
};
Matrix.prototype.del = function(pos) {
    var i = this.getI(pos);
    this.list.splice(i, 1);

    objects.splice(i, 1);
};
