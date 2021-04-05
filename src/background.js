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
