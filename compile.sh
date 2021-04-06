set -e
CHROME=build-chrome
FIREFOX=build-firefox
mkdir -p $CHROME
# ln -sf $(readlink -f ./icon.png) $CHROME/icon.png
# ln -sf $(readlink -f ./manifest.json) $CHROME/manifest.json
cp $(readlink -f ./icon.png) $CHROME/
cp $(readlink -f ./manifest.json) $CHROME/
npx browserify src/content.js -o $CHROME/content.js
npx browserify src/background.js -o $CHROME/background.js
# npx browserify src/devtools.js -o $CHROME/devtools.js
cp src/devtools.js src/panel.js $CHROME

cp src/*.html $CHROME

# modify compiled chrome API calls for firefox
mkdir -p $FIREFOX
cp -R $CHROME/* $FIREFOX/
sed -i -s 's/chrome\./browser./' $FIREFOX/*.js
