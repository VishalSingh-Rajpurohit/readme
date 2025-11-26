const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const PROFILE_URL = `https://www.hackerrank.com/profile/${USERNAME}`;

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html",
      },
    };

    https
      .get(url, options, (res) => {
        let html = "";
        res.on("data", (chunk) => (html += chunk));
        res.on("end", () => resolve(html));
      })
      .on("error", reject);
  });
}

function extractBetween(html, start, end) {
  const s = html.indexOf(start);
  if (s === -1) return null;
  const e = html.indexOf(end, s + start.length);
  if (e === -1) return null;
  return html.substring(s + start.length, e).trim();
}

async function run() {
  console.log("Fetching HTML profile…");

  const html = await fetchHTML(PROFILE_URL);

  fs.writeFileSync("HACKERRANK_RAW.html", html); // debug store

  // =====================
  // Extract Hackos
  // =====================
  let hackos = extractBetween(html, "Hackos:", "</");
  if (!hackos) hackos = "Not visible";

  // =====================
  // Extract Badge
  // =====================
  let badge = extractBetween(html, 'alt="', '"/>');
  if (!badge || badge.includes("Default")) badge = "No Badge Found";

  const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

🧑‍💻 Username: ${USERNAME}  
💰 Hackos: ${hackos}  
🏅 Top Badge: ${badge}

⚠ Data extracted directly from your public HTML page.
`;

  fs.writeFileSync("HACKERRANK_STATS.md", output.trim());
  console.log("HACKERRANK_STATS.md updated!");
}

run();
