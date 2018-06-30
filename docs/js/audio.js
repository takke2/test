var soundFile = null;
var buffer = BUFFERS.buffer;

// AudioContext�̍쐬
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
context.createGain = context.createGain || context.createGainNode;
 
// Buffer�ւ̃f�R�[�h
var getAudioBuffer = function(url,fn) {
  let request = new XMLHttpRequest();
  request.responseType = "arraybuffer";
  request.onreadystatechange = function() {
    // XMLHttpRequest�̏������������Ă��邩
    if (request.readyState === 4) {
      // ���X�|���X�̃X�e�[�^�X���m�F
      // 200�̓��N�G�X�g�ɐ���
      if (request.status === 0 || request.status === 200) {
        context.decodeAudioData(request.response, function(buffer) {
          fn(buffer);
        });
      }
    }
  };
  req.open("GET", url, true);
  req.send("");
};

var sound = function(buffer) {
  if (volumeControl == null) {
    volumeControl = context.createGain();
  }
  let source = context.createBufferSource();
  volumeControl.connect(context.destination);
  source.buffer = buffer;
  source.connect(volumeControl);
  // �O���̊֐������soundFile�ŏ������s�����Ƃɂ���
  soundFile = source;
  playing = true;
  //changeVolume();
  // ���̍Đ�
  source.start();
}

var player_play = function() {
  let bgm = "https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3";
  getAudioBuffer(bgm,function(buffer) {
    sound(buffer);
  });
}
