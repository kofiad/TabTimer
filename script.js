document.getElementById('button').addEventListener('click', setTimer);

async function setTimer () {
  const timeout = document.getElementById('timeout').value;
  await chrome.runtime.sendMessage(timeout);
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  alert(message);
});
