var Proc = function() {}
Proc.prototype.startGame = function() {
    var iData = ioExcute.iData;
    var roomID = Users.getcIDRoomID(iData.cID);
    if (!roomID) return ErrorInfo.retError('roomID not exists...');
    var allReady = Rooms.ifInRoomAllReady(roomID) && (Rooms.rooms[roomID].status === 1);
    if (!allReady) return ErrorInfo.retError('users in Room are not all ready...');
    CoBejeweled.initFillingUp();
    var jewels = CoBejeweled.getJewels();
    var data = {
        roomID : roomID
        , jewels : jewels
    };
    ioExcute.addOutPutData(iData.cID, 'startGame', 'room', data);
    ioExcute.response();
}
Proc.prototype.createRoom = function() {
    var iData = ioExcute.iData;
    var roomID = Rooms.addRoom(iData.cID);
    var roomPosition = Rooms.enterRoom(iData.cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var data = {
        roomID : roomID
        , room : roomInfo
    };
    ioExcute.addOutPutData(iData.cID, 'createRoom', 'broadCast', data);
    var user = Users.fetchUserInfo(cID);
    data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(iData.cID, 'enterRoom', 'broadCast', data);
    ioExcute.response();
}
Proc.prototype.enterRoom = function() {
    var iData = ioExcute.iData;
    var roomID = iData.data.roomID;
    var roomPosition = Rooms.enterRoom(iData.cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(iData.cID, 'enterRoom', 'broadCast', data);
    ioExcute.reponse();
}
Proc.prototype.leaveRoom = function() {
    var iData = ioExcute.iData;
    var roomID = Users.getcIDRoomID(iData.cID);
    var roomPosition = Rooms.leaveRoom(iData.cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(iData.cID, 'leaveRoom', 'broadCast', data);
    
    if (Rooms.ifLastLeave()) {
        delete data.room;
        Rooms.closeRoom();
        ioExcute.addOutPutData(iData.cID, 'closeRoom', 'broadCast', data);
    } else if (Users.ifOwnerLeave(cID)) {
        var newOwnerID = Rooms.rooms[roomID].inRoom[0];
        Users.cancelRoomOwner(cID);
        Users.setRoomOwner(newOwnerID);

        data = {
            newOwnerID : newOwnerID
            , roomID : roomID
        };

        ioExcute.addOutPutData(iData.cID, 'ownerChange', 'room', data);
    }

    ioExcute.reponse();
}
Proc.prototype.setReady = function() {
    var iData = ioExcute.iData;
    var roomID = Users.getcIDRoomID(iData.cID);
    Users.setUserStatusToReady(iData.cID);
    var allReady = Rooms.ifInRoomAllReady(roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
        , allReady : allReady
    };

    ioExcute.addOutPutData(iData.cID, 'setReady', 'room', data);
    ioExcute.response();
}
Proc.prototype.cancelReady = function() {
    var iData = ioExcute.iData;
    var roomID = Users.getcIDRoomID(iData.cID);
    Users.setUserStatusToWait(iData.cID);
    var allReady = Rooms.ifInRoomAllReady(roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
        , allReady : allReady
    };

    ioExcute.addOutPutData(iData.cID, 'cancelReady', 'room', data);
    ioExcute.response();
}

var act = new Proc;

global.PROCESS = {
    createRoom : act.createRoom
    , enterRoom : act.enterRoom
    , leaveRoom : act.leaveRoom
    , setReady : act.setReady
    , cancelReady : act.cancelReady
    , startGame : act.startGame
}
