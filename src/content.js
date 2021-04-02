// 'use strict'

const $ = require("jquery");
const { emotes, emoteHTML } = require("./emotes.js");

let emoteMap = new Map();

const logErr = (...args) => {
  console.log("BYTV log:", ...args);
};

const updateChatframe = () => {
  const chatElems = $("#chatframe")[0].contentDocument.
    getElementsByTagName("yt-live-chat-text-message-renderer");
  console.log(chatElems);
  if (chatElems.length <= 0) {
    return;
  }

  // for all existing messages
  for (let i = 0; i < chatElems.length; i++) {
    try {
      const msg = chatElems[i];
      const p = msg.
        getElementsByClassName("yt-live-chat-text-message-renderer");

      // update msg HTML
      const s = p.message.innerHTML.split(/[<>]/); // TODO: dont do this, is bad
      for (let j = 0; j < s.length; j++) {
        if (j % 2 === 0) {
          // every odd index is an HTML element
          s[j] = s[j].replace(/\w+/g, ss => {
            const emote = emoteMap.get(ss);
            if (emote) {
              return emoteHTML(emote);
            } else {
              return ss;
            }
          });
        } else {
          s[j] = "<" + s[j] + ">";
        }
      }
      p.message.innerHTML = s.join("");
    } catch (err) {
      logErr(err);
    }
  }
};

// listen for msg from background script
chrome.runtime.onMessage.addListener(request => {
  if (request.message === "update chatframe") {
    try {
      updateChatframe();
    } catch (err) {}
  }
});

const changeLogo = async img => {
  try {
    console.log(img);

    $("#logo-icon").html(
      '<img id="logo-icon" class="style-scope ytd-topbar-logo-renderer" src=' +
        img +
        " />"
    );
  } catch (err) {
    console.error(err);
  }
};

const updateEmotes = async() => {
  const m = await emotes();
  emoteMap = m;
  // console.log(m);
  // const gbn = m.get("GabeN");
  // console.log(gbn);
  // console.log("EMOTE HTML", emoteHTML(gbn));

  // console.log(
  //   "GabeN is	our         lord".replace(/\w+/g, (s) => {
  //     if (m.get(s)) {
  //         return emoteHTML(m.get(s));
  //     } else {
  //       return s;
  //     }
  //   })
  // );
};

updateEmotes(); // TODO: find better way to do this. Could lead to race conditions
