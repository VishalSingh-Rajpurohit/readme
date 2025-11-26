const fs = require("fs");
const https = require("https");

// YOUR HACKERRANK USERNAME
const USERNAME = "vsrajpurohit0666";

// HackerRank API (undocumented but works)
const URL = `https://www.hackerrank.com/rest/hackers/${USERNAME}/profile`;

https.get(URL, (resp) => {
  let data = "";

  resp.on("data", (chunk) => { data += chunk; });

  resp.on("end", () => {
    try {
      const json = JSON.parse(data).model;

      const stats = {
        username: USERNAME,
        stars: json.stars,
        solved: json.score,
        certificates: json.certificates.length,
        country_rank: json.country_rank || "N/A",
        global_rank: json.global_rank || "N/A",
        badges: json.badges_summary.badges || []
      };

      // Build README section
      let output = `## 🟩 HackerRank Progress\n`;
      output += `**Username:** [${USERNAME}](https://www.hackerrank.com/${USERNAME})\n\n`;
      output += `⭐ **Stars:** ${stats.stars}\n\n`;
      output += `🧠 **Solved Problems:** ${stats.solved}\n\n`;
      output += `🎖️ **Certificates:** ${stats.certificates}\n\n`;
      output += `🌍 **Global Rank:** ${stats.global_rank}\n\n`;
      output += `🇮🇳 **Country Rank:** ${stats.country_rank}\n\n`;
      output += `🏅 **Badges:**\n`;
      stats.badges.forEach(b => {
        output += `- ${b.name} (${b.stars}★)\n`;
      });

      fs.writeFileSync("./HACKERRANK_STATS.md", output);
      console.log("HackerRank stats generated!");
    } catch (err) {
      console.error("Parsing error:", err.message);
    }
  });

}).on("error", (err) => {
  console.error("HTTP error:", err.message);
});
