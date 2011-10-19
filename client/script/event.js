var Event = function() {
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
