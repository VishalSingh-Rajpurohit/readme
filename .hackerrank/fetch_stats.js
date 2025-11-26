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
      let hackos = html.match(/Hackos[^0-9]*([0-9]+)/i);
      let hackosValue = hackos ? hackos[1] : "Not visible";

      // Extract SQL 3 star badge
      let sqlBadge = html.includes("Sql") ? "SQL (3⭐)" : "Not found";

      // Build markdown block
      const statsBlock = `
## 🟩 HackerRank — Live Stats (Auto Updated)

- 👤 **Username:** ${USERNAME}  
- 💰 **Hackos:** ${hackosValue}  
- 🏅 **Top Badge:** ${sqlBadge}  

⚠ Scraped from public profile (HTML).
`;

      // Read README
      let readme = fs.readFileSync("README.md", "utf8");

      // Replace old block
      const regex = /## 🟩 HackerRank[\s\S]*?profile \(HTML\)\./;
      if (regex.test(readme)) {
        readme = readme.replace(regex, statsBlock);
      } else {
        readme += "\n" + statsBlock;
      }

      fs.writeFileSync("README.md", readme);
      console.log("README updated with live HackerRank stats.");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
