/**
 * Created by berthel on 23/07/15.
 */
'use strict';

window.piano.toogleNote = function toogleNote(keycode, funcToCall) {
    var keyNumber = window.piano.touches;
    switch(keycode) {
        case keyNumber.q:
            funcToCall('do0');
            break;
        case keyNumber.z:
            funcToCall('dod0');
            break;
        case keyNumber.s:
            funcToCall('re0');
            break;
        case keyNumber.e:
            funcToCall('red0');
            break;
        case keyNumber.d:
            funcToCall('mi0');
            break;
        case keyNumber.f:
            funcToCall('fa0');
            break;
        case keyNumber.t:
            funcToCall('fad0');
            break;
        case keyNumber.g:
            funcToCall('sol0');
            break;
        case keyNumber.y:
            funcToCall('sold0');
            break;
        case keyNumber.h:
            funcToCall('la0');
            break;
        case keyNumber.u:
            funcToCall('lad0');
            break;
        case keyNumber.j:
            funcToCall('si0');
            break;
        case keyNumber.k:
            funcToCall('do1');
            break;
        case keyNumber.o:
            funcToCall('dod1');
            break;
        case keyNumber.l:
            funcToCall('re1');
            break;
        case keyNumber.p:
            funcToCall('red1');
            break;
        case keyNumber.m:
            funcToCall('mi1');
            break;
        case keyNumber['ù']:
            funcToCall('fa1');
            break;
        case keyNumber['^']:
            funcToCall('fad1');
            break;
        case keyNumber['*']:
            funcToCall('sol1');
            break;
        case keyNumber['$']:
            funcToCall('sold1');
            break;
        case keyNumber.n:
            funcToCall('si4');
            break;
    }
};