var Connect = function() {};

Connect.prototype.connect = function() {
    if (this.connection) return;
    var connection = new WebSocket(global.GI_SERVER);
    connection.onopen = function(e) { console.log('Connected'); };
    connection.onclose = function(e) { console.log('Disconnected'); };
    connection.onmessage = function(e) { 
        console.log(e.data);
    };
    this.connection = connection;
};
Connect.prototype.send = function(obj) {
    this.connection.send(JSON.stringify(obj));
};
