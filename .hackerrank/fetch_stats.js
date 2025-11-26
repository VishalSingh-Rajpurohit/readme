const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://www.hackerrank.com/rest/hackers/${USERNAME}/profile`;

function progressBar(value, total, length = 25) {
  const filled = Math.round((value / total) * length);
  const empty = length - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

https.get(URL, (resp) => {
  let data = "";

  resp.on("data", (chunk) => (data += chunk));

  resp.on("end", () => {
    try {
      const json = JSON.parse(data).model;

      // Extract stats
      const stars = json.stars;
      const solved = json.score;
      const badges = json.badges_summary.badges || [];
      const certificates = json.certificates.length;
      const globalRank = json.global_rank || "N/A";
      const countryRank = json.country_rank || "N/A";

      // Generate badges (A + C)
      let badgeList = "";
      badges.forEach((b) => {
        let color =
          b.stars >= 4
            ? "🟨 Gold"
            : b.stars === 3
            ? "🟦 Silver"
            : "🟫 Bronze";

        badgeList += `- 🏅 **${b.name}** — ${"⭐".repeat(
          b.stars
        )} (${color})\n`;
      });

      const solvedBar = progressBar(solved, 500); // assuming 500 problems max

      // GLASSMORPHIC CARD
      const card = `
## 🟩 HackerRank Progress (Auto-updated)
> 🔄 Updates every 6 hours  
> 👤 **Username:** [${USERNAME}](https://www.hackerrank.com/${USERNAME})

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png" width="180"/>
</div>

---

### 🧠 Glassmorphic Stats Card

<div style="
  padding: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
">

### ⭐ Stars  
**${"⭐".repeat(stars)} (${stars} Stars)**

### 🧩 Solved Problems  
\`${solved}\`  
\`${solvedBar}\`

### 🧾 Certificates  
**${certificates} Certificates**

### 🌍 Global Rank  
**${globalRank}**

### 🇮🇳 Country Rank  
**${countryRank}**

### 🏅 Badges (Auto-styled)  
${badgeList}
</div>
`;

      fs.writeFileSync("./HACKERRANK_STATS.md", card);
      console.log("HackerRank stats generated!");
    } catch (err) {
      console.error("Error parsing JSON:", err.message);
    }
  });
});
