var Container = function() {
    this.THICKNESS = 10;
    this.WIDTH = 1400;
    this.HEIGHT = 800;
    this.DEPTH = 800;
};

Container.prototype.init = function() {
    var geometry = new THREE.CubeGeometry(this.WIDTH, this.THICKNESS, this.DEPTH, 10, 10, 10, [], true);
    var material = [new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: false }), new THREE.MeshNormalMaterial()];
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 700;
    mesh.position.y = -1000;
    scene.add(mesh);
};
