chrome.runtime.onConnect.addListener(function (port) {
  console.log("AAAAAAAA")
  // Listen for message from the panel and pass it on to the content
  port.onMessage.addListener(function (message) {
    // Request a tab for sending needed information
    // chrome.tabs.query({'active': true,'currentWindow': true}, function (tabs) {
      // Send message to content script
      // if (tabs) {
        // chrome.tabs.sendMessage(tabs[0].id, { message: "chat update", data: message });
    console.log("MSG", message)
    sendMessage({ message: "chat update", data: message })
      // }
    });
  // });
  // Post back to Devtools from content
  chrome.runtime.onMessage.addListener(function (message, sender) {
    port.postMessage(message);
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

// update chat every so many seconds
async function sendPeriodicMessage(msg, period) {
  for (;;) {
    sendMessage({ message: msg });
    await sleep(period); // TODO: not this. Could be better
  }
}

sendPeriodicMessage("update chatframe", 1000);
