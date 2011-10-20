var JEWELCOUNTX = 8;
var JEWELCOUNTY = 13;

var Jewel = function() {
    this.jewels = {};
}
Jewel.prototype.initFillingUp = function() {
    var jewelIndex, jewelType;
    for (var i = 0; i < JEWELCOUNTX; ++i) {
        for (var j = 0; j < JEWELCOUNTY; ++j) {
            jewelIndex = i + ',' + j;
            jewelType = this.createSingleJewel();
            this.jewels[jewelIndex] = jewelType;
        }
    }
    do {
        var triples = this.getTriples();
        if (!triples) break;
        this.eliminateTriples(triples);
        var reorganization = this.jewelsReorganize();
        var emptyFills = this.fillEmptyJewels();
    } while (this.getTriples());
}
Jewel.prototype.getJewels = function() {
    return this.jewels;
}
Jewel.prototype.clientMvSingleJewel = function(src, tar) {
    if (!this.verifyCoordinate(src)
            || !this.verifyCoordinate(tar) 
            || !this.checkNeighbor(src, tar)) return false;

    var srcIndex = src.x + ',' + src.y;
    var tarIndex = tar.x + ',' + tar.y;
    var srcType = this.jewels[srcIndex];
    var tarType = this.jewels[tarIndex];

    this.jewels[srcIndex] = tarType;
    this.jewels[tarIndex] = srcType;

    if (this.getTriples()) return true;

    this.jewels[srcIndex] = srcType;
    this.jewels[tarIndex] = tarType;

    return false;
}
Jewel.prototype.eliminateTriples = function(toEliminateJewels) {
    var length = toEliminateJewels.length;
    for (var i = 0; i < length; ++i) {
        delete this.jewels[toEliminateJewels[i]];
    }
}
Jewel.prototype.coordinateTriplesX = function(coordinateX, coordinateY) {
    var eliminateJewels = [];
    do {
        var curIndex = coordinateX + ',' + coordinateY;
        eliminateJewels.push(curIndex);
        ++coordinateX;
        var NextIndex = coordinateX + ',' + coordinateY;
        var curType = this.jewels[curIndex];
        var NextType = this.jewels[NextIndex];
    } while(curType === NextType);
    if (eliminateJewels.length  < 3) return false;
    return eliminateJewels;
}
Jewel.prototype.coordinateTriplesY = function(coordinateX, coordinateY) {
    var eliminateJewels = [];
    do {
        var curIndex = coordinateX + ',' + coordinateY;
        eliminateJewels.push(curIndex);
        ++coordinateY;
        var NextIndex = coordinateX + ',' + coordinateY;
        var curType = this.jewels[curIndex];
        var NextType = this.jewels[NextIndex];
    } while(curType === NextType);
    if (eliminateJewels.length  < 3) return false;
    return eliminateJewels;
}
Jewel.prototype.getTriples = function() {
    var toEliminateJewels = [];
    for (var index in this.jewels) {
        var indexXY = fc.getXY(index);
        var rowTripleJewels = this.coordinateTriplesX(indexXY.x, indexXY.y);
        var columnTripleJewels = this.coordinateTriplesY(indexXY.x, indexXY.y);
        if (rowTripleJewels) toEliminateJewels.concat(rowTripleJewels);
        if (columnTripleJewels) toEliminateJewels.concat(columnTripleJewels);
    }
    if (toEliminateJewels.length === 0) return false;
    return toEliminateJewels;
}
Jewel.prototype.jewelsReorganize = function() {
    var falls = [];
    for (var index in this.jewels) {
        if (!this.jewels[index] && this.jewels[index] != 0) continue;
        falls.push(this.doJewelFall(index));
    }
    return falls;
}
Jewel.prototype.doJewelFall = function(index) {
    var emptyCount = this.getBelowEmptyCount(index);
    if (!emptyCount) return false;
    var indexXY = fc.getXY(index);
    var fallToCoordinateY = indexXY.y - emptyCount;
    var fallToIndex = indexXY.x + ',' + fallToCoordinateY;
    this.jewels[fallToIndex] = this.jewels[index];
    delete this.jewels[index];
    var singleFall = {
        from : { 
            index : index
            , type : this.jewels[index]
        }
        , to : {
            index : fallToIndex
            , type : this.jewels[fallToIndex]
        }
    };
    return singleFall;
}
Jewel.prototype.getBelowEmptyCount = function(index) {
    var emptyCount = 0;
    var indexXY = fc.getXY(index);
    var coordinateY = indexXY.y;
    while (coordinateY < JEWELCOUNTY) {
        --coordinateY;
        var indexBelow = indexXY.x + ',' + coordinateY;
        if (this.jewels[indexBelow] || this.jewels[indexBelow] === 0) continue;
        ++emptyCount;
    }
    return emptyCount;
}
Jewel.prototype.fillEmptyJewels = function() {
    var filled = [];
    for (var index in this.jewels) {
        if (!this.isJewelEmpty()) continue;
        this.jewels[index] = this.createSingleJewel();
        var singleFilled = {
            index : this.jewels[index]
        };
        filled.push(singleFilled);
    }
    return filled;
}
Jewel.prototype.isJewelEmpty = function() {
    if (this.jewels[index] || this.jewels[index] === 0) return false;
    return true;
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
