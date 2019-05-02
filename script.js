var body = document.getElementsByTagName('body')[0];
var timingWin = document.getElementById('timing');
var setupWin = document.getElementById('setup');
var noteText = document.getElementById('note');
var secondsInput = document.getElementById('seconds');

var preTimerRemaining;
var preTimer;

var actualTimeRemaining;
var timer;

var noSleep = new NoSleep();

function startTimer(preTime, actualTime) {
    setupWin.setAttribute('class', 'hidden');
    timingWin.setAttribute('class', '');
    body.setAttribute('class', 'stopped');
    preTimerRemaining = preTime;
    actualTimeRemaining = actualTime;
    noteText.innerText = preTimerRemaining;
    preTimer = setInterval(function () {
        preTimerRemaining--;
        noteText.innerText = preTimerRemaining;

        if (preTimerRemaining === 0) {
            clearInterval(preTimer);
            noteText.innerText = actualTimeRemaining;
            body.setAttribute('class', 'started');
            timer = setInterval(function () {
                actualTimeRemaining--;
                noteText.innerText = actualTimeRemaining;

                if (actualTimeRemaining === 0) {
                    clearInterval(timer);
                    setupWin.setAttribute('class', '');
                    timingWin.setAttribute('class', 'hidden');
                    body.setAttribute('class', 'stopped');
                    noSleep.disable();
                }
            }, 1000);
        }
    }, 1000);
}

document.getElementById('go').onclick = function () {
    document.documentElement.requestFullscreen();
    noSleep.enable();
    startTimer(3, parseInt(secondsInput.value));
};
