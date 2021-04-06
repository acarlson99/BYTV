window.onload = function() {
  var port = chrome.runtime.connect({name: "Eval in context"});
  // Add the eval'd response to the console when the background page sends it back
  port.onMessage.addListener(function (msg) {
    addToConsole(msg, false);
  });
  // document.getElementById('run').addEventListener('click', function() {
  chrome.devtools.network.onRequestFinished.addListener(function (req){
    try {
      // Ask the background page to ask the content script to inject a script
      // into the DOM that can finally eval `s` in the right context.
      port.postMessage(req);
      // Outputting `s` to the log in the panel works here,
      // but console.log() does nothing, and I can't observe any
      // results of port.postMessage
    }
    catch(e) {}
  });
};