var Front = function() {

}
Front.prototype.createRoom = function(msgData) {
    var tags = [], rooms = msgData.data.rooms, length = rooms.length;
    tags.push('Room List<br/>');
    tags.push('<ul>');
    for (var i = 0; i < length; ++i) {
        if (rooms[i] === null) continue;
        tags.push('<li class="roomLi" title="' + rooms[i].roomID + '">' + rooms[i].roomName + '-' + rooms[i].roomID + '</li>');
    }
    tags.push('</ul>');
    $('#BejHall').empty().append(tags.join(''));

    $('.roomLi').click(function() {
        global.selectedRoom = this.title;
        $('.roomLi').removeClass('selected');
        $(this).addClass('selected');
    });
}
Front.prototype.enterRoom = function(msgData) {
    if (msgData.cID != global.cID) return;
    var header = $('#BejHeader');
    var tags = [];
    var data = msgData.data;
    var roomID = data.roomID;
    var roomName = data.room.roomName;
    tags.push('RoomID : ' + roomID + ' - RoomName : ' + roomName);
    $('#BejHeader').empty().append(tags.join(''));
}
Front.prototype.newLogin = function(msgData) {
    var title = $('#title');
    title.html(msgData.cID);
}
Front.prototype.leaveRoom = function(msgData) {
    if (msgData.cID != global.cID) return;
    var header = $('#BejHeader');
    $('#BejHeader').empty();
}
Front.prototype.ownerChange = function(msgData) {
    var data = msgData.data;
    if (data.ownerID != global.cID) return;
    var roomInfo = $('#BejHeader').html();
    $('#BejHeader').html(roomInfo + " - [Room Master]");
}
Front.prototype.setReady = function(msgData) {
    if (msgData.cID != global.cID) return;
    console.log('set Ready!');
} 
Front.prototype.startGame = function(msgData) {
    var jewels = msgData.data.jewels
    jewel.fillBlankBoard(jewels);
}
