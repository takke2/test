window.AudioContext = window.AudioContext || window.webkitAudioContext;  
var context = new AudioContext();

var buffer;
var exbuffer;
var bgmbuffer;
var clearbuffer;
var endbuffer;

var source2;

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

// 爆発 用の buffer を読み込む
var getexBuffer = function(url, fn) {  

    // ファイルを取得 (arraybufferとして)
    var request = new XMLHttpRequest();
    request.open('GET', '/test/resource/explosion1.mp3', true);
    request.responseType = 'arraybuffer';

    request.send();
    request.onload = function () {
        // 読み込みが終わったら、decodeしてbufferにいれておく
        var res = request.response;
        context.decodeAudioData(res, function (buf) {
            exbuffer = buf;
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
        source = context.createBufferSource();
        // 読み込みが終わったら、decodeしてbufferにいれておく
        var res2 = request2.response;
        context.decodeAudioData(res2, function (buf) {
            bgmbuffer = buf;
        });
    };
};


// クリア 用の buffer を読み込む
var getclearBuffer= function(url, fn) {  
    // ファイルを取得 (arraybufferとして)
    var request2 = new XMLHttpRequest();
    request2.open('GET', '/test/resource/st026.mp3', true);
    request2.responseType = 'arraybuffer';

    request2.send();
    request2.onload = function () {
        source = context.createBufferSource();
        // 読み込みが終わったら、decodeしてbufferにいれておく
        var res2 = request2.response;
        context.decodeAudioData(res2, function (buf) {
            clearbuffer = buf;
        });
    };
};

// エンド 用の buffer を読み込む
var getendBuffer = function(url, fn) {  
    // ファイルを取得 (arraybufferとして)
    var request2 = new XMLHttpRequest();
    request2.open('GET', '/test/resource/st010b.mp3', true);
    request2.responseType = 'arraybuffer';

    request2.send();
    request2.onload = function () {
        source = context.createBufferSource();
        // 読み込みが終わったら、decodeしてbufferにいれておく
        var res2 = request2.response;
        context.decodeAudioData(res2, function (buf) {
            endbuffer = buf;
        });
    };
};


// サウンドを再生
var playSound = function(buffer,isLoop) {  
  // source を作成
  var source = context.createBufferSource();
  // buffer をセット
  source.buffer = buffer;
  // context に connect
  source.connect(context.destination);
  source.loop  = isLoop;
  // 再生
  source.start(0);
};


// サウンドを再生
var playSound2 = function(buffer,isLoop) {  
  // source を作成
  source2 = context.createBufferSource();
  // buffer をセット
  source2.buffer = buffer;
  // context に connect
  source2.connect(context.destination);
  source2.loop  = isLoop;
  // 再生
  source2.start(0);
};


getAudioBuffer("https://github.com/takke2/test/blob/master/docs/resource/shot1.mp3");
getexBuffer("https://github.com/takke2/test/blob/master/docs/resource/explosion1.mp3");
getBGMBuffer("https://github.com/takke2/test/blob/master/docs/resource/tw012.mp3");
getclearBuffer("https://github.com/takke2/test/blob/master/docs/resource/st026.mp3");
getendBuffer("https://github.com/takke2/test/blob/master/docs/resource/st010b.mp3");


var myfunc = function () {
    playSound(buffer,false);
}

var explay = function () {
    playSound(exbuffer,false);
}



var clearplay = function () {
    playSound(clearbuffer,false);
}

var endplay = function () {
    playSound(endbuffer,false);
}



var bgmplay = function () {
    playSound2(bgmbuffer,true);
    //getBGMBuffer("https://github.com/takke2/test/blob/master/docs/resource/tw012.mp3");
}


var bgmstop = function () {
    source2.stop();
}
