var scene = new THREE.Scene();
    
function init() {
    var width  = window.innerWidth;
    var height = window.innerHeight;


    
    alert("aa");
    
    // カメラ
    var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000);
    camera.position.set(0, -20, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // レンダラ
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    document.body.appendChild(renderer.domElement);

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