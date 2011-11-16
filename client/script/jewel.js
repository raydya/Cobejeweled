var Jewel = function(index, type) {
    // constant
    this.GRID_LENGTH = 80;
    this.JEWEL_LENGTH = 70;
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
    this.type = type;

    var geometry = new THREE.CubeGeometry(this.JEWEL_LENGTH, this.JEWEL_LENGTH, this.JEWEL_LENGTH);
    this.object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: this.COLOR[type] }));
    this.object.castShadow = true;
    this.object.receiveShadow = true;
    this.object.jewel = this;

    this.object.rotation.y = Math.PI * 0.25;

    this.position = new THREE.Vector2();
    this.setPosition(index);
    this.animation = new Animation(this);
};
Jewel.prototype.setPosition = function(position) {
    // check index or vector2
    var xy, index;
    if (typeof(position) === 'object') {
        xy = position;
        index = this.xyToI(xy.x, xy.i);
    } else {
        xy = this.iToXY(position);
        index = position;
    }
    // set xy
    this.position.set(xy.x, xy.y);

    // set object position
    var pos = this.xyToPos(xy.x, xy.y);
    this.object.position.x = pos.x;
    this.object.position.y = pos.y;
    this.object.position.z = this.GRID_LENGTH;

    // set index
    this.index = index;
};
Jewel.prototype.getScenePosition = function(position) {
    if (position) {
        var xy = this.xyToPos(position.x, position.y);
        return new THREE.Vector2(xy.x, xy.y);
    }
    return new THREE.Vector2(this.object.position.x, this.object.position.y);
};
Jewel.prototype.getPosition = function() {
    return this.position;
};
Jewel.prototype.getIndex = function() {
    return this.index;
};
Jewel.prototype.getType = function() {
    return this.type;
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
