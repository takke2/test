window.AudioContext = window.AudioContext || window.webkitAudioContext;  
var context = new AudioContext();

var buffer;
var bgmbuffer;

// Audio 用の buffer を読み込む
var getAudioBuffer = function(url, fn) {  

    // ファイルを取得 (arraybufferとして)
    var request = new XMLHttpRequest();
    request.open('GET', '/test/resource/shot1.mp3', true);
    request.responseType = 'arraybuffer';

    request.send();
    request.onload = function () {
        // 読み込みが終わったら、decodeしてbufferにいれておく
        var res = request.response;
        context.decodeAudioData(res, function (buf) {
            buffer = buf;
        });
    };
};

// bgm 用の buffer を読み込む
var getBGMBuffer = function(url, fn) {  

    // ファイルを取得 (arraybufferとして)
    var request2 = new XMLHttpRequest();
    request2.open('GET', '/test/resource/tw012.mp3', true);
    request2.responseType = 'arraybuffer';

    request2.send();
    request2.onload = function () {
        // 読み込みが終わったら、decodeしてbufferにいれておく
        var res2 = request2.response;
        context.decodeAudioData(res2, function (buf) {
            bgmbuffer = buf;
        });
    };
};

// サウンドを再生
var playSound = function(buffer,isLoop) {  
  // source を作成
  var source = context.createBufferSource();
  // buffer をセット
  source.buffer = buffer;
  
  source.loop  = isLoop;
  source.loopStart  = 0;
  source.loopEnd  = audioBuffer.duration;


  // context に connect
  source.connect(context.destination);
  // 再生
  source.start(0);
};

getAudioBuffer("https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3");
getBGMBuffer("https://github.com/takke2/test/blob/master/docs/resource/tw012.mp3");

var myfunc = function () {
    playSound(buffer,false);
}

var bgmplay = function () {
    playSound(bgmbuffer,true);
}
