// scripts/rebuild.mjs — regenerate /public from source pages with the
// Merucow-inspired template. Idempotent.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public");
const BASE_URL = "https://prodacoservices.com";

// Cache-buster: short content hash so CSS/JS updates bypass Cloudflare + browser cache.
const hashFile = (p) => {
  try { return crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex").slice(0, 8); }
  catch { return String(Date.now()); }
};
const V_CSS = hashFile(path.join(OUT, "styles.css"));
const V_JS  = hashFile(path.join(OUT, "site.js"));

const PHONE_PRIMARY   = "+254716767371";
const PHONE_SECONDARY = "+254235919580";
const WA_NUMBER       = "254716767371";
const EMAIL           = "info@prodacoservices.com";

// TODO(client): replace placeholder handles with real ones, then rerun rebuild.
const SOCIAL = {
  facebook:  "https://facebook.com/",
  instagram: "https://instagram.com/",
  twitter:   "https://x.com/",
  youtube:   "https://youtube.com/",
  tiktok:    "https://tiktok.com/",
};

const IMPACT = [
  { n: "1,000+",      l: "Farmers Trained", word: false },
  { n: "300+",        l: "Farms Advised",   word: false },
  { n: "Growing",     l: "Silage Customer Base", word: true },
  { n: "Countrywide", l: "&amp; Cross-Border",   word: true },
];

// Photos matched to each service description. Cattle photos only where the
// service is about cattle (nutrition, comfort/shelter). Training and consultancy
// use African-context farm photos of people. Verified 2026-08-24.
const PHOTO = {
  // Training: African farmer carrying a bundle of fodder — practical, hands-on farm work
  training:    "https://images.unsplash.com/photo-1741940365425-1b9a575d373e?auto=format&fit=crop&w=1200&q=80",
  // Consultancy: single cow portrait — keep as on the live site
  consultancy: "https://images.unsplash.com/photo-1583364428520-fa6c5013c0c3?auto=format&fit=crop&w=1200&q=80",
  // Cow Nutrition: cows actively eating hay — matches feeds/silage
  nutrition:   "https://images.unsplash.com/photo-1504868433093-25555d9c0796?auto=format&fit=crop&w=1200&q=80",
  // Cow Comfort / Shelter: cows inside a barn
  comfort:     "https://images.unsplash.com/photo-1636998980792-63f27ddea4e3?auto=format&fit=crop&w=1200&q=80",
  // On-Farm Services: herd of cattle in the field — activity on the farm
  activities:  "https://images.unsplash.com/photo-1504867980221-c62ae681b301?auto=format&fit=crop&w=1200&q=80",
  // Blog thumbnails
  blogSilage:  "https://images.unsplash.com/photo-1504867841338-3da010c6152c?auto=format&fit=crop&w=1200&q=80", // cattle eating grass
  blogCalf:    "https://images.unsplash.com/photo-1504868531014-6f6787aa186f?auto=format&fit=crop&w=1200&q=80", // young cows / calves
  blogShade:   "https://images.unsplash.com/photo-1636998980792-63f27ddea4e3?auto=format&fit=crop&w=1200&q=80", // cows in barn
  blogBeef:    "https://images.unsplash.com/photo-1504867980221-c62ae681b301?auto=format&fit=crop&w=1200&q=80", // beef herd
};

const PAGES = [
  { file: "index.html",       nav: "home",         custom: "home",
    title: "Dairy & Beef Cattle Nutrition and Farm Services",
    desc: "Prodaco Services helps dairy and beef farmers in Kenya improve milk yield, weight gain and profitability through nutrition, training, consultancy and on-farm services." },
  { file: "training.html",    nav: "training",     title: "Farm Training",
    desc: "Practical dairy and beef cattle training in Kenya — farm visits, herd management, feeding, health, breeding, records and farmer field schools." },
  { file: "consultancy.html", nav: "consultancy",  title: "Farm Consultancy",
    desc: "Dairy and beef farm benchmarking, enterprise planning and farm organisation — improve milk yield, weight gain, costs and herd performance." },
  { file: "nutrition.html",   nav: "nutrition",    title: "Cattle Nutrition — Dairy & Beef Feeds",
    desc: "Quality silage, hay and concentrates for dairy and beef cattle in Kenya — formulated for milk production, growth, breeding and finishing." },
  { file: "comfort.html",     nav: "comfort",      title: "Cattle Housing, Comfort & Feedlot Design",
    desc: "Professional housing, shade and feedlot designs for dairy and beef cattle in Kenya — built for comfort, health, growth and efficient handling." },
  { file: "activities.html",  nav: "activities",   title: "On-Farm Services — Silage, Rations & Animal Health",
    desc: "Silage harvesting, dairy and beef ration formulation, herd health and performance tracking — done professionally on your farm." },
  { file: "blog.html",        nav: "blog",         custom: "blog",
    title: "Blog — Practical Dairy & Beef Cattle Tips",
    desc: "Practical guides for dairy and beef farmers on feeding, calf rearing, housing, herd health, weight gain and farm management." },
  { file: "about.html",       nav: "about",        title: "About Prodaco Services",
    desc: "A Kenyan animal nutrition and farm services company helping dairy and beef farmers build healthier, more productive and profitable herds." },
  { file: "contact.html",     nav: "contact",      custom: "contact",
    title: "Contact Us — Quotes & Bookings",
    desc: "Get a quote or book a service. Call +254 716 767371 or WhatsApp us. We reply the same day." }
];

/* -------- fragments -------- */

const brandLogo = `<img class="brand-logo" src="/logo-header.png" alt="Prodaco Services — dairy and beef cattle nutrition and farm services" width="170" height="114">`;

const contactStrip = `<div class="contact-strip">
  <div class="container">
    <div class="cs-socials">
      <a href="${SOCIAL.facebook}"  target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.6l.4-3.1h-3V8.9c0-.9.3-1.5 1.6-1.5H17V4.6c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.4v2h-3V14h3v8h3.5z"/></svg></a>
      <a href="${SOCIAL.twitter}"   target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7.2 8.3L23.4 22h-6.9l-5.4-7-6.2 7H2l7.7-8.9L1.7 2h7.1l4.9 6.4L18.9 2zm-1.2 18h1.7L7.4 4H5.5l12.2 16z"/></svg></a>
      <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.3.4.6.2 1 .5 1.4.9.4.4.7.9.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.9-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.2-.1 1.6-.1 4.8-.1M12 0C8.7 0 8.3 0 7.1.1 5.8.1 5 .3 4.2.6c-.8.3-1.5.7-2.2 1.4C1.3 2.7.9 3.4.6 4.2.3 5 .1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.1.6 2.9.3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.6.5 2.9.6C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c1.3-.1 2.1-.3 2.9-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.6.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.1-.6-2.9-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4-.8-.3-1.6-.5-2.9-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.2a4 4 0 110-8 4 4 0 010 8zm7.8-10.4a1.4 1.4 0 11-2.9 0 1.4 1.4 0 012.9 0z"/></svg></a>
      <a href="${SOCIAL.youtube}"   target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.7 3.7 12 3.7 12 3.7s-7.7 0-9.5.5c-1 .3-1.8 1-2 2C0 8 0 12 0 12s0 4 .5 5.8c.3 1 1 1.8 2 2 1.8.5 9.5.5 9.5.5s7.7 0 9.5-.5c1-.3 1.8-1 2-2 .5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"/></svg></a>
      <a href="${SOCIAL.tiktok}"    target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M19.6 6.2a5.4 5.4 0 01-3.2-1V16a5.7 5.7 0 11-5.7-5.7c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 102 2.8V0h2.8a5.4 5.4 0 003.2 4.7v1.5z"/></svg></a>
    </div>
    <div class="cs-contact">
      <a href="tel:${PHONE_PRIMARY}"><svg viewBox="0 0 24 24"><path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.5-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.3-.7.2-1-.4-1.1-.6-2.4-.6-3.6 0-.5-.5-1-1-1H4c-.5 0-1 .5-1 1 0 9.4 7.6 17 17 17 .5 0 1-.5 1-1v-3.4c0-.5-.5-1-1-1z"/></svg>${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</a>
      <a href="mailto:${EMAIL}"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>${EMAIL}</a>
      <a href="https://wa.me/${WA_NUMBER}"><svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1s-.8.9-1 1.1c-.2.2-.4.2-.7.1-1.6-.7-3-1.6-4-3-.3-.5.3-.5.9-1.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.5-.5-.5-.7-.5H7.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3 2.7 1.1 2.7.7 3.2.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>WhatsApp</a>
    </div>
    <a class="cs-cta" href="contact.html"><svg viewBox="0 0 24 24"><path d="M12 4v16m-8-8h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>Get a quote</a>
  </div>
</div>`;

function nav(active) {
  const items = [
    ["home","index.html","Home"],["training","training.html","Training"],
    ["consultancy","consultancy.html","Consultancy"],["nutrition","nutrition.html","Cattle Nutrition"],
    ["comfort","comfort.html","Housing & Comfort"],["activities","activities.html","Activities"],
    ["blog","blog.html","Blog"],["about","about.html","About"],["contact","contact.html","Contact"]
  ];
  return `<nav class="site-nav" aria-label="Main navigation"><ul>${
    items.map(([k,h,l]) => `<li><a href="${h}"${k===active?' class="active"':''}>${l}</a></li>`).join("")
  }</ul></nav>`;
}

function header(active) {
  return `${contactStrip}
<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand" aria-label="Prodaco Services home">
      ${brandLogo}
    </a>
    <button class="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
    ${nav(active)}
  </div>
</header>`;
}

const socialIcons = `<div class="socials">
  <a href="${SOCIAL.facebook}"  aria-label="Facebook"  target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.6l.4-3.1h-3V8.9c0-.9.3-1.5 1.6-1.5H17V4.6c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.4v2h-3V14h3v8h3.5z"/></svg></a>
  <a href="${SOCIAL.instagram}" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.3.4.6.2 1 .5 1.4.9.4.4.7.9.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.9-.7 1.4-.9.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7.1.1 5.8.1 5 .3 4.2.6c-.8.3-1.5.7-2.2 1.4C1.3 2.7.9 3.4.6 4.2.3 5 .1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.1.6 2.9.3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.6.5 2.9.6C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c1.3-.1 2.1-.3 2.9-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.6.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.1-.6-2.9-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4-.8-.3-1.6-.5-2.9-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.2a4 4 0 110-8 4 4 0 010 8zm7.8-10.4a1.4 1.4 0 11-2.9 0 1.4 1.4 0 012.9 0z"/></svg></a>
  <a href="${SOCIAL.twitter}"   aria-label="X (Twitter)" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7.2 8.3L23.4 22h-6.9l-5.4-7-6.2 7H2l7.7-8.9L1.7 2h7.1l4.9 6.4L18.9 2zm-1.2 18h1.7L7.4 4H5.5l12.2 16z"/></svg></a>
  <a href="${SOCIAL.youtube}"   aria-label="YouTube"   target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.7 3.7 12 3.7 12 3.7s-7.7 0-9.5.5c-1 .3-1.8 1-2 2C0 8 0 12 0 12s0 4 .5 5.8c.3 1 1 1.8 2 2 1.8.5 9.5.5 9.5.5s7.7 0 9.5-.5c1-.3 1.8-1 2-2 .5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"/></svg></a>
  <a href="${SOCIAL.tiktok}"    aria-label="TikTok"    target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M19.6 6.2a5.4 5.4 0 01-3.2-1V16a5.7 5.7 0 11-5.7-5.7c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 102 2.8V0h2.8a5.4 5.4 0 003.2 4.7v1.5z"/></svg></a>
</div>`;

const footer = `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <h3>Prodaco Services</h3>
      <p>Dairy and beef cattle nutrition, training, consultancy, and farm management services across Kenya and East Africa.</p>
      ${socialIcons}
    </div>
    <div>
      <h3>Services</h3>
      <ul>
        <li><a href="training.html">Training</a></li>
        <li><a href="consultancy.html">Consultancy</a></li>
        <li><a href="nutrition.html">Cattle Nutrition</a></li>
        <li><a href="comfort.html">Housing &amp; Comfort</a></li>
        <li><a href="activities.html">On-Farm Services</a></li>
      </ul>
    </div>
    <div>
      <h3>Company</h3>
      <ul>
        <li><a href="about.html">About Us</a></li>
        <li><a href="blog.html">Blog</a></li>
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
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/favicon.png">
<meta name="theme-color" content="#1c5763">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BASE_URL}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${p.desc}">
<meta name="twitter:image" content="${BASE_URL}/og-image.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v=${V_CSS}">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;
}

const pageTail = () => `${fabs}\n${footer}\n<script src="/site.js?v=${V_JS}" defer></script>\n</body>\n</html>\n`;

/* -------- page bodies -------- */

function homeBody() {
  const svgCall = `<svg viewBox="0 0 24 24"><path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.5-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.3-.7.2-1-.4-1.1-.6-2.4-.6-3.6 0-.5-.5-1-1-1H4c-.5 0-1 .5-1 1 0 9.4 7.6 17 17 17 .5 0 1-.5 1-1v-3.4c0-.5-.5-1-1-1z"/></svg>`;
  const svgChat = `<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1s-.8.9-1 1.1c-.2.2-.4.2-.7.1-1.6-.7-3-1.6-4-3-.3-.5.3-.5.9-1.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.5-.5-.5-.7-.5H7.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3 2.7 1.1 2.7.7 3.2.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>`;
  const svgArrow = `<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  const svgSpark = `<svg viewBox="0 0 24 24"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/></svg>`;
  // Training: instructor + apprentice (a person teaching another) — clearer than a graduation cap
  const svgSchool = `<svg viewBox="0 0 24 24"><path d="M12 4a3 3 0 100 6 3 3 0 000-6zM6 20v-2c0-1.7 1.3-3 3-3h6c1.7 0 3 1.3 3 3v2H6zm14-7v-2h-3v2h3zm-1-4l2-2-1.4-1.4L17.6 7 19 8.4z"/></svg>`;
  // Feeds: hay bale (rounded rectangle with horizontal strands)
  const svgSilo = `<svg viewBox="0 0 24 24"><path d="M4 6h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm-.5 4.5h17v-1h-17v1zm0 3h17v-1h-17v1zm0 3h17v-1h-17v1z"/></svg>`;
  // Consultancy: clipboard with checkmark
  const svgChart = `<svg viewBox="0 0 24 24"><path d="M9 2h6v2h3c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h3V2zm2 2v2h2V4h-2zm-.5 13.5l5.5-5.5-1.4-1.4-4.1 4.1-1.6-1.6L7.5 14.5l3 3z"/></svg>`;
  const svgShield = `<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm-2 16l-4-4 1.4-1.4L10 14.2l6.6-6.6L18 9l-8 8z"/></svg>`;
  const svgHands = `<svg viewBox="0 0 24 24"><path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>`;
  const svgLeaf = `<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.2 3.8 21.7l1.9.6c.7-1.9 1.5-3.5 2.4-4.9 2 .7 4.1.5 6-.7 4.4-2.6 6-9.2 5-13.7-.5-.1-1.1-.1-1.6-.1L17 8z"/></svg>`;
  const svgRefresh = `<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 1 0 7.75 10h-2.08a6 6 0 0 1-11.32-3A6 6 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`;
  return `<section class="hero">
  <div class="container hero-inner">
    <div class="hero-badge">${svgSpark} Dairy &amp; beef cattle support in Kenya</div>
    <h1>Feed better. <span class="accent">Manage better.</span> Produce more.</h1>
    <p class="lead">Prodaco Services helps dairy and beef farmers produce more — more milk, better weight gain, healthier cattle and stronger margins — through professional training, farm consultancy, quality feeds, and hands-on farm services.</p>
    <div class="hero-cta">
      <a href="tel:${PHONE_PRIMARY}" class="btn btn-gold">${svgCall} Call ${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</a>
      <a href="https://wa.me/${WA_NUMBER}" class="btn btn-wa">${svgChat} WhatsApp us</a>
      <a href="contact.html" class="btn btn-outline">Request a quote</a>
    </div>
  </div>
</section>

<div class="tiles-band">
  <div class="container tiles-grid">
    <div class="tile">
      <div class="tile-icon">${svgSchool}</div>
      <h3>Training</h3>
      <p>From 1-day farm visits to full month-long farm-assistant programs. Practical, hands-on, on real farms.</p>
      <a href="training.html" class="btn-outline-dark">See training →</a>
    </div>
    <div class="tile">
      <div class="tile-icon">${svgSilo}</div>
      <h3>Quality Feeds</h3>
      <p>Silage, hay and dairy or beef concentrates supplied year-round for milk production, growth and finishing.</p>
      <a href="nutrition.html" class="btn-outline-dark">Our products →</a>
    </div>
    <div class="tile">
      <div class="tile-icon">${svgChart}</div>
      <h3>Consultancy</h3>
      <p>Farm benchmarking and organisation. Know where your farm stands and get a clear plan to run it better.</p>
      <a href="consultancy.html" class="btn-outline-dark">Get advice →</a>
    </div>
  </div>
</div>

<section class="impact-band">
  <div class="container">
    <div class="band-head">
      <span class="pill-badge">Our impact</span>
      <h2>Helping dairy and beef farmers produce more</h2>
      <p>Practical training, quality feeds, and hands-on services for productive, profitable herds.</p>
    </div>
    <div class="impact-card">
      <div class="impact-grid">
        ${IMPACT.map(s => `<div><div class="num${s.word?' word':''}">${s.n}</div><div class="lbl">${s.l}</div></div>`).join("")}
      </div>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Why Prodaco</span>
      <h2>Built for farmers. Backed by results.</h2>
      <p>Everything you need to feed better, house better and manage better — from one team you can call any time.</p>
    </div>
    <div class="benefits">
      <div class="benefit"><div class="b-ico">${svgShield}</div><h4>Practical, not theoretical</h4><p>Every service happens on real farms with real cows. We train by doing and advise from experience.</p></div>
      <div class="benefit"><div class="b-ico">${svgLeaf}</div><h4>Built for local conditions</h4><p>Feeds, rations, designs and advice built for Kenyan forages, climates and market prices.</p></div>
      <div class="benefit"><div class="b-ico">${svgHands}</div><h4>One partner, whole farm</h4><p>Feeding, housing, health, management and energy — we cover the full picture so gains stick.</p></div>
      <div class="benefit"><div class="b-ico">${svgRefresh}</div><h4>We follow up</h4><p>The job isn't finished when the invoice is paid. It's finished when the results show in milk yield, weight gain and farm profit.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Our services</span>
      <h2>Your dairy and beef cattle partner</h2>
      <p>Five service lines, one goal: a healthier, more productive, more profitable herd.</p>
    </div>

    <div class="service-row">
      <div class="service-media"><img src="${PHOTO.training}" alt="Farm worker carrying fodder during hands-on training" width="1200" height="800" loading="lazy"></div>
      <div class="service-body">
        <span class="tag-sm">Training</span>
        <h3>Practical dairy and beef training that sticks</h3>
        <p>From 1-day farm visits to a full month of farm-assistant training — covering feeding, herd health, breeding, records, dairy routines and beef growth or finishing.</p>
        <ul>
          <li><strong>1-day farm visits</strong> — diagnostic + practical recommendations</li>
          <li><strong>1-week management</strong> — for owners and managers</li>
          <li><strong>1-month farm assistant</strong> — hands-on practical training</li>
          <li>Farmer Field Schools &amp; training of trainers at scale</li>
        </ul>
        <a class="btn btn-green" href="training.html">See training options</a>
      </div>
    </div>

    <div class="service-row reverse">
      <div class="service-media"><img src="${PHOTO.consultancy}" alt="Close-up of cows on a farm" width="1200" height="800" loading="lazy"></div>
      <div class="service-body">
        <span class="tag-sm">Consultancy</span>
        <h3>Know where your farm stands — and where it can go</h3>
        <p>Dairy and beef enterprise benchmarking and farm organisation. Real numbers, real recommendations, a clear plan you can act on.</p>
        <ul>
          <li><strong>Farm benchmarking</strong> — compare milk, growth, health and cost performance</li>
          <li><strong>Farm organisation</strong> — SOPs, record keeping, roles</li>
          <li>Honest advice on what pays and what doesn't</li>
        </ul>
        <a class="btn btn-green" href="consultancy.html">Consultancy services</a>
      </div>
    </div>

    <div class="service-row">
      <div class="service-media"><img src="${PHOTO.nutrition}" alt="Silage and cow feed" width="1200" height="800" loading="lazy"></div>
      <div class="service-body">
        <span class="tag-sm">Cattle Nutrition</span>
        <h3>Quality feeds for milk, growth &amp; finishing</h3>
        <p>Silage, hay and concentrates selected or formulated for your dairy or beef production target.</p>
        <ul>
          <li>Maize and Boma Rhodes <strong>silage</strong></li>
          <li>Baled <strong>hay</strong> — Rhodes, Lucerne</li>
          <li><strong>Dairy meal</strong> and custom dairy concentrates</li>
          <li><strong>Beef grower and finisher</strong> concentrates</li>
        </ul>
        <a class="btn btn-green" href="nutrition.html">Our products</a>
      </div>
    </div>

    <div class="service-row reverse">
      <div class="service-media"><img src="${PHOTO.comfort}" alt="Cows housed comfortably in a well-designed dairy shelter" width="1200" height="800" loading="lazy"></div>
      <div class="service-body">
        <span class="tag-sm">Housing &amp; Comfort</span>
        <h3>Dairy housing and beef facilities that work</h3>
        <p>Professional shades, housing and feedlot layouts. Comfortable cattle eat better, stay healthier and perform more efficiently.</p>
        <ul>
          <li>Dairy free-stall &amp; deep-bed designs sized to your herd</li>
          <li>Beef pens, feedlot layouts and handling flow</li>
          <li>Ventilation, drainage, shade and water access built in</li>
          <li>Bill of quantities for local builders</li>
        </ul>
        <a class="btn btn-green" href="comfort.html">Shade designs</a>
      </div>
    </div>

    <div class="service-row">
      <div class="service-media"><img src="${PHOTO.activities}" alt="Herd of cattle receiving on-farm services" width="1200" height="800" loading="lazy"></div>
      <div class="service-body">
        <span class="tag-sm">On-Farm Services</span>
        <h3>Done properly, on your farm</h3>
        <p>Silage harvesting, dairy and beef ration formulation, animal health and performance tracking — with expertise and follow-up.</p>
        <ul>
          <li><strong>Silage harvesting</strong> — chop, pack, seal</li>
          <li><strong>Ration formulation</strong> for milk yield, growth or finishing</li>
          <li><strong>Animal health</strong> management protocols and vaccinations</li>
          <li><strong>Milk hygiene</strong> plus beef weight and finishing support</li>
        </ul>
        <a class="btn btn-green" href="activities.html">Farm services</a>
      </div>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Getting started</span>
      <h2>Three steps to a more productive farm</h2>
    </div>
    <div class="steps">
      <div class="step"><div class="n">1</div><h3>Call or WhatsApp</h3><p>Tell us about your dairy or beef enterprise and what you want to improve — milk yield, weight gain, feed costs, housing, health, or management.</p></div>
      <div class="step"><div class="n">2</div><h3>We visit &amp; assess</h3><p>We see your farm with our own eyes and give you an honest picture of where you stand.</p></div>
      <div class="step"><div class="n">3</div><h3>You get a plan &amp; a quote</h3><p>Clear recommendations, clear pricing. You choose what to take up — we deliver and follow through.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta-band">
      <div>
        <h2>Ready to improve your farm?</h2>
        <p>Call ${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")} or send a message — we reply the same day.</p>
      </div>
      <a href="contact.html" class="btn btn-gold">Contact Us Today</a>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Get in touch</span>
      <h2>How to reach us</h2>
      <p>Pick whichever works best for you — every channel goes to the same team.</p>
    </div>
    <div class="channel-grid">
      <div class="channel">
        <div class="ico">${svgCall}</div>
        <h4>Call us</h4>
        <p>Speak to our team for immediate advice or bookings.</p>
        <div class="big">${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</div>
        <a class="btn btn-gold" href="tel:${PHONE_PRIMARY}">Call now</a>
      </div>
      <div class="channel">
        <div class="ico">${svgChat}</div>
        <h4>WhatsApp</h4>
        <p>Message us any time — attach farm photos if it helps.</p>
        <div class="big">${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</div>
        <a class="btn btn-wa" href="https://wa.me/${WA_NUMBER}">Chat on WhatsApp</a>
      </div>
      <div class="channel">
        <div class="ico">${svgArrow}</div>
        <h4>Email us</h4>
        <p>Send documents, plans, or detailed questions.</p>
        <div class="big" style="font-size:1rem;">${EMAIL}</div>
        <a class="btn btn-green" href="mailto:${EMAIL}">Email now</a>
      </div>
      <div class="channel">
        <div class="ico">${svgSchool}</div>
        <h4>Request a farm visit</h4>
        <p>Fill in the enquiry form — we'll come and assess your farm.</p>
        <div class="big" style="font-size:1rem;">Fill the form</div>
        <a class="btn btn-green" href="contact.html#enquiry">Open form</a>
      </div>
    </div>
  </div>
</section>`;
}

function contactBody() {
  return `<section class="page-hero">
  <div class="container">
    <span class="pill-badge" style="background:rgba(255,255,255,.12);color:#fff">Get in touch</span>
    <h1 style="margin-top:14px">Contact Us</h1>
    <p>Quotes, bookings, and honest advice on what your farm needs. Reach us any way that suits you — we reply the same day.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Get started</span>
      <h2>How to reach us</h2>
      <p>Pick whichever works best for you — every channel goes to the same team.</p>
    </div>
    <div class="channel-grid">
      <div class="channel">
        <div class="ico">📞</div>
        <h4>Call us</h4>
        <p>Speak to our team for immediate advice or bookings.</p>
        <div class="big">${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</div>
        <a class="btn btn-gold" href="tel:${PHONE_PRIMARY}">Call now</a>
      </div>
      <div class="channel">
        <div class="ico">💬</div>
        <h4>WhatsApp</h4>
        <p>Message us any time — attach photos of your farm if it helps.</p>
        <div class="big">${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</div>
        <a class="btn btn-wa" href="https://wa.me/${WA_NUMBER}?text=Hello%20Prodaco%2C%20I%27d%20like%20to%20ask%20about%20your%20services.">Chat on WhatsApp</a>
      </div>
      <div class="channel">
        <div class="ico">✉️</div>
        <h4>Email</h4>
        <p>Send documents, plans, or detailed questions.</p>
        <div class="big" style="font-size:1rem;">${EMAIL}</div>
        <a class="btn btn-green" href="mailto:${EMAIL}">Email us</a>
      </div>
      <div class="channel">
        <div class="ico">🚜</div>
        <h4>Request a farm visit</h4>
        <p>Use the form below — we'll come and assess your farm in person.</p>
        <div class="big" style="font-size:1rem;">Fill the form ↓</div>
        <a class="btn btn-outline" style="border-color:var(--green-800); color:var(--green-800);" href="#enquiry">Go to form</a>
      </div>
    </div>
  </div>
</section>

<section class="section alt" id="enquiry">
  <div class="container split">
    <div>
      <div class="section-head">
        <h2>Request a quote</h2>
        <p>Tell us about your farm and which service you're interested in — we'll respond with recommendations and pricing.</p>
      </div>
      <form class="form-grid" id="contactForm" novalidate>
        <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px" aria-hidden="true">
        <div>
          <label for="name">Your name</label>
          <input type="text" id="name" name="name" placeholder="e.g. Jane Wanjiku" required>
        </div>
        <div>
          <label for="phone">Phone number</label>
          <input type="text" id="phone" name="phone" placeholder="So we can call you back" required>
        </div>
        <div>
          <label for="county">County / location</label>
          <input type="text" id="county" name="county" placeholder="e.g. Nakuru">
        </div>
        <div>
          <label for="service">Service you're interested in</label>
          <select id="service" name="service">
            <option>Training — farm visit (1 day)</option>
            <option>Training — 1 week management</option>
            <option>Training — 1 month farm assistant</option>
            <option>Training of trainers / Farmer Field School</option>
            <option>Consultancy — farm benchmarking</option>
            <option>Consultancy — farm organisation</option>
            <option>Dairy enterprise support</option>
            <option>Beef enterprise setup / finishing</option>
            <option>Feeds — silage / hay / concentrates</option>
            <option>Cattle housing / shade / feedlot design</option>
            <option>Silage harvesting</option>
            <option>Ration formulation</option>
            <option>Animal health management</option>
            <option>Not sure — advise me</option>
          </select>
        </div>
        <div>
          <label for="message">About your farm</label>
          <textarea id="message" name="message" rows="5" placeholder="Dairy or beef, herd size, what you want to improve, and any timelines..." required></textarea>
        </div>
        <div>
          <button type="submit" class="btn btn-green">Send Enquiry</button>
        </div>
        <div id="formMsg" class="form-msg" role="status" aria-live="polite"></div>
      </form>
    </div>
    <div>
      <div class="card">
        <h3>Planning a seasonal service?</h3>
        <p>Silage harvesting and dry-season feed orders book out fast. Contact us early to secure your slot and the best rates.</p>
      </div>
      <div class="card" style="margin-top:20px">
        <h3>Working with cooperatives &amp; NGOs</h3>
        <p>We run field schools, training-of-trainers, and farm improvement programs at scale. Get in touch to discuss a program.</p>
      </div>
    </div>
  </div>
</section>`;
}

function blogBody() {
  const articles = [
    { tag: "Feeds",    img: PHOTO.blogSilage, title: "Making silage that lasts the dry season",
      excerpt: "The five things that decide whether your silage supports steady milk or weight gain through the dry months — or turns brown and mouldy.",
      meta: "Coming soon" },
    { tag: "Calves",   img: PHOTO.blogCalf,   title: "Calf rearing: the first 90 days shape lifetime performance",
      excerpt: "A practical protocol for strong dairy replacements and fast-growing beef calves, from colostrum to weaning.",
      meta: "Coming soon" },
    { tag: "Housing",  img: PHOTO.blogShade,  title: "Cow comfort: the free-stall design that pays for itself in 18 months",
      excerpt: "Dimensions, ventilation, drainage, and the small mistakes that cost you two litres per cow per day.",
      meta: "Coming soon" },
    { tag: "Beef",     img: PHOTO.blogBeef,   title: "Beef finishing: target weight, days and feed cost",
      excerpt: "How to set a finishing target, track average daily gain and know whether every extra day on feed is still paying.",
      meta: "Coming soon" },
  ];
  return `<section class="page-hero">
  <div class="container">
    <span class="pill-badge" style="background:rgba(255,255,255,.12);color:#fff">Blog</span>
    <h1 style="margin-top:14px">Practical tips for productive farms</h1>
    <p>Articles, guides and lessons from our work with farmers across Kenya. Written for the shed, not the classroom.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="article-grid">
      ${articles.map(a => `<article class="article-card coming">
        <div class="thumb" style="background-image:url('${a.img}')"></div>
        <div class="body">
          <span class="tag">${a.tag}</span>
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
          <div class="meta">${a.meta}</div>
        </div>
      </article>`).join("")}
    </div>
    <p style="margin-top:32px;color:var(--ink-soft)">More articles coming. Want to be notified? <a href="contact.html" style="color:var(--green-800);font-weight:700">Tell us what you'd like us to write about.</a></p>
  </div>
</section>`;
}

/* -------- extract <main> from source pages we're keeping as-is -------- */
function extractMain(src) {
  const m = src.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) throw new Error("no <main> found");
  return m[1];
}

/* -------- build -------- */
fs.mkdirSync(OUT, { recursive: true });
for (const p of PAGES) {
  let body;
  if (p.custom === "home") body = homeBody();
  else if (p.custom === "contact") body = contactBody();
  else if (p.custom === "blog") body = blogBody();
  else body = extractMain(fs.readFileSync(path.join(ROOT, p.file), "utf8"));
  const out = pageHead(p) + header(p.nav) + `<main id="main">${body}</main>` + pageTail();
  fs.writeFileSync(path.join(OUT, p.file), out);
  console.log("wrote", p.file, "(" + out.length + " bytes)");
}
console.log("Done.");
