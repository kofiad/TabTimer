let interval = null;
let total_time = 0; 
let isTimerActive = false;


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    
    total_time = message.time; 
    startTimer();
    console.log("Timer started")
  } else if (message.action === 'pause') {
    pauseTimer();
    console.log("Timer paused")
  }
});


function startTimer() {
  if (!isTimerActive) {
    isTimerActive = true;
    interval = setInterval(() => {
      chrome.tabs.query({}, function(tabs) {
        let inactiveTabUrls = tabs.filter(tab => !tab.active && !tab.pinned).map(tab => tab.url);
		let inactiveTabIds = tabs.filter(tab => !tab.active && !tab.pinned).map(tab => tab.id);
        
    
        if (inactiveTabIds.length > 0) {
		  chrome.runtime.sendMessage({tabs: inactiveTabUrls})
          chrome.tabs.remove(inactiveTabIds);
        }
      });
    }, total_time * 1000);
  }
}


function pauseTimer() {
  if (isTimerActive) {
    clearInterval(interval);
    isTimerActive = false;
  }
}

