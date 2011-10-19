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
    ioExcute.process(connection, fc.encode({ protocol : 'newLogin', data : {} }));
    ioExcute.process(connection, fc.encode({ protocol : 'roomList', data : {} }));

    connection.on('message', function(message) {
        ioExcute.process(connection, message.utf8Data);
    });

    connection.on('close', function(conn) {
        var cID = Users.getClientCID(conn);
        console.log((new Date()) + " user : " + cID + " disconnected.");
        ioExcute.process(conn, fc.encode({ protocol : 'disconnect', data : {} }));
    });
});

function originIsAllowed(origin) {
    if (origin === 'http://www.cobejeweled.com') return true;
    return false;
}
