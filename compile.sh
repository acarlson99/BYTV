mkdir -p build/
ln -sf $(readlink -f ./icon.png) ./build/icon.png
ln -sf $(readlink -f ./manifest.json) ./build/manifest.json
npx browserify src/content.js -o build/content.js
npx browserify src/background.js -o build/background.js
