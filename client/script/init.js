var global = {};
var ws, execute, front, jewel, frame;
var evt;
var container, stats;
var camera, scene, projector, renderer;
var debug;
var microphysics, gravity;
var queue, matrix;
var objects = [], plane;
var SELECTED = null, INTERSECTED;
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var DURATION = 300;

var cake;

document.addEventListener("DOMContentLoaded", function() {
    ws = new Connect();
    ws.connect();
    evt = new Event();
    execute = new Execute();
    frame = new Frame();
    frame.init();

    debug = new Debug();

    front = new Front();

    matrix = new Matrix();
    queue = new Queue();

    var loader = new THREE.ColladaLoader();
    loader.load('./image/cake.dae', function colladaReady(dae) {
        cake = dae.scene;

        //cake.position.x = 100;
        cake.scale.x = 1;
        cake.scale.y = 1;
        cake.scale.z = 1;

        cake.updateMatrix();
    });
}, false);
