var ws, videoNode, logNode;
var available = true;

function init() {
    videoNode = document.getElementById('video');
    videoNode.addEventListener('pause', onPause, false);
    videoNode.addEventListener('play', onPlay, false);
    videoNode.onerror = log;

    var inputNode = document.getElementById('fileInput');
    inputNode.addEventListener('change', playSelectedFile, false);

    logNode = document.getElementById("log");

    initSocket()
}

function log(msg) {
    var node = document.createElement("p");
    var textNode = document.createTextNode(msg);
    node.appendChild(textNode);
    logNode.appendChild(node);
    logNode.scrollTop = logNode.scrollHeight
}

function onMessage(event) {
    var json = JSON.parse(event.data);
    switch (json.type) {
        case 'PLAY': {
            if (available) {
                available = false;
                videoNode.currentTime = json.timestamp;
                log('play: ' + json.timestamp);
                videoNode.play().finally(function () {
                    available = true;
                });
            }
            break;
        }
        case 'PAUSE': {
            if (available) {
                available = false;
                log('pause');
                videoNode.pause();
                setTimeout(function () {
                    available = true;
                }, 50)
            }
            break;
        }
        case 'LOG': {
            log(json.message)
        }
    }
}

function send(json) {
    if (ws.readyState === ws.CONNECTING) {
        ws.onopen = function () {
            send(json);
            ws.onopen = null
        }
    } else if (ws.readyState === ws.OPEN) {
        ws.send(json)
    } else {
        initSocket();
        send(json)
    }
}

function initSocket() {
    var protocol = document.location.protocol === 'http:' ? 'ws' : 'wss';
    var service = protocol + "://" + document.location.host + document.location.pathname + "/api";
    ws = new WebSocket(service);
    ws.onerror = log;
    ws.onmessage = onMessage;
}

function onPlay(event) {
    if (!available) return;
    log('play: ' + event.target.currentTime);
    var json = JSON.stringify({
        "type": "PLAY",
        "timestamp": event.target.currentTime
    });
    send(json)
}

function onPause(event) {
    if (!available) return;
    log('pause');
    var json = JSON.stringify({
        "type": "PAUSE"
    });
    send(json)
}

function playSelectedFile(event) {
    var file = this.files[0];
    videoNode.src = window.URL.createObjectURL(file);
}

init();