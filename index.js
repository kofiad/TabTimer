playBtn = document.querySelector(".bx-play");
pauseBtn = document.querySelector(".bx-pause");

chrome.storage.sync.get(['timerState', 'timerValues'], function(data) {
    if (data.timerState === 'paused') {
        playBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
    } else if (data.timerState === 'playing') {
        playBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
    }

    // Load the previous timer values
    if (data.timerValues) {
        document.querySelector(".hour").value = data.timerValues.hour || 0;
        document.querySelector(".mins").value = data.timerValues.minutes || 0;
        document.querySelector(".secs").value = data.timerValues.seconds || 0;
    }
});


playBtn.addEventListener('click', function () {

    let hr = document.querySelector(".hour").value;
    let mins = document.querySelector(".mins").value;
    let secs = document.querySelector(".secs").value;
    let total_time = (hr * 3600) + (mins * 60) + (secs);
    
	chrome.storage.sync.set({
        timerState: 'playing',
        timerValues: { hour: hr, minutes: mins, seconds: secs }
    });
	
	if (total_time !== "0") {
		chrome.runtime.sendMessage({action: "start", time: total_time});
	}
	
	this.classList.toggle("hidden");
    pauseBtn.classList.toggle("hidden");
});

pauseBtn.addEventListener('click', function () {
    
	chrome.storage.sync.set({
        timerState: 'paused'
    });
     
    chrome.runtime.sendMessage({action: "pause"});

	this.classList.toggle("hidden");
    playBtn.classList.toggle("hidden");
});

