var Event = function() {
    this.setEventListener();
}
Event.prototype.setEventListener = function() {
    var createRoom = document.getElementById('BejCreateRoom');

    createRoom.onclick = function() {
        var data = { protocol : 'createRoom' };
        ws.send(data);
    }
}
