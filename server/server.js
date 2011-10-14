require('./require');

var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer();
server.listen(SERVER_LISTEN_PORT);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + " Connection from origin " + request.origin + " rejected.");
        return;
    }

    var connection = request.accept(null, request.origin);
    var cID = Users.newConnection(connection);
    console.log((new Date()) + " " + cID + " Connection accepted.");

    connection.on('message', function(message) {
        ioExcute.process(connection, message.utf8Data);
    });

    connection.on('close', function(connection) {
        console.log((new Date()) + " user : " + cID + " disconnected.");
        Users.destroyConnection(cID);
    });
});

function originIsAllowed(origin) {
    return true;
}
