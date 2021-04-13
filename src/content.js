const { emotes } = require("./emote");
const { updateChatframe } = require("./chat");

let emoteMap = new Map();

// listen for msg from background script
chrome.runtime.onMessage.addListener(request => {
  if (request.message === "update chatframe") {
    try {
      if (emoteMap.size > 0) updateChatframe(emoteMap);
    } catch (err) {}
  }
});

// const changeLogo = async img => {
//   try {
//     console.log(img);

//     $("#logo-icon").html(
//       '<img id="logo-icon" class="style-scope ytd-topbar-logo-renderer" src=' +
//         img +
//         " />"
//     );
//   } catch (err) {
//     console.error(err);
//   }
// };

const updateEmotes = async() => {
  let m = await emotes();
  while (m.size < 1) {
    m = await emotes();
  }
  emoteMap = m;
};

updateEmotes(); // TODO: find better way to do this. Could lead to race conditions
