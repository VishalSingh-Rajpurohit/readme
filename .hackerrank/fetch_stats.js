const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const BADGE_API = `https://hacker-rank-badge-api.vercel.app/api/badges/${USERNAME}`;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch { resolve(null); }
        });
      })
      .on("error", reject);
  });
}

async function run() {
  let badges = await fetchJSON(BADGE_API);

  let topBadge = "Not found";
  if (badges && badges.length > 0) {
    const b = badges[0];
    topBadge = `${b.badge_name} (${b.stars}⭐)`;
  }

  const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

🧑‍💻 Username: ${USERNAME}
💰 Hackos: Not visible
🏅 Top Badge: ${topBadge}

⚠ Badge data via third-party API (stable).
`;

  fs.writeFileSync("HACKERRANK_STATS.md", output.trim());
  console.log("Updated!");
}

run();
