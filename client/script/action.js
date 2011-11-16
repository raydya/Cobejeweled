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
    srcJewel.animation.initMove(tar);
    srcJewel.animation.run();

    var tarJewel = matrix[tarIndex];
    tarJewel.animation.initMove(src, this.getExchangeJewel(srcIndex, tarIndex));
    tarJewel.animation.run();
};
Action.prototype.eliminateGems = function() {
    this.data.data.toEliminate.forEach(frame.eliminate);
    queue.shift();
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
        queue.shift();
    };
};
Action.prototype.reorganizeGems = function() {
    /*
    var origin = this.data.data.toReorganize;

    var arranged = {};

    origin.forEach(function(data) {

    });
    */






    var _this = this;
    this.data.data.toReorganize.forEach(function(data) {
        var srcIndex = data.from.index;
        var tarIndex = data.to.index;
        // Animation
        var srcJewel = matrix[srcIndex];
        var tar = srcJewel.iToXY(tarIndex);
        srcJewel.animation.initMove(tar, _this.getExchangeJewel(srcIndex, tarIndex));
        srcJewel.animation.run();
    });
};
Action.prototype.fillGems = function() {
    //data.data.toFill.forEach(frame.fill);
    var _this = this;
    this.data.data.toFill.forEach(function(data) {
        var tarIndex = data.index;

        var xy = fc.iToXY(tarIndex);
        xy.y = 1;
        var srcIndex = fc.xyToI(xy.x, xy.y);

        frame.createJewel(srcIndex, data.type);
        // Animation
        var srcJewel = matrix[srcIndex];
        var tar = srcJewel.iToXY(tarIndex);
        srcJewel.animation.initMove(tar, _this.getExchangeJewel(srcIndex, tarIndex));
        srcJewel.animation.run();
    });
};
Action.prototype.gemsBoard = function() {
    var board = this.data.data.board;
    for (var i in board) {
        frame.verify(i, board[i]);
    }
};
