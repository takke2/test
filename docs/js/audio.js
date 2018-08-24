window.AudioContext = window.AudioContext || window.webkitAudioContext;  
var context = new AudioContext();

var buffer;
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

// bgm �p�� buffer ��ǂݍ���
var getBGMBuffer = function(url, fn) {  

    // �t�@�C�����擾 (arraybuffer�Ƃ���)
    var request = new XMLHttpRequest();
    request.open('GET', '/test/resource/tw012.mp3', true);
    request.responseType = 'arraybuffer';

    request.send();
    request.onload = function () {
        // �ǂݍ��݂��I�������Adecode����buffer�ɂ���Ă���
        var res = request.response;
        context.decodeAudioData(res, function (buf) {
            bgmbuffer = buf;
        });
    };
};

// �T�E���h���Đ�
var playSound = function(buffer) {  
  // source ���쐬
  var source = context.createBufferSource();
  // buffer ���Z�b�g
  source.buffer = buffer;
  // context �� connect
  source.connect(context.destination);
  // �Đ�
  source.start(0);
};

getAudioBuffer("https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3");
getBGMBuffer("https://github.com/takke2/test/blob/master/docs/resource/tw012.mp3");

var myfunc = function () {
    playSound(buffer);
}

var bgmplay = function () {
    playSound(bgmbuffer);
}
