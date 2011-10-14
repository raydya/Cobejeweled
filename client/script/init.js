var global = {};
var ws;

document.addEventListener("DOMContentLoaded", function() {
    ws = new Connect();
    ws.connect();
    new Event();
}, false);
