const fs = require("fs");
const css = require("css");
const CleanCSS = require("clean-css");

// Directory where your CSS files are located
const directoryPath = "./css/";

// Function to read and consolidate CSS files
function consolidateAndMinifyCSSFiles() {
  const combinedCSS = { type: "stylesheet", stylesheet: { rules: [] } };

  const mediaQueryMap = new Map();

  fs.readdirSync(directoryPath)
    .sort()
    .forEach((file) => {
      if (file.endsWith(".css")) {
        const cssContent = fs.readFileSync(directoryPath + file, "utf8");
        const parsedCSS = css.parse(cssContent);

        parsedCSS.stylesheet.rules.forEach((rule) => {
          if (rule.type === "media") {
            const mediaKey = rule.media;
            if (!mediaQueryMap.has(mediaKey)) {
              mediaQueryMap.set(mediaKey, []);
            }
            rule.rules.forEach((mediaRule) => {
              mediaQueryMap.get(mediaKey).push(mediaRule);
            });
          } else {
            combinedCSS.stylesheet.rules.push(rule);
          }
        });
      }
    });

  // Reconstruct media queries with their rules
  mediaQueryMap.forEach((rules, mediaKey) => {
    const mediaRule = {
      type: "media",
      media: mediaKey,
      rules: rules,
    };
    combinedCSS.stylesheet.rules.push(mediaRule);
  });

  const combinedCSSString = css.stringify(combinedCSS);

  // Minify the combined CSS using clean-css
  const minifiedCSS = new CleanCSS().minify(combinedCSSString).styles;

  return minifiedCSS;
}

// Write the minified and consolidated CSS to a new file
const minifiedAndConsolidatedCSS = consolidateAndMinifyCSSFiles();
fs.writeFileSync("./build/style.css", minifiedAndConsolidatedCSS);

console.log("CSS files consolidated and minified successfully!");
