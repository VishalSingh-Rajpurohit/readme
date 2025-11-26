const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";

const API_URL = `https://www.hackerrank.com/rest/hackers/${USERNAME}`;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", (err) => reject(err));
  });
}

async function run() {
  console.log("Fetching HackerRank public API...");
  let apiData;

  try {
    apiData = await fetchJSON(API_URL);
  } catch (err) {
    console.error("API request failed, cannot get stats.");
    apiData = null;
  }

  let badge = "Not found";

  try {
    const badges = apiData?.model?.badges || [];
    if (badges.length > 0) {
      badge = `${badges[0].name} (${badges[0].stars}⭐)`;
    }
  } catch (e) {}

  const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

🧑‍💻 Username: ${USERNAME}  
🏅 Top Badge: ${badge}

⚠ Hackos cannot be retrieved (HackerRank blocks automated requests).
`;

  fs.writeFileSync("HACKERRANK_STATS.md", output.trim());
  console.log("HACKERRANK_STATS.md updated!");
}

run();
