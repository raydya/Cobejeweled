var Front = function() {

}
Front.prototype.createRoom = function(data) {
    var tags = [], rooms = data.rooms, length = rooms.length;
    tags.push('<ul>');
    for (var i = 0; i < length; ++i) {
        tags.push('<li>' + rooms[i].roomName + '-' + rooms[i].roomID + '</li>');
    }
    tags.push('</ul>');
    $('#BejHall').empty().append(tags.join(''));
}
