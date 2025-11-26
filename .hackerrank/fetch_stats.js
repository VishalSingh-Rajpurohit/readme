const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://www.hackerrank.com/${USERNAME}`;

https.get(URL, (res) => {
  let html = "";

  res.on("data", (chunk) => (html += chunk));
  res.on("end", () => {
    try {
      // --- Extract Hackos ---
      let hackos = html.match(/"hackos":(\d+)/);
      let hackosValue = hackos ? hackos[1] : "Not visible";

      // --- Extract SQL Badge ---
      let sqlBadge = html.includes("Sql") ? "SQL (3-Star)" : "Not found";

      const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

**🧑‍💻 Username:** ${USERNAME}  
**💰 Hackos:** ${hackosValue}  
**🏅 Top Badge:** ${sqlBadge}

⚠ This data is extracted from your public profile HTML.
`;

      fs.writeFileSync("HACKERRANK_STATS.md", output);
      console.log("HackerRank stats updated (scraper mode).");
    } catch (e) {
      fs.writeFileSync("HACKERRANK_STATS.md", "Failed to parse profile HTML.");
    }
  });
}).on("error", () => {
  fs.writeFileSync("HACKERRANK_STATS.md", "Could not load HackerRank profile.");
});
