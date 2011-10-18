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
    if (roomID === false) return;
    var roomPosition = Rooms.enterRoom(iData.cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var data = {
        roomID : roomID
        , room : roomInfo
    };
    ioExcute.addOutPutData(iData.cID, 'createRoom', 'broadCast', data);
    var user = Users.fetchUserInfo(iData.cID);
    delete user.client;
    data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(iData.cID, 'enterRoom', 'broadCast', data);
    var rooms = Rooms.getAllRooms();
    data = {
        rooms : rooms
    };
    ioExcute.addOutPutData(iData.cID, 'roomList', 'broadCast', data);
    ioExcute.response();
}
Proc.prototype.enterRoom = function() {
    var iData = ioExcute.iData;
    var roomID = iData.data.roomID;
    var roomPosition = Rooms.enterRoom(iData.cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(iData.cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(iData.cID, 'enterRoom', 'broadCast', data);
    ioExcute.response();
}
Proc.prototype.leaveRoom = function() {
    var iData = ioExcute.iData;
    var roomID = Users.getcIDRoomID(iData.cID);
    if (roomID === null) return;
    var roomPosition = Rooms.leaveRoom(iData.cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(iData.cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(iData.cID, 'leaveRoom', 'broadCast', data);
    
    if (Rooms.ifLastLeave(roomID)) {
        delete data.room;
        Rooms.closeRoom(roomID);
        ioExcute.addOutPutData(iData.cID, 'closeRoom', 'broadCast', data);
        var rooms = Rooms.getAllRooms();
        data = {
            rooms : rooms
        };
        ioExcute.addOutPutData(iData.cID, 'roomList', 'broadCast', data);
    } else if (Users.ifOwnerLeave(iData.cID)) {
        var newOwnerID = Rooms.rooms[roomID].inRoom[0];
        Users.cancelRoomOwner(iData.cID);
        Users.setRoomOwner(newOwnerID);

        data = {
            newOwnerID : newOwnerID
            , roomID : roomID
        };

        ioExcute.addOutPutData(iData.cID, 'ownerChange', 'room', data);
    }

    ioExcute.response();
}
Proc.prototype.setReady = function() {
    var iData = ioExcute.iData;
    var roomID = Users.getcIDRoomID(iData.cID);
    var readyRet = Users.setUserStatusToReady(iData.cID);
    if (!readyRet) return;
    var allReady = Rooms.ifInRoomAllReady(roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(iData.cID);
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
    var user = Users.fetchUserInfo(iData.cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
        , allReady : allReady
    };

    ioExcute.addOutPutData(iData.cID, 'cancelReady', 'room', data);
    ioExcute.response();
}
Proc.prototype.roomList = function() {
    var iData = ioExcute.iData;
    var rooms = Rooms.getAllRooms();
    var data = {
        rooms : rooms
    };
    ioExcute.addOutPutData(iData.cID, 'roomList', 'self', data);
    ioExcute.response();
}
Proc.prototype.moveGems = function() {
    var iData = ioExcute.iData;
    var eliminates = CoBejeweled.clientMvSingleJewel(iData.s, iData.t);
    var data = {
        eliminates : eliminates // false or objects
    };
    ioExcute.addOutPutData(iData.cID, 'moveGems', 'room', data);
    ioExcute.response();
}

var act = new Proc;

global.PROCESS = {
    createRoom : act.createRoom     // iData : { protocol : 'createRoom', data : {} }
    , enterRoom : act.enterRoom     // iData : { protocol : 'enterRoom', data : { roomID : roomID } }
    , leaveRoom : act.leaveRoom     // iData : { protocol : 'leaveRoom', data : {} }
    , setReady : act.setReady       // iData : { protocol : 'setReady', data : {} }
    , cancelReady : act.cancelReady // iData : { protocol : 'cancelReady', data : {} }
    , startGame : act.startGame     // iData : { protocol : 'startGame', data : {} }
    , roomList : act.roomList       // iData : { protocol : 'roomList', data : {} }
    , moveGems : act.moveGems       // iData : { protocol : 'moveGems', data : { s : source, t : target } }
}
