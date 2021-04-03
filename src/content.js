// 'use strict'

const $ = require("jquery");
const { emotes, emoteHTML } = require("./emotes.js");

let emoteMap = new Map();

const logErr = (...args) => {
  console.log("BYTV log:", ...args);
};

const fixHTMLString = s => {
  return s.replace(/&amp;/g, () => "&"); // TODO: make this better
};

const msgVisible = (msg, chatframe) => {
  const rect = msg.getBoundingClientRect();
  return (rect.y < chatframe.scrollHeight && rect.y > 0);
};

const updateChatframe = () => {
  const chatframe = $("#chatframe")[0];
  const chatElems = chatframe.contentDocument
    .getElementsByTagName("yt-live-chat-text-message-renderer");
  if (chatElems.length <= 0) {
    return;
  }

  // for all existing messages
  for (let i = 0; i < chatElems.length; i++) {
    try {
      const msg = chatElems[i];

      // Only update if msg in frame
      if (!msgVisible(msg, chatframe)) {
        continue;
      }

      const p = msg
        .getElementsByClassName("yt-live-chat-text-message-renderer");

      // update msg HTML
      const s = p.message.innerHTML.split(/[<>]/); // TODO: dont do this, is bad
      for (let j = 0; j < s.length; j++) {
        if (j % 2 === 0) {
          // not HTML element; replace words with emotes
          s[j] = s[j].replace(/(\s*)([^\s]+)(\s*)/g,
            (a, space1, str, space2) => {
              const emote = emoteMap.get(fixHTMLString(str));
              if (emote) {
                return space1 + emoteHTML(emote) + space2;
              } else {
                return space1 + str + space2;
              }
            });
        } else {
          // every odd index is an HTML element
          s[j] = "<" + s[j] + ">";
        }
      }
      if (s.join("") == p.message.innerHTML) {
        continue;
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
