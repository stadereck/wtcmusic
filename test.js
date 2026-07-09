const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("frontend/index.html", "utf8");
const js = fs.readFileSync("frontend/app.js", "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously" });
try {
  dom.window.eval(js);
  console.log("No errors on load");
} catch (e) {
  console.error("Error on load:", e);
}
