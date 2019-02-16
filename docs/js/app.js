var fire = false;
var counter = 0;
var effects = {};
var auto = 0;

var CHARA_SHOT_COLOR = 'rgba(0, 0, 255, 0.75)';
var CHARA_SHOT_MAX_COUNT = 10;
var ENEMY_COLOR = 'rgba(255, 0, 0, 0.75)';
var ENEMY_MAX_COUNT = 10;
var enemy_count = ENEMY_MAX_COUNT;
var hp = 3;

var uart_device;
var characteristic;
var characteristic_rx;

var text = "0,0";
var arrayBuffe;
var test1=0;
var result = "";

var uuid={};
uuid["UART_SERVICE"]                 ='6e400001-b5a3-f393-e0a9-e50e24dcca9e';
uuid["UART_SERVICE_CHARACTERISTICS_RX"] ='6e400002-b5a3-f393-e0a9-e50e24dcca9e';
uuid["UART_SERVICE_CHARACTERISTICS"] ='6e400003-b5a3-f393-e0a9-e50e24dcca9e';

var camerax=0;
var cameray=0;

var lrSpeed=0;
var fbSpeed=0;

var isFire=0;
var isSpecial = 0;
var isStart=0;
var isGoo=0;
var isKonami=0;

function sleep(waitMsec) {
  var startMsec = new Date(); 
  while (new Date() - startMsec < waitMsec);
}

function connect2(){
    auto = 1;
    document.getElementById("startButton").style.display ="none";
    document.getElementById("tyosakuken").style.display ="none";
    document.getElementById("startButtonAuto").style.display ="none";
    init();
}

function connect(){
    //init();
    
    //alert(navigator.bluetooth);
    document.getElementById("startButton").style.display ="none";
    document.getElementById("tyosakuken").style.display ="none";
    document.getElementById("startButtonAuto").style.display ="none";
    //alert("connect ok");
    
    navigator.bluetooth.requestDevice({
        acceptAllDevices:true,
        optionalServices:[uuid["UART_SERVICE"]]
    })
    .then(device => {
        //alert("gatt.connect実行");
        uart_device=device;
        return device.gatt.connect();
    })
    .then(server => {
        //alert("getPrimaryService実行");
        return server.getPrimaryService(uuid["UART_SERVICE"]);
    })
    .then(service => {
        //alert("getCharacteristic実行");
        return Promise.all([
            service.getCharacteristic(uuid["UART_SERVICE_CHARACTERISTICS_RX"]),
            service.getCharacteristic(uuid["UART_SERVICE_CHARACTERISTICS"])
        ]);
      
        //return service.getCharacteristic(uuid["UART_SERVICE_CHARACTERISTICS"]);
    })
    .then(chara => {
        //alert("BLE connected");
        characteristic_rx=chara[0];
        characteristic=chara[1];
        characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged',onCharacteristicValueChanged);
        
        init();
    })
    .catch(error => {
        alert("BLE error4" + error);
    });
    
}

function onCharacteristicValueChanged(e) {
	var str_arr=[];
	for(var i=0;i<this.value.byteLength;i++){
	    str_arr[i]=this.value.getUint8(i);
	}
	var str=String.fromCharCode.apply(null,str_arr);
	//alert("msg:"+str);
	result = str.split(',');
	
	test1 = 1;
	
	if (Number(result[0]) == 2){
		if(Number(result[1]) == 0){
			lrSpeed=0;
		}else if(Number(result[1]) == 31){
			lrSpeed=-1;
		}else if(Number(result[1]) == 32){
			lrSpeed=-2;
		}else if(Number(result[1]) == 33){
			lrSpeed=-3;
		}else if(Number(result[1]) == 34){
			lrSpeed=-4;
		}else if(Number(result[1]) == 35){
			lrSpeed=-5;
		}else if(Number(result[1]) == 41){
			lrSpeed=1;
		}else if(Number(result[1]) == 42){
			lrSpeed=2;
		}else if(Number(result[1]) == 43){
			lrSpeed=3;
		}else if(Number(result[1]) == 44){
			lrSpeed=4;
		}else if(Number(result[1]) == 45){
			lrSpeed=5;
		}
		
		if(Number(result[2]) == 0){
			fbSpeed=0;
		}else if(Number(result[2]) == 11){
			fbSpeed=1;
		}else if(Number(result[2]) == 12){
			fbSpeed=2;
		}else if(Number(result[2]) == 13){
			fbSpeed=3;
		}else if(Number(result[2]) == 14){
			fbSpeed=4;
		}else if(Number(result[2]) == 15){
			fbSpeed=5;
		}else if(Number(result[2]) == 21){
			fbSpeed=-1;
		}else if(Number(result[2]) == 22){
			fbSpeed=-2;
		}else if(Number(result[2]) == 23){
			fbSpeed=-3;
		}else if(Number(result[2]) == 24){
			fbSpeed=-4;
		}else if(Number(result[2]) == 25){
			fbSpeed=-5;
		}
		
	}else if(Number(result[0]) == 0){
		if(Number(result[1]) == 0){
			isFire = 0;
			isSpecial = 0;
			isGoo=0;
		}else if(Number(result[1]) == 1){
			isFire = 1;
		}else if(Number(result[1]) == 2){
			isFire = 1;
			isSpecial = 1;
		}
	}else if(Number(result[0]) == 3){
		if(Number(result[1]) == 0){
			isStart=1;
		}else if(Number(result[1]) == 2){
			isKonami = 1;
		}
	}else if(Number(result[0]) == 1){
		if(Number(result[1]) == 1){
			isGoo=1;
		}
	}
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
    effects["Laser01"] = effekseer.loadEffect("https://cdn.rawgit.com/effekseer/EffekseerForWebGL/7a1b035c/Release/Sample/Resource/Laser02.efk");
    //effects["Laser01"] = effekseer.loadEffect("https://github.com/takke2/test/blob/master/docs/resource/Laser01.efk");
    //effects["Laser01"] = effekseer.loadEffect("https://github.com/takke2/test/blob/master/docs/resource/tktk01/fire.efk");
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

    // キューブ
    var zimen = new THREE.MeshLambertMaterial({
        map:THREE.ImageUtils.loadTexture("texture/sand2.jpg")
    });
    
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

    var zimengeometory = new THREE.BoxGeometry(10000, 10, 10000);
    var zimenmesh = new THREE.Mesh(zimengeometory, zimen);
    zimenmesh.position.set(0, -30, -30);
    
    scene.add(zimenmesh);
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
    const specialSize = 50;
    for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
        charaShot[i] = new CharacterShot();
        if(i == CHARA_SHOT_MAX_COUNT-1){
            //charaShotMesh[i] = new THREE.Mesh(new THREE.SphereGeometry(specialSize), new THREE.MeshPhongMaterial({map : "texture/alpha.png" , color : 0xaa0000,specular: 0x999999,shininess: 80}));
            //charaShotMesh[i] = new THREE.Mesh(new THREE.SphereGeometry(specialSize), new THREE.MeshPhongMaterial({alphaMap: new THREE.TextureLoader().load('texture/alpha.png'),color : 0xaa0000,specular: 0x999999,shininess: 80,opacity: 0.5, transparent: true,emissive: 0x222200,emissiveIntensity: 5}));
            charaShotMesh[i] = new THREE.Mesh(new THREE.SphereGeometry(specialSize), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('texture/alpha.png'),color : 0xaa0000,transparent: true, blending: THREE.AdditiveBlending}));
        }else{
            charaShotMesh[i] = new THREE.Mesh(new THREE.SphereGeometry(charaShotSize), new THREE.MeshPhongMaterial({color : 0xaaaaaa,specular: 0xffffff,shininess: 30}));
        }
        charaShotMesh[i].position.set(camera.position.x,camera.position.y,camera.position.z);
    }
    
    var enemy = new Array(ENEMY_MAX_COUNT);
    var enemyMesh = new Array(ENEMY_MAX_COUNT);
    const enemySize = 20;
    //var earthTexture = THREE.ImageUtils.loadTexture( "./texture/earth.png" );
    for(i=0; i < ENEMY_MAX_COUNT; i++){
        p.x = Math.random()*1000 - 500;
        p.y = Math.random()*300 + 20;
        p.z = Math.random()*1000 - 500;
        //p.z = Math.random()*200+100;
        
        enemy[i] = new Enemy();
        enemy[i].set(p, enemySize, 0.3);
        enemyMesh[i] = new THREE.Mesh(new THREE.SphereGeometry(enemySize), new THREE.MeshBasicMaterial({color: 0xffffff,blending: THREE.AdditiveBlending,map:THREE.ImageUtils.loadTexture("texture/earth.png")}));
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
    conteText2D.fillStyle = "blue";
    //conteText2D.fillText ( "1/14" , 0 , 10 , 100 );
    conteText2D.fillText ( "hp:"+hp , conteText2D.canvas.width/2-10 , 10 , 100 );
    conteText2D.fillText ( "e:"+enemy_count , conteText2D.canvas.width/2-10 , 20 , 100 );
    
    bgmplay();
    var tStart=0;
    var tEnd=0;
    
    sleep(3000);
    
    var forward = new THREE.Vector3(0, 0, -1);
    var turn = new THREE.Vector3(1, 0, 0);
    var dir = new THREE.Vector3(); 
    
    // アニメーションループ
    (function loop() {
        
        text = "0,0";
        //arrayBuffe = new TextEncoder("utf-8").encode(text);
        //characteristic_rx.writeValue(arrayBuffe);
        
        if(auto==1){
            isStart = 1;
            counter+=1;
        
            if(counter % 10 == 0){
                isFire = 1;
            }
        }
        
        if(isStart==1){
        
            dir.copy(forward).transformDirection(camera.matrixWorld).normalize().multiplyScalar(fbSpeed); 
            camera.position.add(dir);
            dir.copy(turn).transformDirection(camera.matrixWorld).normalize().multiplyScalar(lrSpeed); 
            camera.position.add(dir);
            
            //camera.position.z -= fbSpeed;
            //camera.position.x += lrSpeed;
            
            /*
            conteText2D.clearRect(0, 0, conteText2D.canvas.width, conteText2D.canvas.height);
            conteText2D.fillText ( "r:"+result[0] , conteText2D.canvas.width/2-100 , 30 , 150 );
            conteText2D.fillText ( "r:"+result[1] , conteText2D.canvas.width/2-100 , 40 , 150 );
            conteText2D.fillText ( "r:"+result[2] , conteText2D.canvas.width/2-100 , 50 , 150 );
            conteText2D.fillText ( "f:"+fbSpeed , conteText2D.canvas.width/2-100 , 60 , 150 );
            conteText2D.fillText ( "l:"+lrSpeed , conteText2D.canvas.width/2-100 , 70 , 150 );
            conteText2D.fillText ( "counter:"+counter , conteText2D.canvas.width/2-100 , 80 , 150 );
            */
            
            //if(isFire == 1){
            //    fire = true;
            //}
            
            for(i=0; i < CHARA_SHOT_MAX_COUNT; i++){
                if(isSpecial){
                      isSpecial = 0;
                    i = CHARA_SHOT_MAX_COUNT-1;
                }
                if(isFire==1){
                    if(!charaShot[i].alive){
                        myfunc();
                        var forwardVec4 = forward.applyMatrix4(camera.matrix);
                        forwardVec4.normalize();
                        
                        
                        if(i==CHARA_SHOT_MAX_COUNT-1){
                            charaShot[i].set(camera.position, camera.getWorldDirection().normalize(), 500, 10);
                            text = "0,2";
                            arrayBuffe = new TextEncoder("utf-8").encode(text);
                            if(auto==0){
                                characteristic_rx.writeValue(arrayBuffe);
                            }
                        }else{
                            charaShot[i].set(camera.position, camera.getWorldDirection().normalize(), 500, 5);
                            text = "0,1";
                            arrayBuffe = new TextEncoder("utf-8").encode(text);
                            if(auto==0){
                                characteristic_rx.writeValue(arrayBuffe);
                            }
                        }
                        charaShotMesh[i].position.set(charaShot[i].position.x, charaShot[i].position.y,charaShot[i].position.z);
                        
                        scene.add(charaShotMesh[i]);

                        break;
                    }
                    
                }
            }
            
            isFire = 0;
            
            for(i=0; i < CHARA_SHOT_MAX_COUNT; i++){
                if(charaShot[i].alive){
                    charaShot[i].move();
                    charaShotMesh[i].position.set(charaShot[i].position.x,charaShot[i].position.y,charaShot[i].position.z);
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
                    
                    
                    
                    ps = enemy[i].position.distance(camera.position);
                    if(ps.length() < enemy[i].size + 1){
                        enemy[i].alive = false;
                        enemy_count = enemy_count-1;
                        scene.remove(enemyMesh[i]);
                        if(isGoo==0 && isKonami==0){
                            hp = hp - 1;
                        }
                        conteText2D.clearRect(0, 0, conteText2D.canvas.width, conteText2D.canvas.height);
                        conteText2D.fillText ( "hp:"+ hp , conteText2D.canvas.width/2-10 , 10 , 100 );
                        conteText2D.fillText ( "e:"+ enemy_count , conteText2D.canvas.width/2-10 , 20 , 100 );
                        text = "0,4";
                        arrayBuffe = new TextEncoder("utf-8").encode(text);
                        if(auto==0){
                            characteristic_rx.writeValue(arrayBuffe);
                        }
                    }
                }
            }
            
            for(i=0;i < CHARA_SHOT_MAX_COUNT; i++){
                if(charaShot[i].alive){
                    for(j=0; j< ENEMY_MAX_COUNT; j++){
                        if(enemy[j].alive){
                            p = enemy[j].position.distance(charaShot[i].position);
                            sabun = charaShotSize;
                            if(i==CHARA_SHOT_MAX_COUNT-1){
                                sabun = specialSize;
                            }
                            
                            if(p.length() < enemy[j].size+sabun){
                            
                                text = "0,3";
                                arrayBuffe = new TextEncoder("utf-8").encode(text);
                                if(auto==0){
                                    characteristic_rx.writeValue(arrayBuffe);
                                }
                            
                                enemy[j].alive = false;
                                enemy_count = enemy_count-1;
                                conteText2D.clearRect(0, 0, conteText2D.canvas.width, conteText2D.canvas.height);
                                conteText2D.fillText ( "hp:"+hp , conteText2D.canvas.width/2-10 , 10 , 100 );
                                conteText2D.fillText ( "e:"+enemy_count , conteText2D.canvas.width/2-10 , 20 , 100 );
                                scene.remove(enemyMesh[j]);
                                charaShot[i].alive = false;
                                explay();
                                effekseer.play(effects['Laser01'], charaShot[i].position.x,charaShot[i].position.y,charaShot[i].position.z);
                                break;
                            }
                        }
                    }
                }
            }
        }else{
            tStart = performance.now();
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
        
        tEnd = performance.now();
        
        if(hp>0 && tEnd-tStart < 90000 && enemy_count>0){
            requestAnimationFrame(loop);
        }else{
            bgmstop();
            if(hp<=0 || tEnd-tStart > 90000){
                endplay();
                text = "0,5";
                arrayBuffe = new TextEncoder("utf-8").encode(text);
                if(auto==0){
                    characteristic_rx.writeValue(arrayBuffe);
                }
                alert("game over!");
            }
            if(enemy_count<=0){
                clearplay();
                alert("clear!");
            }
        }
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
//connect();

function dispButton(){
    player_play();
}