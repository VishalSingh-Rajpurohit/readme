const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://r.hackerrank.com/rest/hackers/${USERNAME}/profile`;  // cached endpoint (works always)

https.get(URL, (res) => {
  let data = "";

  res.on("data", (chunk) => (data += chunk));

  res.on("end", () => {
    try {
      const json = JSON.parse(data);

      const hackos = json.model && json.model.hackos ? json.model.hackos : "Not visible";
      const badges = json.model.badges || [];

      // get top badge
      let topBadge = "Not found";
      if (badges.length > 0) {
        topBadge = `${badges[0].badge_name} (${badges[0].stars}-Star)`;
      }

      const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

👤 **Username:** ${USERNAME}  
💰 **Hackos:** ${hackos}  
🏅 **Top Badge:** ${topBadge}  

⏱ Updated automatically every 6 hours.
`;

      // <-- DIRECTLY UPDATE README.md  
      let readme = fs.readFileSync("README.md", "utf8");
      readme = readme.replace(
        /# 🟩 HackerRank[\s\S]*?hours\./,
        output.trim()
      );

      fs.writeFileSync("README.md", readme);
      console.log("README.md updated with live HackerRank stats.");
    } catch (e) {
      console.log("Parsing error:", e);
    }
  });
});
