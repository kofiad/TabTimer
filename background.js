let trackTabs = {}
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


function updateTracker(tabId) {
	const currentTime = Date.now();

	trackTabs[tabId] = currentTime;
}

chrome.tabs.onActivated.addListener((activeInfo) => {
	updateTracker(activeInfo.tabId);
});
  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
if (changeInfo.url || changeInfo.title) {
	updateTracker(tabId);
}
});

function startTimer() {
  if (!isTimerActive) {
    isTimerActive = true;

    interval = setInterval(() => {
	  currentTime = Date.now();

      chrome.tabs.query({active: false, pinned: false}, function(tabs) {
		for (const tab of tabs){
			let lastAccessed = trackTabs[tab.id];
			if (lastAccessed && (currentTime - lastAccessed) >= (total_time * 1000)) {
				cacheCloseTabs(tab);
				console.log(`${tab.title} tab was closed at ${Date()}`);
				chrome.tabs.remove(tab.id);
				delete trackTabs[tab.id];
			}
		}
      });
    }, 5000);
  }
}


function pauseTimer() {
  if (isTimerActive) {
    clearInterval(interval);
    isTimerActive = false;
  }
}


function cacheCloseTabs(tab) {
    const tabData = {
        id: tab.id,
        url: tab.url,
        title: tab.title
    };

    chrome.storage.session.get(['closedTabs']).then((result) => {
        const closedTabs = result.closedTabs || [];

        if (!closedTabs.some(t => t.url === tab.url)) {
            closedTabs.push(tabData);
        }

        chrome.storage.session.set({ 'closedTabs': closedTabs });
    });
}
