var Debug = function() {
    this.$cameraCoorindate = document.getElementById('camera-coordinate');
    this.$selectedJewelCoordinate = document.getElementById('selected-jewel-coordinate');
    this.$selectedJewelXY = document.getElementById('selected-jewel-xy');
};

Debug.prototype.update = function() {
    this.getCameraPos();
    this.getJewelPos();
    this.getJewelXY();
};
Debug.prototype.getCameraPos = function() {
    this.$cameraCoorindate.innerHTML = camera.position.x + ',' + camera.position.y + ',' + camera.position.z;
};
Debug.prototype.getJewelPos = function() {
    if (SELECTED) {
        var position = SELECTED.object.position;
        this.$selectedJewelCoordinate.innerHTML = position.x + ',' + position.y + ',' + position.z;
    } else {
        this.$selectedJewelCoordinate.innerHTML = '';
    }
};
Debug.prototype.getJewelXY = function() {
    if (SELECTED) {
        var xy = SELECTED.getPosition();
        this.$selectedJewelXY.innerHTML = xy.x + ',' + xy.y + ',0';
    } else {
        this.$selectedJewelXY.innerHTML = '';
    }
};
