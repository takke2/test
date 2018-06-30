window.AudioContext = window.AudioContext || window.webkitAudioContext;  
var context = new AudioContext();

var buffer;

// Audio �p�� buffer ��ǂݍ���
var getAudioBuffer = function(url, fn) {  
    // ������buffer���i�[������
    var buffer;

    // �t�@�C�����擾 (arraybuffer�Ƃ���)
    var request = new XMLHttpRequest();
    request.open('GET', 'https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3', true);
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

var myfunc = function () {
    playSound(buffer);
}