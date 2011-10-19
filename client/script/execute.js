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
    front.leaveRoom(data);
}
Execute.prototype.closeRoom = function(data) {
}
Execute.prototype.setReady = function(data) {
    front.setReady(data);
}
Execute.prototype.newLogin = function(data) {
    if (global.cID) return;
    global.cID = data.cID;
    front.newLogin(data);
}
Execute.prototype.disconnect = function(data) {
    
}
Execute.prototype.ownerChange = function(data) {
    front.ownerChange(data);
}
Execute.prototype.setReady = function(data) {
    front.setReady(data);
}
Execute.prototype.startGame = function(data) {
    front.startGame(data);
}
