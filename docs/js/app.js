var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000 );
var renderer = new THREE.WebGLRenderer();
var controls = new THREE.VRControls(camera);
var effect = new THREE.VREffect(renderer);
var manager = new WebVRManager(renderer, effect);

var sceneCube  = new THREE.Scene();
var sceneSphere = new THREE.Scene();

var meshCube = new THREE.Mesh();

function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls.standing = true;

  effect.setSize(window.innerWidth, window.innerHeight);

  var light = new THREE.DirectionalLight(0xFFFFFF);
  light.position.set(2, 2, 1);
  scene.add( light );

  var ambientLight = new THREE.AmbientLight(0x333333);
  scene.add( ambientLight );


    var geometryCube = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    var loaderCube = new THREE.TextureLoader();

    switch(1) {
    case 1:
       var materialCube = new THREE.MeshLambertMaterial( { color: 0x00ff88 } );
       break;
    case 2:
       var materialCube = new THREE.MeshLambertMaterial( { color: 0x00ff88, wireframe:true } );
       break;
    default:
       var materials = [
          new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("./img/dice1.png")}),
          new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("./img/dice2.png")}),
          new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("./img/dice3.png")}),
          new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("./img/dice4.png")}),
          new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("./img/dice5.png")}),
          new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("./img/dice6.png")}),
       ];
       var materialCube = new THREE.MeshFaceMaterial(materials);
       break;
    }

    meshCube = new THREE.Mesh( geometryCube, materialCube );
    meshCube.position.set(0, 0, -0.32);
    sceneCube.add( meshCube );

    var meshSphere = new THREE.Mesh();
    var materialSphere = new THREE.MeshLambertMaterial( { color: 0x0088ff, wireframe:true } );
    var geometrySphere = new THREE.SphereGeometry(0.6,32,32);
    meshSphere = new THREE.Mesh( geometrySphere, materialSphere );
    meshSphere.position.set(0, 0, 0);
    sceneSphere.add( meshSphere );

    scene.add( sceneCube );
    scene.add( sceneSphere );
}

var lastRender = 0;
function render(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    meshCube.rotation.x += delta * 0.0005
    meshCube.rotation.z += delta * 0.001

    requestAnimationFrame(render);
    controls.update();
    manager.render(scene, camera, timestamp);
}

init();
render(performance ? performance.now() : Date.now());
