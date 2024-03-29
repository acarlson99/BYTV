# BetterYTV

Better YouTube, inspired by [BetterTTV](https://betterttv.com/)

To contribute see [notes](./notes/notes.org)

## Dependencies

- npm (version 7.8.0)
- node (12.20.1)
- http://browserify.org/

See `package.json` for version info

## Build

```
# install npm deps
npm install
# build
make chrome     # create chrome-xpi
# or
make firefox    # create firefox-xpi
# or
make all        # create chrome.xpi && firefox.xpi
```

## Install

### Chrome

#### Source

Compile for Chrome

`make chrome`

Load files into browser

`chrome://extensions` -> enable dev mode (if disabled) -> load unpacked -> /extension/path/build-chrome/

### Firefox

#### Store

https://addons.mozilla.org/en-US/firefox/addon/betterytv/

#### Source

Compile for Firefox

`make firefox`

Load files into browser

`about:debugging#/runtime/this-firefox` -> Load Temporary Add-on -> /extension/path/build-firefox/manifest.json

## Usage

Adds global BTTV/FFZ emotes to YT live chat

For channel emotes the broadcaster must have Twitch acct linked in `channel/about` Links.  Note: link name must match regex `/twitch/i`

## Store Info

### Description

```
BetterYTV adds features to YouTube (inspired by BetterTTV for Twitch)

Adds new emotes to live chat

All global FFZ+BTTV emotes currently supported.  To enable channel emotes link Twitch acct in channel/about links named "Twitch"

Plan on adding more features
```

### Dev comments

```html
KNOWN BUGS/ISSUES:
<ol>
<li>Sending emotes can be buggy; may flip between emote and text</li>
</ol>

TODO:
<ol>
<li>Display emote info on hover</li>
<li>Emote tab completion</li>
<li>Extended emote menu</li>
<li>Username/keyword highlighting</li>
<li>Word/phrase blacklist</li>
</ol>
```
