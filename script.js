const body = document.getElementsByTagName('body')[0];
const timingWin = document.getElementById('timing');
const setupWin = document.getElementById('setup');
const noteText = document.getElementById('note');
const secondsInput = document.getElementById('seconds');

let preTimerRemaining;
let preTimer;

let actualTimeRemaining;
let timer;
let paused = false;

const noSleep = new NoSleep();

const MIN_PRE_TIME = 3;
const MAX_PRE_TIME = 7;

function timerStartedEvent()
{
    new Audio('beep.mp3').play();
}

function timerCompletedEvent()
{
    new Audio('beep.mp3').play();
}

function setTimeLimitTo(value) {
    secondsInput.value = value;
}

function toggleTimer() {
    // Can't pause the pre timer
    if (preTimerRemaining > 0) {
        return;
    }

    // Unpause by just restarting the timer with actual time remaining
    if (paused) {
        paused = false;
        startTimer(3, actualTimeRemaining);
        return;
    }

    // Pause by stopping timer, don't clear actualTimeRemaining though
    clearInterval(timer);
    body.setAttribute('class', 'paused');
    paused = true;
}

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

            timerStartedEvent();

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

                    timerCompletedEvent();
                }
            }, 1000);
        }
    }, 1000);
}

document.getElementById('go').onclick = function () {
    noSleep.enable();
    document.documentElement.webkitRequestFullscreen();

    startTimer(
        Math.floor(Math.random() * (MAX_PRE_TIME - MIN_PRE_TIME + 1)) + MIN_PRE_TIME,
        parseInt(secondsInput.value)
    );
};
document.getElementById('timing').onclick = toggleTimer;
