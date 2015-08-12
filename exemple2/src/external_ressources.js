/**
 * Created by berthel on 04/08/15.
 */
'use script';

var ajaxRequest = new XMLHttpRequest();

ajaxRequest.open('GET', 'http://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg', true);
ajaxRequest.responseType = 'arraybuffer';

ajaxRequest.onload = function() {
    window.piano.convolerAudioData = ajaxRequest.response;
};

ajaxRequest.send();