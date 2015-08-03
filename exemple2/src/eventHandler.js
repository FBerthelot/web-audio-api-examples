/**
 * Created by berthel on 24/07/15.
 */
'use strict';

/**play notes with mouse and keyboard **/
var mouseDownNote, initialTarget;
var pianoDom = document.getElementById('piano');

pianoDom.onmousedown = pianoDom.ontouchstart = function(e) {
    mouseDownNote = e.target.getAttribute('id');
    initialTarget = e.target;
    initialTarget.classList.add('active');
    window.piano.playNote(notes[mouseDownNote]);
};



document.onmouseup = pianoDom.ontouchend =  function() {
    if(!mouseDownNote && !initialTarget) { return; }
    initialTarget.classList.remove('active');
    window.piano.stopNote(notes[mouseDownNote]);
    mouseDownNote = null;
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

document.getElementById('mainGain').oninput = function(e) {
    window.piano.mainGain.gain.value = e.target.value;
};
document.getElementById('octave').oninput = function(e) {
    window.piano.displayKeyAffectation(e.target.value);
};

//Attack Decay Sustain and Realease Params
window.piano.adsr = {
    isActive: document.getElementById('adsrToggle').checked,
    attack: parseFloat(document.getElementById('attack').value),
    decay: parseFloat(document.getElementById('decay').value),
    maxIntensity: parseFloat(document.getElementById('max_intensity').value),
    release: parseFloat(document.getElementById('release').value)
};

document.getElementById('adsrToggle').onchange = function(e) {
    if(e.target.checked) {
        document.getElementById('adsrParams').classList.remove('hide');
    } else {
        document.getElementById('adsrParams').classList.add('hide');
    }
    window.piano.adsr.isActive = e.target.checked;
};

document.getElementById('attack').oninput = function(e) {
    window.piano.adsr.attack = parseFloat(e.target.value);
};
document.getElementById('decay').oninput = function(e) {
    window.piano.adsr.decay = parseFloat(e.target.value);
};
document.getElementById('max_intensity').oninput = function(e) {
    window.piano.adsr.maxIntensity = parseFloat(e.target.value);
};
document.getElementById('release').oninput = function(e) {
    window.piano.adsr.release = parseFloat(e.target.value);
};

//Oscilator Type
window.piano.oscilatorType = 'sine';
document.getElementById('oscilator_type').oninput = function(e) {
    window.piano.oscilatorType = e.target.value;
};