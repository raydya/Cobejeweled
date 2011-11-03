var Event = function() {
    this.preSelectedGem = null;
    this.setEventListener();
}
Event.prototype.setEventListener = function() {
    var createRoom = document.getElementById('BejCreateRoom');
    var leaveRoom = document.getElementById('BejLeaveRoom');
    var setReady = document.getElementById('BejSetReady');
    var enterRoom = document.getElementById('BejEnterRoom');
    var startGame = document.getElementById('BejStartGame');
    var _this = this;

    createRoom.onclick = function() {
        _this.protocolCreateRoom();
    }

    leaveRoom.onclick = function() {
        _this.protocolLeaveRoom();
    }

    setReady.onclick = function() {
        _this.protocolSetReady();
    }

    enterRoom.onclick = function() {
        _this.protocolEnterRoom();
    }

    startGame.onclick = function() {
        _this.protocolStartGame();
    }

    document.onselectstart = function() {
        return false;
    }

    $('.BejBlocks').live('click', function() {
        _this.selectGem(this);
    });
}
Event.prototype.protocolCreateRoom = function() {
    var data = { protocol : 'createRoom', data : {} };
    ws.send(data);
}
Event.prototype.protocolLeaveRoom = function() {
    var data = { protocol : 'leaveRoom', data : {} };
    ws.send(data);
}
Event.prototype.protocolSetReady = function() {
    var data = { protocol : 'setReady', data : {} };
    ws.send(data);
}
Event.prototype.protocolEnterRoom = function() {
    var roomID = global.selectedRoom;
    var data = { protocol : 'enterRoom', data : { roomID : roomID } };
    ws.send(data);
}
Event.prototype.protocolStartGame = function() {
    var data = { protocol : 'startGame', data : {} };
    ws.send(data);
}
Event.prototype.protocolMoveGems = function(src, tar) {
    var data = { protocol : 'moveGems', data : { s : src, t : tar } };
    ws.send(data);
}
Event.prototype.selectGem = function(gem) {
    if (!global.startGame) return;
    $('.BejBlocks').removeClass('selectedGem');
    $(gem).addClass('selectedGem');
    $(this.preSelectedGem).addClass('selectedGem');
    if (!this.preSelectedGem) {
        this.preSelectedGem = gem;
        return;
    }
    var pre = this.preSelectedGem.title.split(',');
    var cur = gem.title.split(',');
    var src = { x : pre[0], y : pre[1] };
    var tar = { x : cur[0], y : cur[1] };
    if (!this.checkNeighbour(src, tar)) return;
    this.protocolMoveGems(src, tar);
    this.preSelectedGem = gem;
}
Event.prototype.checkNeighbour = function(src, tar) {
    var absX, absY;
    absX = Math.abs(src.x - tar.x);
    absY = Math.abs(src.y - tar.y);
    return (absX + absY) == 1 ? true : false;
}
