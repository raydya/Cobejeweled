var userList = function() {
    this.onlineUser = {};
    this.msgSenderCID = null;
}
userList.prototype.newConnection = function(client) {
    //TODO connection verify player name exists
    var cID = fc.guid();
    this.onlineUser[cID] = {
        cID : cID
        , roomID: null    // null or Number
        , roomPosition : null   // null or Number
        , client : client
        , status : 1   // 1 : in hall, 2 : in room waiting, 3 : ready, 4 : gaming
        , roomOwner : false
        , lastActiveTime : fc.getTimestamp()
    }
    return cID;
}
userList.prototype.destroyConnection = function(cID) {
    delete this.onlineUser[cID];
}
userList.prototype.setRoomOwner = function(cID) {
    this.onlineUser[cID].roomOwner = true;
}
userList.prototype.cancelRoomOwner = function(cID) {
    this.onlineUser[cID].roomOwner = false;
}
userList.prototype.getClientCID = function(client) {
    for (var cID in this.onlineUser) {
        if (this.onlineUser[cID].client === client) return cID;
    }
    return false;
}
userList.prototype.getClient = function(cID) {
    return this.onlineUser[cID].client;
}
userList.prototype.getRoomID = function(cID) {
    if (!this.onlineUser[cID]) return false;
    return this.onlineUser[cID].roomID;
}
userList.prototype.getcIDRoomID = function(cID) {
    if (!this.onlineUser[cID]) return false;
    return this.onlineUser[cID].roomID;
}
userList.prototype.fetchUserInfo = function(cID) {
    return {
        cID : this.onlineUser[cID].cID
        , roomID: this.onlineUser[cID].roomID
        , roomPosition : this.onlineUser[cID].roomPosition
        , status : this.onlineUser[cID].status
        , roomOwner : this.onlineUser[cID].roomOwner
        , lastActiveTime : this.onlineUser[cID].lastActiveTime
    };
}
userList.prototype.setUserStatusToInHall = function(cID) {
    this.onlineUser[cID].status = 1;
}
userList.prototype.setUserStatusToWait = function(cID) {
    this.onlineUser[cID].status = 2;
}
userList.prototype.setUserStatusToReady = function(cID) {
    if (this.onlineUser[cID].status != 2) return ErrorInfo.retError('user Not in Room...');
    this.onlineUser[cID].status = 3;
}
userList.prototype.setUserStatusToGaming = function(cID) {
    if (this.onlineUser[cID].status != 3) return ErrorInfo.retError('user Not Ready...');
    this.onlineUser[cID].status = 4;
}
userList.prototype.setRoomPosition = function(cID, roomPosition) {
    this.onlineUser[cID].roomPosition = roomPosition;
}
userList.prototype.resetRoomPosition = function(cID) {
    this.onlineUser[cID].roomPosition = null;
}
userList.prototype.ifOwnerLeave = function(cID) {
    if (!this.onlineUser[cID].roomOwner) return false;
    return true;
}

global.Users = new userList;
