const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const PROFILE_URL = `https://www.hackerrank.com/profile/${USERNAME}`;

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: "text/html",
      },
    };

    https
      .get(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function extract(text, start, end) {
  const s = text.indexOf(start);
  if (s === -1) return null;
  const e = text.indexOf(end, s + start.length);
  if (e === -1) return null;
  return text.substring(s + start.length, e).trim();
}

async function run() {
  console.log("Fetching profile HTML...");

  let html = await fetchHTML(PROFILE_URL);

  if (!html || html.includes("Access Denied")) {
    console.log("⚠ HTML Blocked — HackerRank still blocking.");
    fs.writeFileSync(
      "HACKERRANK_STATS.md",
      `# HackerRank — Live Stats\n\n❌ Unable to fetch — Access Denied.`
    );
    return;
  }

  // Extract badge (SQL, Python, etc.)
  let badgeName = extract(html, `"badge_name":"`, `"`);
  let badgeStars = extract(html, `"stars":`, `,`);

  // Extract Hackos
  let hackos = extract(html, `"hackos":`, `,`);

  if (!hackos) hackos = "Not visible";
  if (!badgeName) badgeName = "Not found";

  const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

🧑‍💻 Username: ${USERNAME}  
💰 Hackos: ${hackos}  
🏅 Top Badge: ${badgeName} ${badgeStars ? `(${badgeStars}-Star)` : ""}

⚠ This data is extracted from your public profile HTML.
`;

  fs.writeFileSync("HACKERRANK_STATS.md", output.trim());
  console.log("✔ Updated HACKERRANK_STATS.md");
}

run();
