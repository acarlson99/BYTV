const axios = require("axios");

const setSrc = (o, lst) => {
  o.src = lst;
  return o;
};

const getEmoteData = async() => {
  try {
    const bttvGlobal = await axios.get(
      "https://api.betterttv.net/3/cached/emotes/global"
    );
    const bttvChannel = await axios.get(
      "https://api.betterttv.net/3/cached/users/twitch/71092938"
    );

    console.log(bttvGlobal, bttvChannel);

    const bttvEmoteData = bttvGlobal.data
      .map(a => setSrc(a, ["bttv", "global"]))
      .concat(bttvChannel.data.channelEmotes
        .map(a => setSrc(a, ["bttv", "channel", "channel"]))
        .concat(bttvChannel.data.sharedEmotes
          .map(a => setSrc(a, ["bttv", "channel", "shared"])))); // always has id,code,imageType
    console.log("bttv:", bttvEmoteData);

    const ffzGlobal = await axios.get(
      "https://api.betterttv.net/3/cached/frankerfacez/emotes/global"
    );
    const ffzChannel = await axios.get(
      "https://api.betterttv.net/3/cached/frankerfacez/users/twitch/71092938"
    );

    const ffzEmoteData = ffzGlobal.data
      .map(a => setSrc(a, ["ffz", "global"]))
      .concat(ffzChannel.data
        .map(a => setSrc(a, ["ffz", "channel"]))); // always has id,code,imageType, and `images` field with links to source img
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

// const wordEmote = (word, emoteData) => {
//   const l = emoteData.bttv
//     .filter(w => w.code === word)
//     .concat(emoteData.ffz.filter(w => w.code === word));
//   if (l.length > 0) {
//     return l[0];
//   } else {
//     return null;
//   }
// };

const emoteLinks = emote => {
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

const emoteMap = emoteData => {
  const m = new Map();

  emoteData.bttv.forEach(e => {
    e.images = emoteLinks(e);
    m.set(e.code, e);
  });
  emoteData.ffz.forEach(e => {
    // e.images = emoteLinks(e)
    m.set(e.code, e);
  });

  return m;
};

// returns map of emote names to emote data
const emotes = async() => {
  const e = await getEmoteData();
  return emoteMap(e);
};

const emoteHTML = emoteObj => {
  return `<img class="emoji yt-formatted-string\
style-scope yt-live-chat-text-message-renderer" src="${emoteObj.images["1x"]}"\
alt="${emoteObj.code}" shared-tooltip-text="${emoteObj.code}">`;
};

module.exports = { emotes, emoteHTML };
