/**
 * Created by berthel on 23/07/15.
 */

window.piano.osciloscope = function() {
    var osciloscope = document.getElementById('oscilloscope');

    var osciloCtx = osciloscope.getContext('2d');

    var analyser = window.piano.analyser;

    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        osciloCtx.fillStyle = 'rgb(200, 200, 200)';
        osciloCtx.fillRect(0, 0, osciloscope.width, osciloscope.height);
        osciloCtx.lineWidth = 2;
        osciloCtx.strokeStyle = 'rgb(0, 0, 0)';

        analyser.getByteTimeDomainData(dataArray);

        osciloCtx.beginPath();
        var sliceWidth = osciloscope.width * 1.0 / bufferLength;

        var x = 0;
        for(var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * osciloscope.height / 2;

            if(i === 0) { osciloCtx.moveTo(x, y); }
            else { osciloCtx.lineTo(x, y); }

            x += sliceWidth;
        }
        osciloCtx.stroke();
    }
    draw();
};