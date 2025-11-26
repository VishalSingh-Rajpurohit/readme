const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://www.hackerrank.com/${USERNAME}`;

https.get(URL, (res) => {
  let html = "";

  res.on("data", (chunk) => (html += chunk));
  res.on("end", () => {
    try {
      let hackosValue = "Not visible";

      // 1) Try modern format
      let h1 = html.match(/"hackos":\s*(\d+)/);
      if (h1) hackosValue = h1[1];

      // 2) Try embedded JSON analytics
      let h2 = html.match(/data-analytics=['"]\{[^}]*"hackos":\s*(\d+)/);
      if (h2) hackosValue = h2[1];

      // 3) Try legacy tag
      let h3 = html.match(/Hackos:\s*(\d+)/i);
      if (h3) hackosValue = h3[1];

      // Extract SQL badge
      let sqlBadge =
        html.includes("3-star") || html.includes("Sql") ? "SQL (3-Star)" : "Not found";

      const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

**🧑‍💻 Username:** ${USERNAME}  
**💰 Hackos:** ${hackosValue}  
**🏅 Top Badge:** ${sqlBadge}

⚠ This data is extracted from your public profile HTML (scraper mode).
`;

      fs.writeFileSync("HACKERRANK_STATS.md", output);
      console.log("Stats updated.");
    } catch (err) {
      fs.writeFileSync("HACKERRANK_STATS.md", "Error scraping HackerRank.");
    }
  });
}).on("error", () => {
  fs.writeFileSync("HACKERRANK_STATS.md", "Failed to fetch HackerRank profile.");
});
