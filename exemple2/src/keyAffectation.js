/**
 * Created by berthel on 23/07/15.
 */
'use strict';

window.piano.toogleNote = function toogleNote(keycode, funcToCall) {
    var keyNumber = window.piano.touches;

    var octaveValue = document.getElementById('octave').value.toString();
    var octaveValuePlus1 = (parseInt(octaveValue) + 1).toString();

    switch(keycode) {
        case keyNumber.q:
            funcToCall('do'+ octaveValue);
            break;
        case keyNumber.z:
            funcToCall('dod'+ octaveValue);
            break;
        case keyNumber.s:
            funcToCall('re'+ octaveValue);
            break;
        case keyNumber.e:
            funcToCall('red'+ octaveValue);
            break;
        case keyNumber.d:
            funcToCall('mi'+ octaveValue);
            break;
        case keyNumber.f:
            funcToCall('fa'+ octaveValue);
            break;
        case keyNumber.t:
            funcToCall('fad'+ octaveValue);
            break;
        case keyNumber.g:
            funcToCall('sol' + octaveValue);
            break;
        case keyNumber.y:
            funcToCall('sold'+ octaveValue);
            break;
        case keyNumber.h:
            funcToCall('la'+ octaveValue);
            break;
        case keyNumber.u:
            funcToCall('lad'+ octaveValue);
            break;
        case keyNumber.j:
            funcToCall('si'+ octaveValue);
            break;
        case keyNumber.k:
            funcToCall('do'+ octaveValuePlus1);
            break;
        case keyNumber.o:
            funcToCall('dod'+ octaveValuePlus1);
            break;
        case keyNumber.l:
            funcToCall('re'+ octaveValuePlus1);
            break;
        case keyNumber.p:
            funcToCall('red'+ octaveValuePlus1);
            break;
        case keyNumber.m:
            funcToCall('mi'+ octaveValuePlus1);
            break;
        case keyNumber['ù']:
            funcToCall('fa'+ octaveValuePlus1);
            break;
        case keyNumber['^']:
            funcToCall('fad'+ octaveValuePlus1);
            break;
        case keyNumber['*']:
            funcToCall('sol'+ octaveValuePlus1);
            break;
        case keyNumber['$']:
            funcToCall('sold'+ octaveValuePlus1);
            break;
        case keyNumber.n:
            funcToCall('la'+ octaveValuePlus1);
            break;
        case keyNumber[',']:
            funcToCall('lad'+ octaveValuePlus1);
            break;
        case keyNumber[';']:
            funcToCall('si'+ octaveValuePlus1);
            break;
    }
};