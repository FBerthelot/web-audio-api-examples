/**
 * Created by berthel on 08/07/15.
 */
'use strict';

window.onload = function() {

    document.getElementById('beep').onclick = function() {
        var audioContext = new AudioContext();
        var oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    };

};

