// scripts/rebuild.mjs — regenerate /public from source pages with the
// Merucow-inspired template. Idempotent.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public");
const BASE_URL = "https://prodacoservices.com";

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

// Reusable Unsplash photos (free CC0, hot-linked). Client can swap for real farm photos.
const PHOTO = {
  training:    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
  consultancy: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80",
  nutrition:   "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=1200&q=80",
  comfort:     "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=80",
  activities:  "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80",
  blogSilage:  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  blogCalf:    "https://images.unsplash.com/photo-1584949514490-73fc2b3f0e83?auto=format&fit=crop&w=1200&q=80",
  blogShade:   "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1200&q=80",
};

const PAGES = [
  { file: "index.html",       nav: "home",         custom: "home",
    title: "Animal Nutrition & Farm Management Services",
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
  { file: "blog.html",        nav: "blog",         custom: "blog",
    title: "Blog — Practical Dairy Farming Tips",
    desc: "Articles, guides and lessons from Prodaco Services on silage-making, calf rearing, cow comfort, feeding and dairy farm management." },
  { file: "about.html",       nav: "about",        title: "About Prodaco Services",
    desc: "A Kenyan animal nutrition and farm services company with one measure of success: your farm producing more." },
  { file: "contact.html",     nav: "contact",      custom: "contact",
    title: "Contact Us — Quotes & Bookings",
    desc: "Get a quote or book a service. Call +254 716 767371 or WhatsApp us. We reply the same day." }
];

/* -------- fragments -------- */

const brandLogo = `<img class="brand-logo" src="/logo-header.png" alt="Prodaco Services — animal nutrition & dairy farm services" width="200" height="134">`;

function nav(active) {
  const items = [
    ["home","index.html","Home"],["training","training.html","Training"],
    ["consultancy","consultancy.html","Consultancy"],["nutrition","nutrition.html","Cow Nutrition"],
    ["comfort","comfort.html","Cow Comfort"],["activities","activities.html","Activities"],
    ["blog","blog.html","Blog"],["about","about.html","About"],["contact","contact.html","Contact"]
  ];
  return `<nav class="site-nav" aria-label="Main navigation"><ul>${
    items.map(([k,h,l]) => `<li><a href="${h}"${k===active?' class="active"':''}>${l}</a></li>`).join("")
  }</ul></nav>`;
}

function header(active) {
  return `<header class="site-header">
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
      <p>Animal nutrition, farm training, and dairy management services for farmers across Kenya and East Africa.</p>
      ${socialIcons}
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
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;
}

const pageTail = () => `${fabs}\n${footer}\n<script src="/site.js" defer></script>\n</body>\n</html>\n`;

/* -------- page bodies -------- */

function homeBody() {
  return `<section class="hero">
  <div class="container hero-inner">
    <p class="eyebrow">Animal Nutrition · Kenya</p>
    <h1>Feed better. Manage better. Produce more.</h1>
    <p class="lead">Prodaco Services helps dairy farmers get more milk from every cow — through professional training, farm consultancy, quality feeds, and hands-on farm services. Your farm, run like a business.</p>
    <div class="hero-cta">
      <a href="tel:${PHONE_PRIMARY}" class="btn btn-gold">📞 Call ${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</a>
      <a href="https://wa.me/${WA_NUMBER}" class="btn btn-wa">💬 WhatsApp us</a>
      <a href="contact.html" class="btn btn-outline">Request a Quote</a>
    </div>
  </div>
</section>

<section class="impact-band">
  <div class="container">
    <div class="band-head">
      <p class="eyebrow">Our impact</p>
      <h2>Helping dairy farmers across Kenya produce more</h2>
      <p>Practical training, quality feeds, and hands-on services — the work adds up.</p>
    </div>
    <div class="impact-grid">
      ${IMPACT.map(s => `<div><div class="num${s.word?' word':''}">${s.n}</div><div class="lbl">${s.l}</div></div>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Our services</p>
      <h2>Your complete dairy farming partner</h2>
      <p>Five service lines, one goal: a healthier, more productive, more profitable herd.</p>
    </div>

    <div class="service-row">
      <div class="service-media"><img src="${PHOTO.training}" alt="Farm training in Kenya"></div>
      <div class="service-body">
        <span class="tag-sm">Training</span>
        <h3>Practical dairy training that sticks</h3>
        <p>From 1-day farm visits to a full month of farm-assistant training — plus Farmer Field Schools and training of trainers for cooperatives and NGO programs.</p>
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
      <div class="service-media"><img src="${PHOTO.consultancy}" alt="Dairy farm consultancy"></div>
      <div class="service-body">
        <span class="tag-sm">Consultancy</span>
        <h3>Know where your farm stands — and where it can go</h3>
        <p>Farm benchmarking and farm organisation. Real numbers, real recommendations, a clear plan you can act on.</p>
        <ul>
          <li><strong>Farm benchmarking</strong> — compare your farm to top performers</li>
          <li><strong>Farm organisation</strong> — SOPs, record keeping, roles</li>
          <li>Honest advice on what pays and what doesn't</li>
        </ul>
        <a class="btn btn-green" href="consultancy.html">Consultancy services</a>
      </div>
    </div>

    <div class="service-row">
      <div class="service-media"><img src="${PHOTO.nutrition}" alt="Silage and dairy feed"></div>
      <div class="service-body">
        <span class="tag-sm">Cow Nutrition</span>
        <h3>Quality silage, hay &amp; dairymeal — year-round</h3>
        <p>Feeds you can trust, supplied consistently so production doesn't drop when the dry season hits.</p>
        <ul>
          <li>Maize and Boma Rhodes <strong>silage</strong></li>
          <li>Baled <strong>hay</strong> — Rhodes, Lucerne</li>
          <li>Custom <strong>dairymeal</strong> mixes</li>
        </ul>
        <a class="btn btn-green" href="nutrition.html">Our products</a>
      </div>
    </div>

    <div class="service-row reverse">
      <div class="service-media"><img src="${PHOTO.comfort}" alt="Cow shade design"></div>
      <div class="service-body">
        <span class="tag-sm">Cow Comfort</span>
        <h3>Housing that pays for itself</h3>
        <p>Professional cow shade designs. Comfortable cows eat more, stress less, and give more milk.</p>
        <ul>
          <li>Free-stall &amp; deep-bed designs sized to your herd</li>
          <li>Ventilation, drainage, water access built in</li>
          <li>Bill of quantities for local builders</li>
        </ul>
        <a class="btn btn-green" href="comfort.html">Shade designs</a>
      </div>
    </div>

    <div class="service-row">
      <div class="service-media"><img src="${PHOTO.activities}" alt="On-farm services"></div>
      <div class="service-body">
        <span class="tag-sm">On-Farm Services</span>
        <h3>Done properly, on your farm</h3>
        <p>Silage harvesting, ration formulation, biogas installation and animal health management — with equipment, expertise, and follow-up.</p>
        <ul>
          <li><strong>Silage harvesting</strong> — chop, pack, seal</li>
          <li><strong>Ration formulation</strong> from your local ingredients</li>
          <li><strong>Biogas</strong> for cooking &amp; lighting from cow waste</li>
          <li><strong>Animal health</strong> management protocols</li>
        </ul>
        <a class="btn btn-green" href="activities.html">Farm services</a>
      </div>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Getting started</p>
      <h2>Three steps to a more productive farm</h2>
    </div>
    <div class="steps">
      <div class="step"><div class="n">1</div><h3>Call or WhatsApp</h3><p>Tell us about your farm and what you want to improve — milk yield, feed costs, housing, or management.</p></div>
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
</section>`;
}

function contactBody() {
  return `<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Get in touch</p>
    <h1>Contact Us</h1>
    <p>Quotes, bookings, and honest advice on what your farm needs. Reach us any way that suits you — we reply the same day.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Get started</p>
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
            <option>Feeds — silage / hay / dairymeal</option>
            <option>Cow shade design</option>
            <option>Silage harvesting</option>
            <option>Ration formulation</option>
            <option>Biogas</option>
            <option>Animal health management</option>
            <option>Not sure — advise me</option>
          </select>
        </div>
        <div>
          <label for="message">About your farm</label>
          <textarea id="message" name="message" rows="5" placeholder="How many cows, what you want to improve, and any timelines..." required></textarea>
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
      excerpt: "The five things that decide whether your silage keeps cows in milk from July to October — or turns brown and mouldy by August.",
      meta: "Coming soon" },
    { tag: "Calves",   img: PHOTO.blogCalf,   title: "Calf rearing: the first 90 days decide the next 5 years",
      excerpt: "Why the calf you neglect at 3 weeks becomes the heifer that never gives 20 litres. A practical protocol.",
      meta: "Coming soon" },
    { tag: "Housing",  img: PHOTO.blogShade,  title: "Cow comfort: the free-stall design that pays for itself in 18 months",
      excerpt: "Dimensions, ventilation, drainage, and the small mistakes that cost you two litres per cow per day.",
      meta: "Coming soon" },
  ];
  return `<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Blog</p>
    <h1>Practical tips for productive dairy farms</h1>
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
