var userList = function() {
    this.onlineUser = {};
    this.msgSenderCID = null;
}
userList.prototype.newConnection = function(client) {
    //TODO connection verify player name exists
    var cID = fc.guid();
    this.onlineUser[cID] = {
        cID : cID
        , roomID: 890604
        , client : client
        , lastActiveTime : fc.getTimestamp()
    }
    return cID;
}
userList.prototype.messageSender = function(client) {
    var cID = this.getClientCID(client);
    this.msgSenderCID = cID;
    return cID;
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
userList.prototype.getMsgSenderRoomID = function() {
    if (!this.onlineUser[this.msgSenderCID]) return false;
    return this.onlineUser[this.msgSenderCID].roomID;
}
userList.prototype.responseSelf = function(output) {
    var self = this.users.getClient(this.users.msgSenderCID);
    if (self) self.sendUTF(fc.encode(output));
}
userList.prototype.responseRoom = function(output) {
    var roomID = this.users.getRoomID(this.users.msgSenderCID);
    // TODO 
    // LOOP EFFICIENT TOO LOW
    for (var cID in this.users.onlineUser) {
        if (this.users.onlineUser[cID].roomID === roomID) this.users.onlineUser[cID].client.sendUTF(fc.encode(output));
    }
}
userList.prototype.responseBroadCast = function(output) {
    for (var cID in this.users.onlineUser) {
        this.users.onlineUser[cID].client.sendUTF(fc.encode(output));
    }
} 

global.Users = new userList;
