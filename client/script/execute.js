var Execute = function() {
    global.startGame = false;
};
Execute.prototype.roomList = function(data) {
    front.createRoom(data);
};
Execute.prototype.createRoom = function(data) {
};
Execute.prototype.enterRoom = function(data) {
    front.enterRoom(data);
};
Execute.prototype.leaveRoom = function(data) {
    global.startGame = false;
    front.leaveRoom(data);
};
Execute.prototype.closeRoom = function(data) {
};
Execute.prototype.setReady = function(data) {
    front.setReady(data);
};
Execute.prototype.newLogin = function(data) {
    if (global.cID) return;
    global.cID = data.cID;
    front.newLogin(data);
};
Execute.prototype.disconnect = function(data) {
    
};
Execute.prototype.ownerChange = function(data) {
    front.ownerChange(data);
};
Execute.prototype.setReady = function(data) {
    front.setReady(data);
};
Execute.prototype.startGame = function(data) {
    global.startGame = true;
    frame.start(data.data.jewels);
    //front.startGame(data);
};

// add by ila
Execute.prototype.moveGems = function(data) {
    console.log(data);
};
Execute.prototype.eliminateGems = function(data) {
    data.data.toEliminate.forEach(jewel.eliminate);
};
Execute.prototype.reorganizeGems = function(data) {
    data.data.toReorganize.forEach(jewel.reorganize);
};
