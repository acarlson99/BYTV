# BetterYTV

Better YouTube, inspired by [BetterTTV](https://betterttv.com/)

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
make chrome     # create chrome.xpi
# or
make firefox    # create firefox.xpi
# or
make all        # create chrome.xpi && firefox.xpi
```

## Install

### Chrome

`chrome://extensions` -> enable dev mode (if disabled) -> load unpacked -> /extension/path/build-chrome/

### Firefox

`about:debugging#/runtime/this-firefox` -> Load Temporary Add-on -> /extension/path/build-firefox/manifest.json

## Usage

Adds global BTTV/FFZ emotes to YT live chat

For channel emotes the broadcaster must have Twitch acct linked in `channel/about` Links.  Note: link name must match regex `/twitch/i`
