var ws, videoNode;
var available = true;

function init() {
    videoNode = document.getElementById('video');
    videoNode.addEventListener('pause', onPause, false);
    videoNode.addEventListener('play', onPlay, false);

    var inputNode = document.getElementById('fileInput');
    inputNode.addEventListener('change', playSelectedFile, false);

    var protocol = document.location.protocol === 'http:' ? 'ws' : 'wss';
    var service = protocol + "://" + document.location.host + document.location.pathname + "/api";
    ws = new WebSocket(service);
    ws.onmessage = onMessage;
}

function onMessage(event) {
    var json = JSON.parse(event.data);
    switch (json.type) {
        case 'PLAY': {
            if (available) {
                available = false;
                videoNode.currentTime = json.timestamp;
                videoNode.play().finally(function () {
                    available = true;
                });
            }
            break;
        }
        case 'PAUSE': {
            if (available) {
                available = false;
                videoNode.pause();
                setTimeout(function () {
                    available = true;
                }, 50)
            }
            break;
        }
    }
}

function onPlay(event) {
    if (!available) return;
    var json = JSON.stringify({
        "type": "PLAY",
        "timestamp": event.target.currentTime
    });
    ws.send(json)
}

function onPause(event) {
    if (!available) return;
    var json = JSON.stringify({
        "type": "PAUSE"
    });
    ws.send(json)
}

function playSelectedFile(event) {
    var file = this.files[0];
    videoNode.src = window.URL.createObjectURL(file);
}

init();