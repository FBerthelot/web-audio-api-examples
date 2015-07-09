/**
 * Created by berthel on 08/07/15.
 */
'use strict';

window.onload = function() {

    document.getElementById('beep').onclick = function(e) {
        //just styling
        e.target.classList.add('clicked');
        setTimeout(function() {
            e.target.classList.remove('clicked');
        }, 3000);

        var audioContext = new AudioContext();
        var oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    };

};

