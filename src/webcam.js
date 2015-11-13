//Webcam Video Player
//Mario Solorzano

var remote = require('remote');

var audioSource = [];
var videoSource = [];

var videoIndex = 0;
var audioIndex = 0;

window.onload=function(e){
    init();
    controls();
    webcamPrep();
}

function init(){
    if (hasGetUserMedia()){
        console.log('Ready to start!');
    }else{
        alert('getUserMedia() is not supported in your browser');
    }

}

function controls(){
    var close = document.querySelector('#closeButton');
    var theatre = document.querySelector('#theatreMode');
    var window = remote.getCurrentWindow();

    close.addEventListener(
        'click',
        function(e){
            window.close();
        }
    );

    theatreMode.addEventListener(
        'click',
        function(e){
            var window = remote.getCurrentWindow();
            if (!window.isFullScreen()){
                window.setResizable(true);
                window.setFullScreen(true);
            }else{
                window.setFullScreen(false);
                window.setResizable(false);
            }
        }
    );
}

function webcamPrep(){
    MediaStreamTrack.getSources(
        function(sourceInfos){
            for (var i = 0; i != sourceInfos.length; ++i){
                //console.log(sourceInfos[i]);
                if (sourceInfos[i].kind === 'audio'){
                    //console.log('audio source found: ', sourceInfos);
                    audioSource[audioIndex] = sourceInfos[i];
                    audioIndex++;

                } else if (sourceInfos[i].kind === 'video') {
                    //console.log('video source found: ', sourceInfos);
                    videoSource[videoIndex] = sourceInfos[i];

                    videoIndex++;

                }
            }
            audioIndex = 0;
            videoIndex = 0;
            //console.log('video ID', videoSource[0]);
            playVideo();
        }
    );
}

function errorCallback(err){
    console.log('Rejected', err);
}

function successCallback(stream){
    var video = document.querySelector('#liveVideo');
    video.src = window.URL.createObjectURL(stream);
}

function playVideo(){

    console.log('video source ID', videoSource[videoIndex].id);
    var constraints = {
        audio: false,
        video: {
            mandatory: {
                minWidth: 1200,
                minHeight: 720,
                sourceId:videoSource[videoIndex].id
            }
        }
    }


    navigator.webkitGetUserMedia(
        constraints,
        successCallback,
        errorCallback
    );

}



function hasGetUserMedia(){
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
}
