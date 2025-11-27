// .hackerrank/fetch_and_generate.js
const fs = require("fs");
const https = require("https");
const path = require("path");

const USERNAME = "vsrajpurohit0666"; // <- change if needed
const OUT_SVG = path.join("assets", "hackerrank_card.svg");
const OUT_MD = "HACKERRANK_STATS.md";
const README = "README.md";

function get(url, headers = {}) {
  const options = { headers: Object.assign({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    Accept: "*/*"
  }, headers) };
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    }).on("error", reject);
  });
}

async function fetchHR() {
  // Try official (public) REST profile (may be blocked sometimes)
  const apiUrl = `https://www.hackerrank.com/rest/hackers/${USERNAME}`;
  try {
    const r = await get(apiUrl, { Accept: "application/json" });
    if (r.status >= 200 && r.status < 300) {
      // try parse JSON
      try {
        const json = JSON.parse(r.body);
        return { source: "api", data: json };
      } catch (_) {
        // not valid JSON -> fallthrough to HTML attempt
      }
    }
  } catch (e) {
    // ignore and try HTML fetch next
  }

  // Fallback: fetch profile HTML (may return Access Denied)
  const htmlUrl = `https://www.hackerrank.com/profile/${USERNAME}`;
  try {
    const r2 = await get(htmlUrl);
    return { source: "html", data: r2.body, status: r2.status };
  } catch (e) {
    return { source: "error", error: String(e) };
  }
}

function extractFromApi(json) {
  // json.model may contain badges, rating, etc.
  const model = json?.model || {};
  const badges = model.badges || [];
  const topBadge = badges.length ? `${badges[0].name} (${badges[0].stars || "?"}⭐)` : "Not found";
  // hackos often not present in public API; try common fields:
  const hackos = model?.hackos ?? model?.total_points ?? "Not visible";
  const name = model?.display_name || model?.username || USERNAME;
  return { topBadge, hackos, name, source: "api" };
}

function extractFromHtml(html) {
  // try various patterns for hackos or badges
  let hackos = "Not visible";
  let topBadge = "Not found";
  // 1) JSON style in HTML: "hackos":275
  let m = html.match(/"hackos"\s*:\s*(\d+)/i);
  if (m) hackos = m[1];
  // 2) data-analytics style
  if (hackos === "Not visible") {
    m = html.match(/data-analytics=['"]\{[^}]*"hackos"\s*:\s*(\d+)/i);
    if (m) hackos = m[1];
  }
  // 3) textual "Hackos: 275"
  if (hackos === "Not visible") {
    m = html.match(/Hackos:\s*(\d+)/i);
    if (m) hackos = m[1];
  }
  // badge: find badge_name or "Sql" near star
  m = html.match(/"badge_name"\s*:\s*"([^"]+)"/i);
  if (m) topBadge = m[1];
  else if (/Sql/i.test(html) && /star|★|3-star|3 star/i.test(html)) topBadge = "SQL (3-Star)";
  const nameMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const name = (nameMatch ? nameMatch[1].replace(/- HackerRank.*$/i, "").trim() : USERNAME);
  return { topBadge, hackos, name, source: "html" };
}

function buildSvg({ username, topBadge, hackos }) {
  // Simple generated SVG layout (800x230)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="230" viewBox="0 0 800 230" role="img" aria-label="HackerRank badge for ${username}">
  <defs>
    <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#e0f7ff"/>
      <stop offset="1" stop-color="#fbe7ff"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" x2="1">
      <stop offset="0" stop-color="#5aa9ff"/>
      <stop offset="1" stop-color="#c77bff"/>
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#0b1220" flood-opacity="0.14"/>
    </filter>
  </defs>

  <rect rx="18" ry="18" width="780" height="200" x="10" y="15" fill="url(#g1)" stroke="url(#g2)" stroke-width="3" filter="url(#shadow)"/>
  <g transform="translate(50,55)">
    <circle cx="70" cy="50" r="50" fill="#ffffff" opacity="0.95" />
    <g transform="translate(40,30)" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="0" cy="-10" r="6" fill="#60a5fa" stroke="none"/>
      <circle cx="0" cy="40" r="6" fill="#60a5fa" stroke="none"/>
      <circle cx="-40" cy="20" r="6" fill="#60a5fa" stroke="none"/>
      <circle cx="40" cy="20" r="6" fill="#60a5fa" stroke="none"/>
      <path d="M0 -4 L 0 34" />
      <path d="M0 34 L -34 20" />
      <path d="M0 34 L 34 20" />
    </g>
  </g>

  <g transform="translate(160,50)">
    <text x="0" y="18" font-family="Segoe UI, Roboto, Helvetica, Arial" font-size="34" fill="#2b2b2b" font-weight="700">${escapeXML(username)}</text>
    <text x="0" y="46" font-family="Segoe UI, Roboto, Helvetica, Arial" font-size="14" fill="#4b5563">HackerRank • Public profile</text>
  </g>

  <g transform="translate(520,58)">
    <rect x="0" y="0" width="230" height="80" rx="12" fill="white" opacity="0.95" stroke="#e9eaf0"/>
    <text x="18" y="26" font-family="Segoe UI, Roboto, Helvetica, Arial" font-size="13" fill="#6b7280">Top Badge</text>
    <text x="18" y="52" font-family="Segoe UI, Roboto, Helvetica, Arial" font-size="20" fill="#0f172a" font-weight="700">${escapeXML(topBadge)}</text>
  </g>

  <g transform="translate(170,125)">
    <rect x="-8" y="10" width="120" height="36" rx="8" fill="url(#g2)"/>
    <text x="8" y="34" font-family="Segoe UI, Roboto, Helvetica, Arial" font-size="14" fill="white" font-weight="700">HackerRank</text>
  </g>

  <text x="400" y="130" font-family="Segoe UI, Roboto, Helvetica, Arial" font-size="42" fill="#13213a" text-anchor="middle">Hackos: ${escapeXML(String(hackos))}</text>

  <rect x="18" y="23" width="764" height="184" rx="14" fill="none" stroke="url(#g2)" stroke-width="1.2" opacity="0.6"/>
  <text x="34" y="208" font-family="Segoe UI, Roboto, Helvetica, Arial" font-size="11" fill="#6b7280">Auto-generated badge card — update README to embed this image</text>
</svg>`;
}

function escapeXML(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}

async function main() {
  console.log("Fetching HackerRank data for", USERNAME);
  const res = await fetchHR();

  let stats = { source: res.source };
  try {
    if (res.source === "api" && res.data) {
      stats = extractFromApi(res.data);
    } else if (res.source === "html") {
      stats = extractFromHtml(res.data || "");
    } else {
      stats = { topBadge: "Not found", hackos: "Not visible", name: USERNAME };
    }
  } catch (e) {
    stats = { topBadge: "Not found", hackos: "Not visible", name: USERNAME };
  }

  // write HACKERRANK_STATS.md
  const md = `# 🟩 HackerRank — Live Stats (Auto Updated)

**Username:** ${stats.name || USERNAME}  
**Top Badge:** ${stats.topBadge || "Not found"}  
**Hackos:** ${stats.hackos ?? "Not visible"}

_Source: ${stats.source}_`;
  fs.writeFileSync(OUT_MD, md);

  // ensure assets folder
  if (!fs.existsSync("assets")) fs.mkdirSync("assets");

  // write SVG card
  const svg = buildSvg({ username: stats.name || USERNAME, topBadge: stats.topBadge || "Not found", hackos: stats.hackos ?? "Not visible" });
  fs.writeFileSync(OUT_SVG, svg);

  // Update README placeholder (replace between markers)
  if (fs.existsSync(README)) {
    let readme = fs.readFileSync(README, "utf8");
    const start = "<!-- HACKERRANK_BADGE -->";
    const end = "<!-- HACKERRANK_BADGE_END -->";
    if (readme.includes(start) && readme.includes(end)) {
      const embed = `<p align="left"><img src="./${OUT_SVG.replace(/\\/g,'/')}" alt="HackerRank card" /></p>`;
      const replaced = readme.replace(new RegExp(`${escapeForRegex(start)}[\\s\\S]*?${escapeForRegex(end)}`,'m'), `${start}\n${embed}\n${end}`);
      fs.writeFileSync(README, replaced, "utf8");
    } else {
      console.log("README placeholder not found; skipping README update.");
    }
  } else {
    console.log("README.md not found; skipping README update.");
  }

  console.log("Done. Wrote:", OUT_SVG, "and", OUT_MD);
}

function escapeForRegex(s){ return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
