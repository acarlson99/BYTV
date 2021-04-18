CHROME_DIR = build-chrome/
FIREFOX_DIR = build-firefox/
SRC = src/
CONTENT = content.js
CONTENT_SRC = chat.js emote.js util.js yt-twitch.js
CHROME_DEPS = $(CHROME_DIR)                                         \
              $(addprefix $(CHROME_DIR), $(CONTENT)                 \
                                         icon.png manifest.json)
FIREFOX_DEPS = $(FIREFOX_DIR)                                       \
               $(addprefix $(FIREFOX_DIR), $(CONTENT)               \
                                           icon.png manifest.json)
CHROME_XPI = chrome.xpi
CHROME_ZIP = chrome.zip
FIREFOX_XPI = firefox.xpi
FIREFOX_ZIP = firefox.zip
ZIP = src.zip

# Top level rules
all: chrome-xpi chrome-zip firefox-xpi firefox-zip

clean:
	$(RM) -r $(CHROME_DIR) $(FIREFOX_DIR)
	$(RM) $(CHROME_XPI) $(CHROME_ZIP) $(FIREFOX_XPI) $(FIREFOX_ZIP)

re: clean all

format:
	npx eslint src/*.js --fix

fmt: format

## zip src code (for Firefox add-on verification)
src-zip:
	$(RM) $(ZIP)
	zip -r $(ZIP) package*.json README.md icon.png manifest.json src/*.js Makefile

# CHROME
chrome: $(CHROME_DEPS)

chrome-xpi: $(CHROME_XPI)

chrome-zip: $(CHROME_ZIP)

$(CHROME_DIR)icon.png:
	cp icon.png $(CHROME_DIR)

$(CHROME_DIR)manifest.json:
	cp manifest.json $(CHROME_DIR)

## compile
$(addprefix $(CHROME_DIR), $(CONTENT)): $(addprefix $(SRC), $(CONTENT)) $(addprefix $(SRC), $(CONTENT_SRC))
	npx browserify -o $@ $<

## package
$(CHROME_XPI): chrome
	@echo ">>> Packaging $@"
	zip -1 -r -j $(CHROME_XPI) $(CHROME_DIR)*

$(CHROME_ZIP): chrome
	@echo ">>> Packaging $@"
	zip -1 -r -j $(CHROME_ZIP) $(CHROME_DIR)*

# FIREFOX
firefox: $(FIREFOX_DEPS)
	sed -i -s 's/chrome\./browser./' $(FIREFOX_DIR)*.js

firefox-xpi: $(FIREFOX_XPI)

firefox-zip: $(FIREFOX_ZIP)

$(FIREFOX_DIR)icon.png:
	cp icon.png $(FIREFOX_DIR)

$(FIREFOX_DIR)manifest.json:
	cp manifest.json $(FIREFOX_DIR)

## compile
$(addprefix $(FIREFOX_DIR), $(CONTENT)): $(addprefix $(SRC), $(CONTENT)) $(addprefix $(SRC), $(CONTENT_SRC))
	npx browserify -o $@ $<

## package
$(FIREFOX_XPI): firefox
	@echo ">>> Packaging $@"
	zip -1 -r -j $(FIREFOX_XPI) $(FIREFOX_DIR)*

$(FIREFOX_ZIP): firefox
	@echo ">>> Packaging $@"
	zip -1 -r -j $(FIREFOX_ZIP) $(FIREFOX_DIR)*

# OTHER
$(CHROME_DIR) $(FIREFOX_DIR):
	mkdir -p $@
