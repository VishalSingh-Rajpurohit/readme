const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://www.hackerrank.com/${USERNAME}`;

https.get(URL, (res) => {
  let html = "";

  res.on("data", (chunk) => (html += chunk));
  res.on("end", () => {
    try {
      // Extract SQL badge (3 star)
      let sqlBadge = html.match(/Sql[\s\S]*?3\s*stars/i)
        ? "SQL Badge: 3⭐"
        : "SQL Badge: Not found";

      // Extract Hackos
      let hackos = html.match(/Hackos:\s*(\d+)/i);
      let hackosValue = hackos ? hackos[1] : "Not visible";

      const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

**👤 Username:** ${USERNAME}  
**🟩 Hackos:** ${hackosValue}  
**🏅 Top Badge:** SQL (3-Star)  

⚠ This data is scraped from your public profile page (not API).  
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
