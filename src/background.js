async function sendMessage(msg) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs === undefined || tabs.length < 1) return;
      const activeTab = tabs[0];
      if (activeTab && activeTab.url
          && activeTab.url.match(/^(https?:\/\/)?(www\.)?youtube\.com/)) {
        chrome.tabs.sendMessage(activeTab.id, msg);
      }
    });
  } catch (err) {}
}

chrome.runtime.onConnect.addListener(port => {
  console.log("Background new port connection");
  // Listen for message from the panel and pass it on to the content
  port.onMessage.addListener(message => {
    // Request a tab for sending needed information
    // chrome.tabs.query({'active': true,'currentWindow': true}, function (tabs) {
    // Send message to content script
    // if (tabs) {
    // chrome.tabs.sendMessage(tabs[0].id, { message: "chat update", data: message });
    sendMessage({ message: "chat update", data: message });
    // }
  });
  // });
  // Post back to Devtools from content
  chrome.runtime.onMessage.addListener((message, sender) => {
    port.postMessage(message);
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// update chat every so many seconds
async function sendPeriodicMessage(msg, period) {
  for (;;) {
    sendMessage({ message: msg });
    await sleep(period); // TODO: not this. Could be better
  }
}

sendPeriodicMessage("update chatframe", 1000);
