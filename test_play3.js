const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("frontend/index.html", "utf8");
const js = fs.readFileSync("frontend/app.js", "utf8");
const dom = new JSDOM(html, { runScripts: "outside-only", url: "http://localhost/" });
const window = dom.window;
const document = window.document;

window.BACKEND_URL = 'http://localhost:3000';
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: function() {
        console.log("Audio play called! src:", this.src);
        return Promise.resolve();
    }
});
window.HTMLMediaElement.prototype.load = function() {};
window.HTMLMediaElement.prototype.pause = function() {};
Object.defineProperty(window, 'localStorage', { value: { getItem: () => null, setItem: () => {} } });

try {
  window.eval(js);
  console.log("JS Evaluated Successfully");
  window.loadTrack("test_id", "Test Title", "Test Artist", "test.jpg");
} catch(e) {
  console.error("Error:", e);
}
