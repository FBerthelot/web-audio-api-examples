/**
 * Created by berthel on 08/07/15.
 */
'use strict';

window.onload = function() {
    var audioContext = new window.AudioContext();
    /* volume node */
    var mainGain = audioContext.createGain();

    mainGain.gain.value = 1;
    window.piano.mainGain = mainGain;
    /* osiciloscope !!*/
    var analyser = audioContext.createAnalyser();


    analyser.connect(audioContext.destination);
    mainGain.connect(analyser);

    window.piano.analyser = analyser;
    window.piano.osciloscope();

    var oscillators = {};


    window.piano.playNote = function playNote(freq){
        if(!oscillators[freq]) {
            oscillators[freq] = audioContext.createOscillator();
            oscillators[freq].type = 'sine';
            oscillators[freq].frequency.value = freq;
            oscillators[freq].start(audioContext.currentTime);
            oscillators[freq].connect(mainGain);
        }
    };

    window.piano.stopNote = function stopNote(freq) {
        if(oscillators[freq]) {
            oscillators[freq].stop(audioContext.currentTime);
            delete  oscillators[freq];
        }
    };
};