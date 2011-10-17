var global = {};
var ws, execute, front;

document.addEventListener("DOMContentLoaded", function() {
    ws = new Connect();
    ws.connect();
    new Event();
    execute = new Execute();
    front = new Front();
}, false);
