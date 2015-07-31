/**
 * Created by berthel on 31/07/15.
 */
'use strict';

window.piano.displayKeyAffectation = function displayKeyAffectation(value) {
    var allSpan = document.querySelectorAll('#piano span');
    for(var i=0; i < allSpan.length; i++) {
        var note = allSpan[i].parentElement.getAttribute('id');
        var octave = parseInt(note[note.length - 1]);
        note = note.substr(0, note.length - 1);
        if(note === 'sold') { note = 'lab'; }

        var textOfSpan = note;
        textOfSpan = textOfSpan[textOfSpan.length - 1] === 'b' ? textOfSpan.substring(0, textOfSpan.length -1).toUpperCase() + 'b' :
            (textOfSpan[textOfSpan.length - 1] === 'd' ? textOfSpan.substring(0, textOfSpan.length -1).toUpperCase() + '#' : textOfSpan.toUpperCase());

        var upperOctave = value == octave;
        if(value == octave - 1 || upperOctave) {
            switch(note) {
                case 'do':
                    textOfSpan = upperOctave ? 'q' : 'k';
                    break;
                case 'dod':
                    textOfSpan = upperOctave ? 'z' : 'o';
                    break;
                case 're':
                    textOfSpan = upperOctave ? 's' : 'l';
                    break;
                case 'red':
                    textOfSpan = upperOctave ? 'e' : 'p';
                    break;
                case 'mi':
                    textOfSpan = upperOctave ? 'd' : 'm';
                    break;
                case 'fa':
                    textOfSpan = upperOctave ? 'f' : 'ù';
                    break;
                case 'fad':
                    textOfSpan = upperOctave ? 't' : '^';
                    break;
                case 'sol':
                    textOfSpan = upperOctave ? 'g' : '*';
                    break;
                case 'lab':
                    textOfSpan = upperOctave ? 'y' : '$';
                    break;
                case 'la':
                    textOfSpan = upperOctave ? 'h' : 'n';
                    break;
                case 'lad':
                    textOfSpan = upperOctave ? 'u' : ',';
                    break;
                case 'si':
                    textOfSpan = upperOctave ? 'j' : ';';
                    break;
            }
            textOfSpan = '<em>'+ textOfSpan +'</em>';
        }
        allSpan[i].innerHTML = textOfSpan;
    }
};