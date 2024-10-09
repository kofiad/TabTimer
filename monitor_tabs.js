// Get Message from content.js
chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  const timeoutInMilliSeconds = Number(message) * 60 * 1000;
  chrome.tabs.query({})
    .then((tabs) => {
      console.log(`Timeout: ${message}, Number of tabs: ${tabs.length}`);

      // Remove tab if tab hasn't been accessed in a Timeout
      for (const tab of tabs) {
        console.log(Date.now(), tab.lastAccessed);
        if (Date.now() - tab.lastAccessed >= timeoutInMilliSeconds) {
          sendResponse('Tab has been removed');
          chrome.tabs.remove(tab.id);
        }
      }

      sendResponse('done');
    });

  return true;
});
