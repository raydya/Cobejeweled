var Animation = function(jewel) {
    this.jewel = jewel;
    this.running = false;

    this.moveAnimationId = null;
    this.callback = null;
};

Animation.prototype.run = function() {
    this.renderStartStamp = fc.getNowStamp();
    this.running = true;
    
    this.render();
};
Animation.prototype.initMove = function(tarPosition, callback) {
    this.srcPosition = this.jewel.getScenePosition();
    this.tarPosition = this.jewel.getScenePosition(tarPosition);
    console.log(tarPosition);
    console.log(this.srcPosition);
    console.log(this.tarPosition);
    this.getDisplacement();
    this.regCallback(callback);
};
Animation.prototype.getDisplacement = function() {
    var displacementX = this.tarPosition.x - this.srcPosition.x;
    var displacementY = this.tarPosition.y - this.srcPosition.y;
    this.displacement = new THREE.Vector2(displacementX, displacementY);
};
Animation.prototype.render = function() {
    var deltaStamp = fc.getNowStamp() - this.renderStartStamp;
    if (deltaStamp > DURATION) {
        this.stop();
        return;
    }

    var nowScreenX = fc.fix(this.srcPosition.x + deltaStamp / DURATION * this.displacement.x);
    var nowScreenY = fc.fix(this.srcPosition.y + deltaStamp / DURATION * this.displacement.y);
    this.jewel.object.position.set(nowScreenX, nowScreenY, this.jewel.GRID_LENGTH);

    var _this = this;
    this.moveAnimationId = webkitRequestAnimationFrame(function() {
        _this.render();
    });
};
Animation.prototype.stop = function() {
    this.running = false;
    this.callback();
    queue.shift();
};
Animation.prototype.regCallback = function(callback) {
    this.callback = callback || function() {};
};
