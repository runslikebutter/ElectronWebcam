'use strict';

var remote = require('@electron/remote');

let videoSource = [];
let videoIndex = 0;
let videoSourceLength = 0;
let selectedSourceId;

window.onload = function (e) {
    init();
    controls();
    webcamPrep();
}

function init() {
    if (hasGetUserMedia()) {
        console.log('Ready to start!');
    } else {
        alert('getUserMedia() is not supported in your browser');
    }

}

function controls() {
    const close = document.querySelector('#closeButton');
    const theatre = document.querySelector('#theatreMode');
    const toggle = document.querySelector('#toggleVideoSource');
    const window = remote.getCurrentWindow();

    toggle.addEventListener(
        'click',
        function (e) {
            videoIndex++;
            playVideo();
        }
    )

    close.addEventListener(
        'click',
        function (e) {
            window.close();
        }
    );

    theatreMode.addEventListener(
        'click',
        function (e) {
            var window = remote.getCurrentWindow();
            if (!window.isFullScreen()) {
                window.setResizable(true);
                window.setFullScreen(true);
            } else {
                window.setFullScreen(false);
                window.setResizable(false);
            }
        }
    );
}

function webcamPrep() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            var tempVideoIndex = 0;

            devices.forEach(device => {
                if (device.kind === 'videoinput')
                    selectedSourceId = device.deviceId;
                console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
            });
            playVideo();
        }).catch(err => console.error(`${err.name}: ${err.message}`));
}

function errorCallback(err) {
    console.log('Rejected', err);
}

function successCallback(stream) {
    const video = document.querySelector('#liveVideo');
    video.srcObject = stream;
    video.autoplay = true
}

function playVideo() {

    videoIndex = videoIndex % videoSourceLength;
    console.log('current video source :', videoSource[videoIndex]);
    const constraints = {
        audio: false,
        video: {
            mandatory: {
                minWidth: 1280,
                minHeight: 720,
                sourceId: selectedSourceId
            }
        }
    }


    navigator.getUserMedia(
        constraints,
        successCallback,
        errorCallback
    );

}



function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
}
