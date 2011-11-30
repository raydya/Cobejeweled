var Score = function() {
    /*  roomScoreBoard = {
     *      roomID : roomScore
     *  }
     * */
    this.roomScoreBoard = {};
    /*  userScoreBoard = {
     *      roomID : { 
     *          userID1 : userScore1
     *          , userID2 : userScore2
     *          ...
     *      }
     *  }
     * */
    this.userScoreBoard = {};
}
Score.prototype.initRoom = function(roomID) {
    if (this.roomScoreBoard[roomID] != undefined) return ErrorInfo.retError('create room Score Failed : roomID exists');
    this.roomScoreBoard[roomID] = 0;
    if (this.userScoreBoard[roomID] != undefined) return ErrorInfo.retError('create User Score Failed : user Board roomID exists');
    this.userScoreBoard[roomID] = {};
    return true;
}
Score.prototype.initRoomUsers = function(roomID) {
    var inRoomUsers = Rooms.rooms[roomID].inRoom;
    var length = inRoomUsers.length;
    for (var i = 0; i < length; ++i) {
        var cID = inRoomUsers[i];
        this.initUser(roomID, cID);
    }
}
Score.prototype.initUser = function(roomID, cID) {
    if (this.userScoreBoard[roomID] === undefined) return ErrorInfo.retError('create User Score Failed : user Board roomID not exists');
    this.userScoreBoard[roomID][cID] = 0;
    return true;
}
Score.prototype.setRoomScore = function(score, roomID) {
    if (this.roomScoreBoard[roomID] === undefined) return ErrorInfo.retError('set User Score Failed : room Board not exists');
    this.roomScoreBoard[roomID] += score;
    return this.getRoomScorePoints(roomID);
}
Score.prototype.setUserScore = function(score, cID) {
    var roomID = Users.getcIDRoomID(cID);
    if (!roomID && roomID != 0) return ErrorInfo.retError('set User Score Failed : user has no roomID');
    if (this.userScoreBoard[roomID] === undefined) return ErrorInfo.retError('set User Score Failed : user Board roomID not exists');
    this.userScoreBoard[roomID][cID] += score;
    return this.getUserScorePoints(roomID, cID);
}
Score.prototype.resetBoard = function(roomID) {
    this.resetRoomBoard(roomID);
    for (var cID in this.userScoreBoard[roomID]) {
        this.resetUserBoard(roomID, cID);
    }
}
Score.prototype.resetRoomBoard = function(roomID) {
    if (this.roomScoreBoard[roomID] === undefined) return ErrorInfo.retError('reset room Score Failed : roomID not exists');
    this.roomScoreBoard[roomID] = 0;
    return true;
}
Score.prototype.resetUserBoard = function(roomID, cID) {
    if (this.userScoreBoard[roomID] === undefined) return ErrorInfo.retError('reset user Score Failed : roomID not exists');
    if (this.userScoreBoard[roomID][cID] === undefined) return ErrorInfo.retError('reset user Score Failed : cID not exists');
    this.userScoreBoard[roomID][cID] = 0;
    return true;
}
Score.prototype.destroyRoomBoard = function(roomID) {
    if (this.roomScoreBoard[roomID] === undefined) return ErrorInfo.retError('destroy room Score Failed : roomID not exists');
    delete this.roomScoreBoard[roomID];
    for (var cID in this.userScoreBoard[roomID]) {
        this.destroyUserBoard(cID);
    }
    return true;
}
Score.prototype.destroyUserBoard = function(cID) {
    var roomID = Users.getcIDRoomID(cID);
    if (!roomID && roomID != 0) return ErrorInfo.retError('destroy User Score Failed : user has no roomID');
    if (this.userScoreBoard[roomID] === undefined) return ErrorInfo.retError('destroy User Score Failed : user Board roomID not exists');
    delete this.userScoreBoard[roomID][cID];
    var noneRet = false;
    for (var x in this.userScoreBoard[roomID]) {
        noneRet = true;
    }
    if (!noneRet) delete this.userScoreBoard[roomID];
    return true;
}
Score.prototype.getRoomScorePoints = function(roomID) {
    return this.roomScoreBoard[roomID];
}
Score.prototype.getUserScorePoints = function(roomID, cID) {
    return this.userScoreBoard[roomID][cID];
}

global.scoreBoard = new Score;
