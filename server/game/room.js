var Room = function() {
    this.rooms = [];
}
Room.prototype.addRoom = function(cID) {
    if (Users.onlineUser[cID].roomID) return ErrorInfo.retError(cID + ' already in room, cannot create a new one!');
    var roomID = this.rooms.length;
    var data = {
        roomID : roomID
        , roomName : 'DefaultName'
        , inRoom : []
        , status : 0    // 0 : default, 1 : all ready, 2 : playing
    };
    this.rooms.push(data);
    Users.setRoomOwner(cID);
    return roomID;
}
Room.prototype.leaveRoom = function(cID, roomID) {
    var inRoom = this.rooms[roomID].inRoom;
    var length = inRoom.length;
    if (length === 0) return false;
    for (var i = 0; i < length; ++i) {
        if (inRoom[i] === cID) {
            delete this.rooms[roomID].inRoom[i];
            Users.onlineUser[cID].roomID = null;
            Users.setUserStatusToInHall(cID);
            Users.resetRoomPosition(cID);
            var roomPosition = i;
            break;
        }
    }
    return roomPosition;
}
Room.prototype.enterRoom = function(cID, roomID) {
    if (!this.inRoomCID) return false;
    var roomPosition = this.rooms[roomID].inRoom.push(cID);
    Users.onlineUser[cID].roomID = roomID;
    Users.setUserStatusToWait(cID);
    Users.setRoomPosition(cID, roomPosition);
    return roomPosition;
}
Room.prototype.inRoomCID = function(cID) {
    var inRoom = this.rooms[roomID].inRoom;
    var length = inRoom.length;
    for (var i = 0; i < length; ++i) {
        if (inRoom[i] === cID) {
            return false;
        }
    }
    return true;
}
Room.prototype.ifLastLeave = function(roomID) {
    var inRoomNum = this.rooms[roomID].inRoom;
    if (inRoomNum === 0) return true;
    return false;
}
Room.prototype.closeRoom = function(roomID) {
    delete this.rooms[roomID];
}
Room.prototype.fetchRoomInfo = function(roomID) {
    return this.rooms[roomID];
}
Room.prototype.ifInRoomAllReady = function(roomID) {
    var inRoom = this.rooms[roomID].inRoom;
    var length = inRoom.length;
    var cID;
    for (var i = 0; i < length; ++i) {
        cID = inRoom[i];
        if (Users.onlineUser[cID].status != 3) return false;
    }
    this.setRoomAllReady(roomID);
    return true;
}
Room.prototype.setRoomAllReady = function(roomID) {
    this.rooms[roomID].status = 1;
}
Room.prototype.setRoomPlaying = function(roomID) {
    this.rooms[roomID].status = 2;
}
Room.prototype.getAllRooms = function() {
    return this.rooms;
}

global.Rooms = new Room;
