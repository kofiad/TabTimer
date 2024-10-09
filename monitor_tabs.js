let timeoutInMilliSeconds;
chrome.runtime.onMessage.addListener(async (message, _sender, _sendResponse) => {
  console.log("Submit");
  timeoutInMilliSeconds = Number(message) * 60 * 1000;
  monitor_tabs(timeoutInMilliSeconds);
});


chrome.tabs.onCreated.addListener((_tab)=> {
  monitor_tabs(timeoutInMilliSeconds);
});

function monitor_tabs (timeout) {
  chrome.tabs.query({})
    .then(async (tabs) => {
      // Remove tab if tab hasn't been accessed in a Timeout
      for (const tab of tabs) {
        console.log(Date.now(), tab.lastAccessed, timeout, tab.id);
        if (Date.now() - tab.lastAccessed >= timeout) {
          try {
           await chrome.runtime.sendMessage('tab removed');
          } catch(err) {
            console.log(err);
          }
          chrome.tabs.remove(tab.id);
        }
      }
    });
}
