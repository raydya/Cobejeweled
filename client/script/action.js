var Action = function(data, maxCount) {
    this.data = data;
    this.type = data.protocol;

    // make sure all gems animation done
    this.count = 0;
    this.maxCount = maxCount || 1;
};

Action.prototype.run = function() {
    this[this.type]();
};
Action.prototype.moveGems = function() {
    var srcPos = this.data.data.s;
    var tarPos = this.data.data.t;

    // Animation
    var srcJewel = matrix.get(srcPos);
    srcJewel.animation.initMove(tarPos);
    srcJewel.animation.run();

    var tarJewel = matrix.get(tarPos);
    tarJewel.animation.initMove(srcPos, this.fnExchangeJewel(srcPos, tarPos));
    tarJewel.animation.run();
};
Action.prototype.eliminateGems = function() {
    this.data.data.toEliminate.forEach(frame.eliminate);
    queue.shift();
};
Action.prototype.fnExchangeJewel = function(srcPos, tarPos) {
    return function() {
        var srcJewel = matrix.get(srcPos);
        var tarJewel = matrix.get(tarPos);

        var srcToPos = tarJewel.getPosition().clone();
        var tarToPos = srcJewel.getPosition().clone();
        srcJewel.setPosition(srcToPos);
        tarJewel.setPosition(tarToPos);

        srcJewel.setScreen();
        tarJewel.setScreen();
        queue.shift();
    };
};
Action.prototype.fnTransferJewel = function(srcPos, tarPos, action) {
    return function() {
        var srcJewel = matrix.get(srcPos);

        srcJewel.setPosition(tarPos);
        srcJewel.setScreen();
        action.isDone();
    };
};
Action.prototype.reorganizeGems = function() {
    var _this = this;
    this.data.data.toReorganize.forEach(function(data) {
        var srcPos = new Position(data.from.index);
        var tarPos = new Position(data.to.index);
        // Animation
        var srcJewel = matrix.get(srcPos);
        srcJewel.animation.initMove(tarPos, _this.fnTransferJewel(srcPos, tarPos, _this));
        srcJewel.animation.run();
    });
};
Action.prototype.fillGems = function() {
    var _this = this;
    this.data.data.toFill.forEach(function(data) {
        var srcPos = new Position(data.index);
        srcPos.setY1();

        var tarPos = new Position(data.index);

        frame.createJewel(srcPos.i, data.type);
        // Animation
        var srcJewel = matrix.get(srcPos);
        srcJewel.animation.initMove(tarPos, _this.fnTransferJewel(srcPos, tarPos, _this));
        srcJewel.animation.run();
    });
};
Action.prototype.gemsBoard = function() {
    var board = this.data.data.board;
    var pos, standards;
    for (var i in board) {
        pos = new Position(i);
        standards = board[i];
        frame.verify(pos, standards);
    }
    queue.shift();
};
Action.prototype.isDone = function() {
    ++this.count;
    if (this.count < this.maxCount) return;
    queue.shift();
};
