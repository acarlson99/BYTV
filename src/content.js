// 'use strict'

const $ = require("jquery");
const emotes = require("./emotes.js");

// listen for msg from background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "click browser action") {
    var firstHref = $("a[href^='http']").eq(0).attr("href");

    console.log(firstHref);
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
  console.log(m);

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

alert("Hello from BYTV");
