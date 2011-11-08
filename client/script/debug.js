var Debug = function() {};

Debug.prototype.update = function() {
    this.getCameraPos();
    this.getJewelPos();
    this.getJewelXY();
};
Debug.prototype.getCameraPos = function() {
    var el = document.getElementById('camera-coordinate');
    el.innerHTML = camera.position.x + ',' + camera.position.y + ',' + camera.position.z;
};
Debug.prototype.getJewelPos = function() {
    if (!SELECTED) return;
    var el = document.getElementById('selected-jewel-coordinate');
    el.innerHTML = SELECTED.position.x + ',' + SELECTED.position.y + ',' + SELECTED.position.z;
};
Debug.prototype.getJewelXY = function() {
    if (!SELECTED) return;
    var el = document.getElementById('selected-jewel-xy');
    var xy = jewel.posToXY(SELECTED.position.x, SELECTED.position.y);
    el.innerHTML = xy.x + ',' + xy.y + ',0';
};
