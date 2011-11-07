var io = function() {
    this.iDataReset();
    this.oDataReset();
}
io.prototype.getInputData = function(client, data) {
    var cID = Users.getClientCID(client);
    if (!cID) return ErrorInfo.retError('cID not exists...');
    data.cID = cID;
    this.iData = data;
}
io.prototype.process = function(client, data) {
    data = JSON.parse(data);
    if (data.protocol === 'newLogin') return PROCESS[data.protocol](client);
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

        this[oData.sendType](outputData);
    }

    this.iDataReset();
    this.oDataReset();
}
io.prototype.responseSelf = function(output) {
    var self = Users.getClient(output.cID);
    output = fc.encode(output);
    if (self) self.sendUTF(output);
}
io.prototype.responseRoom = function(output) {
    var roomID = output.data.roomID;
    output = fc.encode(output);
    // TODO 
    // LOOP EFFICIENT TOO LOW
    for (var cID in Users.onlineUser) {
        if (!Users.onlineUser[cID]) continue;
        if (Users.onlineUser[cID].roomID == roomID) Users.onlineUser[cID].client.sendUTF(output);
    }
}
io.prototype.responseBroadCast = function(output) {
    output = fc.encode(output);
    for (var cID in Users.onlineUser) {
        if (!Users.onlineUser[cID]) continue;
        Users.onlineUser[cID].client.sendUTF(output);
    }
}
io.prototype.self = function(outputData) {
    this.responseSelf(outputData);
}
io.prototype.room = function(outputData) {
    this.responseRoom(outputData);
}
io.prototype.broadCast = function(outputData) {
    this.responseBroadCast(outputData);
}

global.ioExcute = new io;
