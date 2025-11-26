const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://www.hackerrank.com/${USERNAME}`;

https.get(URL, (res) => {
  let html = "";

  res.on("data", (chunk) => (html += chunk));
  res.on("end", () => {
    try {
      // Extract Hackos
      let hackosMatch = html.match(/Hackos[^0-9]+([0-9]+)/i);
      let hackos = hackosMatch ? hackosMatch[1] : "Not visible";

      // Extract SQL 3-Star badge
      let sqlBadge = html.includes("Sql") ? "SQL (3⭐)" : "Not found";

      const output = `
### 👤 Username: **${USERNAME}**
### 💰 Hackos: **${hackos}**
### 🏅 Top Badge: **${sqlBadge}**

⚠ This data is extracted automatically from your public HackerRank profile.
`;

      fs.writeFileSync("HACKERRANK_STATS.md", output.trim());
      console.log("HackerRank stats updated!");
    } catch (err) {
      fs.writeFileSync("HACKERRANK_STATS.md", "⚠ Failed to parse HackerRank profile.");
    }
  });
}).on("error", () => {
  fs.writeFileSync("HACKERRANK_STATS.md", "⚠ Could not load HackerRank profile.");
});
