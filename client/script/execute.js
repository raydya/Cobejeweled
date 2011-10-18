var Execute = function() {
    
}
Execute.prototype.roomList = function(data) {
    front.createRoom(data);
}
Execute.prototype.createRoom = function(data) {
}
Execute.prototype.enterRoom = function(data) {
    front.enterRoom(data);
}
Execute.prototype.leaveRoom = function(data) {
}
Execute.prototype.closeRoom = function(data) {
}
Execute.prototype.setReady = function(data) {
    front.setReady(data);
}
Execute.prototype.newLogin = function(data) {
    global.cID = data.cID;
}
