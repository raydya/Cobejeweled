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
        $(this).addClass('selected');
    });
}
Front.prototype.enterRoom = function(msgData) {
    var header = $('#BejHeader');
    var tags = [];
    var data = msgData.data;
    
    if (msgData.data.cID != global.cID) return;
    console.log(data);
    var roomID = data.roomID;
    var roomName = data.room.roomName;

    tags.push(roomID + ' - ' + roomName);
    $('#BejHeader').empty().append(tags.join(''));
}
