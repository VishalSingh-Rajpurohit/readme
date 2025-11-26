const fs = require("fs");
const https = require("https");

const USERNAME = "vsrajpurohit0666";
const URL = `https://www.hackerrank.com/profile/${USERNAME}`;

// Fetch HTML of your profile page
https.get(URL, (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        // 1) SAVE RAW HTML for debugging
        fs.writeFileSync("HACKERRANK_RAW.html", data);
        console.log("Saved raw HTML → HACKERRANK_RAW.html");

        // 2) Extract Hackos
        let hackos = "Not visible";

        const hackosRegex = /"hackos":(\d+)/i;
        const matchHackos = data.match(hackosRegex);
        if (matchHackos) hackos = matchHackos[1];

        // 3) Extract Top Badge
        let topBadge = "Not found";

        const badgeRegex = /"badge_name":"(.*?)"/i;
        const badgeMatch = data.match(badgeRegex);
        if (badgeMatch) topBadge = badgeMatch[1];

        // 4) Build the stats card
        const stats = `
🟩 HackerRank — Live Stats (Auto Updated)

🧑‍💻 Username: ${USERNAME}
💰 Hackos: ${hackos}
🏅 Top Badge: ${topBadge}

⚠ This data is extracted from your public profile HTML (scraper mode).
`;

        fs.writeFileSync("HACKERRANK_STATS.md", stats);
        console.log("Updated HACKERRANK_STATS.md");
    });

}).on("error", (err) => {
    console.error("Error fetching data:", err);
});
