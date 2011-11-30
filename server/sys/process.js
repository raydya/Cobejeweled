var Proc = function() {}
Proc.prototype.startGame = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var isOwner = Users.isRoomOwner(cID);
    if (!isOwner) return ErrorInfo.retError('not Room Master...');
    var roomID = Users.getcIDRoomID(cID);
    if (!roomID && roomID != 0) return ErrorInfo.retError('roomID not exists...');
    var allReady = Rooms.ifInRoomAllReady(roomID) && (Rooms.rooms[roomID].status === 1);
    if (!allReady) return ErrorInfo.retError('users in Room are not all ready...');
    var filledUp = Rooms.rooms[roomID].jewel.initFillingUp();
    if (filledUp) var jewels = Rooms.rooms[roomID].jewel.getJewels();
    // SCORE START
    scoreBoard.initRoom(roomID);
    data = {
        roomID : roomID
        , modScore : 0
        , score : 0
    };
    ioExcute.addOutPutData(cID, 'getRoomScore', 'room', data);
    scoreBoard.initRoomUsers(roomID);
    var inRoomUsers = Rooms.rooms[roomID].inRoom;
    for (var i = 0; i < inRoomUsers.length; ++i) {
        data = {
            cID : inRoomUsers[i]
            , modScore : 0
            , score : 0
        };
        ioExcute.addOutPutData(cID, 'getUserScore', 'room', data);
    }
    // SCORE END
    var data = {
        roomID : roomID
        , jewels : jewels
    };
    ioExcute.addOutPutData(cID, 'startGame', 'room', data);
    ioExcute.response();
}
Proc.prototype.createRoom = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var roomID = Rooms.addRoom(cID);
    if (roomID === false) return;
    var roomPosition = Rooms.enterRoom(cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var data = {
        roomID : roomID
        , room : roomInfo
    };
    ioExcute.addOutPutData(cID, 'createRoom', 'broadCast', data);
    var user = Users.fetchUserInfo(cID);
    delete user.client;
    data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(cID, 'enterRoom', 'broadCast', data);
    data = {
        ownerID : cID
        , roomID : roomID
    };
    ioExcute.addOutPutData(cID, 'ownerChange', 'room', data);
    var rooms = Rooms.getAllRooms();
    data = {
        rooms : rooms
    };
    ioExcute.addOutPutData(cID, 'roomList', 'broadCast', data);
    ioExcute.response();
}
Proc.prototype.enterRoom = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var roomID = iData.data.roomID;
    var roomPosition = Rooms.enterRoom(cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(cID, 'enterRoom', 'broadCast', data);
    ioExcute.response();
}
Proc.prototype.leaveRoom = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var roomID = Users.getcIDRoomID(cID);
    if (roomID === null) return ErrorInfo.retError('Leave Room Failed : no roomID');
    var roomPosition = Rooms.leaveRoom(cID, roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    if (!user) return ErrorInfo.retError('Leave Room Failed : user not exists');
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
    };
    ioExcute.addOutPutData(cID, 'leaveRoom', 'broadCast', data);

    // SCORE START
    scoreBoard.destroyUserBoard(cID);
    // SCORE END
   
    if (Rooms.ifLastLeave(roomID)) {
        delete data.room;
        Rooms.closeRoom(roomID);
        ioExcute.addOutPutData(cID, 'closeRoom', 'broadCast', data);
        var rooms = Rooms.getAllRooms();
        data = {
            rooms : rooms
        };
        ioExcute.addOutPutData(cID, 'roomList', 'broadCast', data);
        // SCORE START
        scoreBoard.destroyRoomBoard(roomID);
        // SCORE END
    } else if (Users.ifOwnerLeave(cID)) {
        var newOwnerID = Rooms.recycleNewOwnerID(roomID);
        if (!newOwnerID) return;
        Users.cancelRoomOwner(cID);
        Users.setRoomOwner(newOwnerID);
        data = {
            ownerID : newOwnerID
            , roomID : roomID
        };
        ioExcute.addOutPutData(cID, 'ownerChange', 'room', data);
    }
    ioExcute.response();
}
Proc.prototype.setReady = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var roomID = Users.getcIDRoomID(cID);
    var readyRet = Users.setUserStatusToReady(cID);
    if (!readyRet) return;
    var allReady = Rooms.ifInRoomAllReady(roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
        , allReady : allReady
    };
    ioExcute.addOutPutData(cID, 'setReady', 'room', data);
    ioExcute.response();
}
Proc.prototype.cancelReady = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var roomID = Users.getcIDRoomID(cID);
    Users.setUserStatusToWait(cID);
    var allReady = Rooms.ifInRoomAllReady(roomID);
    var roomInfo = Rooms.fetchRoomInfo(roomID);
    var user = Users.fetchUserInfo(cID);
    var data = {
        roomID : roomID
        , room : roomInfo
        , user : user
        , allReady : allReady
    };
    ioExcute.addOutPutData(cID, 'cancelReady', 'room', data);
    ioExcute.response();
}
Proc.prototype.roomList = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var rooms = Rooms.getAllRooms();
    var data = {
        rooms : rooms
    };
    ioExcute.addOutPutData(cID, 'roomList', 'self', data);
    ioExcute.response();
}
Proc.prototype.moveGems = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    var roomID = Users.getcIDRoomID(cID);
    var moved = Rooms.rooms[roomID].jewel.clientMvSingleJewel(iData.data.s, iData.data.t);
    var data = {
        roomID : roomID
        , sucess : moved
        , s : iData.data.s
        , t : iData.data.t
    };
    ioExcute.addOutPutData(cID, 'moveGems', 'room', data);
    if (!moved) return ErrorInfo.retError('moveGems Failed : clientMvSingleJewel returns false');

    while (true) {
        var triples = Rooms.rooms[roomID].jewel.getTriples();
        if (!triples) break;
        var eliminateCounts = Rooms.rooms[roomID].jewel.eliminateTriples(triples);
        data = {
            roomID : roomID
            , toEliminate : triples
        };
        ioExcute.addOutPutData(cID, 'eliminateGems', 'room', data);
        var reorganization = Rooms.rooms[roomID].jewel.jewelsReorganize();
        data = {
            roomID : roomID
            , toReorganize : reorganization
        };
        ioExcute.addOutPutData(cID, 'reorganizeGems', 'room', data);
        var emptyFills = Rooms.rooms[roomID].jewel.fillEmptyJewels();
        data = {
            roomID : roomID
            , toFill : emptyFills
        };
        ioExcute.addOutPutData(cID, 'fillGems', 'room', data);
        // SCORE START
        var getScorePoints = eliminateCounts * SCORE_POINT_THREE; // TODO
        var roomScorePoints = scoreBoard.setRoomScore(getScorePoints, roomID);
        data = {
            roomID : roomID
            , modScore : getScorePoints
            , score : roomScorePoints
        };
        ioExcute.addOutPutData(cID, 'getRoomScore', 'room', data);
        var userScorePoints = scoreBoard.setUserScore(getScorePoints, cID);
        data = {
            cID : cID
            , modScore : getScorePoints
            , score : userScorePoints
        };
        ioExcute.addOutPutData(cID, 'getUserScore', 'room', data);
        // SCORE END
    }

    var gemsBoard = Rooms.rooms[roomID].jewel.getJewels();
    data = {
        roomID : roomID
        , board : gemsBoard
    };
    ioExcute.addOutPutData(cID, 'gemsBoard', 'room', data);

    ioExcute.response();
}
Proc.prototype.newLogin = function(connection) {
    var cID = Users.newConnection(connection);
    console.log((new Date()) + " " + cID + " Connection accepted.");
    ioExcute.addOutPutData(cID, 'newLogin', 'broadCast', { cID : cID });
    ioExcute.response();
}
Proc.prototype.disconnect = function() {
    var iData = ioExcute.iData;
    var cID = iData.cID;
    Users.destroyConnection(cID);
    this.leaveRoom();
    ioExcute.addOutPutData(cID, 'disconnect', 'broadCast', { cID : cID });
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
    , newLogin : act.newLogin       // iData : { Protocol : 'newLogin', data : {} }
    , disconnect : act.disconnect   // iData : { Protocol : 'disconnect', data : {} }
}
// oData : { protocol : 'getRoomScore', data : {} }
// oData : { protocol : 'getUserScore', data : {} }
