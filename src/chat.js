const $ = require("jquery");
const { emoteHTML } = require("./emote");
const { binarySearchArr, logErr } = require("./util");

const bttvUpdatedContainer = "bttv-updated-container";

const fixHTMLString = s => {
  return s.replace(/&amp;/g, () => "&"); // TODO: make this better
};

const getChatframe = () => {
  try {
    const cf = $("#chatframe");
    if (cf.contentDocument) return cf;
    return cf[0];
  } catch (err) {
    return null;
  }
};

const getChatElems = () => {
  try {
    return getChatframe().contentDocument
      .getElementsByTagName("yt-live-chat-text-message-renderer");
  } catch (err) {
    return null;
  }
};

const msgToEmoteMsg = (emoteMap, msg) => {
  const p = msg.getElementsByClassName("yt-live-chat-text-message-renderer");

  // update msg HTML
  const s = p.message.innerHTML.split(/[<>]/); // TODO: change this later
  for (let j = 0; j < s.length; j++) {
    if (j % 2 === 0) {
      // not HTML element; replace words with emotes
      s[j] = s[j].replace(/(\s*)([^\s]+)(\s*)/g,
        (wholeMatch, space1, str, space2) => {
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
  // const updatedHTML = s.join("");
  return s.join("");
};

const updateChatMsg = (emoteMap, msg) => {
  const p = msg
    .getElementsByClassName("yt-live-chat-text-message-renderer");
  const updatedHTML = msgToEmoteMsg(emoteMap, msg);

  if (!p.message.classList.contains(bttvUpdatedContainer)) {
    p.message.classList.add(bttvUpdatedContainer); // THIS
  }
  if (updatedHTML === p.message.innerHTML) {
    return;
  }
  p.message.innerHTML = updatedHTML;
};

const updateChatMsgId = (emoteMap, id) => {
  const msg = document.getElementsByTagName("iframe")
    .chatframe.contentDocument.getElementById(id);
  updateChatMsg(emoteMap, msg);
};

const updateChatframe = emoteMap => {
  const chatElems = getChatElems();
  if (!chatElems || chatElems.length <= 0) {
    return;
  }

  const smallestVisible = binarySearchArr(chatElems, x => {
    const rect = x.getBoundingClientRect();
    return (0 - rect.bottom);
  });
  const start = Math.max(0, smallestVisible - 2); // small buffer to preload just-out-of-frame messages

  // for all existing messages, starting from first visible message
  const chatframe = getChatframe();
  for (let i = start; i < chatElems.length; i++) {
    try {
      const msg = chatElems[i];

      // Only update if msg in frame
      const rect = msg.getBoundingClientRect();
      if (rect.top > chatframe.scrollHeight) {
        break;
      } else if (rect.bottom + 50 < 0) {
        continue;
      }

      updateChatMsg(emoteMap, msg);
    } catch (err) {
      logErr(err);
    }
  }
};

module.exports = { updateChatMsgId, updateChatframe };
