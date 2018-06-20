alert("0");
/*
function init() {
  var button = document.getElementById('button'); //id���ubutton�v�̗v�f���擾
  button.addEventListener("click",connect);
}
*/

/*
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
	  return characteristic.readValue();
	})
	.then(value => {
	  alert(value.getUint8(0));
	})
	.catch(error => { console.log(error); });
}
*/

/*
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


/*
function init() {
    
    
    var width  = window.innerWidth;
    var height = window.innerHeight;

    // �J����
    var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000);
    camera.position.set(0, -20, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // �����_��
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    document.body.appendChild(renderer.domElement);

    // �V�[��
    var scene = new THREE.Scene();

    // �L���[�u
    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var geometory = new THREE.BoxGeometry(10, 10, 10);
    var mesh = new THREE.Mesh(geometory, material);

    // ���C�g
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

    // �A�j���[�V�������[�v
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

    // ���T�C�Y
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
*/

//window.addEventListener("load", init);

//--------------------------------------------------
//Global�ϐ�
//--------------------------------------------------
//BlueJelly�̃C���X�^���X����
var ble = new BlueJelly();

alert("1");
//--------------------------------------------------
//���[�h���̏���
//--------------------------------------------------
window.onload = function () {
  //UUID�̐ݒ�
  //ble.setUUID("UUID1", "713d0000-503e-4c75-ba94-3148f18d941e", "713d0002-503e-4c75-ba94-3148f18d941e");  //BLEnano SimpleControl rx_uuid
  ble.setUUID("BatteryLevel", "0000180f-0000-1000-8000-00805f9b34fb", "00002a19-0000-1000-8000-00805f9b34fb");

}

alert("2");
//--------------------------------------------------
//Scan��̏���
//--------------------------------------------------
ble.onScan = function (deviceName) {
  alert(deviceName);
  //document.getElementById('device_name').innerHTML = deviceName;
  //document.getElementById('status').innerHTML = "found device!";
}


//--------------------------------------------------
//ConnectGATT��̏���
//--------------------------------------------------
ble.onConnectGATT = function (uuid) {
  console.log('> connected GATT!');
  alert(uuid);
  //document.getElementById('uuid_name').innerHTML = uuid;
  //document.getElementById('status').innerHTML = "connected GATT!";
}


//--------------------------------------------------
//Read��̏����F����ꂽ�f�[�^�̕\���ȂǍs��
//--------------------------------------------------
ble.onRead = function (data, uuid){
  //�t�H�[�}�b�g�ɏ]���Ēl���擾
  value = data.getInt8(0);//1Byte�̏ꍇ�̃t�H�[�}�b�g
  alert(value);
  //�R���\�[���ɒl��\��
  console.log(value);

  //HTML�ɒl��\��
  //document.getElementById('data_text').innerHTML = value;

  //document.getElementById('uuid_name').innerHTML = uuid;
  //document.getElementById('status').innerHTML = "read data"
}


//--------------------------------------------------
//Start Notify��̏���
//--------------------------------------------------
ble.onStartNotify = function(uuid){
  console.log('> Start Notify!');

  //document.getElementById('uuid_name').innerHTML = uuid;
  //document.getElementById('status').innerHTML = "started Notify";
}


//--------------------------------------------------
//Stop Notify��̏���
//--------------------------------------------------
ble.onStopNotify = function(uuid){
  console.log('> Stop Notify!');

  //document.getElementById('uuid_name').innerHTML = uuid;
  //document.getElementById('status').innerHTML = "stopped Notify";
}


//-------------------------------------------------
//�{�^���������ꂽ���̃C�x���g�o�^
//--------------------------------------------------
document.getElementById('button').addEventListener('click', function() {
      alert("aaa")
      ble.read('BatteryLevel');
});
