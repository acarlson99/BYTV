const $ = require("jquery");
const { emotes, emoteHTML } = require("./emotes.js");

let emoteMap = new Map();

const bttvUpdatedContainer = "bttv-updated-container";

const logErr = (...args) => {
  console.log("BYTV log:", ...args);
};

const fixHTMLString = s => {
  return s.replace(/&amp;/g, () => "&"); // TODO: make this better
};

// f => 0 == good
//     -1 == too low
//      1 == too high
// e.g. binarySearchArr([0,1,2,3,4,5], (x) => 3-x)
//   => 3
const binarySearchArr = (arr, f) => {
  let start = 0;
  let end = arr.length - 1;
  let mid;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    const res = f(arr[mid]);
    if (res === 0) return mid;
    else if (res > 0) start = mid + 1;
    else end = mid - 1;
  }
  return mid;
};

const getChatframe = () => {
  const cf = $("#chatframe");
  if (cf.contentDocument) return cf;
  return cf[0];
};

const getChatElems = () => {
  return getChatframe().contentDocument
    .getElementsByTagName("yt-live-chat-text-message-renderer");
};

const msgToEmoteMsg = msg => {
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

const updateChatMsg = msg => {
  const p = msg
    .getElementsByClassName("yt-live-chat-text-message-renderer");
  const updatedHTML = msgToEmoteMsg(msg);

  if (!p.message.classList.contains(bttvUpdatedContainer)) {
    p.message.classList.add(bttvUpdatedContainer); // THIS
  }
  if (updatedHTML === p.message.innerHTML) {
    return;
  }
  p.message.innerHTML = updatedHTML;
};

const updateChatMsgId = id => {
  const msg = document.getElementsByTagName("iframe")
    .chatframe.contentDocument.getElementById(id);
  updateChatMsg(msg);
};

const updateChatframe = () => {
  const chatElems = getChatElems();
  if (chatElems.length <= 0) {
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

      updateChatMsg(msg);
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
  } else if (request.message === "chat update") {
    // TODO: check if correct URL
    // NOTE: may have to open fresh tab in YT for it to work idk why

    // TODO: UNCOMMENT
    // try {
    //   const data = JSON.parse(request.data);
    //   if (data == null) return;
    //   console.log("DATA:", data);
    //   let actions = [];
    //   if (data.actions) {
    //     actions = actions.concat(data.actions);
    //   }
    //   try {
    //     if (data.continuationContents.liveChatContinuation.actions) {
    //       actions = actions.concat(data.continuationContents.liveChatContinuation.actions);
    //     }
    //   } catch (err) {}
    //   if (actions.length < 1) {console.log("no action");} else {
    //     console.log("actions:", actions);
    //     actions.map(a => {
    //       console.log(a)
    //       console.log(a.addChatItemAction)
    //       if (a.addChatItemAction) {
    //         console.log("YEEEEE", a.addChatItemAction.item.liveChatTextMessageRenderer.id);
    //                                                   // item.liveChatTextMessageRenderer.id
    //         updateChatMsgId(a.addChatItemAction.item.liveChatTextMessageRenderer.id);
    //       }
    //     });
    //   }
    // } catch (err) {}
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
  const m = await emotes();
  emoteMap = m;
};

updateEmotes(); // TODO: find better way to do this. Could lead to race conditions
