var Connect = function() {};

Connect.prototype.connect = function() {
    var _this = this;
    if (this.connection) return;
    var connection = new WebSocket(global.GI_SERVER);
    connection.onopen = function(e) {
        console.log('Connected');
    };
    
    connection.onclose = function(e) { console.log('Disconnected'); };
    
    connection.onmessage = function(e) {
        var msgData = JSON.parse(e.data);
        console.log(msgData.protocol, msgData);
        execute[msgData.protocol](msgData);
    };

    this.connection = connection;
};
Connect.prototype.send = function(obj) {
    console.log(obj);
    this.connection.send(JSON.stringify(obj));
};
