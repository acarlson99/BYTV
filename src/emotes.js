const axios = require("axios");

const setSrc = (o, src, scope, shared) => {
  o.src = {
    src: src,
    scope: scope,
    shared: shared ? true : false,
  };
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

    const bttvEmoteData = { // always has id,code,imageType
      global: bttvGlobal.data.map(a => setSrc(a, "bttv", "global", false)),
      channel: {
        channel: bttvChannel.data.channelEmotes
          .map(a => setSrc(a, "bttv", "channel", false)),
        shared: bttvChannel.data.sharedEmotes
          .map(a => setSrc(a, "bttv", "channel", true))
      },
      toArr: function() {
        return this.global.concat(this.channel.channel,
          this.channel.shared);
      }
    };
    console.log("bttv:", bttvEmoteData);

    const ffzGlobal = await axios.get(
      "https://api.betterttv.net/3/cached/frankerfacez/emotes/global"
    );
    const ffzChannel = await axios.get(
      "https://api.betterttv.net/3/cached/frankerfacez/users/twitch/71092938"
    );

    const ffzEmoteData = { // always has id,code,imageType, and `images` field with links to source img
      global: ffzGlobal.data.map(a => setSrc(a, "ffz", "global", false)),
      channel: ffzChannel.data.map(a => setSrc(a, "ffz", "channel", false)),
      toArr: function() { return this.global.concat(this.channel); }
    };
    console.log("ffz:", ffzEmoteData);
    return {
      bttv: bttvEmoteData,
      ffz: ffzEmoteData,
      toArr: function() { return this.bttv.toArr().concat(this.ffz.toArr()); }
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

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

  emoteData.toArr().forEach(e => {
    e.images = emoteLinks(e);
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
  return "<img style=\"width:auto;\""
       + " class=\"bttv-emote emoji yt-formatted-string"
       + " style-scope yt-live-chat-text-message-renderer\""
       + ` src="${emoteObj.images["1x"]}"`
       + ` alt="${emoteObj.code}"`
       + ` shared-tooltip-text="${emoteObj.code}">`;
};

module.exports = { emotes, emoteHTML };
