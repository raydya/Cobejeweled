var Event = function() {
    this.preSelectedGem = null;
    this.setEventListener();
};
Event.prototype.setEventListener = function() {
    var createRoom = document.getElementById('BejCreateRoom');
    var leaveRoom = document.getElementById('BejLeaveRoom');
    var setReady = document.getElementById('BejSetReady');
    var enterRoom = document.getElementById('BejEnterRoom');
    var startGame = document.getElementById('BejStartGame');
    var _this = this;

    createRoom.onclick = function() {
        _this.protocolCreateRoom();
    };

    leaveRoom.onclick = function() {
        _this.protocolLeaveRoom();
    };

    setReady.onclick = function() {
        _this.protocolSetReady();
    };

    enterRoom.onclick = function() {
        _this.protocolEnterRoom();
    };

    startGame.onclick = function() {
        _this.protocolStartGame();
    };

    document.onselectstart = function() {
        return false;
    };

    $('.BejBlocks').live('click', function() {
        _this.selectGem(this);
    });
};
Event.prototype.protocolCreateRoom = function() {
    var data = { protocol : 'createRoom', data : {} };
    ws.send(data);
};
Event.prototype.protocolLeaveRoom = function() {
    var data = { protocol : 'leaveRoom', data : {} };
    ws.send(data);
};
Event.prototype.protocolSetReady = function() {
    var data = { protocol : 'setReady', data : {} };
    ws.send(data);
};
Event.prototype.protocolEnterRoom = function() {
    var roomID = global.selectedRoom;
    var data = { protocol : 'enterRoom', data : { roomID : roomID } };
    ws.send(data);
};
Event.prototype.protocolStartGame = function() {
    var data = { protocol : 'startGame', data : {} };
    ws.send(data);
};
Event.prototype.protocolMoveGems = function(src, tar) {
    var data = { protocol : 'moveGems', data : { s : src, t : tar } };
    ws.send(data);
};
Event.prototype.selectGem = function(gem) {
    if (!global.startGame) return;
    $('.BejBlocks').removeClass('selectedGem');
    $(gem).addClass('selectedGem');
    $(this.preSelectedGem).addClass('selectedGem');
    if (!this.preSelectedGem) {
        this.preSelectedGem = gem;
        return;
    }
    var pre = this.preSelectedGem.title.split(',');
    var cur = gem.title.split(',');
    var src = { x : pre[0], y : pre[1] };
    var tar = { x : cur[0], y : cur[1] };
    if (!this.checkNeighbour(src, tar)) return;
    this.protocolMoveGems(src, tar);
    this.preSelectedGem = gem;
};
Event.prototype.checkNeighbour = function(src, tar) {
    var absX, absY;
    absX = Math.abs(src.x - tar.x);
    absY = Math.abs(src.y - tar.y);
    return (absX + absY) == 1 ? true : false;
};

// by ila 3D event
Event.prototype.initFrameEvent = function() {
    renderer.domElement.addEventListener('mousemove', this.frameMouseMove, false);
    renderer.domElement.addEventListener('mousedown', this.frameMouseDown, false);
    renderer.domElement.addEventListener('mouseup', this.frameMouseUp, false);
    renderer.domElement.addEventListener('mousewheel', this.frameMouseWheel, false);
};
Event.prototype.frameMouseMove = function(e) {
    e.preventDefault();

    mouse.x = (e.offsetX / frame.WIDTH) * 2 - 1;
    mouse.y = - (e.offsetY / frame.HEIGHT) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

    var intersects;

    if (SELECTED) {
        intersects = ray.intersectObject(plane);
        //console.log(intersects);
        SELECTED.position.copy(intersects[0].point.subSelf(offset));
        return;
    }

    intersects = ray.intersectObjects(objects);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
                INTERSECTED.materials[0].color.setHex(INTERSECTED.currentHex);
            }
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.materials[0].color.getHex();
            INTERSECTED.materials[0].color.setHex(0x000000);

            plane.position.copy(INTERSECTED.position);
        }
    } else {
        if (INTERSECTED) {
            INTERSECTED.materials[0].color.setHex(INTERSECTED.currentHex);
            INTERSECTED = null;
        }
    }
};
Event.prototype.frameMouseDown = function(e) {
    //console.log('down');
    e.preventDefault();
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

    var intersects = ray.intersectObjects(objects);

    if (intersects.length > 0) {
        SELECTED = intersects[0].object;
        offset.copy(intersects[0].point).subSelf(plane.position);
    }
};
Event.prototype.frameMouseUp = function(e) {
    //console.log('up');
    e.preventDefault();
    if (INTERSECTED) {
        plane.position.copy(INTERSECTED.position);
        SELECTED = null;
    }
};
Event.prototype.frameMouseWheel = function(e) {
    camera.position.z += e.wheelDelta;
    return false;
};
