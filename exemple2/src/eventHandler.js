/**
 * Created by berthel on 24/07/15.
 */
'use strict';

/**play notes with mouse and keyboard **/
var mouseDownFreq, initialTarget;
var pianoDom = document.getElementById('piano');
pianoDom.onmousedown = function(e) {
    mouseDownFreq = parseFloat(e.target.getAttribute('data-frequency'));
    initialTarget = e.target;
    initialTarget.classList.add('active');
    window.piano.playNote(mouseDownFreq);
};

document.onmouseup = function() {
    if(!mouseDownFreq && !initialTarget) { return; }
    initialTarget.classList.remove('active');
    window.piano.stopNote(mouseDownFreq);
    mouseDownFreq = null;
    initialTarget = null;
};


/**play notes with keys **/
document.onkeydown = function(e) {
    window.piano.toogleNote(e.keyCode, function(note) {
        window.piano.playNote(notes[note]);
        document.getElementById(note).classList.add('active');
    });
};

document.onkeyup = function(e) {
    window.piano.toogleNote(e.keyCode, function(note) {
        window.piano.stopNote(notes[note]);
        document.getElementById(note).classList.remove('active');
    });
};

/**Menu part **/
document.getElementById('oscilo-btn').onclick = function() {
    document.getElementsByClassName('wave-menu')[0].classList.add('active');
};
document.getElementById('oscilo-btn-close').onclick = function() {
    document.getElementsByClassName('wave-menu')[0].classList.remove('active');
};

document.getElementById('param-btn').onclick = function() {
    document.getElementsByClassName('param-menu')[0].classList.add('active');
};
document.getElementById('param-btn-close').onclick = function() {
    document.getElementsByClassName('param-menu')[0].classList.remove('active');
};

/** Input from params */

document.getElementById('mainGain').onchange = function(e) {
    window.piano.mainGain.gain.value = e.target.value;
};