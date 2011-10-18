var Connect = function() {}

Connect.prototype.connect = function() {
    var _this = this;
    if (this.connection) return;
    var connection = new WebSocket(global.GI_SERVER);
    connection.onopen = function(e) {
        console.log('Connected');
    }
    
    connection.onclose = function(e) { console.log('Disconnected'); }
    
    connection.onmessage = function(e) {
        var msgData = JSON.parse(e.data);
        execute[msgData.protocol](msgData);
        console.log(msgData);
    }

    this.connection = connection;
}
Connect.prototype.send = function(obj) {
    this.connection.send(JSON.stringify(obj));
}
