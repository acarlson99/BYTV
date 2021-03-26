// 'use strict'

const $ = require("jquery");
const { emotes, emoteHTML } = require("./emotes.js");

var emoteMap = new Map();

// listen for msg from background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "click browser action") {
    var firstHref = $("a[href^='http']").eq(0).attr("href");

    console.log(firstHref);
  } else if (request.message === "do thing") {
    var chatframe = document.getElementsByTagName("iframe").chatframe
      .contentDocument;
    var chatElems = chatframe.getElementsByTagName(
      "yt-live-chat-text-message-renderer"
    );
    if (chatElems.length == 0) {
      return;
    }

    for (i = 0; i < chatElems.length; i++) {
      try {
        var msg = chatElems[i];
        var p = msg.getElementsByClassName(
          "yt-live-chat-text-message-renderer"
        );
        // TODO: fix this, don't hardcode p[4], is bad
        p[4].innerHTML = "accept Him " + emoteHTML(emoteMap.get("GabeN"));
        // if (p && p.length > 0) {
        // 	for (i = 0; i < p.length; i++) {
        // 		if (p && p[i].id == "message") {
        // 			p[i].innerText = "hehehehe gay";
        // 			console.log("CHANGED");
        // 			throw("")
        // 		}
        // 	}
        // }
      } catch (err) {}
    }
  }
});

console.log("Hello from BYTV console");

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

const f = async () => {
  const m = await emotes();
  emoteMap = m;
  console.log(m);
  const gbn = m.get("GabeN");
  console.log(gbn);
  console.log("EMOTE HTML", emoteHTML(gbn));

  console.log(
    "GabeN is	 our         lord".replace(/\w+/g, (s) => {
      console.log(s);
      if (m.get(s)) {
        return m.get(s).images["1x"];
      } else {
        return s;
      }
    })
  );
};

f();

// alert("Hello from BYTV");
