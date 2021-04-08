BUILD_CHROME = build-chrome/
BUILD_FIREFOX = build-firefox/
SRC = src/
BACKGROUND = background.js
CONTENT = content.js
CHROME_FILES = $(BUILD_CHROME) $(addprefix $(BUILD_CHROME), $(BACKGROUND) $(CONTENT) icon.png manifest.json)
FIREFOX_FILES = $(BUILD_FIREFOX) $(addprefix $(BUILD_FIREFOX), $(BACKGROUND) $(CONTENT) icon.png manifest.json)
CHROME_XPI = chrome.xpi
FIREFOX_XPI = firefox.xpi

all: chrome-pkg firefox-pkg

clean:
	$(RM) -r $(BUILD_CHROME) $(BUILD_FIREFOX)
	$(RM) $(CHROME_XPI) $(FIREFOX_XPI)

re: clean all

# CHROME
chrome: $(CHROME_FILES)

chrome-pkg: $(CHROME_XPI)

$(BUILD_CHROME):
	mkdir -p $@

$(addprefix $(BUILD_CHROME), %.js): $(addprefix $(SRC), %.js)
	npx browserify -o $@ $<

$(BUILD_CHROME)icon.png:
	cp icon.png $(BUILD_CHROME)

$(BUILD_CHROME)manifest.json:
	cp manifest.json $(BUILD_CHROME)

$(CHROME_XPI): chrome
	@echo ">>> Packaging $@"
	zip -1 -r -j $(CHROME_XPI) $(BUILD_CHROME)*

# FIREFOX
firefox: $(FIREFOX_FILES)
	sed -i -s 's/chrome\./browser./' $(BUILD_FIREFOX)/*.js

firefox-pkg: $(FIREFOX_XPI)

$(BUILD_FIREFOX):
	mkdir -p $@

$(addprefix $(BUILD_FIREFOX), %.js): $(addprefix $(SRC), %.js)
	npx browserify -o $@ $<

$(BUILD_FIREFOX)icon.png:
	cp icon.png $(BUILD_FIREFOX)

$(BUILD_FIREFOX)manifest.json:
	cp manifest.json $(BUILD_FIREFOX)

$(FIREFOX_XPI): firefox
	@echo ">>> Packaging $@"
	zip -1 -r -j $(FIREFOX_XPI) $(BUILD_FIREFOX)*
