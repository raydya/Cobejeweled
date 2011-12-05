var Dae = function() {
    this.MODEL_CAKE_FILE_NAME = {
        0 : 'cake_orange',
        1 : 'cake_red',
        2 : 'cake_white',
        3 : 'cake_yellow',
        4 : 'cake_blue',
        5 : 'cake_purple',
        6 : 'cake_green',
        7 : 'cake_black'
    };
    this.MODEL_CAKE = {};
    this.MODEL_URI = './image/';
    this.MODEL_EXT = '.dae';
    this.loader = new THREE.ColladaLoader();

    this.init();
};

Dae.prototype.init = function() {
    var _this = this;

    // load cake
    for (var i in this.MODEL_CAKE_FILE_NAME) {
        this.loadCake(i);
    }
};
Dae.prototype.loadCake = function(i) {
    var _this = this;
    this.loader.load(this.MODEL_URI + this.MODEL_CAKE_FILE_NAME[i] + this.MODEL_EXT, function(dae) {
        _this.MODEL_CAKE[i] = dae.scene;

        _this.MODEL_CAKE[i].scale.x = 1;
        _this.MODEL_CAKE[i].scale.y = 1;
        _this.MODEL_CAKE[i].scale.z = 1;

        _this.MODEL_CAKE[i].updateMatrix();
    });
};
