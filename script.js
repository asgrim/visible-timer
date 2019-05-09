var body = document.getElementsByTagName('body')[0];
var timingWin = document.getElementById('timing');
var setupWin = document.getElementById('setup');
var noteText = document.getElementById('note');
var secondsInput = document.getElementById('seconds');

var preTimerRemaining;
var preTimer;

var actualTimeRemaining;
var timer;

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

            new Audio('beep.mp3').play();

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
                }
            }, 1000);
        }
    }, 1000);
}

document.getElementById('go').onclick = function () {
    document.documentElement.webkitRequestFullscreen();
    startTimer(3, parseInt(secondsInput.value));
};
