var JEWELROWCOUNT = 16;
var JEWELCOLUMNCOUNT = 8;

var Jewel = function() {
    this.jewels = {};
    this.rowCount = JEWELROWCOUNT;
    this.columnCount = JEWELCOLUMNCOUNT;
}
Jewel.prototype.initFillingUp = function() {
    var jewelIndex, jewelType;
    for (var i = 0; i < this.rowCount; ++i) {
        for (var j = 0; j < this.columnCount; ++j) {
            jewelIndex = i + ',' + j;
            jewelType = this.createSingleJewel();
            this.jewels[jewelIndex] = jewelType;
        }
    }
}
Jewel.prototype.getJewels = function() {
    return this.jewels;
}
Jewel.prototype.clientMvSingleJewel = function(src, tar) {
    if (!this.checkNeighbor(src, tar)) return false;
    this.srcTmp = tar;
    this.tarTmp = src;
    return this.jewelMove();
}
Jewel.prototype.jewelMove = function() {
    var eliminateJewels = [];
    
    if (this.getEliminateJewel(this.srcTmp)) {
        eliminateJewels.push(this.getEliminateJewel(this.srcTmp));
    }

    if (this.getEliminateJewel(this.tarTmp)) {
        eliminateJewels.push(this.getEliminateJewel(this.tarTmp));
    }
    
    if (eliminateJewels[0]) {
        this.eliminateLegalJewels(eliminateJewels);
        this.fillEmptyJewels(eliminateJewels);
        return eliminateJewels;
    }

    return false;
}
Jewel.prototype.eliminateLegalJewels = function(jewels) {
    var length = jewels.length;

    for (var i = 0; i <= length; ++i) {
        delete this.jewels[jewels[i]];
    }
}
Jewel.prototype.fillEmptyJewels = function(jewels) {
    var length = jewels.length;

    for (var i = 0; i <= length; ++i) {
        this.jewels[jewels[i]] = this.createSingleJewel();
    }
}
Jewel.prototype.getEliminateJewel = function(coordinate) {
    var eliminateJewelX = [], eliminateJewelY = [], eliminateJewel = [], tmpType, tmpIndex, coordinateIndex = coordinate.x + ',' + coordinate.y;

    eliminateJewelX.push(coordinateIndex);
    eliminateJewelY.push(coordinateIndex);

    for (var a = coordinate.x; a > 0; --a) {
        tmpIndex = a + ',' + coordinate.y;
        if (this.jewels[tmpIndex] != this.jewels[coordinateIndex]) break;
        eliminateJewelX.push(tmpIndex);
    }

    for (var b = coordinate.x; b < this.rowCount; ++b) {
        tmpIndex = b + ',' + coordinate.y;
        if (this.jewels[tmpIndex] != this.jewels[coordinateIndex]) break;
        eliminateJewelX.push(tmpIndex);
    }

    for (var c = coordinate.y; c > 0; --c) {
        tmpIndex = c + ',' + coordinate.y;
        if (this.jewels[tmpIndex] != this.jewels[coordinateIndex]) break;
        eliminateJewelY.push(tmpIndex);
    }

    for (var d = coordinate.y; d < this.columnCount; ++d) {
        tmpIndex = d + ',' + coordinate.y;
        if (this.jewels[tmpIndex] != this.jewels[coordinateIndex]) break;
        eliminateJewelY.push(tmpIndex);
    }

    if (eliminateJewelX.length < 3) eliminateJewelX = [];
    if (eliminateJewelY.length < 3) eliminateJewelY = [];

    eliminateJewel = eliminateJewelX.concat(eliminateJewelY);

    return eliminateJewel[0] ? eliminateJewel : false;
}
Jewel.prototype.checkNeighbor = function(src, tar) {
    var absX, absY;
    absX = Math.abs(src.x - tar.x);
    absY = Math.abs(src.y - tar.y);
    return (absX + absY) == 1 ? true : false;
}
Jewel.prototype.verifyCoordinate = function(coord) {
    if (/^[1-9]+[0-9]*]*$/.test(coord.x) && /^[1-9]+[0-9]*]*$/.test(coord.y)) return true;
    return false;
}
Jewel.prototype.createSingleJewel = function() {
    return Math.round(Math.random() * 7);
}

global.CoBejeweled = new Jewel;
