// send message when extension button clicked
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: "click browser action" });
  });
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// update chat
async function a() {
  for (;;) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message: "do thing" });
    });
    await sleep(3000);
  }
}

a();
