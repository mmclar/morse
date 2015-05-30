randomMorse = {
    init: function() {
        document.onkeypress = randomMorse.guess;
        randomMorse.letters = [];
        for (var i = 0; i < 5; i++) {
            randomMorse.letters.push('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]);
        }
        document.write('Letters are: ' + randomMorse.letters);
        randomMorse.next();
    },

    guess: function(e) {
        if (String.fromCharCode(e.charCode) == ' ') {
            morse.sendLetter(randomMorse.lastLetter);
        }
        if (String.fromCharCode(e.charCode) == randomMorse.lastLetter) {
            morse.sendLetter(randomMorse.lastLetter);
            document.write(' ' + randomMorse.lastLetter);
            setTimeout(function() {
                randomMorse.next();
            }, 1000);
            document.onkeypress = randomMorse.guess;
        }
    },

    next: function() {
        randomMorse.lastLetter = randomMorse.letters[Math.floor(Math.random() * randomMorse.letters.length)];
        document.write('<br>' + morse.codes[randomMorse.lastLetter]);
        morse.sendLetter(randomMorse.lastLetter);
    }
};

randomMorse.init();
