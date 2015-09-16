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

    var convolver = audioContext.createConvolver();
    var concertHallBuffer;
    function test() {
        if(window.piano.convolerAudioData) {
            audioContext.decodeAudioData(window.piano.convolerAudioData, function (buffer) {
                concertHallBuffer = buffer;
                var soundSource = audioContext.createBufferSource();
                soundSource.buffer = concertHallBuffer;
                convolver.buffer = concertHallBuffer;
            }, function (e) {
                "Error with decoding audio data" + e.err
            });
        }
        else {
            setTimeout(test, 1500);
        }
    }
    test();

    analyser.connect(audioContext.destination);

    function connectingNodes(convoler) {
        mainGain.disconnect();
        convolver.disconnect();
        if (convoler) {
            mainGain.connect(convolver);
            convolver.connect(analyser);
        }
        else {
            convolver.connect(analyser);
        }
    }
    connectingNodes(document.getElementById('convoler').checked);
    document.getElementById('convoler').onchange = function(e) {
        connectingNodes(e.target.checked);
    };

    window.piano.analyser = analyser;
    window.piano.osciloscope();

    var oscillators = {};
    var harmonique = {};
    var gain = {};

    window.piano.playNote = function playNote(freq){
        if(!oscillators[freq]) {
            oscillators[freq] = audioContext.createOscillator();
            oscillators[freq].type = window.piano.oscilatorType;
            oscillators[freq].frequency.value = freq;
            oscillators[freq].start(audioContext.currentTime);

            gain[freq] = audioContext.createGain();
            gain[freq].gain.value = 0.1;

            if(window.piano.harmonique.isActive){
                harmonique[freq] = [];
                for(var i=0; i < window.piano.harmonique.number; i++) {
                    harmonique[freq][i] = {
                        oscillator: audioContext.createOscillator(),
                        gain: audioContext.createGain()
                    };
                    harmonique[freq][i].oscillator.type = window.piano.oscilatorType;
                    harmonique[freq][i].oscillator.frequency.value = freq * 2 * (i+1);
                    harmonique[freq][i].oscillator.start(audioContext.currentTime);

                    harmonique[freq][i].gain.gain.value = 1.0 / ((i+1)*2);

                    harmonique[freq][i].oscillator.connect(harmonique[freq][i].gain);
                    harmonique[freq][i].gain.connect(gain[freq]);
                }
            }

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

            for(var i in harmonique[freq]) {
                harmonique[freq][i].oscillator.stop(audioContext.currentTime);
                delete harmonique[freq][i].oscillator;
                delete harmonique[freq][i].gain;
            }
            delete harmonique[freq];
            delete oscillators[freq];
            delete gain[freq];
        }
    };
};