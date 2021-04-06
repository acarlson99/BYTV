// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function sendMessage(msg) {
//   try {
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//       if (tabs === undefined || tabs.length < 1) return;
//       const activeTab = tabs[0];
//       if (activeTab && activeTab.url
//           && activeTab.url.match(/^(https?:\/\/)?(www\.)?youtube\.com/)) {
//         chrome.tabs.sendMessage(activeTab.id, msg);
//       }
//     });
//   } catch (err) {}
// }

// chrome.devtools.network.onRequestFinished.addListener(
//   r => {
//     sendMessage({ message: "chat update", data: r });
//   });

chrome.devtools.panels.create("NewPanel",
  null,
  "panel.html",
  null
);
