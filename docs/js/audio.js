window.AudioContext = window.AudioContext || window.webkitAudioContext;  
var context = new AudioContext();

// Audio �p�� buffer ��ǂݍ���
var getAudioBuffer = function(url, fn) {  
  var req = new XMLHttpRequest();
  // array buffer ���w��
  req.responseType = 'arraybuffer';

  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 0 || req.status === 200) {
        // array buffer �� audio buffer �ɕϊ�
        context.decodeAudioData(req.response, function(buffer) {
          // �R�[���o�b�N�����s
          fn(buffer);
        });
      }
    }
  };

  req.open('GET', url, true);
  req.send('');
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

// main
window.onload = function() {  
  // �T�E���h��ǂݍ���
  getAudioBuffer("https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3", function(buffer) {
    // �ǂݍ��݊�����Ƀ{�^���ɃN���b�N�C�x���g��o�^
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      // �T�E���h���Đ�
      playSound(buffer);
    };
  });
};