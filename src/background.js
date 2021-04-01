function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// update chat every so many seconds
async function sendPeriodicMessage(msg, period) {
  for (;;) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message: msg });
    });
    await sleep(period); // TODO: not this. Could be better
  }
}

sendPeriodicMessage("update chatframe", 1000);
