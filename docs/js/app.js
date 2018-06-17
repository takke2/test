var button = document.getElementById('button'); //idが「button」の要素を取得
button.addEventListener("click",connect);

function connect() {
    alert(navigator.bluetooth)
    navigator.bluetooth.requestDevice({
        filters: [{
        services: ['battery_service']
    }]})
    .then((device) => {
          var result = 999;
          alert(device.name);
          resulet = device.gatt.connect();
          alert(result);
          return result;
          })
    .then((server) => {
          alert("service");
          return server.getPrimaryService('battery_service');
          })
    .then(service => service.getCharacteristic('battery_level'))
    .then(characteristic => characteristic.readValue())
    .then(value => {
      let batteryLevel = value.getUint8(0);
      alert( batteryLevel )
    })
    .catch(error => alert( error ));
}


    
function init() {
    
    
    var width  = window.innerWidth;
    var height = window.innerHeight;

    // カメラ
    var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000);
    camera.position.set(0, -20, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // レンダラ
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    document.body.appendChild(renderer.domElement);

    // シーン
    var scene = new THREE.Scene();

    // キューブ
    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var geometory = new THREE.BoxGeometry(10, 10, 10);
    var mesh = new THREE.Mesh(geometory, material);

    // ライト
    var light = new THREE.DirectionalLight();
    light.position.set(0, 100, 100);

    scene.add(light);
    scene.add(mesh);

    // Skybox
    var cubeMap = new THREE.CubeTexture([]);
    cubeMap.format = THREE.RGBFormat;
    cubeMap.flipY = false;

    var loader = new THREE.ImageLoader();
    loader.load('texture/skyboxsun25degtest.png', function (image) {
        var getSide = function (x, y) {
            var size = 1024;
            var canvas = document.createElement('canvas');
            canvas.width  = size;
            canvas.height = size;

            var context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;
        }

        cubeMap.images[0] = getSide(2, 1);
        cubeMap.images[1] = getSide(0, 1);
        cubeMap.images[2] = getSide(1, 0);
        cubeMap.images[3] = getSide(1, 2);
        cubeMap.images[4] = getSide(1, 1);
        cubeMap.images[5] = getSide(3, 1);
        cubeMap.needsUpdate = true;
    });

    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = cubeMap;

    var skyboxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    var skybox = new THREE.Mesh(
        new THREE.BoxGeometry(10000, 10000, 10000),
        skyboxMaterial
    );

    scene.add(skybox);

    var ua = navigator.userAgent.toLowerCase();
    var isSmartphone = !!(~ua.indexOf('iphone') ||
                          ~ua.indexOf('ipad') ||
                          ~ua.indexOf('ipod') ||
                          ~ua.indexOf('android'));

    // OrbitControls
    var orbitControls = new THREE.OrbitControls(camera);

    // DeviceOrientationControls
    var orientationControls = new THREE.DeviceOrientationControls(camera);

    // VRControls
    var vrControls = new THREE.VRControls(camera);

    // VREffect
    var effect   = new THREE.VREffect(renderer);
    effect.setSize(width, height);

    // アニメーションループ
    (function loop() {
        mesh.rotation.y += 0.01;
        vrControls.update();
        orbitControls.update();
        if (isSmartphone) {
            orientationControls.update();
        }
        effect.render(scene, camera);
        requestAnimationFrame(loop);
    }());

    // リサイズ
    window.addEventListener('resize', function () {
        width  = window.innerWidth;
        height = window.innerHeight;
        effect.setSize(width, height);
        renderer.setSize(width, height);
        renderer.setViewport(0, 0, width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }, false);
    
}

init();