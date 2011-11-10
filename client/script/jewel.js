var Jewel = function() {
    this.COLOR = {
        0 : 0xff5500, // orange
        1 : 0x8b0000, // red
        2 : 0xf8f8ff, // white
        3 : 0xffd700, // yellow
        4 : 0x00bfff, // blue
        5 : 0x68228b, // purple
        6 : 0x228b22, // green
        7 : 0x383838 // grey
    };
    this.GRID_LENGTH = 80;
    this.JEWEL_LENGTH = 70;
};
Jewel.prototype.iToXY = function(index) {
    var array = index.split(',');
    return { x: parseInt(array[0], 10), y: parseInt(array[1], 10) };
};
Jewel.prototype.xyToI = function(x, y) {
    return x + ',' + y;
};
Jewel.prototype.posToXY = function(x, y) {
    return {
        x: x / this.GRID_LENGTH - 1,
        y: - y / this.GRID_LENGTH - 1
    };
};
Jewel.prototype.xyToPos = function(x, y) {
    return {
        x: (x + 1)  * this.GRID_LENGTH,
        y: - (y + 1) * this.GRID_LENGTH
    };
};
Jewel.prototype.create = function(index, type) {
    var geometry = new THREE.CubeGeometry(this.JEWEL_LENGTH, this.JEWEL_LENGTH, this.JEWEL_LENGTH);
    var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: this.COLOR[type] }));

    var xy = this.iToXY(index);
    var pos = this.xyToPos(xy.x, xy.y);
    object.position.x = pos.x;
    object.position.y = pos.y;
    object.x = xy.x;
    object.y = xy.y;
    object.position.z = this.GRID_LENGTH;

    object.castShadow = true;
    object.receiveShadow = true;
    return object;
};
Jewel.prototype.isNeighbour = function(src, tar) {
    var absX, absY;
    absX = Math.abs(src.x - tar.x);
    absY = Math.abs(src.y - tar.y);
    return absX + absY === 1;
};
Jewel.prototype.eliminate = function(posXY) {
    var object = matrix[posXY];
    scene.remove(object);
    delete matrix[posXY];
    var i = objects.indexOf(object);
    objects.splice(i, 1);
};
Jewel.prototype.reorganize = function(data) {
    /* data = {
     *  from: { effect: null, index: '2,7' },
     *  to: { effect: null, index: '2,8' }
     * }
     * ||
     * false
     * */
    if (data === false) return;
    var object = matrix[data.from.index];
    var toXY = jewel.iToXY(data.to.index);
    object.x = toXY.x;
    object.y = toXY.y;
    var toPos = jewel.xyToPos(toXY.x, toXY.y);
    object.position.x = toPos.x;
    object.position.y = toPos.y;
    matrix[data.to.index] = object;
};
