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
        console.log('Moving to ' + newState.name + '.');
        console.log('Tones: ' + readMorse.tones);
        console.log('Letters: ' + readMorse.letters);
        readMorse.currentState = newState;
        document.onkeydown = this.currentState.events.down;
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
