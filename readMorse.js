readMorse = {
    DOT_CUTOFF: 200,
    LETTER_CUTOFF: 1000,

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
                }
            }
        },
        inLetterUp: {
            name: 'inLetterUp',
            events: {
                down: function() {
                    audio.start();
                    if (readMorse.timeSinceLast() > readMorse.LETTER_CUTOFF) {
                        readMorse.letters.push(readMorse.decipher(readMorse.tones));
                        readMorse.tones = [];
                    }
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
    },

    timeSinceLast: function() {
        return new Date().getTime() - readMorse.timeMark;
    },

    decipher: function(tones) {
        return morse.lettersByCode[tones.join('')];
    }
}

readMorse.init();
