const fs = require("fs");
const https = require("https");

const USERNAME = "Vishal0666";
const API_URL = `https://leetcode-stats-api.herokuapp.com/${USERNAME}`;

https.get(API_URL, (res) => {
  let data = "";

  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    try {
      const json = JSON.parse(data);

      const output = `
# 🟧 LeetCode — Live Stats (Auto Updated)

👤 **Username:** ${USERNAME}

🏆 **Ranking:** ${json.ranking}
💡 **Easy Solved:** ${json.easySolved} / ${json.totalEasy}
🔥 **Medium Solved:** ${json.mediumSolved} / ${json.totalMedium}
💀 **Hard Solved:** ${json.hardSolved} / ${json.totalHard}

🟢 Total Solved: **${json.totalSolved}**

⚠ Stats fetched from public LeetCode API.
    `.trim();

      fs.writeFileSync("LEETCODE_STATS.md", output);
      console.log("LeetCode stats updated!");
    } catch (err) {
      fs.writeFileSync("LEETCODE_STATS.md", "Error parsing LeetCode API.");
      console.error("Failed:", err);
    }
  });
}).on("error", () => {
  fs.writeFileSync("LEETCODE_STATS.md", "Failed to reach LeetCode API.");
});
