const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://www.hackerrank.com/rest/hackers/${USERNAME}/profile`;

function progressBar(value, total = 500, length = 25) {
  const filled = Math.round((value / total) * length);
  return "█".repeat(filled) + "░".repeat(length - filled);
}

https.get(URL, (resp) => {
  let data = "";

  resp.on("data", (chunk) => (data += chunk));

  resp.on("end", () => {
    try {
      const parsed = JSON.parse(data);

      if (!parsed.model) {
        console.log("❌ HackerRank returned empty profile.");
        fs.writeFileSync("./HACKERRANK_STATS.md", "HackerRank data not available.");
        return;
      }

      const json = parsed.model;

      const stars = json.stars || 0;
      const solved = json.score || 0;
      const badges = json.badges_summary?.badges || [];
      const certificates = json.certificates?.length || 0;
      const globalRank = json.global_rank || "N/A";
      const countryRank = json.country_rank || "N/A";

      let badgeList = "";
      badges.forEach((b) => {
        const color =
          b.stars >= 4 ? "Gold" : b.stars === 3 ? "Silver" : "Bronze";
        badgeList += `- 🏅 **${b.name}** — ${"⭐".repeat(
          b.stars
        )} (${color})\n`;
      });

      const solvedBar = progressBar(solved);

      const output = `
# 🟩 HackerRank Progress (Auto-updated)
👤 **User:** [${USERNAME}](https://www.hackerrank.com/${USERNAME})

---

## ⭐ Stars  
**${"⭐".repeat(stars)} (${stars} Stars)**  

## 🧠 Solved Problems  
**${solved}**  
\`${solvedBar}\`

## 🧾 Certificates  
**${certificates}**

## 🌍 Global Rank  
**${globalRank}**

## 🇮🇳 Country Rank  
**${countryRank}**

---

## 🏅 Badges  
${badgeList}
`;

      // Write file
      fs.writeFileSync("./HACKERRANK_STATS.md", output.trim());
      console.log("✅ HackerRank stats generated successfully!");

    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
      fs.writeFileSync("./HACKERRANK_STATS.md", "Error parsing HackerRank response.");
    }
  });
});
