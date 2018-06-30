var soundFile = null;
var buffer = BUFFERS.buffer;

// AudioContextの作成
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
context.createGain = context.createGain || context.createGainNode;
 
// Bufferへのデコード
var getAudioBuffer = function(url,fn) {
  let request = new XMLHttpRequest();
  request.responseType = "arraybuffer";
  request.onreadystatechange = function() {
    // XMLHttpRequestの処理が完了しているか
    if (request.readyState === 4) {
      // レスポンスのステータスを確認
      // 200はリクエストに成功
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
  // 外部の関数からはsoundFileで処理を行うことにする
  soundFile = source;
  playing = true;
  //changeVolume();
  // 音の再生
  source.start();
}

var player_play = function() {
  let bgm = "https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3";
  getAudioBuffer(bgm,function(buffer) {
    sound(buffer);
  });
}
