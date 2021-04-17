const { log } = require("./util");

const setSrc = (o, src, scope, shared) => {
  o.src = {
    src: src,
    scope: scope,
    shared: shared ? true : false,
  };
  return o;
};

const getEmoteData = async id => {
  try {
    const bttvGlobal = await fetch(
      "https://api.betterttv.net/3/cached/emotes/global"
    ).then(a => {
      return a.json();
    });

    const bttvChannel = id
      ? await fetch(
        `https://api.betterttv.net/3/cached/users/twitch/${id}`
      ).then(a => {
        return a.json();
      })
      : { channelEmotes: [], sharedEmotes: [] };

    console.log("bttv global", bttvGlobal);
    console.log("bttv channel", bttvChannel);

    const bttvEmoteData = {
      // always has id,code,imageType
      global: bttvGlobal.map(a => setSrc(a, "BetterTTV", "Global", false)),
      channel: bttvChannel.message
        ? {
          channel: [],
          shared: [],
        }
        : {
          channel: bttvChannel.channelEmotes.map(a =>
            setSrc(a, "BetterTTV", "Channel", false)
          ),
          shared: bttvChannel.sharedEmotes.map(a =>
            setSrc(a, "BetterTTV", "Channel", true)
          ),
        },
      toArr: function() {
        return this.global.concat(this.channel.channel, this.channel.shared);
      },
    };
    console.log("bttv:", bttvEmoteData);

    const ffzGlobal = await fetch(
      "https://api.betterttv.net/3/cached/frankerfacez/emotes/global"
    ).then(a => a.json());
    const ffzChannel = id
      ? await fetch(
        `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${id}`
      ).then(a => a.json())
      : [];

    console.log("ffz global", ffzGlobal);
    console.log("ffz channel", ffzChannel);

    const ffzEmoteData = {
      // always has id,code,imageType, and `images` field with links to source img
      global: ffzGlobal.map(a => setSrc(a, "FrankerFaceZ", "Global", false)),
      channel: !ffzChannel.map
        ? []
        : ffzChannel.map(a => setSrc(a, "FrankerFaceZ", "Channel", false)),
      toArr: function() {
        return this.global.concat(this.channel);
      },
    };
    console.log("ffz:", ffzEmoteData);
    return {
      bttv: bttvEmoteData,
      ffz: ffzEmoteData,
      toArr: function() {
        return this.bttv.toArr().concat(this.ffz.toArr());
      },
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
const emotes = async id => {
  const e = await getEmoteData(id);
  return emoteMap(e);
};

/*
** bttv.channel.channel = "xqcow"; BetterTTV Channel Emotes
** bttv.channel.shared = emote.user.name; BetterTTV Channel Emotes
** bttv.global = BetterTTV Global Emotes
** ffz.channel = emote.user.name; FrankerFaceZ Channel Emotes
** ffz.global = emote.user.name ;FrankerFaceZ Global Emotes
*/
// const emoteSrc = emoteObj => {
//   // user?
//   // <br>?
//   // src
//   let s = "";
//   if (emoteObj.user) {
//     s = `Channel: ${emoteObj.user.displayName}
// <br>
// `;
//   }
//   return s + `${emoteObj.src.src} ${emoteObj.src.scope} emote`;
// };

// const emoteTooltip = emoteObj => {
//   return "<div class=\"bttv-emote-tooltip\" style=\"display:none; overflow:visible;\">"
//        + `${emoteObj.code}`
//        + "<br>"
//        + `${emoteSrc(emoteObj)}`
//        + "</div>";
// };

const emoteImg = emoteObj => {
  return '<img style="width:auto; overflow:visible;"'
       + ' class="bttv-emote emoji yt-formatted-string'
       + ' style-scope yt-live-chat-text-message-renderer"'
       + ` src="${emoteObj.images["1x"]}"`
       + ` alt="${emoteObj.code}"`
       + ` shared-tooltip-text="${emoteObj.code}">`
};

// TODO: add `emoteTooltip() and display on hover
const emoteHTML = emoteObj => emoteImg(emoteObj);

module.exports = { emotes, emoteHTML };
