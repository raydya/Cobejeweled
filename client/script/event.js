var Event = function() {
    this.setEventListener();
}
Event.prototype.setEventListener = function() {
    var start = document.getElementById('start');
    
    start.onclick = function() {
        var data = {
            protocol : 'startGame'
        };
        ws.send(data);
    }
}
