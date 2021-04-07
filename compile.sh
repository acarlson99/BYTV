set -e
CHROME=build-chrome
FIREFOX=build-firefox
mkdir -p $CHROME
# assets
cp $(readlink -f ./icon.png) $CHROME/
cp $(readlink -f ./manifest.json) $CHROME/
# browserify
npx browserify src/content.js -o $CHROME/content.js
npx browserify src/background.js -o $CHROME/background.js
# devtools
cp src/devtools/* $CHROME

# modify compiled chrome API calls for firefox
mkdir -p $FIREFOX
cp -R $CHROME/* $FIREFOX/
sed -i -s 's/chrome\./browser./' $FIREFOX/*.js
