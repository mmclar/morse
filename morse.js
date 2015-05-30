/* Much code from http://patorjk.com/blog/2012/07/22/tone-playing-experiment-with-html5s-web-audio-api/ */

var morse = (function(){
    var base_length = .05,
        dot_l = 1, dash_l = 3, beep_sep_l = 1, letter_sep_l = 5, wordsep_l = 10,
        context = new webkitAudioContext(),
        getOscillator = function() {
            var oscillator = context.createOscillator();
            oscillator.type = 0; // sine wave
            oscillator.frequency.value = 1000;
            oscillator.connect(context.destination);
            return oscillator;
        },
        tone = function(length, cb) {
            var oscillator = getOscillator(),
                curTime = context.currentTime;
            oscillator.start(curTime);
            oscillator.stop(curTime + length);
            oscillator.onended = cb;
        },
        /* Send some beeps and call back when done. */
        doBeeps = function(beeps, cb) {
            doBeep(beeps[0], function() {
                var remBeeps = beeps.slice(1),
                    waitTime;
                if (remBeeps.length > 0) {
                    waitTime = beep_sep_l * base_length * 1000;
                    console.log(waitTime);
                    setTimeout(function() { doBeeps(remBeeps, cb); }, waitTime);
                }
                else {
                    if (cb) cb();
                }
            });
        }
        /* Send a single beep and call back when done. */
        doBeep = function(length, cb) {
            tone(length * base_length, cb);
        };
    return {
        codes: { 'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
                'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---',
                'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---',
                'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
                'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--',
                'z': '--..' },
        dob: doBeeps,
        t: tone,
        sendLetter: function(letter, cb) {
            var i,
                code = morse.codes[letter],
                beeps = [];
            for (i = 0; i < code.length; i++) {
                beeps.push(code[i] == '.' ? dot_l : dash_l);
            }
            doBeeps(beeps, cb);
        },

        sendLetters: function(letters, cb) {
            morse.sendLetter(letters[0], function() {
                var remLetters = letters.slice(1),
                    waitTime;
                if (remLetters.length > 0) {
                    waitTime = letter_sep_l * base_length * 1000;
                    setTimeout(function() { morse.sendLetters(remLetters, cb); }, waitTime);
                }
                else {
                    if (cb) cb();
                }
            });
        },

        sendWords: function(words, cb) {
            morse.sendLetters(words[0], function() {
                var remWords = words.slice(1),
                    waitTime;
                if (remWords.length > 0) {
                    waitTime = wordsep_l * base_length * 1000;
                    setTimeout(function() { morse.sendWords(remWords, cb); }, waitTime);
                }
                else {
                    if (cb) cb();
                }
            });
        },

        sendText: function(text, cb) {
            var words = text.toLowerCase().split(' ');
            morse.sendWords(words, cb);
        }
    };
}());
