readMorse = {
    DOT_CUTOFF: 200,
    LETTER_CUTOFF: 300,

    tones: [],
    letters: [],
    words: [],

    states: {
        outLetterUp: {
            name: 'outLetterUp',
            events: {
                down: function() {
                    audio.start();
                    readMorse.moveState(readMorse.states.inLetterDown);
                }
            }
        },
        inLetterDown: {
            name: 'inLetterDown',
            events: {
                up: function() {
                    readMorse.tones.push(readMorse.timeSinceLast() < readMorse.DOT_CUTOFF ? '.' : '-');
                    audio.end();
                    readMorse.moveState(readMorse.states.inLetterUp);
                    readMorse.pushTimer = setTimeout(function() {
                        readMorse.letters.push(readMorse.decipher(readMorse.tones));
                        readMorse.tones = [];
                        document.getElementById('output').innerHTML = readMorse.letters.join('');
                    }, readMorse.LETTER_CUTOFF);
                }
            }
        },
        inLetterUp: {
            name: 'inLetterUp',
            events: {
                down: function() {
                    audio.start();
                    readMorse.moveState(readMorse.states.inLetterDown);
                }
            }
        }
    },

    init: function() {
        this.moveState(this.states.outLetterUp);
    },

    moveState: function(newState) {
        readMorse.currentState = newState;
        document.onkeydown = function(e) {
            var ignoreCodes = [17, 18, 27];
            if (ignoreCodes.indexOf(e.keyCode) < 0) {
                readMorse.currentState.events.down();
            }
            if (e.keyCode == 27) {
                readMorse.letters = [];
                document.getElementById('output').innerHTML = '';
            }
        }
        document.onkeyup = this.currentState.events.up;
        readMorse.timeMark = new Date().getTime();
        clearTimeout(readMorse.pushTimer);
    },

    timeSinceLast: function() {
        return new Date().getTime() - readMorse.timeMark;
    },

    decipher: function(tones) {
        return morse.lettersByCode[tones.join('')];
    }
}

readMorse.init();
