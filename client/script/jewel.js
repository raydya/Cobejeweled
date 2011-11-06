var Jewel = function() {
    this.COLOR = {
        0 : 0xff8c00, // orange
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
Jewel.prototype.create = function(index, type) {
    var geometry = new THREE.CubeGeometry(this.JEWEL_LENGTH, this.JEWEL_LENGTH, this.JEWEL_LENGTH);
    var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: this.COLOR[type] }));

    var xy = this.iToXY(index);
    object.x = xy.x;
    object.y = xy.y;
    object.position.x = xy.x * this.GRID_LENGTH - frame.WIDTH;
    object.position.y = - xy.y * this.GRID_LENGTH + frame.HEIGHT;
    object.position.z = 150;

    object.scale.x = 1;
    object.scale.y = 1;
    object.scale.z = 1;

    object.castShadow = true;
    object.receiveShadow = true;
    return object;
};
