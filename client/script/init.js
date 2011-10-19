var global = {};
var ws, execute, front, jewel;

document.addEventListener("DOMContentLoaded", function() {
    ws = new Connect();
    ws.connect();
    new Event();
    execute = new Execute();
    front = new Front();
    jewel = new Jewel();
    jewel.createBlankBoard();
}, false);
