mkdir -p build/
ln -sf $(readlink -f ./icon.png) ./build/icon.png
ln -sf $(readlink -f ./manifest.json) ./build/manifest.json
npx browserify content.js -o build/content.js
