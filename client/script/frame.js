var Frame = function() {
    this.WIDTH = 354;
    this.HEIGHT = 574;
};

Frame.prototype.init = function() {
    // create camera
    camera = new THREE.PerspectiveCamera(70, this.WIDTH / this.HEIGHT, 1, 10000);
    camera.position.x = this.WIDTH;
    camera.position.y = - this.HEIGHT;
    camera.position.z = 1000;

    // create scene
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x505050));

    // create light
    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);
    light.castShadow = true;
    scene.add(light);

    // create plane
    plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.25, transparent: true, wireframe: true }));
    plane.lookAt(camera.position);
    plane.visible = false;
    scene.add(plane);

    // create projector
    projector = new THREE.Projector();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.sortObjects = false;
    renderer.setSize(this.WIDTH, this.HEIGHT);

    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;

    var gameField = document.getElementById('BejField');
    gameField.appendChild(renderer.domElement);

    // create Container
    //var container = new Container();
    //container.init();

    // create coordinate
    this.coordinate();

    evt.initFrameEvent();
};
Frame.prototype.coordinate = function() {
    var xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 1, linewidth: 5 });
    var xGeometry = new THREE.Geometry();
    xGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
    xGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(2000, 0, 0)));
    var xLine = new THREE.Line(xGeometry, xMaterial);

    var yMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 1, linewidth: 5 });
    var yGeometry = new THREE.Geometry();
    yGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
    yGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 2000, 0)));
    var yLine = new THREE.Line(yGeometry, yMaterial);

    var zMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 1, linewidth: 5 });
    var zGeometry = new THREE.Geometry();
    zGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
    zGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 2000)));
    var zLine = new THREE.Line(zGeometry, zMaterial);

    scene.add(xLine);
    scene.add(yLine);
    scene.add(zLine);
};
Frame.prototype.animate = function() {
    webkitRequestAnimationFrame(frame.animate);
    renderer.render(scene, camera);
    debug.update();
};
Frame.prototype.start = function(jewels) {
    for (var index in jewels) {
        this.createJewel(index, jewels[index].type);
    }
    this.animate();
};
Frame.prototype.createJewel = function(index, type) {
    var jewel = new Jewel(index, type);
    scene.add(jewel.object);
    matrix.add(jewel);
};
Frame.prototype.clickJewel = function(obj) {
    // no jewel selected
    if (SELECTED === null) {
        this.selectJewel(obj.jewel);
        return;
    }
    // jewel selected
    this.moveJewel(obj.jewel);
    return;
};
Frame.prototype.selectJewel = function(jewel) {
    SELECTED = jewel;
};
Frame.prototype.isNeighbour = function(srcJewel, tarJewel) {
    var absX, absY;
    var srcPosition = srcJewel.getPosition();
    var tarPosition = tarJewel.getPosition();

    absX = Math.abs(srcPosition.x - tarPosition.x);
    absY = Math.abs(srcPosition.y - tarPosition.y);
    return absX + absY === 1;
};
Frame.prototype.moveJewel = function(jewel) {
    // check neighbor
    if (!this.isNeighbour(SELECTED, jewel)) {
        SELECTED = jewel;
        return;
    }

    var data = { protocol : 'moveGems', data : { s : SELECTED.getPosition(), t : jewel.getPosition() } };
    ws.send(data);

    SELECTED = null;
};
Frame.prototype.exchangeJewel = function(srcIndex, tarIndex) {
    var srcObject = matrix[srcIndex];
    var tarObject = matrix[tarIndex];

    this.transferJewel(srcObject, tarIndex);
    delete matrix[srcIndex];
    if (tarObject) {
        this.transferJewel(tarObject, srcIndex);
    }
};
Frame.prototype.transferJewel = function(object, tarIndex) {
    object.setPosition(tarIndex);
    matrix[tarIndex] = object;
};
Frame.prototype.eliminate = function(index) {
    var pos = new Position(index);
    var jewel = matrix.get(pos);
    scene.remove(jewel.object);
    matrix.del(pos);
};
Frame.prototype.reorganize = function(data) {
    /* data = {
     *  from: { effect: null, index: '2,7' },
     *  to: { effect: null, index: '2,8' }
     * }
     * */
    frame.exchangeJewel(data.from.index, data.to.index);
};
Frame.prototype.fill = function(data) {
    /* { effect: null, index: '2,7', type: 2 }
     * */
    frame.createJewel(data.index, data.type);
};
Frame.prototype.verify = function(pos, standards) {
    var jewel = matrix.get(pos);
    if (!jewel) {
        console.log(pos.i, 'not exists in matrix, verify failed');
        return;
    }

    if (jewel.getType() != standards.type) {
        console.log(pos.i, 'jewel type verify failed, client:', jewel.getType(), '!= server:', standards.type);
        return;
    }
};
