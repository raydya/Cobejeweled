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

var dae;
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

    dae = new Dae();

}, false);
