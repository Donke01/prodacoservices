// scripts/rebuild.mjs: regenerate /public from source pages with the
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

const SVG_CALL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.5-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.3-.7.2-1-.4-1.1-.6-2.4-.6-3.6 0-.5-.5-1-1-1H4c-.5 0-1 .5-1 1 0 9.4 7.6 17 17 17 .5 0 1-.5 1-1v-3.4c0-.5-.5-1-1-1z"/></svg>`;
const SVG_WHATSAPP = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1s-.8.9-1 1.1c-.2.2-.4.2-.7.1-1.6-.7-3-1.6-4-3-.3-.5.3-.5.9-1.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.5-.5-.5-.7-.5H7.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3 2.7 1.1 2.7.7 3.2.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>`;
const SVG_EMAIL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
const SVG_FORM = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 7V4.5L19.5 9H15zM8 13h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>`;

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
  // Training: African farmer carrying a bundle of fodder, showing practical farm work
  training:    "https://images.unsplash.com/photo-1741940365425-1b9a575d373e?auto=format&fit=crop&w=1200&q=80",
  // Consultancy: single cow portrait, retained from the live site
  consultancy: "https://images.unsplash.com/photo-1583364428520-fa6c5013c0c3?auto=format&fit=crop&w=1200&q=80",
  // Cattle nutrition: cows actively eating hay to represent feeds and silage
  nutrition:   "https://images.unsplash.com/photo-1504868433093-25555d9c0796?auto=format&fit=crop&w=1200&q=80",
  // Cow Comfort / Shelter: cows inside a barn
  comfort:     "https://images.unsplash.com/photo-1636998980792-63f27ddea4e3?auto=format&fit=crop&w=1200&q=80",
  // On-farm services: herd of cattle in the field
  activities:  "https://images.unsplash.com/photo-1504867980221-c62ae681b301?auto=format&fit=crop&w=1200&q=80",
  // Blog thumbnails
  blogSilage:  "https://images.unsplash.com/photo-1504867841338-3da010c6152c?auto=format&fit=crop&w=1200&q=80", // cattle eating grass
  blogCalf:    "https://images.unsplash.com/photo-1504868531014-6f6787aa186f?auto=format&fit=crop&w=1200&q=80", // young cows / calves
  blogShade:   "https://images.unsplash.com/photo-1636998980792-63f27ddea4e3?auto=format&fit=crop&w=1200&q=80", // cows in barn
  blogBeef:    "https://images.unsplash.com/photo-1504867980221-c62ae681b301?auto=format&fit=crop&w=1200&q=80", // beef herd
};

const WORK_PHOTOS = [
  { src: "/images/work/work-01.webp", alt: "Prodaco farmer training session", caption: "Farmer training session" },
  { src: "/images/work/work-02.webp", alt: "Prodaco team and participants at a milk cooling centre", caption: "Milk cooling centre visit" },
  { src: "/images/work/work-03.webp", alt: "Practical farmer training in a maize field", caption: "Practical field training" },
  { src: "/images/work/work-04.webp", alt: "Participants carrying harvested fodder during a demonstration", caption: "Fodder harvesting demonstration" },
  { src: "/images/work/work-05.webp", alt: "Farmers preparing freshly harvested fodder", caption: "Fodder preparation session" },
  { src: "/images/work/work-06.webp", alt: "Farmers visiting an established pasture plot", caption: "Pasture establishment visit" },
  { src: "/images/work/work-07.webp", alt: "Practical chaff-cutter demonstration with farmers", caption: "Chaff-cutter demonstration" },
  { src: "/images/work/work-08.webp", alt: "Prodaco outdoor farmer training workshop", caption: "Farmer training workshop" },
  { src: "/images/work/work-09.webp", alt: "Farm team compacting and packing silage", caption: "Silage preparation and packing" },
];

const PAGES = [
  { file: "index.html",       nav: "home",         custom: "home",
    title: "Dairy and Beef Cattle Nutrition and Farm Services",
    desc: "Prodaco Services helps dairy and beef farmers in Kenya improve milk yield, weight gain and profitability through nutrition, training, consultancy and on-farm services." },
  { file: "training.html",    nav: "training",     title: "Farm Training",
    desc: "Practical dairy and beef cattle training in Kenya covering herd nutrition, health, breeding, records, staff development and farmer field schools." },
  { file: "consultancy.html", nav: "consultancy",  title: "Farm Consultancy",
    desc: "Dairy and beef enterprise benchmarking, production planning and farm management systems focused on herd performance, cost control and profitability." },
  { file: "nutrition.html",   nav: "nutrition",    title: "Cattle Nutrition for Dairy and Beef Herds",
    desc: "Silage, hay and concentrates for dairy and beef cattle in Kenya, supported by practical feeding guidance for production, growth, breeding and finishing." },
  { file: "comfort.html",     nav: "comfort",      title: "Cattle Housing, Comfort and Feedlot Design",
    desc: "Dairy housing, cattle shade and beef feedlot design for thermal comfort, herd health, efficient handling and productive use of farm infrastructure." },
  { file: "activities.html",  nav: "activities",   title: "On-Farm Cattle Production Services",
    desc: "Silage harvesting, dairy and beef ration formulation, herd-health planning and performance monitoring delivered on the farm." },
  { file: "blog.html",        nav: "blog",         custom: "blog",
    title: "Dairy and Beef Cattle Production Insights",
    desc: "Practical technical guidance for dairy and beef farmers on nutrition, calf management, housing, herd health, growth performance and farm management." },
  { file: "about.html",       nav: "about",        title: "About Prodaco Services",
    desc: "A Kenyan animal nutrition and farm services company helping dairy and beef farmers build healthier, more productive and profitable herds." },
  { file: "contact.html",     nav: "contact",      custom: "contact",
    title: "Contact Prodaco Services",
    desc: "Book a farm assessment, request a service quotation or discuss dairy and beef cattle production support with the Prodaco Services team." }
];

/* -------- fragments -------- */

const brandLogo = `<img class="brand-logo" src="/logo-header.png" alt="Prodaco Services, dairy and beef cattle nutrition and farm services" width="170" height="114">`;

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
    <p>&copy; ${new Date().getFullYear()} Prodaco Services. Advancing cattle nutrition, herd performance and farm profitability.</p>
  </div>
</footer>`;

const fabs = `<div class="fab-stack">
  <a class="fab fab-wa" href="https://wa.me/${WA_NUMBER}?text=Hello%20Prodaco%2C%20I%27d%20like%20to%20ask%20about%20your%20services." aria-label="WhatsApp Prodaco Services">${SVG_WHATSAPP}</a>
  <a class="fab fab-call" href="tel:${PHONE_PRIMARY}" aria-label="Call Prodaco Services">${SVG_CALL}</a>
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
<meta name="theme-color" content="#1d4ed8">
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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v=${V_CSS}">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;
}

const pageTail = () => `${fabs}\n${footer}\n<script src="/site.js?v=${V_JS}" defer></script>\n</body>\n</html>\n`;

function workGallery() {
  const slides = WORK_PHOTOS.map((photo) => `<figure class="work-slide">
        <img src="${photo.src}" alt="${photo.alt}" width="800" height="600" loading="lazy">
        <figcaption>${photo.caption}</figcaption>
      </figure>`).join("");

  return `<section class="work-showcase" aria-labelledby="work-showcase-title">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Our work</span>
      <h2 id="work-showcase-title">Prodaco in the field</h2>
      <p>Practical training, forage production and farm support.</p>
    </div>
  </div>
  <div class="work-slider" role="region" aria-label="Prodaco field activities">
    <div class="work-track">
      <div class="work-set">${slides}</div>
      <div class="work-set" aria-hidden="true">${slides}</div>
    </div>
  </div>
</section>`;
}

/* -------- page bodies -------- */

function homeBody() {
  const svgCall = SVG_CALL;
  const svgChat = SVG_WHATSAPP;
  const svgSpark = `<svg viewBox="0 0 24 24"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/></svg>`;
  const svgShield = `<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm-2 16l-4-4 1.4-1.4L10 14.2l6.6-6.6L18 9l-8 8z"/></svg>`;
  const svgHands = `<svg viewBox="0 0 24 24"><path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>`;
  const svgLeaf = `<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.2 3.8 21.7l1.9.6c.7-1.9 1.5-3.5 2.4-4.9 2 .7 4.1.5 6-.7 4.4-2.6 6-9.2 5-13.7-.5-.1-1.1-.1-1.6-.1L17 8z"/></svg>`;
  const svgRefresh = `<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 1 0 7.75 10h-2.08a6 6 0 0 1-11.32-3A6 6 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`;
  return `<section class="hero">
  <div class="container hero-inner">
    <div class="hero-badge">${svgSpark} Dairy and beef cattle services in Kenya</div>
    <h1>Stronger herd performance. <span class="accent">Better farm returns.</span></h1>
    <p class="lead">Practical nutrition, training and farm-management support for profitable dairy and beef production.</p>
    <div class="hero-cta">
      <a href="tel:${PHONE_PRIMARY}" class="btn btn-gold">${svgCall} Call ${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</a>
      <a href="https://wa.me/${WA_NUMBER}" class="btn btn-wa">${svgChat} WhatsApp us</a>
      <a href="contact.html" class="btn btn-outline">Request a quote</a>
    </div>
  </div>
</section>

<section class="impact-band">
  <div class="container">
    <div class="band-head">
      <span class="pill-badge">Our impact</span>
      <h2>Supporting cattle enterprises across Kenya</h2>
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
      <h2>Why farmers choose Prodaco</h2>
    </div>
    <div class="benefits">
      <div class="benefit"><div class="b-ico">${svgShield}</div><h4>Practical expertise</h4><p>Advice your farm team can implement.</p></div>
      <div class="benefit"><div class="b-ico">${svgLeaf}</div><h4>Local relevance</h4><p>Solutions suited to Kenyan farm conditions.</p></div>
      <div class="benefit"><div class="b-ico">${svgHands}</div><h4>Complete assessment</h4><p>Nutrition, health, housing, staff and records.</p></div>
      <div class="benefit"><div class="b-ico">${svgRefresh}</div><h4>Measured progress</h4><p>Follow-up against agreed performance targets.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Our services</span>
      <h2>Dairy and beef services</h2>
    </div>

    <div class="service-row">
      <div class="service-body">
        <span class="tag-sm">Training</span>
        <h3>Farm Training</h3>
        <p>On-farm programmes for owners, managers, workers, farmer groups and extension teams.</p>
        <a class="btn btn-green" href="training.html">See training options</a>
      </div>
      <div class="service-media"><img src="${PHOTO.training}" alt="Farmer carrying harvested fodder during practical cattle-feeding work" width="1200" height="800" loading="lazy"></div>
    </div>

    <div class="service-row">
      <div class="service-body">
        <span class="tag-sm">Consultancy</span>
        <h3>Farm Consultancy</h3>
        <p>Benchmarking, operating systems and improvement plans based on production and cost records.</p>
        <a class="btn btn-green" href="consultancy.html">Consultancy services</a>
      </div>
      <div class="service-media"><img src="${PHOTO.consultancy}" alt="Dairy cow being assessed as part of cattle farm consultancy" width="1200" height="800" loading="lazy"></div>
    </div>

    <div class="service-row">
      <div class="service-body">
        <span class="tag-sm">Cattle Nutrition</span>
        <h3>Cattle Nutrition</h3>
        <p>Silage, hay and concentrates for milk production, young stock, breeding, growth and finishing.</p>
        <a class="btn btn-green" href="nutrition.html">Our products</a>
      </div>
      <div class="service-media"><img src="${PHOTO.nutrition}" alt="Cattle eating forage as part of a balanced feeding programme" width="1200" height="800" loading="lazy"></div>
    </div>

    <div class="service-row">
      <div class="service-body">
        <span class="tag-sm">Housing &amp; Comfort</span>
        <h3>Housing and Facilities</h3>
        <p>Dairy housing, cattle shades, beef pens and feedlot layouts designed for comfort and efficient work.</p>
        <a class="btn btn-green" href="comfort.html">Shade designs</a>
      </div>
      <div class="service-media"><img src="${PHOTO.comfort}" alt="Cattle resting in a covered barn designed for comfort" width="1200" height="800" loading="lazy"></div>
    </div>

    <div class="service-row">
      <div class="service-body">
        <span class="tag-sm">On-Farm Services</span>
        <h3>On-Farm Services</h3>
        <p>Silage harvesting, ration formulation, herd-health planning and performance monitoring.</p>
        <a class="btn btn-green" href="activities.html">Farm services</a>
      </div>
      <div class="service-media"><img src="${PHOTO.activities}" alt="Cattle herd supported through on-farm production services" width="1200" height="800" loading="lazy"></div>
    </div>
  </div>
</section>

${workGallery()}

<section class="section alt">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Getting started</span>
      <h2>How it works</h2>
    </div>
    <div class="steps">
      <div class="step"><div class="n">1</div><h3>Tell us your goal</h3><p>Share your enterprise type, herd size and priority.</p></div>
      <div class="step"><div class="n">2</div><h3>We assess the need</h3><p>We review the farm where a visit is required.</p></div>
      <div class="step"><div class="n">3</div><h3>Receive a clear plan</h3><p>Get the recommended scope, actions and price.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta-band">
      <div>
        <h2>Ready to improve herd performance?</h2>
        <p>Tell us what your farm needs. We will recommend the next step.</p>
      </div>
      <a href="contact.html" class="btn btn-gold">Contact Us Today</a>
    </div>
  </div>
</section>`;
}

function contactBody() {
  return `<section class="page-hero">
  <div class="container">
    <span class="pill-badge">Get in touch</span>
    <h1 style="margin-top:14px">Contact Us</h1>
    <p>Request a farm assessment, service booking or quotation.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head centered">
      <span class="pill-badge">Get started</span>
      <h2>How to reach us</h2>
      <p>Choose the channel that suits you.</p>
    </div>
    <div class="channel-grid">
      <div class="channel">
        <div class="ico">${SVG_CALL}</div>
        <h4>Call us</h4>
        <p>Speak directly with our team.</p>
        <div class="big">${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</div>
        <a class="btn btn-gold" href="tel:${PHONE_PRIMARY}">${SVG_CALL} Call now</a>
      </div>
      <div class="channel">
        <div class="ico">${SVG_WHATSAPP}</div>
        <h4>WhatsApp</h4>
        <p>Send farm details, photos or records.</p>
        <div class="big">${PHONE_PRIMARY.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3$4")}</div>
        <a class="btn btn-wa" href="https://wa.me/${WA_NUMBER}?text=Hello%20Prodaco%2C%20I%27d%20like%20to%20ask%20about%20your%20services.">${SVG_WHATSAPP} WhatsApp</a>
      </div>
      <div class="channel">
        <div class="ico">${SVG_EMAIL}</div>
        <h4>Email</h4>
        <p>Send documents or detailed questions.</p>
        <div class="big" style="font-size:1rem;">${EMAIL}</div>
        <a class="btn btn-green" href="mailto:${EMAIL}">${SVG_EMAIL} Email us</a>
      </div>
      <div class="channel">
        <div class="ico">${SVG_FORM}</div>
        <h4>Request a farm visit</h4>
        <p>Request an on-farm assessment.</p>
        <div class="big" style="font-size:1rem;">Enquiry form</div>
        <a class="btn btn-outline" style="border-color:var(--green-800); color:var(--green-800);" href="#enquiry">${SVG_FORM} Open form</a>
      </div>
    </div>
  </div>
</section>

<section class="section alt" id="enquiry">
  <div class="container split">
    <div>
      <div class="section-head">
        <h2>Request a consultation</h2>
        <p>Share the basics. We will confirm the service scope and price.</p>
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
            <option>Training: one-day farm coaching</option>
            <option>Training: one-week management programme</option>
            <option>Training: one-month farm-assistant programme</option>
            <option>Training of trainers / Farmer Field School</option>
            <option>Consultancy: enterprise benchmarking</option>
            <option>Consultancy: farm organisation and SOPs</option>
            <option>Dairy enterprise support</option>
            <option>Beef enterprise setup / finishing</option>
            <option>Feed supply: silage, hay or concentrates</option>
            <option>Cattle housing / shade / feedlot design</option>
            <option>Silage harvesting</option>
            <option>Ration formulation</option>
            <option>Animal health management</option>
            <option>Request guidance on the appropriate service</option>
          </select>
        </div>
        <div>
          <label for="message">About your farm</label>
          <textarea id="message" name="message" rows="5" placeholder="Dairy or beef, herd size, what you want to improve, and any timelines..." required></textarea>
        </div>
        <div>
          <button type="submit" class="btn btn-green">${SVG_FORM} Send enquiry</button>
        </div>
        <div id="formMsg" class="form-msg" role="status" aria-live="polite"></div>
      </form>
    </div>
    <div>
      <div class="card">
        <h3>Planning a seasonal service?</h3>
        <p>Book harvesting and dry-season feed supply early to secure suitable dates.</p>
      </div>
      <div class="card" style="margin-top:20px">
        <h3>Group training</h3>
        <p>We provide group training, trainer development and farm-improvement programmes.</p>
      </div>
    </div>
  </div>
</section>`;
}

function blogBody() {
  const articles = [
    { tag: "Feeds",    img: PHOTO.blogSilage, title: "Protecting silage quality through the dry season",
      excerpt: "Five checks for better fermentation, storage and feeding results.",
      meta: "Coming soon" },
    { tag: "Calves",   img: PHOTO.blogCalf,   title: "A practical 90-day calf-rearing protocol",
      excerpt: "Colostrum, feeding, health monitoring and weaning made practical.",
      meta: "Coming soon" },
    { tag: "Housing",  img: PHOTO.blogShade,  title: "Dairy housing decisions that protect cow comfort",
      excerpt: "Key checks for stalls, ventilation, drainage and cattle movement.",
      meta: "Coming soon" },
    { tag: "Beef",     img: PHOTO.blogBeef,   title: "Beef finishing: setting weight, time and feed-cost targets",
      excerpt: "Track daily gain, feed cost, finishing time and market readiness.",
      meta: "Coming soon" },
  ];
  return `<section class="page-hero">
  <div class="container">
    <span class="pill-badge">Blog</span>
    <h1 style="margin-top:14px">Practical tips for productive farms</h1>
    <p>Clear guidance for dairy and beef farmers.</p>
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
