mkdir -p build/
cp icon.png build/
cp manifest.json build/
npx browserify content.js -o build/content.js
