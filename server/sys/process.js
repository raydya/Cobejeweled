var Proc = function() {}
Proc.prototype.startGame = function() {
    var iData = ioExcute.iData;
    CoBejeweled.initFillingUp();
    var jewels = CoBejeweled.getJewels();
    var data = {
        roomID : Users.getMsgSenderRoomID()
        , jewels : jewels
    };
    ioExcute.addOutPutData('startGame', 'room', data);
    ioExcute.response();
}

var act = new Proc;

global.PROCESS = {
    start : act.startGame
}
