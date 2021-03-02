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

const getRequest = async () => {
  try {
    const response = await axios.get(
      "https://api.betterttv.net/3/cached/frankerfacez/users/twitch/71092938"
    );
    console.log("DATA", response);
    console.log(response.data[0].images["4x"]);

    const resp = await axios.get(response.data[0].images["4x"]);
    const d = resp.data;

    $("#logo-icon").html(
      '<img id="logo-icon" class="style-scope ytd-topbar-logo-renderer" src=' +
        response.data[0].images["4x"] +
        " />"
    );

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
  const emoteData = await getRequest();
  console.log(emoteData);
};

f();

alert("Hello from BYTV");
