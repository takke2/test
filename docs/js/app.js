/*
function init() {
  var button = document.getElementById('button'); //idが「button」の要素を取得
  button.addEventListener("click",connect);
}

function connect() {
	alert(navigator.bluetooth)
	navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
	.then(device => device.gatt.connect())
	.then(server => {
	  // Getting Battery Service...
	  return server.getPrimaryService('battery_service');
	})
	.then(service => {
	  // Getting Battery Level Characteristic...
	  return service.getCharacteristic('battery_level');
	})
	.then(characteristic => {
	  // Reading Battery Level...
	  characteristic.addEventListener('characteristicvaluechanged', onHeartRateChanged);
	  return characteristic.startNotifications();
	})
	.catch(error => {
	  alert(error);
	  console.log(error);
	});
}


function onHeartRateChanged(event) {
  let characteristic = event.target;
  alert(characteristic.value.getUint8(0))
}
*/

var fire = false;
var counter = 0;
var effects = {};

var CHARA_SHOT_COLOR = 'rgba(0, 0, 255, 0.75)';
var CHARA_SHOT_MAX_COUNT = 10;
var ENEMY_COLOR = 'rgba(255, 0, 0, 0.75)';
var ENEMY_MAX_COUNT = 10;
var enemy_count = ENEMY_MAX_COUNT;

var uart_device;

var uuid={};
uuid["UART_SERVICE"]                 ='6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
uuid["UART_SERVICE_CHARACTERISTICS"] ='6e400003-b5a3-f393-e0a9-e50e24dcca9e';

function connect(){
    alert(navigator.bluetooth);
    navigator.bluetooth.requestDevice({
        //filters: [{namePrefix: 'BBC micro:bit',}],
        acceptAllDevices:true,
        optionalServices: [uuid["UART_SERVICE"]]
    })
    .then(device => {
        uart_device=device;
        return device.gatt.connect();
    })
    .then(server => {
        return server.getPrimaryService(uuid["UART_SERVICE"]);
    })
    .then(service => {
        return service.getCharacteristic(uuid["UART_SERVICE_CHARACTERISTICS"]);
    })
    .then(chara => {
        alert("BLE connected");
        characteristic=chara;
        characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged',onCharacteristicValueChanged);
    })
    .catch(error => {
        alert("BLE error");
    });
}

function onCharacteristicValueChanged(e) {
    var str_arr=[];
    for(var i=0;i<this.value.byteLength;i++){
        str_arr[i]=this.value.getUint8(i);
    }
    var str=String.fromCharCode.apply(null,str_arr);
    alert("msg:"+str);
}


function init() {
    var i, j;
    var p = new Point();
    var forward = new THREE.Vector4(0, 0, -1, 0);
    var cameraVector = new THREE.Vector3(0, 0, -1);
    
    var width  = window.innerWidth;
    var height = window.innerHeight;

    // カメラ
    var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000);
    camera.position.set(0, 0, 0);
    //camera.lookAt(new THREE.Vector3(0, 0, 0))

    // レンダラ
    var renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    document.body.appendChild(renderer.domElement);


    var canvas2D = document.getElementById('canvas2d');
    //canvas2D.appendChild(renderer.domElement);
    var conteText2D = canvas2D.getContext('2d');
    
    // effekseerの初期化
    effekseer.init(renderer.context);
    effects["Laser01"] = effekseer.loadEffect("https://cdn.rawgit.com/effekseer/EffekseerForWebGL/7a1b035c/Release/Sample/Resource/Laser01.efk");
    //effects["Laser01"] = effekseer.loadEffect("https://github.com/takke2/test/blob/master/docs/resource/002_sword_effect/sword.efk");
    // シーン
    var scene = new THREE.Scene();

    // ライト
    var light = new THREE.DirectionalLight();
    light.position.set(0, 100, 100);

    scene.add(light);

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
    
    
    var charaShot = new Array(CHARA_SHOT_MAX_COUNT);
    var charaShotMesh = new Array(CHARA_SHOT_MAX_COUNT);
    const charaShotSize = 5;
    for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
        charaShot[i] = new CharacterShot();
        charaShotMesh[i] = new THREE.Mesh(new THREE.SphereGeometry(charaShotSize), new THREE.MeshPhongMaterial({color : 0xaaaaaa,specular: 0x999999,shininess: 30}));
        charaShotMesh[i].position.set(camera.position.x,camera.position.y,camera.position.z);
    }
    
    var enemy = new Array(ENEMY_MAX_COUNT);
    var enemyMesh = new Array(ENEMY_MAX_COUNT);
    const enemySize = 20;
    for(i=0; i < ENEMY_MAX_COUNT; i++){
        p.x = -200 + i*60;
        p.y = -200 + i*60;
        p.z = -500 + i*60;
        enemy[i] = new Enemy();
        enemy[i].set(p, enemySize, 0.1);
        enemyMesh[i] = new THREE.Mesh(new THREE.SphereGeometry(enemySize), new THREE.MeshNormalMaterial());
        enemyMesh[i].position.set(enemy[i].position.x, enemy[i].position.y, enemy[i].position.z);
        scene.add(enemyMesh[i]);
    }
    
    
    // カメラキューブ
    var cameraMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var cameraGeometory = new THREE.BoxGeometry(10, 10, 10);
    var cameraMesh = new THREE.Mesh(cameraGeometory, cameraMaterial);
    cameraMesh.position.set(camera.position.x, camera.position.y, camera.position.z);
    
    var arrowdir = new THREE.Vector3( 0, 1, 0 );
    var arroworigin = new THREE.Vector3( 0, 0, 0 );
    var arrowlength = 10;
    var arrowhex = 0xffff00;

    var arrowHelper = new THREE.ArrowHelper( arrowdir, arroworigin, arrowlength, arrowhex );
    scene.add( arrowHelper );

    conteText2D.clearRect(0, 0, conteText2D.canvas.width, conteText2D.canvas.height);
    conteText2D.fillText ( "enemy:"+enemy_count , 0 , 10 , 100 );
        
    // アニメーションループ
    (function loop() {        
        counter++;
        
        if(counter % 10 == 0){
            fire = true;
        }
        
        for(i=0; i < CHARA_SHOT_MAX_COUNT; i++){
            if(fire){
                if(!charaShot[i].alive){
                    myfunc();
                    //var vector = new THREE.Vector3();
                    //camera.getWorldDirection( vector );
                    //arrowHelper.setDirection(vector);
                    var forwardVec4 = forward.applyMatrix4(camera.matrix);
                    forwardVec4.normalize();
                    
                    //camera.getWorldDirection(cameraVector);
                    //cameraVector.normalize();
                    
                    //cameraVector.applyQuaternion( camera.quaternion );
                    //cameraVector.normalize();
                    

                    //const project = cameraVector.position.project(camera);
                    //const sx = width / 2 * (+project.x + 1.0);
                    //const sy = height / 2 * (-project.y + 1.0);
                    
                    //var pos = new THREE.Vector3(sx, sy, 1);
                    //pos.unproject(camera);

                    charaShot[i].set(camera.position, camera.getWorldDirection().normalize(), 1000, 5);
                    //charaShot[i].set(camera.position, pos.sub(camera.position).normalize(), 1000, 5);
                    charaShotMesh[i].position.set(charaShot[i].position.x, charaShot[i].position.y,charaShot[i].position.z);
                    //charaShotMesh[i].position.set(0, 0,charaShot[i].position.z);
                    
                    scene.add(charaShotMesh[i]);
                    break;
                }
                
            }
        }
        
        fire = false;
        
        for(i=0; i < CHARA_SHOT_MAX_COUNT; i++){
            if(charaShot[i].alive){
                charaShot[i].move();
                charaShotMesh[i].position.set(charaShot[i].position.x,charaShot[i].position.y,charaShot[i].position.z);
                //charaShotMesh[i].position.set(0,0,charaShot[i].position.z);
            }
            
            if(!charaShot[i].alive){
                scene.remove(charaShotMesh[i]);
            }
        }
        
        for(i=0; i < ENEMY_MAX_COUNT; i++){
            if(enemy[i].alive){
                p = enemy[i].position.distance(camera.position);
                p.normalize();
                enemy[i].move(p);
                enemyMesh[i].position.set(enemy[i].position.x,enemy[i].position.y,enemy[i].position.z);
            }
        }
        
        for(i=0;i < CHARA_SHOT_MAX_COUNT; i++){
            if(charaShot[i].alive){
                for(j=0; j< ENEMY_MAX_COUNT; j++){
                    if(enemy[j].alive){
                        p = enemy[j].position.distance(charaShot[i].position);
                        if(p.length() < enemy[j].size){
                            enemy[j].alive = false;
                            enemy_count = enemy_count-1;
                            conteText2D.clearRect(0, 0, conteText2D.canvas.width, conteText2D.canvas.height);
                            conteText2D.fillText ( "enemy:"+enemy_count , 0 , 10 , 100 );
                            scene.remove(enemyMesh[j]);
                            charaShot[i].alive = false;
                            effekseer.play(effects['Laser01'], charaShot[i].position.x,charaShot[i].position.y,charaShot[i].position.z);
                            break;
                        }
                    }
                }
            }
        }
        
        vrControls.update();
        orbitControls.update();
        if (isSmartphone) {
            orientationControls.update();
        }
        
        // Effekseerの更新
        effekseer.update();

        effect.render( scene, camera, function( camera ) {
            effekseer.setProjectionMatrix(camera.projectionMatrix.elements);
            effekseer.setCameraMatrix(camera.matrixWorldInverse.elements);
            effekseer.draw();
        } );

        /*
        effect.render(scene, camera);
        
        // EffekseerをThree.jsの3D空間に合わせる
        effekseer.setProjectionMatrix(camera.projectionMatrix.elements);
        effekseer.setCameraMatrix(camera.matrixWorldInverse.elements);
        
        // Effekseerのレンダリング
        effekseer.draw();
        */
        
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

//window.addEventListener("load", init);
init();

function dispButton(){
    player_play();
}