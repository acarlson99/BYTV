// 'use strict'

const axios = require("axios");
const $ = require("jquery");
const Buffer = require("buffer").Buffer;

// listen for msg from background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "click browser action") {
    var firstHref = $("a[href^='http']").eq(0).attr("href");

    console.log(firstHref);
  }
});

console.log("Hello from BYTV console");

// TODO: only do things for YT links
// TODO: intercept live chat messages

const changeLogo = async (img) => {
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

const f = async () => {
  const emoteData = await getEmoteData();
  console.log(emoteData);
  console.log(emoteLinks(wordEmote("GabeN", emoteData)));
  changeLogo(emoteLinks(wordEmote("GabeN", emoteData))["3x"]);
};

f();

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

alert("Hello from BYTV");
