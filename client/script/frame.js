var Frame = function() {
    this.WIDTH = 354;
    this.HEIGHT = 574;
};

Frame.prototype.init = function() {
    // create camera
    camera = new THREE.PerspectiveCamera(70, this.WIDTH / this.HEIGHT, 1, 10000);
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
    plane.visible = true;
    scene.add(plane);

    // create projector
    projector = new THREE.Projector();

    renderer = new THREE.WebGLRenderer({ antialias: true});
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

    evt.initFrameEvent();
};
Frame.prototype.animate = function() {
    webkitRequestAnimationFrame(frame.animate);
    renderer.render(scene, camera);
};
Frame.prototype.start = function(jewels) {
    for (var index in jewels) {
        var object = jewel.create(index, jewels[index].type);
        scene.add(object);
        objects.push(object);
        //objects[index] = object;
    }
    this.animate();
};
