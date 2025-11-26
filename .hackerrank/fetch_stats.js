const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";

const API_URL = `https://www.hackerrank.com/rest/hackers/${USERNAME}`;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "application/json",
      },
    };

    https
      .get(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data)); // FIXED
          } catch (err) {
            console.error("JSON Parse failed, raw data:");
            console.error(data);
            resolve(null);
          }
        });
      })
      .on("error", reject);
  });
}

async function run() {
  console.log("Fetching HackerRank public API...");
  let apiData = await fetchJSON(API_URL);

  let badge = "Not found";

  if (apiData?.model?.badges?.length > 0) {
    const b = apiData.model.badges[0];
    badge = `${b.name} (${b.stars}⭐)`;
  }

  const output = `
# 🟩 HackerRank — Live Stats (Auto Updated)

🧑‍💻 Username: ${USERNAME}  
🏅 Top Badge: ${badge}

⚠ Hackos cannot be retrieved (HackerRank blocks automated scripts).
`;

  fs.writeFileSync("HACKERRANK_STATS.md", output.trim());
  console.log("HACKERRANK_STATS.md updated!");
}

run();
