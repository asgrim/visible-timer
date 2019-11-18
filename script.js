const body = document.getElementsByTagName('body')[0];
const timingWin = document.getElementById('timing');
const setupWin = document.getElementById('setup');
const welcomeWin = document.getElementById('welcome');
const noteText = document.getElementById('note');
const secondsInput = document.getElementById('seconds');

let preTimerRemaining;
let preTimer;

let actualTimeSet;
let actualTimeRemaining;
let timer;
let paused = false;

const noSleep = new NoSleep();

const MIN_PRE_TIME = 3000;
const MAX_PRE_TIME = 7000;
const TICK_SIZE = 100;

const numberFormatter = Intl.NumberFormat(
    'en',
    {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }
);

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
        startTimer(3000, actualTimeRemaining, actualTimeSet);
        return;
    }

    // Pause by stopping timer, don't clear actualTimeRemaining though
    clearInterval(timer);
    body.setAttribute('class', 'paused');
    paused = true;
}

function renderTime(timeInMs)
{
    noteText.innerHTML = numberFormatter.format(timeInMs / 1000) + ' remaining<br />'
    + numberFormatter.format((actualTimeSet - timeInMs) / 1000) + ' elapsed<br />';
}

function stopAndReset() {
    clearInterval(preTimer);
    clearInterval(timer);
    preTimerRemaining = 0;
    actualTimeRemaining = 0;
    setupWin.setAttribute('class', '');
    timingWin.setAttribute('class', 'hidden');
    body.setAttribute('class', 'stopped');
    paused = false;
    renderTime(0);
}

function startTimer(preTime, actualTime, originalActualTime) {
    setupWin.setAttribute('class', 'hidden');
    timingWin.setAttribute('class', '');
    body.setAttribute('class', 'stopped');
    preTimerRemaining = preTime;
    actualTimeRemaining = actualTime;
    actualTimeSet = originalActualTime;
    renderTime(preTimerRemaining);
    preTimer = setInterval(function () {
        preTimerRemaining -= TICK_SIZE;
        renderTime(preTimerRemaining);

        if (preTimerRemaining <= 0) {
            clearInterval(preTimer);

            timerStartedEvent();

            renderTime(actualTimeRemaining);
            body.setAttribute('class', 'started');
            timer = setInterval(function () {
                actualTimeRemaining -= TICK_SIZE;
                renderTime(actualTimeRemaining);

                if (actualTimeRemaining <= 0) {
                    stopAndReset();

                    timerCompletedEvent();
                }
            }, TICK_SIZE);
        }
    }, TICK_SIZE);
}

document.getElementById('startup').onclick = function () {
    noSleep.enable();
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    }

    screen.orientation.lock('landscape');

    welcomeWin.setAttribute('class', 'hidden');
    setupWin.setAttribute('class', '');
};
document.getElementById('go').onclick = function () {
    startTimer(
        Math.floor(Math.random() * (MAX_PRE_TIME - MIN_PRE_TIME + 1)) + MIN_PRE_TIME,
        parseInt(secondsInput.value) * 1000,
        parseInt(secondsInput.value) * 1000
    );
};
document.getElementById('timing').onclick = toggleTimer;
