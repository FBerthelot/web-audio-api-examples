/**
 * Created by berthel on 08/07/15.
 */
'use strict';

window.onload = function() {

    document.onkeydown = function(e) {
        //console.log(e.keyCode);
        switch(e.keyCode) {
            case 65:
                playNote(440, audioContext.currentTime);
                break;
            case 90:
                playNote(466, audioContext.currentTime);
                break;
            case 69:
                playNote(494, audioContext.currentTime);
                break;
            case 82:
                playNote(523, audioContext.currentTime);
                break;
            case 84:
                playNote(554, audioContext.currentTime);
                break;
            case 89:
                playNote(587, audioContext.currentTime);
                break;
            case 85:
                playNote(622, audioContext.currentTime);
                break;
            case 73:
                playNote(659, audioContext.currentTime);
                break;
        }
    };

    document.onkeyup = function() {
        vca.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    };

    /* AudioContext */
    var audioContext = new window.AudioContext();

    /* VCO - Voltage Controlled Oscillator */
    var vco = audioContext.createOscillator();
    vco.type = 'sine';
    vco.frequency.value = 0;
    vco.start(audioContext.currentTime);

    /* VCA - Voltage Controlled Amplifier */
    var vca = audioContext.createGain();
    vca.gain.value = 0;

    /* Filter */
    var filter = audioContext.createBiquadFilter();

    /* Connections */
    vco.connect(vca);
    vca.connect(filter);
    filter.connect(audioContext.destination);


    function playNote(freq, time){
        vco.frequency.value = freq;
        vca.gain.cancelScheduledValues(time);
        vca.gain.setValueAtTime(0, time);
        vca.gain.linearRampToValueAtTime(1, time + 0.1);
    }
};