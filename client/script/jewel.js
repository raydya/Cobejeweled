var Jewel = function() {
    this.blackBoard = $('#BejField');
    this.defineJewel = {
        0 : 'orange'
        , 1 : 'red'
        , 2 : 'white'
        , 3 : 'yellow'
        , 4 : 'blue'
        , 5 : 'purple'
        , 6 : 'green'
        , 7 : 'grey'
    };
}
Jewel.prototype.createBlankBoard = function() {
    var x = 13;
    var y = 8;
    for (var i = 0; i < x; ++i) {
        for (var j = 0; j < y; ++j) {
            var index = i + ','+ j;
            this.createSingleJewelBlock(index);
        }
    }
}
Jewel.prototype.createSingleJewelBlock = function(index) {
    var JewelBlock = document.createElement('div');
    JewelBlock.id = index;
    JewelBlock.title = index;
    JewelBlock.className = "BejBlocks inline";
    this.blackBoard.append(JewelBlock);
}
Jewel.prototype.fillBlankBoard = function(jewels) {
    for (var index in jewels) {
        var jewelType = jewels[index];
        var className = this.defineJewel[jewelType];
        var target = document.getElementById(index);
        $(target).addClass(className);
    }
}
