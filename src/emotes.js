const axios = require("axios");

const getEmoteData = async () => {
  try {
    var r1 = await axios.get(
      "https://api.betterttv.net/3/cached/emotes/global"
    );
    var r2 = await axios.get(
      "https://api.betterttv.net/3/cached/users/twitch/71092938"
    );

    const bttvEmoteData = r1.data
      .concat(r2.data["channelEmotes"])
      .concat(r2.data["sharedEmotes"]); // always has id,code,imageType
    console.log("bttv:", bttvEmoteData);

    r1 = await axios.get(
      "https://api.betterttv.net/3/cached/frankerfacez/emotes/global"
    );
    r2 = await axios.get(
      "https://api.betterttv.net/3/cached/frankerfacez/users/twitch/71092938"
    );

    const ffzEmoteData = r1.data.concat(r2.data); // always has id,code,imageType, and `images` field with links to source img
    console.log("ffz:", ffzEmoteData);
    return {
      bttv: bttvEmoteData,
      ffz: ffzEmoteData,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

const wordEmote = (word, emoteData) => {
  const l = emoteData.bttv
    .filter((w) => w.code == word)
    .concat(emoteData.ffz.filter((w) => w.code == word));
  if (l.length > 0) {
    return l[0];
  } else {
    return null;
  }
};

const emoteLinks = (emote) => {
  if (emote.images != null) {
    return emote.images;
  } else {
    return {
      "1x": `https://cdn.betterttv.net/emote/${emote.id}/1x`,
      "2x": `https://cdn.betterttv.net/emote/${emote.id}/2x`,
      "3x": `https://cdn.betterttv.net/emote/${emote.id}/3x`,
    };
  }
};

const emoteMap = (emoteData) => {
  const m = new Map();

  emoteData.bttv.forEach((e) => {
    e.images = emoteLinks(e);
    m.set(e.code, e);
  });
  emoteData.ffz.forEach((e) => {
    // e.images = emoteLinks(e)
    m.set(e.code, e);
  });

  return m;
};

// returns map of emote names to emote data
const emotes = async () => {
  const e = await getEmoteData();
  return emoteMap(e);
};

const emoteHTML = (emoteObj) => {
  return `<img class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer" src="${emoteObj.images["1x"]}" alt="${emoteObj.code}" shared-tooltip-text="${emoteObj.code}">`;
};

module.exports = { emotes, emoteHTML };
