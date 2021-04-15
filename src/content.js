const { emotes } = require("./emote");
const { updateChatframe } = require("./chat");
const { getTwitchID } = require("./yt-twitch");

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
    console.log(err);
  }

  console.log("ID:", id);

  if (id === twitchID) {
    // same twitch id, no need to update
    console.log("SAME ID, SKIPPING");
    return;
  }

  twitchID = id;

  const m = await emotes(id);
  console.log(m);
  emoteMap = m;
};

setInterval(async() => {
  const l = window.location;
  if (l.pathname === "/watch"
   && l.origin.match(/www.youtube.com/)
   && l.search !== location) {
    console.log("CHANGE:", l);
    location = l.search;
    updateEmotes();
  } else {
    const id = await getTwitchID();
    if (!(id === twitchID)) {
      console.log("DIFFERENT ID", id, twitchID, id === twitchID);
      location = l.search;
      updateEmotes();
    }
  }
}, 5000);
