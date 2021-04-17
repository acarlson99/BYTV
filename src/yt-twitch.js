const $ = require("jquery");
const { traverseObj } = require("./util");

// FIXME: this breaks frequently and idk why
const getChannelLink = () => $("#meta-contents #upload-info a")[0].href;

// finds channel and queries about page for linked Twitch acct
// https://www.youtube.com/channel/xxchannelIDxx/about
const getTwitchUName = async() => {
  const url = getChannelLink() + "/about";
  const resp = await fetch(url).then(r => {
    return r.text();
  });
  const d = document.createElement("div");
  d.innerHTML = resp;
  const elems = d.getElementsByTagName("script");

  for (const i in elems) {
    if (elems[i] && elems[i].innerHTML
        && elems[i].innerHTML.startsWith("var ytInitialData = {")) {
      let s = elems[i].innerHTML.substr(20);
      s = s.substr(0, s.length - 1);
      const obj = JSON.parse(s);
      let name = null;

      traverseObj(
        o => {
          const u = new URL(o);
          const arr = u.search.substr(1).split("&");
          let ss = "";
          for (const v of arr) {
            if (v.startsWith("q=")) {
              ss = decodeURIComponent(v.substr(2));
              break;
            }
          }
          name = new URL(ss).pathname.substr(1);
        },
        obj,
        "contents",
        "twoColumnBrowseResultsRenderer",
        "tabs",
        o => o.tabRenderer.title === "About",
        "tabRenderer",
        "content",
        "sectionListRenderer",
        "contents",
        true,
        "itemSectionRenderer",
        "contents",
        true,
        "channelAboutFullMetadataRenderer",
        "primaryLinks",
        o => o.title.simpleText.match(/twitch/i),
        "navigationEndpoint",
        "urlEndpoint",
        "url"
      );

      return name;
    }
  }
};

const usernameTwitchID = async uname => {
  const resp = await fetch(`https://api.twitch.tv/kraken/users?login=${uname}`, {
    headers: {
      "Client-ID": "i7t08ggus3b5d71deab8k20rdzn5ez",
      "Accept": "application/vnd.twitchtv.v5+json"
    }
  }).then(a=> {return a.json();});
  if (resp.users.length < 1) {
    return null;
  }
  return resp.users[0]._id;
};

const getTwitchID = async() => {
  const name = await getTwitchUName();
  if (!name) {
    return null;
  }
  const id = await usernameTwitchID(name);
  return id;
};

module.exports = { getTwitchUName, usernameTwitchID, getTwitchID };
