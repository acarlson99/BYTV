const ariaLabel = "BTTV";
const innerText = "BTTV";
const customEmojiTemplate = `<yt-emoji-picker-category-button-renderer
        class="style-scope yt-emoji-picker-renderer"
        id="UCSJ4gkVC6NrvII8umztf0Ow"
        ><!--css-build:shady--><yt-icon-button
          id="button"
          class="style-scope yt-emoji-picker-category-button-renderer"
          ><!--css-build:shady--><button
            id="button"
            class="style-scope yt-icon-button"
            aria-label="${ariaLabel}"
          >
            <yt-icon
              class="style-scope yt-emoji-picker-category-button-renderer"
              ><svg
                viewBox="0 0 24 24"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                class="style-scope yt-icon"
                style="pointer-events: none; display: block; width: 100%; height: 100%;"
              >
                <g class="style-scope yt-icon">
                  <path
                    d="M0 0h24v24H0z"
                    fill="none"
                    class="style-scope yt-icon"
                  ></path>
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="#FFF"
                    class="style-scope yt-icon"
                  ></circle>
                  <path
                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"
                    class="style-scope yt-icon"
                  ></path>
                </g></svg
              ><!--css-build:shady--></yt-icon
            ></button
          ><yt-interaction
            id="interaction"
            class="circular style-scope yt-icon-button"
            ><!--css-build:shady-->
            <div class="stroke style-scope yt-interaction"></div>
            <div class="fill style-scope yt-interaction"></div></yt-interaction
          ><tp-yt-paper-tooltip
            role="tooltip"
            tabindex="-1"
            style="left: -50.5703px; top: 32px;"
            ><!--css-build:shady-->

            <div id="tooltip" class="style-scope tp-yt-paper-tooltip hidden">
              ${innerText}
            </div>
          </tp-yt-paper-tooltip></yt-icon-button
        > </yt-emoji-picker-category-button-renderer
      >`;

module.exports = customEmojiTemplate;
