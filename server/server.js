require('./require');
/* ExpressJS Start */
var express = require('express');
var app = express.createServer();
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static('/home/ila/project/cobejeweled/client/'));
var downloads = {};
app.get('/*', function(req, res, next){
    var file = req.params[0];
    console.log(file);
    downloads[file] = downloads[file] || 0;
    ++downloads[file];
    next();
});
app.listen(SERVER_LISTEN_PORT);
/* ExpressJS End */

var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: app,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    /*
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + " Connection from origin " + request.origin + " rejected.");
        return;
    }
    */

    var connection = request.accept(null, request.origin);
    var cID = Users.newConnection(connection);
    console.log((new Date()) + " " + cID + " Connection accepted.");
    ioExcute.addOutPutData(cID, 'newLogin', 'broadCast', { cID : cID });
    ioExcute.response();

    connection.on('message', function(message) {
        ioExcute.process(connection, message.utf8Data);
    });

    connection.on('close', function(conn) {
        console.log((new Date()) + " user : " + cID + " disconnected.");
        var leaveProtocol = { protocol : 'closePage' };
        ioExcute.getInputData(connection, JSON.stringify(leaveProtocol));
        Users.destroyConnection(cID);
    });
});

function originIsAllowed(origin) {
    if (origin === 'http://www.cobejeweled.com') return true;
    return false;
}
