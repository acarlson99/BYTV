const { emotes } = require("./emote");
const { updateChatframe } = require("./chat");
const { getTwitchID } = require("./yt-twitch");
const { log } = require("./util");

let emoteMap = new Map();

let twitchID = undefined;

let location = "";

setInterval(() => {
  if (emoteMap.size > 0 && window.location.pathname === "/watch") {
    updateChatframe(emoteMap);
  }
}, 1000);

const updateEmotes = async() => {
  let id = null;
  try {
    id = await getTwitchID();
  } catch (err) {
    log(err);
    return
  }

  if (id === twitchID) {
    // same twitch id, no need to update
    return;
  }

  twitchID = id;

  const m = await emotes(id);
  log(m);
  emoteMap = m;
};

setInterval(async() => {
  const l = window.location;
  if (l.pathname === "/watch"
   && l.origin.match(/www.youtube.com/)
   && l.search !== location) {
    location = l.search;
    updateEmotes();
  } else {
    const id = await getTwitchID();
    if (!(id === twitchID)) {
      location = l.search;
      updateEmotes();
    }
  }
}, 5000);
