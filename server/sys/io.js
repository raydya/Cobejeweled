var io = function() {
    this.iDataReset();
    this.oDataReset();
}
io.prototype.getInputData = function(client, data) {
    var data = JSON.parse(data);
    var cID = Users.messageSender(client);
    //data.cID = Users.getClientCID(client);
    if (!cID) return ErrorInfo.retError('cID not exists...');
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
io.prototype.addOutPutData = function(protocol, sendType, data) {
    this.oData.push({
        protocol : protocol
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
        outPut = {
            protocol : oData.protocol
            , data : oData.data
        }

        responseList[oData.sendType](outPut);
    }

    this.iDataReset();
    this.oDataReset();
}

// TODO
// DOMAIN PROBLEM
var responseList = {
    self : Users.responseSelf
    , room : Users.responseRoom
    , broadCast : Users.responseBroadCast
    , users : Users
}

global.ioExcute = new io;
