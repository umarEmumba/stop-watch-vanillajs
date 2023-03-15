const stopWatchTime = {
    breakDown : {
        hours : 0,
        minutes: 0,
        seconds:0,
        milliseconds:0,
    },
    timeStamp : 0,
};
const timeInterval = 15;
let intervalId;
let startTimeStamp;
const htmlElementRefs = {
    watchDial : null,
    currentSplitTime : null,
    watchHistory : null,
    historyItems : null,
    startBtn : null,
    pauseBtn : null,
    splitBtn : null,
    resetBtn : null,
}

// utility function
const prependZeros = (timeUnit,length=2) => {
    return `${ "0".repeat(length-1)}${timeUnit}`.slice(-length);
}

const getCurrentTimeStamp = () => new Date().getTime();

const converMilliToTimeObject = (rawMilliseconds)  => {
    const hours = Math.floor(rawMilliseconds / (60 * 60 * 1000));
    let remainder = rawMilliseconds - (hours * 60 * 60 * 1000);
    const minutes = Math.floor(remainder / (60 * 1000));
    remainder = remainder - (minutes * 60 * 1000);
    const seconds = Math.floor(remainder / 1000);
    const milliseconds = remainder - (seconds * 1000);
    const timeObject = {milliseconds,seconds,minutes,hours};
  return  timeObject;
}

const getPrependedDigits = () => {
    const hours = prependZeros(stopWatchTime.breakDown.hours);
    const minutes = prependZeros(stopWatchTime.breakDown.minutes);
    const seconds = prependZeros(stopWatchTime.breakDown.seconds);
    const milliseconds = prependZeros(stopWatchTime.breakDown.milliseconds,3);
    return {hours,minutes,seconds,milliseconds};
}

const displayUpdatedTime = () => {
    const {hours,minutes,seconds,milliseconds} = getPrependedDigits();
    htmlElementRefs.watchDial.innerHTML = `${hours}:${minutes}:${prependZeros(seconds)}:${milliseconds.charAt(0)}<span class="small-text">${milliseconds.substring(1)}</span>`;
}

const displayCurrentSplitTime = () => {
    const {hours,minutes,seconds,milliseconds} = getPrependedDigits();
    htmlElementRefs.currentSplitTime.innerHTML = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// get refrences
window.onload = () => {
    htmlElementRefs.watchDial = document.getElementById("watch-dial");
    htmlElementRefs.currentSplitTime = document.getElementById("current-split-time");
    htmlElementRefs.watchHistory = document.getElementById("watch-history");
    htmlElementRefs.historyItems = document.getElementsByClassName("stop-watch-history__item");
    htmlElementRefs.startBtn = document.getElementsByClassName("stop-watch__actions-circular-btn--start")?.[0];
    htmlElementRefs.pauseBtn = document.getElementsByClassName("stop-watch__actions-circular-btn--paused")?.[0];
    htmlElementRefs.splitBtn = document.getElementsByClassName("stop-watch__actions-circular-btn--split")?.[0];
    htmlElementRefs.resetBtn = document.getElementsByClassName("stop-watch__actions-circular-btn--reset")?.[0];
}

const watchTicking = () => {
    stopWatchTime.timeStamp = getCurrentTimeStamp() - startTimeStamp;
    stopWatchTime.breakDown = converMilliToTimeObject(stopWatchTime.timeStamp);
    displayUpdatedTime();    
}

const onStart = () => {
    htmlElementRefs.startBtn?.classList.add("d-none");
    htmlElementRefs.pauseBtn?.classList.remove("d-none");
    htmlElementRefs.splitBtn?.classList.remove("stop-watch__actions-circular-btn--disabled");
    htmlElementRefs.resetBtn?.classList.add("stop-watch__actions-circular-btn--disabled");
    startTimeStamp = getCurrentTimeStamp() - stopWatchTime.timeStamp;
    intervalId = setInterval(()=>{
        watchTicking()
    }, timeInterval);
}

const onPause = () => {
    clearInterval(intervalId);
    htmlElementRefs.startBtn?.classList.remove("d-none")
    htmlElementRefs.pauseBtn?.classList.add("d-none")
    htmlElementRefs.splitBtn?.classList.add("stop-watch__actions-circular-btn--disabled");
    htmlElementRefs.resetBtn?.classList.remove("stop-watch__actions-circular-btn--disabled");
    insertHistory("pause");
    
}

const insertHistory = (mode="split") => {
    const {hours,minutes,seconds,milliseconds} = getPrependedDigits();
    const historyItem = `<div class="stop-watch-history__item">
                            <span> #${htmlElementRefs.historyItems.length+1} </span>
                            <span class="history__item--${mode}">${hours}:${minutes}:${seconds}:${milliseconds} </span>
                            <span class="history__item--right"> ${ mode } </span>
                        </div>`;
    htmlElementRefs.watchHistory?.insertAdjacentHTML('beforeend',historyItem);
}

const onSplit = () => {
    displayCurrentSplitTime();
    insertHistory("split");
}

const clearHistory = () => {
    htmlElementRefs.watchHistory.innerHTML='';
    htmlElementRefs.currentSplitTime.innerHTML='SPLIT TIME';
}

const onReset = () => {
    stopWatchTime.breakDown = {
            hours : 0,
            minutes: 0,
            seconds:0,
            milliseconds:0,
        }
    stopWatchTime.timeStamp = 0;
    displayUpdatedTime();
    clearHistory();
    htmlElementRefs.resetBtn?.classList.add("stop-watch__actions-circular-btn--disabled");       
}