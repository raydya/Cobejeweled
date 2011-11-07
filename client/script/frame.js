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

    // create physics env
    microphysics = new THREEx.Microphysics();
    microphysics.start();
    gravity = new vphy.LinearAccelerator({
        x: 0,
        y: -9.8,
        z: 0
    });
    microphysics.world().add(gravity);

    // create Container
    var container = new Container();
    container.init();

    evt.initFrameEvent();
};
Frame.prototype.animate = function() {
    webkitRequestAnimationFrame(frame.animate);
    microphysics.update();
    renderer.render(scene, camera);
};
Frame.prototype.start = function(jewels) {
    for (var index in jewels) {
        var object = jewel.create(index, jewels[index].type);
        scene.add(object);
        objects.push(object);
        microphysics.bindMesh(object, jewel.PHYSICS_OPTIONS);
        /*
        microphysics.bindMesh(object, 
            { geometry: new THREE.CubeGeometry(400, 400, 400), physics : { restitution: 0.98 }}
        );
        */
        //objects[index] = object;
    }
    this.animate();
};
