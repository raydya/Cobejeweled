var Action = function(data) {
    this.data = data;
    this.type = data.protocol;
};

Action.prototype.run = function() {
    this[this.type]();
};
Action.prototype.moveGems = function() {
    var src = this.data.data.s;
    var tar = this.data.data.t;
    var srcIndex = fc.xyToI(src.x, src.y);
    var tarIndex = fc.xyToI(tar.x, tar.y);

    // Animation
    var srcJewel = matrix[srcIndex];
    console.log('src', src);
    console.log('tar', tar);
    srcJewel.animation.initMove(tar);
    srcJewel.animation.run();

    var tarJewel = matrix[tarIndex];
    tarJewel.animation.initMove(src, this.getExchangeJewel(srcIndex, tarIndex));
    tarJewel.animation.run();
};
Action.prototype.getExchangeJewel = function(srcIndex, tarIndex) {
    return function() {
        var srcObject = matrix[srcIndex];
        var tarObject = matrix[tarIndex];

        frame.transferJewel(srcObject, tarIndex);
        delete matrix[srcIndex];
        if (tarObject) {
            frame.transferJewel(tarObject, srcIndex);
        }
    };
};
