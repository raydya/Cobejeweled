var Event = function() {
    this.setEventListener();
}
Event.prototype.setEventListener = function() {
    var createRoom = document.getElementById('BejCreateRoom');
    var leaveRoom = document.getElementById('BejLeaveRoom');
    var setReady = document.getElementById('BejSetReady');
    var enterRoom = document.getElementById('BejEnterRoom');
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
}
Event.prototype.protocolCreateRoom = function() {
    var data = { protocol : 'createRoom' };
    ws.send(data);
}
Event.prototype.protocolLeaveRoom = function() {
    var data = { protocol : 'leaveRoom' };
    ws.send(data);
}
Event.prototype.protocolSetReady = function() {
    var data = { protocol : 'setReady' };
    ws.send(data);
}
Event.prototype.protocolEnterRoom = function() {
    var roomID = global.selectedRoom;
    var data = { protocol : 'enterRoom', data : { roomID : roomID } };
    ws.send(data);
}
