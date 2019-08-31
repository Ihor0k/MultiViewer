var ws, videoNode;

function init() {
    videoNode = document.getElementById('video');
    videoNode.addEventListener('pause', onPause, false);
    videoNode.addEventListener('play', onPlay, false);

    var inputNode = document.getElementById('fileInput');
    inputNode.addEventListener('change', playSelectedFile, false);

    var service = "ws://multi-viewer.herokuapp.com/api";
    service = "ws://localhost:8080/MultiViewer_war/api";
    ws = new WebSocket(service);
    ws.onmessage = onMessage;
}

function onMessage(event) {
    var json = JSON.parse(event.data);
    switch (json.type) {
        case 'PLAY': {
            videoNode.currentTime = json.timestamp;
            videoNode.play();
            break;
        }
        case 'PAUSE': {
            videoNode.pause();
            break;
        }
        case 'REWIND': {
            videoNode.currentTime = json.timestamp;
            break;
        }
    }
}

function onRewind(event) {
    var json = JSON.stringify({
        "type": "REWIND",
        "timestamp": event.target.currentTime
    });
    ws.send(json)
}

function onPlay(event) {
    var json = JSON.stringify({
        "type": "PLAY",
        "timestamp": event.target.currentTime
    });
    ws.send(json)
}

function onPause(event) {
    var json = JSON.stringify({
        "type": "PAUSE"
    });
    ws.send(json)
}

function playSelectedFile(event) {
    var file = this.files[0];
    videoNode.src = window.URL.createObjectURL(file);
}

function send() {
    var json = JSON.stringify({
        "type": "REWIND",
        "timestamp": 1
    });

    ws.send(json);
}

init();