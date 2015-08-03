/**
 * Created by berthel on 08/07/15.
 */
'use strict';

window.onload = function() {
    window.piano.displayKeyAffectation(document.getElementById('octave').value);

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
    var gain = {};


    window.piano.playNote = function playNote(freq){
        if(!oscillators[freq]) {
            oscillators[freq] = audioContext.createOscillator();
            oscillators[freq].type = window.piano.oscilatorType;
            oscillators[freq].frequency.value = freq;
            oscillators[freq].start(audioContext.currentTime);

            gain[freq] = audioContext.createGain();
            gain[freq].gain.value = 0.1;

            oscillators[freq].connect(gain[freq]);
            gain[freq].connect(mainGain);

            if(window.piano.adsr && window.piano.adsr.isActive) {
                gain[freq].gain.linearRampToValueAtTime(window.piano.adsr.maxIntensity, audioContext.currentTime);
                gain[freq].gain.linearRampToValueAtTime(1, audioContext.currentTime + window.piano.adsr.attack + window.piano.adsr.decay);
            }
            else {
                gain[freq].gain.value = 1;
            }
        }
    };

    window.piano.stopNote = function stopNote(freq) {
        if(oscillators[freq]) {
            if(window.piano.adsr && window.piano.adsr.isActive) {
                gain[freq].gain.linearRampToValueAtTime(0, audioContext.currentTime + window.piano.adsr.release);
                oscillators[freq].stop(audioContext.currentTime + window.piano.adsr.release);
            } else {
                oscillators[freq].stop(audioContext.currentTime);
            }

            delete  oscillators[freq];
            delete  gain[freq];
        }
    };
};