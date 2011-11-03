var JEWELCOUNTX = 8;
var JEWELCOUNTY = 13;

var Jewel = function() {
    this.jewels = {};
    /*
     *  Gem Type : 
     *  0 : 'orange'
     *  1 : 'red'
     *  2 : 'white'
     *  3 : 'yellow'
     *  4 : 'blue'
     *  5 : 'purple'
     *  6 : 'green'
     *  7 : 'grey'
     *
     *  Effect Type :
     *  1 : 'explode'
     *  2 : 'cross'
     *  3 : 'sameClear'
     *
     */
    this.effects = {
        1 : 'doEffectExplode'
        , 2 : 'doEffectCross'
        , 3 : 'doEffectSameClear'
    };
}
Jewel.prototype.initFillingUp = function() {
    var jewelIndex, jewelType;
    for (var i = 0; i < JEWELCOUNTY; ++i) {
        for (var j = 0; j < JEWELCOUNTX; ++j) {
            jewelIndex = i + ',' + j;
            jewelType = this.createSingleJewel();
            this.jewels[jewelIndex] = { type : jewelType, effect : null };
        }
    }
    while (true) {
        var triples = this.getTriples();
        if (!triples) break;
        this.eliminateTriples(triples);
        this.jewelsReorganize();
        this.fillEmptyJewels();
    }
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
    var srcType = this.jewels[srcIndex].type;
    var tarType = this.jewels[tarIndex].type;

    this.jewels[srcIndex].type = tarType;
    this.jewels[tarIndex].type = srcType;

    if (this.getTriples()) return true;

    this.jewels[srcIndex].type = srcType;
    this.jewels[tarIndex].type = tarType;

    return false;
}
Jewel.prototype.eliminateTriples = function(toEliminateJewels) {
    toEliminateJewels = this.addEffectCross(toEliminateJewels);
    var length = toEliminateJewels.length;
    for (var i = 0; i < length; ++i) {
        if (!this.jewels[toEliminateJewels[i]]) continue;
        delete this.jewels[toEliminateJewels[i]].type;
        if (!this.jewels[toEliminateJewels[i]].effect) continue;
        var funcName = this.effects[this.jewels[toEliminateJewels[i]].effect];
        // call function
        this[funcName](toEliminateJewels[i]);
        //this.effects[this.jewels[toEliminateJewels[i]].effect](toEliminateJewels[i]);
        delete this.jewels[toEliminateJewels[i]].effect;
    }
}
Jewel.prototype.coordinateTriplesX = function(coordinateX, coordinateY) {
    var eliminateJewels = [];
    do {
        var curIndex = coordinateX + ',' + coordinateY;
        eliminateJewels.push(curIndex);
        ++coordinateX;
        var NextIndex = coordinateX + ',' + coordinateY;
        if (!this.jewels[NextIndex]) break;
        var curType = this.jewels[curIndex].type;
        var NextType = this.jewels[NextIndex].type;
    } while(curType === NextType);
    if (eliminateJewels.length < 3) return false;
    if (eliminateJewels.length === 4) eliminateJewels = this.addEffectExplode(eliminateJewels);
    if (eliminateJewels.length >= 5) eliminateJewels = this.addEffectSameClear(eliminateJewels);
    return eliminateJewels;
}
Jewel.prototype.coordinateTriplesY = function(coordinateX, coordinateY) {
    var eliminateJewels = [];
    do {
        var curIndex = coordinateX + ',' + coordinateY;
        eliminateJewels.push(curIndex);
        ++coordinateY;
        var NextIndex = coordinateX + ',' + coordinateY;
        if (!this.jewels[NextIndex]) break;
        var curType = this.jewels[curIndex].type;
        var NextType = this.jewels[NextIndex].type;
    } while(curType === NextType);
    if (eliminateJewels.length < 3) return false;
    if (eliminateJewels.length === 4) eliminateJewels = this.addEffectExplode(eliminateJewels);
    if (eliminateJewels.length >= 5) eliminateJewels = this.addEffectSameClear(eliminateJewels);
    return eliminateJewels;
}
Jewel.prototype.getTriples = function() {
    var toEliminateJewels = [];
    for (var index in this.jewels) {
        var indexXY = fc.getXY(index);
        var rowTripleJewels = this.coordinateTriplesX(indexXY.x, indexXY.y);
        var columnTripleJewels = this.coordinateTriplesY(indexXY.x, indexXY.y);
        if (rowTripleJewels) toEliminateJewels = toEliminateJewels.concat(rowTripleJewels);
        if (columnTripleJewels) toEliminateJewels = toEliminateJewels.concat(columnTripleJewels);
    }
    if (toEliminateJewels.length === 0) return false;
    return toEliminateJewels;
}
Jewel.prototype.jewelsReorganize = function() {
    var falls = [];
    for (var index in this.jewels) {
        if (!this.jewels[index].type && this.jewels[index].type != 0) continue;
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
    this.jewels[fallToIndex].type = this.jewels[index].type;
    delete this.jewels[index].type;
    var singleFall = {
        from : { 
            index : index
            , type : this.jewels[index].type
            , effect : this.jewels[index].effect
        }
        , to : {
            index : fallToIndex
            , type : this.jewels[fallToIndex].type
            , effect : this.jewels[fallToIndex].effect
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
        if (!this.jewels[indexBelow]) break;
        if (this.jewels[indexBelow].type || this.jewels[indexBelow].type === 0) continue;
        ++emptyCount;
    }
    return emptyCount;
}
Jewel.prototype.fillEmptyJewels = function() {
    var filled = [];
    for (var index in this.jewels) {
        if (!this.isJewelEmpty(index)) continue;
        this.jewels[index].type = this.createSingleJewel();
        var singleFilled = {
            index : index
            , type : this.jewels[index].type
            , effect : this.jewels[index].effect
        };
        filled.push(singleFilled);
    }
    return filled;
}
Jewel.prototype.isJewelEmpty = function(index) {
    if (this.jewels[index].type || this.jewels[index].type === 0) return false;
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
Jewel.prototype.addEffectExplode = function(toEliminateJewels) {
    if (toEliminateJewels.length != 4) return toEliminateJewels;
    var constGenerateIndex = 1;
    var index = toEliminateJewels[constGenerateIndex];
    if (this.jewels[index].effect) return toEliminateJewels;  // TODO index effect exist fix
    this.jewels[index].effect = 1;
    delete toEliminateJewels[constGenerateIndex];
    return toEliminateJewels;
}
Jewel.prototype.addEffectCross = function(toEliminateJewels) {
    var crossPoint = fc.hasRepeat(toEliminateJewels);
    for (var x in crossPoint) {
        var index = crossPoint[x];
        if (this.jewels[index].effect) continue;    // TODO
        this.jewels[index].effect = 2;
        delete toEliminateJewels[x];
    }
    return toEliminateJewels;
}
Jewel.prototype.addEffectSameClear = function(toEliminateJewels) {
    if (toEliminateJewels.length < 5) return toEliminateJewels;
    var constGenerateIndex = 2;
    var index = toEliminateJewels[constGenerateIndex];
    if (this.jewels[index].effect) return toEliminateJewels;  // TODO
    this.jewels[index].effect = 3;
    delete toEliminateJewels[constGenerateIndex];
    return toEliminateJewels;
}
Jewel.prototype.doEffectExplode = function(index) {
    var box = fc.getNineBlockBox(index);
    for (var x in box) {
        if (!this.jewels[box[x]]) delete box[x];
    }
    return box;
}
Jewel.prototype.doEffectCross = function(index) {
    var crossPoint = fc.getXY(index);
    var cross = [];
    for (var gem in this.jewels) {
        var gemXY = fc.getXY(gem);
        if (crossPoint.x === gemXY.x || crossPoint.y === gemXY.y) cross.push(gem);
    }
    return cross;
}
Jewel.prototype.doEffectSameClear = function(index) {
    var type = this.jewels[index].type;
    var clear = [];
    for (var gem in this.jewels) {
        if (this.jewels[gem].type === type) clear.push(gem);
    }
    return clear;
}

exports.create = function() {
    return new Jewel();
}
