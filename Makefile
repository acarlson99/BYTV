CHROME_DIR = build-chrome/
FIREFOX_DIR = build-firefox/
SRC = src/
BACKGROUND = background.js
CONTENT = content.js
DEVTOOLS = devtools.html devtools.js panel.html panel.js
CHROME_DEPS = $(CHROME_DIR)                                                     \
              $(addprefix $(CHROME_DIR), $(BACKGROUND) $(CONTENT) $(DEVTOOLS)   \
                                         icon.png manifest.json)
FIREFOX_DEPS = $(FIREFOX_DIR)                                                   \
               $(addprefix $(FIREFOX_DIR), $(BACKGROUND) $(CONTENT) $(DEVTOOLS) \
                                           icon.png manifest.json)
CHROME_XPI = chrome.xpi
FIREFOX_XPI = firefox.xpi

# Top level rules
all: chrome-pkg firefox-pkg

clean:
	$(RM) -r $(CHROME_DIR) $(FIREFOX_DIR)
	$(RM) $(CHROME_XPI) $(FIREFOX_XPI)

re: clean all

format:
	npx eslint src/*.js --fix

fmt: format

# CHROME
chrome: $(CHROME_DEPS)

chrome-pkg: $(CHROME_XPI)

$(CHROME_DIR)icon.png:
	cp icon.png $(CHROME_DIR)

$(CHROME_DIR)manifest.json:
	cp manifest.json $(CHROME_DIR)

## compile
$(addprefix $(CHROME_DIR), %.js): $(addprefix $(SRC), %.js)
	npx browserify -o $@ $<

## package
$(CHROME_XPI): chrome
	@echo ">>> Packaging $@"
	zip -1 -r -j $(CHROME_XPI) $(CHROME_DIR)*

# FIREFOX
firefox: $(FIREFOX_DEPS)
	sed -i -s 's/chrome\./browser./' $(FIREFOX_DIR)/*.js

firefox-pkg: $(FIREFOX_XPI)

$(FIREFOX_DIR)icon.png:
	cp icon.png $(FIREFOX_DIR)

$(FIREFOX_DIR)manifest.json:
	cp manifest.json $(FIREFOX_DIR)

## compile
$(addprefix $(FIREFOX_DIR), %.js): $(addprefix $(SRC), %.js)
	npx browserify -o $@ $<

## package
$(FIREFOX_XPI): firefox
	@echo ">>> Packaging $@"
	zip -1 -r -j $(FIREFOX_XPI) $(FIREFOX_DIR)*

# OTHER
## copy devtools
$(addprefix $(CHROME_DIR), $(DEVTOOLS)) $(addprefix $(FIREFOX_DIR), $(DEVTOOLS)): $(addprefix $(SRC)devtools/, $(DEVTOOLS))
	cp $< $@

## src dirs
$(CHROME_DIR) $(FIREFOX_DIR):
	mkdir -p $@
