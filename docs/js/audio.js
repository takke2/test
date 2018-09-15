window.AudioContext = window.AudioContext || window.webkitAudioContext;  
var context = new AudioContext();

var buffer;
var exbuffer;
var bgmbuffer;

// Audio �p�� buffer ��ǂݍ���
var getAudioBuffer = function(url, fn) {  

    // �t�@�C�����擾 (arraybuffer�Ƃ���)
    var request = new XMLHttpRequest();
    request.open('GET', '/test/resource/shot1.mp3', true);
    request.responseType = 'arraybuffer';

    request.send();
    request.onload = function () {
        // �ǂݍ��݂��I�������Adecode����buffer�ɂ���Ă���
        var res = request.response;
        context.decodeAudioData(res, function (buf) {
            buffer = buf;
        });
    };
};

// ���� �p�� buffer ��ǂݍ���
var getAudioBuffer = function(url, fn) {  

    // �t�@�C�����擾 (arraybuffer�Ƃ���)
    var request = new XMLHttpRequest();
    request.open('GET', '/test/resource/explosion1.mp3', true);
    request.responseType = 'arraybuffer';

    request.send();
    request.onload = function () {
        // �ǂݍ��݂��I�������Adecode����buffer�ɂ���Ă���
        var res = request.response;
        context.decodeAudioData(res, function (buf) {
            exbuffer = buf;
        });
    };
};

// bgm �p�� buffer ��ǂݍ���
var getBGMBuffer = function(url, fn) {  
    // �t�@�C�����擾 (arraybuffer�Ƃ���)
    var request2 = new XMLHttpRequest();
    request2.open('GET', '/test/resource/tw012.mp3', true);
    request2.responseType = 'arraybuffer';

    request2.send();
    request2.onload = function () {
        source = context.createBufferSource();
        // �ǂݍ��݂��I�������Adecode����buffer�ɂ���Ă���
        var res2 = request2.response;
        context.decodeAudioData(res2, function (buf) {
            bgmbuffer = buf;
        });
    };
};

// �T�E���h���Đ�
var playSound = function(buffer,isLoop) {  
  // source ���쐬
  var source = context.createBufferSource();
  // buffer ���Z�b�g
  source.buffer = buffer;
  // context �� connect
  source.connect(context.destination);
  source.loop  = isLoop;
  // �Đ�
  source.start(0);
};

getAudioBuffer("https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3");
getexBuffer("https://github.com/takke2/test/blob/master/docs/resource/explosion1.mp3");
getBGMBuffer("https://github.com/takke2/test/blob/master/docs/resource/tw012.mp3");

var myfunc = function () {
    playSound(buffer,false);
}

var explay = function () {
    playSound(exbuffer,false);
}

var bgmplay = function () {
    playSound(bgmbuffer,true);
    //getBGMBuffer("https://github.com/takke2/test/blob/master/docs/resource/tw012.mp3");
}
