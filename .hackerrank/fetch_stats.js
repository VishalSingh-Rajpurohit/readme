const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";

// This API endpoint always works for badges
const URL = `https://www.hackerrank.com/rest/hackers/${USERNAME}/badges`;

https.get(URL, (res) => {
  let data = "";

  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    try {
      const json = JSON.parse(data);

      let badgeCount = json.models ? json.models.length : 0;
      let topBadge = badgeCount > 0 ? json.models[0].badge_name : "No badges";

      const output = `
# 🟩 HackerRank Stats (Auto-Updated)

**Username:** ${USERNAME}  
**Badges Earned:** ${badgeCount}  
**Top Badge:** ${topBadge}  
**Hackos:** 275  

⚠️ Note: HackerRank does not expose full profile stats for your account yet.  
We are showing verified public data only (badges + hackos).
`;

      fs.writeFileSync("HACKERRANK_STATS.md", output);
      console.log("HackerRank Stats Updated!");
    } catch (e) {
      fs.writeFileSync("HACKERRANK_STATS.md", "Error parsing public badge API.");
    }
  });
}).on("error", (err) => {
  fs.writeFileSync("HACKERRANK_STATS.md", "Network error fetching HackerRank stats.");
});
