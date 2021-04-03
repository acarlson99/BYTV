function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// update chat every so many seconds
async function sendPeriodicMessage(msg, period) {
  for (;;) {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs === undefined || tabs.length < 1) return
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: msg });
      });
    } catch(err){}
    await sleep(period); // TODO: not this. Could be better
  }
}

sendPeriodicMessage("update chatframe", 1000);
