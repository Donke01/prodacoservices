// scripts/rebuild.mjs — one-time transformer: takes the original 8 pages and
// rewrites them into /public with a shared template (shared CSS, SEO, WhatsApp FAB,
// wired contact form). Idempotent — safe to re-run.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public");
const BASE_URL = "https://prodacoservices.com";

const PAGES = [
  { file: "index.html",       nav: "home",         title: "Animal Nutrition & Farm Management Services",
    desc: "Prodaco Services — professional animal nutrition, farm training, consultancy, quality feeds, and on-farm services for dairy farmers in Kenya. Call +254 716 767371." },
  { file: "training.html",    nav: "training",     title: "Dairy Farm Training",
    desc: "Farm visit, week-long management, month-long farm-assistant training, farmer field schools and training of trainers — practical dairy farm training in Kenya." },
  { file: "consultancy.html", nav: "consultancy",  title: "Dairy Farm Consultancy",
    desc: "Farm benchmarking and farm organisation consultancy — see where your farm stands and get a clear plan to run it better." },
  { file: "nutrition.html",   nav: "nutrition",    title: "Cow Nutrition — Silage, Hay & Dairymeal",
    desc: "Quality silage, hay and dairymeal for Kenyan dairy farms. Consistent milk production all year round." },
  { file: "comfort.html",     nav: "comfort",      title: "Cow Comfort & Shade Design",
    desc: "Professional cow shade designs for Kenyan dairy farms. Comfortable cows eat more, stress less, and give more milk." },
  { file: "activities.html",  nav: "activities",   title: "On-Farm Services — Silage, Rations, Biogas, Health",
    desc: "Silage harvesting, ration formulation, biogas and animal health management — done professionally, on your farm." },
  { file: "about.html",       nav: "about",        title: "About Prodaco Services",
    desc: "A Kenyan animal nutrition and farm services company with one measure of success: your farm producing more." },
  { file: "contact.html",     nav: "contact",      title: "Contact Us — Quotes & Bookings",
    desc: "Get a quote or book a service. Call +254 716 767371 or WhatsApp us. We reply the same day." }
];

const PHONE_PRIMARY   = "+254716767371";
const PHONE_SECONDARY = "+254235919580"; // sanitised — kept as-is if the client corrects it
const WA_NUMBER       = "254716767371";  // wa.me/<intl-no-plus>
const EMAIL           = "info@prodacoservices.com";

function nav(active) {
  const items = [
    ["home","index.html","Home"],["training","training.html","Training"],
    ["consultancy","consultancy.html","Consultancy"],["nutrition","nutrition.html","Cow Nutrition"],
    ["comfort","comfort.html","Cow Comfort"],["activities","activities.html","Activities"],
    ["about","about.html","About"],["contact","contact.html","Contact"]
  ];
  return `<nav class="site-nav" aria-label="Main navigation"><ul>${
    items.map(([k,h,l]) => `<li><a href="${h}"${k===active?' class="active"':''}>${l}</a></li>`).join("")
  }</ul></nav>`;
}

const brandSVG = `<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M8 14c-3 0-5-2-5-5h4c0 1 .5 1.5 1.5 1.5H12l3-3h18l3 3h3.5c1 0 1.5-.5 1.5-1.5h4c0 3-2 5-5 5h-2l1 8c0 2-1 4-3 5l1 12c0 2-1.5 3.5-3.5 3.5S30 41 30 39l-1-9h-4v9c0 2-1.5 3.5-3.5 3.5S18 41 18 39l1-12c-2-1-3-3-3-5l1-8H8zm12-2a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"/></svg>`;

function header(active) {
  return `<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand" aria-label="Prodaco Services home">
      ${brandSVG}
      <span class="brand-text">PRODACO<span class="brand-sub">Services</span></span>
    </a>
    <button class="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
    ${nav(active)}
  </div>
</header>`;
}

const footer = `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <h3>Prodaco Services</h3>
      <p>Animal nutrition, farm training, and dairy management services for farmers across Kenya and East Africa.</p>
    </div>
    <div>
      <h3>Services</h3>
      <ul>
        <li><a href="training.html">Training</a></li>
        <li><a href="consultancy.html">Consultancy</a></li>
        <li><a href="nutrition.html">Cow Nutrition</a></li>
        <li><a href="comfort.html">Cow Comfort</a></li>
        <li><a href="activities.html">On-Farm Services</a></li>
      </ul>
    </div>
    <div>
      <h3>Company</h3>
      <ul>
        <li><a href="about.html">About Us</a></li>
        <li><a href="contact.html">Contact &amp; Quotes</a></li>
      </ul>
    </div>
    <div>
      <h3>Talk to us</h3>
      <p><a href="tel:${PHONE_PRIMARY}">${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</a><br>
      <a href="https://wa.me/${WA_NUMBER}">WhatsApp us</a><br>
      <a href="mailto:${EMAIL}">${EMAIL}</a><br>Kenya</p>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; ${new Date().getFullYear()} Prodaco Services. Feed better. Manage better. Produce more.</p>
  </div>
</footer>`;

const fabs = `<div class="fab-stack">
  <a class="fab fab-wa" href="https://wa.me/${WA_NUMBER}?text=Hello%20Prodaco%2C%20I%27d%20like%20to%20ask%20about%20your%20services." aria-label="WhatsApp Prodaco Services">💬</a>
  <a class="fab fab-call" href="tel:${PHONE_PRIMARY}" aria-label="Call Prodaco Services">📞</a>
</div>`;

function pageHead(p) {
  const canonical = `${BASE_URL}/${p.file === "index.html" ? "" : p.file}`;
  const title = `${p.title} | Prodaco Services`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BASE_URL}/favicon.svg">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${p.desc}">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;
}

function pageTail() {
  return `${fabs}
${footer}
<script src="/site.js" defer></script>
</body>
</html>
`;
}

// Extract the <main>...</main> body from the source file (preserves user content verbatim)
function extractMain(src) {
  const m = src.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) throw new Error("no <main> found");
  return m[1];
}

// Contact form rewrite: mailto → id="contactForm" + honeypot + msg div before </form>
function rewriteContactForm(mainHtml) {
  return mainHtml
    .replace(/<form\s+class="form-grid"[^>]*>/i,
      `<form class="form-grid" id="contactForm" novalidate>
        <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px" aria-hidden="true">`)
    .replace(/<\/form>/i,
      `  <div id="formMsg" class="form-msg" role="status" aria-live="polite"></div>
      </form>`);
}

fs.mkdirSync(OUT, { recursive: true });
for (const p of PAGES) {
  const src = fs.readFileSync(path.join(ROOT, p.file), "utf8");
  let mainBody = extractMain(src);
  if (p.file === "contact.html") mainBody = rewriteContactForm(mainBody);
  const out = pageHead(p) + header(p.nav) + `<main id="main">${mainBody}</main>` + pageTail();
  fs.writeFileSync(path.join(OUT, p.file), out);
  console.log("wrote", p.file, "(" + out.length + " bytes)");
}
console.log("Done.");
