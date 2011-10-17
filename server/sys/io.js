var io = function() {
    this.iDataReset();
    this.oDataReset();
}
io.prototype.getInputData = function(client, data) {
    var data = JSON.parse(data);
    var cID = Users.getClientCID(client);
    if (!cID) return ErrorInfo.retError('cID not exists...');
    data.cID = cID;
    this.iData = data;
}
io.prototype.process = function(client, data) {
    this.getInputData(client, data);
    if (!this.iData) return ErrorInfo.retError('iData illegal...');
    var protocol = this.iData.protocol;
    if (!protocol) return ErrorInfo.retError('iData protocol illegal...');
    if (!PROCESS[protocol]) return ErrorInfo.retError('Process action not exists...');
    return PROCESS[protocol]();
}
io.prototype.addOutPutData = function(cID, protocol, sendType, data) {
    this.oData.push({
        cID : cID
        , protocol : protocol
        , sendType : sendType
        , data : data
    });
}
io.prototype.iDataReset = function() {
    this.iData = null;
}
io.prototype.oDataReset = function() {
    this.oData = [];
}
io.prototype.response = function() {
    var length = this.oData.length
        , oData, outputData;

    for (var i = 0; i < length; ++i) {
        oData = this.oData[i];
        outputData = {
            cID : oData.cID
            , protocol : oData.protocol
            , data : oData.data
        };

        responseList[oData.sendType](fc.encode(outputData));
    }

    this.iDataReset();
    this.oDataReset();
}
io.prototype.responseSelf = function(output) {
    var self = this.users.getClient(output.cID);
    if (self) self.sendUTF(fc.encode(output));
}
io.prototype.responseRoom = function(output) {
    var roomID = this.users.getRoomID(output.cID);
    // TODO 
    // LOOP EFFICIENT TOO LOW
    for (var cID in this.users.onlineUser) {
        if (this.users.onlineUser[cID].roomID === roomID) this.users.onlineUser[cID].client.sendUTF(output);
    }
}
io.prototype.responseBroadCast = function(output) {
    for (var cID in this.users.onlineUser) {
        this.users.onlineUser[cID].client.sendUTF(output);
    }
}

global.ioExcute = new io;

// TODO
// DOMAIN PROBLEM
var responseList = {
    self : ioExcute.responseSelf
    , room : ioExcute.responseRoom
    , broadCast : ioExcute.responseBroadCast
    , users : Users
}
