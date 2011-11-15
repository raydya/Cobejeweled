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
};

// add by ila
Execute.prototype.moveGems = function(data) {
    var action = new Action(data);
    queue.add(action);
};
Execute.prototype.eliminateGems = function(data) {
//    data.data.toEliminate.forEach(frame.eliminate);
};
Execute.prototype.reorganizeGems = function(data) {
//    data.data.toReorganize.forEach(frame.reorganize);
};
Execute.prototype.fillGems = function(data) {
//    data.data.toFill.forEach(frame.fill);
};
Execute.prototype.gemsBoard = function(data) {
    var board = data.data.board;
    for (var i in board) {
        frame.verify(i, board[i]);
    }
};
