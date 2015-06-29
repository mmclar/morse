readMorse = {
    init: function() {
        readMorse.started = false;
        document.onkeydown = document.onkeyup = readMorse.recordEvent;
        readMorse.timings = { 'down': [], 'up': [] };
    },

    recordEvent: function(e) {
        var eventTime = Date.now();
        if (e.keyCode == 16) {
            if (e.type == 'keydown') {
                if (!readMorse.startTime) {
                    readMorse.startTime = eventTime;
                }
                readMorse.timings.down.push(eventTime);
                audio.start();
            }
            else {
                readMorse.timings.up.push(eventTime);
                audio.end();
            }
            clearTimeout(readMorse.timer);
            readMorse.timer = setTimeout(function() {
                //morse.read(readMorse.timings);
                document.write('<p>down: ' + readMorse.timings.down);
                document.write('<br>up: ' + readMorse.timings.up);
                document.onkeydown = document.onkeyup = readMorse.recordEvent;
            }, 1000);
        }
    }
};

readMorse.init();
