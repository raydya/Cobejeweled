var Jewel = function(index, type) {
    // constant
    this.GRID_LENGTH = 80;
    this.JEWEL_LENGTH = 70;
    this.COLOR = {
        0 : 0xff5500, // orange
        1 : 0x8b0000, // red
        2 : 0xbcbcbc, // white
        3 : 0xffd700, // yellow
        4 : 0x00bfff, // blue
        5 : 0x68228b, // purple
        6 : 0x228b22, // green
        7 : 0x383838  // grey
    };
    this.type = type;

    var geometry = new THREE.CubeGeometry(this.JEWEL_LENGTH, this.JEWEL_LENGTH, this.JEWEL_LENGTH);
    //this.object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: this.COLOR[type] }));
    this.object = dae.MODEL_CAKE[type];
    this.object.castShadow = true;
    this.object.receiveShadow = true;
    this.object.jewel = this;

    this.object.rotation.y = Math.PI * 0.25;

    this.position = new Position(index);
    this.setScreen();
    this.animation = new Animation(this);
};
Jewel.prototype.setPosition = function(pos) {
    this.position = pos;
};
Jewel.prototype.setScreen = function(newPos) {
    var pos = newPos || this.position;

    var screenPos = this.posToScreen(pos);

    // set object position
    this.object.position.x = screenPos.x;
    this.object.position.y = screenPos.y;
    this.object.position.z = this.GRID_LENGTH;
};
Jewel.prototype.getScenePosition = function(newPos) {
    var pos = newPos || this.position;
    return this.posToScreen(pos);
};
Jewel.prototype.getPosition = function() {
    return this.position;
};
Jewel.prototype.getType = function() {
    return this.type;
};
Jewel.prototype.screenToXY = function(screen) {
    return {
        x: screen.x / this.GRID_LENGTH - 1,
        y: - screen.y / this.GRID_LENGTH - 1
    };
};
Jewel.prototype.posToScreen = function(pos) {
    return {
        x: (pos.x + 1)  * this.GRID_LENGTH,
        y: - (pos.y + 1) * this.GRID_LENGTH
    };
};
