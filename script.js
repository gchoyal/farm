/**
 * ==========================================================================
 * गिरधारी फार्म्स - OFFICIAL JAVASCRIPT LOGIC
 * घर पर निर्मित शुद्ध उत्पाद
 * ==========================================================================
 */

// ==========================================================================
// 1. CONFIGURATION & EDITABLE SETTINGS
// ==========================================================================
// Google Apps Script Web App URL (Google Doc ID: 1DSK-EpK93Ub3R0MZ_2DPc7pq_gxrHRyd0X8hQE9VA-E)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxU4dqB4bbcBzbgKnstDtbiWL-aYNrg1_H2JFTHwRoKa7inFkQOxY74-FaKTzZSvSx4/exec";

// व्हाट्सऐप नंबर
const WHATSAPP_NUMBER = "918435155366";

// कॉलिंग फ़ोन नंबर
const PHONE_NUMBER = "+918435155366";
const PHONE_DISPLAY = "8435155366";


// ==========================================================================
// 1.1 ADVANCED USER ACTIVITY, DEVICE, IP & BEHAVIOR TRACKING ENGINE
// Tracks: IP address, Device, Browser, Viewport, Timestamp, Interactions,
// WhatsApp clicks, Call clicks, and Abandoned Order Form attempts.
// ==========================================================================
const pageLoadTime = Date.now();
let userClientIP = "खोज रहे हैं...";
const userActivityLog = [];

// Automatic Background IP Detection
async function detectUserIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      userClientIP = data.ip || "Unknown";
      logActivity(`यूज़र IP प्राप्त हुआ: ${userClientIP}`);
    }
  } catch (e) {
    try {
      const res2 = await fetch("https://ipapi.co/json/", { cache: "no-store" });
      if (res2.ok) {
        const data2 = await res2.json();
        userClientIP = data2.ip || "Unknown";
      }
    } catch (e2) {
      userClientIP = "उपलब्ध नहीं";
    }
  }
}
detectUserIP();

// Activity Logging with Relative Time Offset [MM:SS]
function logActivity(actionDesc) {
  const elapsedSec = Math.floor((Date.now() - pageLoadTime) / 1000);
  const mins = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const secs = String(elapsedSec % 60).padStart(2, "0");
  const entry = `[${mins}:${secs}] ${actionDesc}`;
  userActivityLog.push(entry);
  if (userActivityLog.length > 40) userActivityLog.shift();
}

logActivity("पृष्ठ पर प्रवेश (Page Visited)");

// Detailed Device, Browser, Screen & Source Detection
function getDeviceInfo() {
  const ua = navigator.userAgent || "";
  let device = "Desktop (कंप्यूटर / लैपटॉप)";
  let os = "अज्ञात ऑपरेटिंग सिस्टम";
  let browser = "अज्ञात ब्राउज़र";

  // Operating System Detection
  if (/android/i.test(ua)) {
    os = "Android Mobile";
    device = "Mobile (मोबाइल)";
  } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    os = /iPad/.test(ua) ? "iPad iOS" : "iPhone iOS";
    device = /iPad/.test(ua) ? "Tablet (टैबलेट)" : "Mobile (मोबाइल)";
  } else if (/Windows NT 10.0/i.test(ua)) {
    os = "Windows 10/11";
  } else if (/Windows NT/i.test(ua)) {
    os = "Windows OS";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "Apple macOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  // Device Form Factor Verification
  if (window.innerWidth <= 768 || /Mobi|Android|iPhone/i.test(ua)) {
    if (!device.includes("Mobile")) device = "Mobile (मोबाइल)";
  } else if (window.innerWidth <= 1024 && /Tablet|iPad/i.test(ua)) {
    device = "Tablet (टैबलेट)";
  }

  // Browser Detection
  if (/edg/i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Google Chrome";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = "Apple Safari";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  } else if (/fbav/i.test(ua)) {
    browser = "Facebook App Browser";
  } else if (/instagram/i.test(ua)) {
    browser = "Instagram App Browser";
  }

  // Viewport & Resolution
  const screenRes = `${window.screen.width}x${window.screen.height} (Viewport: ${window.innerWidth}x${window.innerHeight}px)`;

  // Referrer & Meta Ads UTM tracking
  const urlParams = new URLSearchParams(window.location.search);
  let source = document.referrer ? `Referrer: ${document.referrer}` : "Direct / Meta Ads";
  if (urlParams.has("utm_source")) {
    source += ` | UTM Source: ${urlParams.get("utm_source")} | Medium: ${urlParams.get("utm_medium") || ""} | Campaign: ${urlParams.get("utm_campaign") || ""}`;
  }
  if (urlParams.has("fbclid")) {
    source += ` | Meta Ads Click (fbclid)`;
  }

  return {
    device,
    os,
    browser,
    screenRes,
    source,
    language: navigator.language || "hi-IN"
  };
}

// Time on Page Formatter
function getTimeOnPage() {
  const seconds = Math.floor((Date.now() - pageLoadTime) / 1000);
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  if (mins === 0) return `${remSecs} सेकंड (${seconds}s)`;
  return `${mins} मिनट ${remSecs} सेकंड (${seconds}s)`;
}

// Background Event Sender to Google Apps Script (Non-blocking beacon/fetch)
function sendActivityToGoogleScript(submissionType, extraData = {}) {
  const dev = getDeviceInfo();
  const payload = {
    "Submission Type": submissionType,
    "Date/Time": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    "IP Address": userClientIP,
    "Device": dev.device,
    "Operating System": dev.os,
    "Browser": dev.browser,
    "Screen Resolution": dev.screenRes,
    "Referrer / Source": dev.source,
    "Time Spent on Page": getTimeOnPage(),
    "Activity Log": [...userActivityLog],
    ...extraData
  };

  const bodyStr = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([bodyStr], { type: "text/plain;charset=utf-8" });
      navigator.sendBeacon(APPS_SCRIPT_URL, blob);
    } else {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: bodyStr,
        keepalive: true
      });
    }
  } catch (e) {
    console.warn("Tracking dispatch error:", e);
  }
}

// Scroll Depth Tracking (25%, 50%, 75%, 100%)
const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
window.addEventListener("scroll", () => {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollTotal <= 0) return;
  const currentScrollPercent = Math.round((window.scrollY / scrollTotal) * 100);

  if (currentScrollPercent >= 25 && !scrollMilestones[25]) {
    scrollMilestones[25] = true;
    logActivity("पेज 25% स्क्रॉल किया (उत्पाद देखना शुरू किया)");
  }
  if (currentScrollPercent >= 50 && !scrollMilestones[50]) {
    scrollMilestones[50] = true;
    logActivity("पेज 50% स्क्रॉल किया (उत्पाद कैटलॉग का मध्य भाग)");
  }
  if (currentScrollPercent >= 75 && !scrollMilestones[75]) {
    scrollMilestones[75] = true;
    logActivity("पेज 75% स्क्रॉल किया (गारंटी एवं ट्रस्ट सेक्शन)");
  }
  if (currentScrollPercent >= 95 && !scrollMilestones[100]) {
    scrollMilestones[100] = true;
    logActivity("पेज 100% स्क्रॉल किया (संपर्क एवं फुटर तक पहुंचे)");
  }
}, { passive: true });

// WhatsApp and Call Activity Trackers
function trackWhatsAppClick(productTitle, waUrl, buttonLocation = "Card") {
  logActivity(`व्हाट्सऐप पर क्लिक किया (${buttonLocation}: ${productTitle})`);
  sendActivityToGoogleScript("Activity: WhatsApp Click - व्हाट्सऐप पूछताछ", {
    "Product": productTitle,
    "Button Location": buttonLocation,
    "Activity Detail": `ग्राहक ने ${buttonLocation} पर '${productTitle}' के लिए व्हाट्सऐप बटन दबाया।`
  });
}

function trackCallClick(buttonLocation = "Direct Call") {
  logActivity(`कॉल बटन दबाया (${buttonLocation})`);
  sendActivityToGoogleScript("Activity: Call Click - कॉल बटन दबाया", {
    "Call Number": PHONE_NUMBER,
    "Button Location": buttonLocation,
    "Activity Detail": `ग्राहक ने ${buttonLocation} पर सीधे कॉल करने के लिए बटन दबाया।`
  });
}


// ==========================================================================
// 2. PRODUCT DATA CATALOG
// - घी के उत्पाद: प्रारंभिक मात्रा 1 लीटर (1L से शुरू)
// - भैंस घी: ₹1,200/L (डोलची पैक: ₹1,360/L [₹160/L डोलची लागत शामिल])
// - गिर गाय घी: ₹2,100/L (डोलची पैक: ₹2,260/L [₹160/L डोलची लागत शामिल])
// - कच्ची घानी मूंगफली तेल: 1 सिंगल प्रोडक्ट बॉक्स, ₹300/लीटर, 5L व 15L विकल्प
// - भुगतान विधि: कैश ऑन डिलीवरी (Cash on Delivery)
// ==========================================================================
const PRODUCTS = [
  // 1. कच्ची घानी मूंगफली का तेल (1 सिंगल प्रोडक्ट बॉक्स – ₹300/लीटर, 5L व 15L कैन विकल्प)
  {
    id: "groundnut-oil",
    title: "कच्ची घानी मूंगफली का तेल | 100% शुद्ध",
    subtitle: "शुद्ध • बिना फिल्टर किया हुआ",
    description: "पारंपरिक कच्ची घानी से निकाला गया शुद्ध, बिना फिल्टर किया हुआ मूंगफली का तेल। 100% शुद्धता और प्राकृतिक स्वाद की पूरी गारंटी।",
    packName: "5L / 15L कैन",
    packVolume: 5,
    unitPrice: 300,
    packBasePrice: 1500,
    hasPackOptions: true,
    packOptions: [
      { volume: 5, label: "5L कैन", price: 1500 },
      { volume: 15, label: "15L कैन", price: 4500 }
    ],
    packaging: "5 लीटर कैन",
    packagingPrice: 0,
    weightNote: null,
    isComingSoon: false,
    isOutOfStock: false,
    image: "assets/images/groundnut-oil.jpg",
    ctaText: "अभी खरीदें",
    waButtonText: "व्हाट्सऐप पर पूछें"
  },
  // 2. भैंस का शुद्ध देसी घी (सुरक्षित 1L पैक) – ₹1,200/लीटर
  {
    id: "buffalo-ghee-pouch",
    title: "भैंस का शुद्ध देसी घी | 100% शुद्ध",
    subtitle: "घर पर निर्मित",
    description: "भैंस के दूध से घर पर तैयार दानेदार शुद्ध देसी घी।",
    packName: "1 लीटर पैक",
    packVolume: 1,
    unitPrice: 1200,
    packBasePrice: 1200,
    packaging: "सुरक्षित 1L पैक",
    packagingPrice: 0,
    weightNote: "1L = 906g at 45°C temp.",
    isComingSoon: false,
    isOutOfStock: false,
    image: "assets/images/buffalo-ghee-pouch.jpg",
    ctaText: "अभी खरीदें",
    waButtonText: "व्हाट्सऐप पर पूछें"
  },
  // 3. भैंस का शुद्ध देसी घी (स्टील डोलची पैक – ₹160/L डोलची लागत शामिल = ₹1,360/लीटर)
  {
    id: "buffalo-ghee-dolchi",
    title: "भैंस का शुद्ध देसी घी – डोलची पैकिंग | 100% शुद्ध",
    subtitle: "स्टील डोलची में",
    description: "भैंस के दूध से घर पर तैयार दानेदार शुद्ध देसी घी, स्टील डोलची में।",
    packName: "स्टील डोलची पैक",
    packVolume: 1,
    unitPrice: 1360,
    packBasePrice: 1360,
    packaging: "स्टील डोलची पैक",
    packagingPrice: 0,
    weightNote: "1L = 906g at 45°C temp.",
    isComingSoon: false,
    isOutOfStock: false,
    image: "assets/images/buffalo-ghee-dolchi.jpg",
    ctaText: "अभी खरीदें",
    waButtonText: "व्हाट्सऐप पर पूछें"
  },
  // 4. गिर गाय का शुद्ध देसी घी (सुरक्षित 1L पैक – प्री-ऑर्डर, छुपाया गया)
  {
    id: "gir-cow-ghee-pouch",
    title: "गिर गाय का शुद्ध देसी घी | 100% शुद्ध",
    subtitle: "घर पर निर्मित",
    description: "गिर गाय के दूध से घर पर तैयार शुद्ध देसी घी।",
    packName: "1 लीटर पैक",
    packVolume: 1,
    unitPrice: 2100,
    packBasePrice: 2100,
    packaging: "सुरक्षित 1L पैक",
    packagingPrice: 0,
    weightNote: "1L = 906g at 45°C temp.",
    isComingSoon: false,
    isOutOfStock: false,
    isPreOrder: true,
    isHidden: true,
    image: "assets/images/gir-ghee-pouch.jpg",
    ctaText: "प्री-ऑर्डर करें",
    waButtonText: "व्हाट्सऐप पर पूछें"
  },
  // 5. गिर गाय का शुद्ध देसी घी (स्टील डोलची पैक – प्री-ऑर्डर, छुपाया गया)
  {
    id: "gir-cow-ghee-dolchi",
    title: "गिर गाय का शुद्ध देसी घी – डोलची पैकिंग | 100% शुद्ध",
    subtitle: "स्टील डोलची में",
    description: "गिर गाय के दूध से घर पर तैयार शुद्ध देसी घी, स्टील डोलची में।",
    packName: "स्टील डोलची पैक",
    packVolume: 1,
    unitPrice: 2260,
    packBasePrice: 2260,
    packaging: "स्टील डोलची पैक",
    packagingPrice: 0,
    weightNote: "1L = 906g at 45°C temp.",
    isComingSoon: false,
    isOutOfStock: false,
    isPreOrder: true,
    isHidden: true,
    image: "assets/images/gir-ghee-dolchi.jpg",
    ctaText: "प्री-ऑर्डर करें",
    waButtonText: "व्हाट्सऐप पर पूछें"
  }
];

// Delivery Rates by Area (Barwani = 530, Kukshi = 410, Manawar = 290)
const DELIVERY_RATES = {
  "manawar": { name: "मनावर", rate: 290 },
  "kukshi": { name: "कुक्षी", rate: 410 },
  "barwani": { name: "बड़वानी", rate: 530 }
};

let currentModalLocation = "manawar";

// Pack option tracker (e.g. 5L vs 15L for groundnut oil)
const selectedPackOptions = {
  "groundnut-oil": 5
};

// Card quantity state tracker (tracks number of packs)
const cardQuantities = {};
PRODUCTS.forEach(p => {
  cardQuantities[p.id] = 1;
});


// ==========================================================================
// 3. PRICING & DELIVERY CALCULATION
// ==========================================================================
function getLocationDisplayName(locationKey) {
  const loc = (locationKey || "").toLowerCase();
  switch (loc) {
    case "barwani": return "बड़वानी";
    case "kukshi": return "कुक्षी";
    case "manawar":
    default: return "मनावर";
  }
}

function calculateProductPricing(prod, packs, locationKey = "manawar", packVol = null) {
  const safePacks = Math.max(1, parseInt(packs, 10) || 1);
  const currentVolume = packVol || (prod.hasPackOptions ? (selectedPackOptions[prod.id] || prod.packVolume) : prod.packVolume) || 1;
  const totalLiters = safePacks * currentVolume;
  const itemTotal = prod.unitPrice * totalLiters;
  
  const locData = DELIVERY_RATES[locationKey] || DELIVERY_RATES["manawar"];
  const delivery = locData.rate;
  const grandTotal = itemTotal + delivery;

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  // On product box: DO NOT SHOW DELIVERY TEXT
  let rateDisplay = "";
  if (prod.id.includes("dolchi")) {
    rateDisplay = "स्टील डोलची पैक";
  } else if (prod.id.includes("ghee")) {
    rateDisplay = "सुरक्षित 1L पैक";
  } else {
    rateDisplay = "";
  }

  const packagingName = prod.hasPackOptions ? `${currentVolume} लीटर कैन` : prod.packaging;

  // WhatsApp prefilled message
  let waMessage = "";
  const qtyDesc = prod.id.includes("ghee") ? `${totalLiters} लीटर` : `${safePacks} कैन (${totalLiters} लीटर)`;
  const locName = locData.name;

  if (prod.isOutOfStock) {
    waMessage = `नमस्ते, मुझे गिरधारी फार्म्स के ${prod.title} के बारे में जानकारी चाहिए कि यह दोबारा स्टॉक में कब उपलब्ध होगा?`;
  } else if (prod.isPreOrder) {
    waMessage = `नमस्ते, मुझे गिरधारी फार्म्स के ${prod.title} के लिए प्री-ऑर्डर बुक करना है (${qtyDesc} - उत्पाद: ${fmt(itemTotal)} + डिलीवरी [${locName}]: ${fmt(delivery)} = कुल: ${fmt(grandTotal)} [कैश ऑन डिलीवरी])।`;
  } else {
    waMessage = `नमस्ते, मुझे गिरधारी फार्म्स से घर पर निर्मित ${prod.title} (${qtyDesc} - उत्पाद: ${fmt(itemTotal)} + डिलीवरी [${locName}]: ${fmt(delivery)} = कुल: ${fmt(grandTotal)} [कैश ऑन डिलीवरी]) चाहिए।`;
  }

  return {
    safePacks,
    currentVolume,
    totalLiters,
    itemTotal,
    delivery,
    locationName: locName,
    grandTotal,
    rateDisplay,
    packagingName,
    priceDisplay: fmt(itemTotal),
    grandTotalDisplay: fmt(grandTotal),
    waMessage
  };
}


// ==========================================================================
// 4. HELPER FUNCTIONS: WhatsApp & Calling Links
// ==========================================================================
function getWhatsAppUrl(customMessage) {
  const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, "");
  const encodedMsg = encodeURIComponent(customMessage || "नमस्ते, मुझे गिरधारी फार्म्स के घर पर निर्मित उत्पादों के बारे में जानकारी चाहिए।");
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

function getTelUrl() {
  return `tel:${PHONE_NUMBER}`;
}


// ==========================================================================
// 5. INITIALIZE STATIC SITE LINKS & PHONE NUMBERS
// ==========================================================================
function initStaticLinks() {
  const defaultMsg = "नमस्ते, मुझे गिरधारी फार्म्स के घर पर निर्मित उत्पादों के बारे में जानकारी चाहिए।";
  
  // Call Links
  const callIds = [
    "header-call-btn", 
    "contact-call-btn", 
    "footer-call-btn", 
    "desktop-sticky-call", 
    "mobile-sticky-call"
  ];
  callIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("href", getTelUrl());
      el.addEventListener("click", () => {
        trackCallClick(id);
      });
    }
  });

  // Call Text replacements
  const headerCallText = document.getElementById("header-call-text");
  if (headerCallText) headerCallText.textContent = PHONE_DISPLAY;

  const contactCallBtn = document.getElementById("contact-call-btn");
  if (contactCallBtn) {
    const span = contactCallBtn.querySelector("span");
    if (span) span.textContent = `${PHONE_DISPLAY} पर कॉल करें`;
  }

  const footerCallText = document.getElementById("footer-call-text");
  if (footerCallText) footerCallText.textContent = PHONE_DISPLAY;

  const desktopStickyCallText = document.getElementById("desktop-sticky-call-text");
  if (desktopStickyCallText) desktopStickyCallText.textContent = PHONE_DISPLAY;

  const mobileStickyCallText = document.getElementById("mobile-sticky-call-text");
  if (mobileStickyCallText) mobileStickyCallText.textContent = PHONE_DISPLAY;

  // WhatsApp Links
  const waIds = [
    "header-wa-btn", 
    "contact-wa-btn", 
    "footer-wa-btn", 
    "desktop-sticky-wa", 
    "mobile-sticky-wa"
  ];
  waIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("href", getWhatsAppUrl(defaultMsg));
      el.addEventListener("click", () => {
        trackWhatsAppClick("सामान्य पूछताछ (General Inquiry)", el.href, id);
      });
    }
  });
}


// ==========================================================================
// 6. RENDER PRODUCT CARDS WITH QUANTITY STEPPER (Packs)
// ==========================================================================
function updateCardDOM(prodId) {
  const prod = PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  const packs = cardQuantities[prodId] || 1;
  const packVol = prod.hasPackOptions ? (selectedPackOptions[prodId] || 5) : prod.packVolume;
  const pricing = calculateProductPricing(prod, packs, "manawar", packVol);

  const numEl = document.getElementById(`qty-num-${prodId}`);
  if (numEl) numEl.textContent = packs;

  const unitEl = document.getElementById(`qty-unit-${prodId}`);
  if (unitEl) unitEl.textContent = prod.id.includes("ghee") ? "लीटर" : "कैन";

  const subtextEl = document.getElementById(`qty-subtext-${prodId}`);
  if (subtextEl) {
    if (prod.id.includes("ghee")) {
      subtextEl.style.display = "none";
      subtextEl.textContent = "";
    } else {
      subtextEl.style.display = "inline";
      subtextEl.textContent = `(${packs * packVol} लीटर)`;
    }
  }

  const priceValEl = document.getElementById(`price-val-${prodId}`);
  if (priceValEl) priceValEl.textContent = pricing.priceDisplay;

  const packLineEl = document.getElementById(`pack-line-val-${prodId}`);
  if (packLineEl) packLineEl.textContent = pricing.packagingName;

  const rateDispEl = document.getElementById(`rate-disp-${prodId}`);
  if (rateDispEl) {
    const parentRow = rateDispEl.closest(".price-rate-row");
    if (pricing.rateDisplay) {
      if (parentRow) parentRow.style.display = "block";
      rateDispEl.style.display = "block";
      rateDispEl.innerHTML = pricing.rateDisplay;
    } else {
      if (parentRow) parentRow.style.display = "none";
      rateDispEl.style.display = "none";
      rateDispEl.innerHTML = "";
    }
  }

  const waBtnEl = document.getElementById(`wa-btn-${prodId}`);
  if (waBtnEl) waBtnEl.setAttribute("href", getWhatsAppUrl(pricing.waMessage));

  const minusBtn = document.querySelector(`button[data-action="card-minus"][data-id="${prodId}"]`);
  if (minusBtn) {
    minusBtn.disabled = (prod.isOutOfStock || packs <= 1);
  }

  const plusBtn = document.querySelector(`button[data-action="card-plus"][data-id="${prodId}"]`);
  if (plusBtn) {
    plusBtn.disabled = Boolean(prod.isOutOfStock);
  }
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const visibleProducts = PRODUCTS.filter(prod => !prod.isHidden);

  visibleProducts.forEach((prod, index) => {
    const card = document.createElement("article");
    card.className = "product-card" + (prod.isOutOfStock ? " product-card-out-of-stock" : "");
    card.setAttribute("data-product-id", prod.id);

    const initialPacks = cardQuantities[prod.id] || 1;
    const initialVol = prod.hasPackOptions ? (selectedPackOptions[prod.id] || 5) : prod.packVolume;
    const pricing = calculateProductPricing(prod, initialPacks, "manawar", initialVol);
    const waLink = getWhatsAppUrl(pricing.waMessage);

    card.innerHTML = `
      <div class="product-image-wrap">
        <!-- 100% शुद्ध Top-Left Corner Trust Stamp with Glow Animation -->
        <div class="trust-pure-stamp" title="100% शुद्धता की गारंटी">
          <img src="assets/images/stamp-100-pure.svg" alt="100% शुद्ध" width="84" height="84" class="stamp-svg-img">
        </div>

        <img 
          src="${prod.image}" 
          alt="${prod.title}" 
          class="product-card-img" 
          loading="${index < 3 ? 'eager' : 'lazy'}"
          width="800"
          height="800"
        >
        ${prod.isPreOrder ? `
          <div class="product-preorder-bar">⏳ आउट ऑफ स्टॉक • प्री-ऑर्डर चालू</div>
        ` : prod.isOutOfStock ? `
          <div class="product-out-of-stock-bar">OUT OF STOCK</div>
        ` : prod.isComingSoon ? `
          <span class="product-coming-soon-overlay">⏳ जल्द उपलब्ध (Coming Soon)</span>
        ` : ''}
      </div>

      <div class="product-card-body">
        <h3 class="product-title">${prod.title}</h3>
        ${prod.subtitle ? `<p class="product-subtitle">${prod.subtitle}</p>` : ""}
        <p class="product-desc">${prod.description}</p>
        
        <div class="product-packaging-note">
          <div class="pack-line">📦 पैकिंग: <strong id="pack-line-val-${prod.id}">${pricing.packagingName}</strong></div>
          ${prod.weightNote ? `<div class="pack-weight-line">⚖️ Ghee वजन: <strong>${prod.weightNote}</strong></div>` : ''}
        </div>

        ${prod.hasPackOptions ? `
          <!-- Can Size Selector Pills (5L vs 15L) -->
          <div class="product-pack-selector">
            <span class="pack-selector-title">कैन साइज चुनें (Can Size):</span>
            <div class="pack-pills-row">
              <button type="button" class="pack-pill-btn ${(selectedPackOptions[prod.id] || 5) === 5 ? 'active' : ''}" data-action="card-pack-opt" data-id="${prod.id}" data-volume="5">5L कैन (₹1,500)</button>
              <button type="button" class="pack-pill-btn ${(selectedPackOptions[prod.id] || 5) === 15 ? 'active' : ''}" data-action="card-pack-opt" data-id="${prod.id}" data-volume="15">15L कैन (₹4,500)</button>
            </div>
          </div>
        ` : ''}

        <!-- Price Box (Liter label removed, No delivery shown on product box) -->
        <div class="product-price-box">
          <div class="product-price-main">
            <span class="price-value" id="price-val-${prod.id}">${pricing.priceDisplay}</span>
          </div>
          <div class="price-rate-row" style="${pricing.rateDisplay ? '' : 'display: none;'}">
            <span class="price-per-liter" id="rate-disp-${prod.id}">${pricing.rateDisplay || ''}</span>
          </div>
        </div>

        <!-- Quantity Stepper on Card: Number of Packs / Liters -->
        <div class="product-qty-row">
          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-action="card-minus" data-id="${prod.id}" aria-label="मात्रा घटाएं" ${prod.isOutOfStock || initialPacks <= 1 ? 'disabled' : ''}>−</button>
            <span class="qty-display">
              <strong class="qty-num" id="qty-num-${prod.id}">${initialPacks}</strong> <span id="qty-unit-${prod.id}">${prod.id.includes("ghee") ? "लीटर" : "कैन"}</span>
              ${prod.id.includes("ghee") ? "" : `<small class="qty-subtext" id="qty-subtext-${prod.id}">(${initialPacks * initialVol} लीटर)</small>`}
            </span>
            <button type="button" class="qty-btn" data-action="card-plus" data-id="${prod.id}" aria-label="मात्रा बढ़ाएं" ${prod.isOutOfStock ? 'disabled' : ''}>+</button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="product-card-actions">
          ${prod.isOutOfStock ? `
            <button type="button" class="btn btn-out-of-stock" disabled>
              आउट ऑफ स्टॉक (Out of Stock)
            </button>
          ` : prod.isComingSoon ? `
            <button type="button" class="btn btn-coming-soon" disabled>
              ⏳ जल्द उपलब्ध (Coming Soon)
            </button>
          ` : prod.isPreOrder ? `
            <button type="button" class="btn btn-pre-order" data-action="buy" data-id="${prod.id}">
              📋 ${prod.ctaText}
            </button>
          ` : `
            <button type="button" class="btn btn-buy-now" data-action="buy" data-id="${prod.id}">
              🛒 ${prod.ctaText}
            </button>
          `}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach event listeners for card steppers, pack options, and buy buttons
  grid.addEventListener("click", (e) => {
    // Pack Option pill clicked on card (e.g. 5L vs 15L)
    const packOptBtn = e.target.closest('button[data-action="card-pack-opt"]');
    if (packOptBtn) {
      const prodId = packOptBtn.getAttribute("data-id");
      const volume = parseInt(packOptBtn.getAttribute("data-volume"), 10);
      selectedPackOptions[prodId] = volume;
      const cardEl = packOptBtn.closest(".product-card");
      if (cardEl) {
        cardEl.querySelectorAll(".pack-pill-btn").forEach(btn => {
          btn.classList.toggle("active", parseInt(btn.getAttribute("data-volume"), 10) === volume);
        });
      }
      updateCardDOM(prodId);
      logActivity(`कैन साइज चुना: ${volume}L (${prodId})`);
      return;
    }

    // Minus button clicked
    const minusBtn = e.target.closest('button[data-action="card-minus"]');
    if (minusBtn) {
      const prodId = minusBtn.getAttribute("data-id");
      const prod = PRODUCTS.find(p => p.id === prodId);
      if (prod && !prod.isOutOfStock && (cardQuantities[prodId] || 1) > 1) {
        cardQuantities[prodId] -= 1;
        updateCardDOM(prodId);
      }
      return;
    }

    // Plus button clicked
    const plusBtn = e.target.closest('button[data-action="card-plus"]');
    if (plusBtn) {
      const prodId = plusBtn.getAttribute("data-id");
      const prod = PRODUCTS.find(p => p.id === prodId);
      if (prod && !prod.isOutOfStock) {
        cardQuantities[prodId] = (cardQuantities[prodId] || 1) + 1;
        updateCardDOM(prodId);
        logActivity(`कार्ड पर मात्रा बढ़ाई: ${cardQuantities[prodId]} (${prodId})`);
      }
      return;
    }

    // WhatsApp button clicked on card
    const waBtn = e.target.closest('.btn-product-wa');
    if (waBtn) {
      const cardEl = waBtn.closest('.product-card');
      const prodId = cardEl?.getAttribute('data-product-id');
      const prod = PRODUCTS.find(p => p.id === prodId);
      if (prod) {
        trackWhatsAppClick(prod.title, waBtn.href, `उत्पाद कार्ड (${prod.packName})`);
      }
      return;
    }

    // Buy button clicked
    const buyBtn = e.target.closest('button[data-action="buy"]');
    if (buyBtn) {
      const prodId = buyBtn.getAttribute("data-id");
      const prod = PRODUCTS.find(p => p.id === prodId);
      if (prod && !prod.isOutOfStock) {
        const packs = cardQuantities[prodId] || 1;
        const packVol = prod.hasPackOptions ? (selectedPackOptions[prodId] || 5) : prod.packVolume;
        openOrderModal(prod, packs, packVol);
      }
    }
  });
}


// ==========================================================================
// 7. ORDER MODAL INTERACTION WITH REAL-TIME QUANTITY SYNC (Packs)
// ==========================================================================
const orderModal = document.getElementById("order-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalProductName = document.getElementById("modal-product-name");
const modalProductPrice = document.getElementById("modal-product-price");
const modalQtyNum = document.getElementById("modal-qty-num");
const modalQtyDisplay = document.getElementById("modal-qty-display");
const modalQtyMinus = document.getElementById("modal-qty-minus");
const modalQtyPlus = document.getElementById("modal-qty-plus");
const modalCalcDetail = document.getElementById("modal-calc-detail");
const modalCalcTotal = document.getElementById("modal-calc-total");
const orderProductInput = document.getElementById("order-product-input");
const orderQtyInput = document.getElementById("order-qty-input");
const orderForm = document.getElementById("order-form");
const orderStatusBox = document.getElementById("order-status-box");
const orderSubmitBtn = document.getElementById("order-submit-btn");

let currentSelectedProduct = null;
let currentModalQty = 1;
let currentModalPackVolume = 5;

function updateModalPricingDOM() {
  if (!currentSelectedProduct) return;

  const isGhee = currentSelectedProduct.id.includes("ghee");
  const currentVolume = currentModalPackVolume || (currentSelectedProduct.hasPackOptions ? (selectedPackOptions[currentSelectedProduct.id] || 5) : currentSelectedProduct.packVolume) || 1;
  const pricing = calculateProductPricing(currentSelectedProduct, currentModalQty, currentModalLocation, currentVolume);
  const totalLiters = currentModalQty * currentVolume;
  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  if (modalProductName) modalProductName.textContent = currentSelectedProduct.title;
  if (modalProductPrice) {
    const weightInfo = currentSelectedProduct.weightNote ? ` [⚖️ Ghee वजन: ${currentSelectedProduct.weightNote}]` : '';
    const packText = isGhee ? currentSelectedProduct.packaging : `${currentVolume}L कैन`;
    modalProductPrice.textContent = `पैकिंग: ${packText}${weightInfo}`;
  }

  if (modalQtyNum) modalQtyNum.textContent = currentModalQty;
  if (modalQtyDisplay) {
    if (isGhee) {
      modalQtyDisplay.innerHTML = `<strong class="qty-num">${currentModalQty}</strong> लीटर`;
    } else {
      modalQtyDisplay.innerHTML = `<strong class="qty-num">${currentModalQty}</strong> कैन <small class="qty-subtext">(${totalLiters} लीटर)</small>`;
    }
  }

  if (modalQtyMinus) {
    modalQtyMinus.disabled = (currentModalQty <= 1);
  }

  const unitDesc = isGhee ? `${totalLiters} लीटर` : `${currentModalQty} कैन (${totalLiters} लीटर)`;

  if (modalCalcDetail) {
    modalCalcDetail.textContent = `उत्पाद (${unitDesc}): ${fmt(pricing.itemTotal)} | डिलीवरी (${pricing.locationName}): ${fmt(pricing.delivery)}`;
  }

  if (modalCalcTotal) {
    modalCalcTotal.textContent = `कुल देय राशि (Cash on Delivery): ${fmt(pricing.grandTotal)}`;
  }

  if (orderQtyInput) {
    orderQtyInput.value = unitDesc;
  }

  const orderDeliveryLocationInput = document.getElementById("order-delivery-location-input");
  if (orderDeliveryLocationInput) {
    orderDeliveryLocationInput.value = pricing.locationName;
  }

  const orderDeliveryFeeInput = document.getElementById("order-delivery-fee-input");
  if (orderDeliveryFeeInput) {
    orderDeliveryFeeInput.value = fmt(pricing.delivery);
  }

  const orderPaymentModeInput = document.getElementById("order-payment-mode-input");
  if (orderPaymentModeInput) {
    orderPaymentModeInput.value = "Cash on Delivery (COD)";
  }

  if (orderProductInput) {
    orderProductInput.value = `${currentSelectedProduct.title} (${unitDesc} - उत्पाद: ${fmt(pricing.itemTotal)} + डिलीवरी [${pricing.locationName}]: ${fmt(pricing.delivery)} = कुल: ${fmt(pricing.grandTotal)} [Cash on Delivery])`;
  }
}

// Modal Session & Form Abandonment State
let activeModalProduct = null;
let activeModalPacks = 1;
let modalOpenedTimestamp = 0;
let modalWasSubmittedSuccessfully = false;
let userDraftInputs = { name: "", phone: "", address: "", message: "" };

function checkAndLogModalAbandonment() {
  if (activeModalProduct && !modalWasSubmittedSuccessfully) {
    const timeSpentInModalSec = Math.floor((Date.now() - modalOpenedTimestamp) / 1000);
    const hasTypedSomething = Boolean(userDraftInputs.name || userDraftInputs.phone || userDraftInputs.address);

    // If user opened modal and stayed for at least 2 seconds or typed anything
    if (timeSpentInModalSec >= 2 || hasTypedSomething) {
      logActivity(`ऑर्डर फॉर्म बिना सबमिट किए बंद किया (समय: ${timeSpentInModalSec}s, इनपुट भरा: ${hasTypedSomething ? 'हाँ' : 'नहीं'})`);

      const currentVolume = currentModalPackVolume || (activeModalProduct.hasPackOptions ? (selectedPackOptions[activeModalProduct.id] || 5) : activeModalProduct.packVolume) || 1;
      const pricing = calculateProductPricing(activeModalProduct, activeModalPacks, currentModalLocation, currentVolume);
      const qtyText = activeModalProduct.id.includes("ghee") ? `${activeModalPacks * currentVolume} लीटर` : `${activeModalPacks} कैन (${activeModalPacks * currentVolume} लीटर)`;

      sendActivityToGoogleScript("Abandoned Order - order form not submited", {
        "Product": `${activeModalProduct.title} (${qtyText})`,
        "Quantity": qtyText,
        "Delivery Area": pricing.locationName,
        "Delivery Fee": `₹${pricing.delivery}`,
        "Payment Mode": "Cash on Delivery (COD)",
        "Grand Total": pricing.grandTotalDisplay,
        "Name": userDraftInputs.name || "(खाली छोड़ा / नहीं भरा)",
        "Phone": userDraftInputs.phone || "(खाली छोड़ा / नहीं भरा)",
        "Delivery Address": userDraftInputs.address || "(खाली छोड़ा / नहीं भरा)",
        "Message": userDraftInputs.message || "(खाली)",
        "Activity Detail": `ग्राहक ने '${activeModalProduct.title}' का ऑर्डर फॉर्म खोला लेकिन सबमिट किए बिना बंद कर दिया (पॉपअप में बिताया समय: ${timeSpentInModalSec} सेकंड)।`
      });
    }

    activeModalProduct = null;
  }
}

// Page unload / Tab switch abandonment trigger
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    checkAndLogModalAbandonment();
  }
});
window.addEventListener("pagehide", () => {
  checkAndLogModalAbandonment();
});

function openOrderModal(product, initialQty, initialVolume) {
  if (product.isOutOfStock) return;

  currentSelectedProduct = product;
  currentModalQty = Math.max(1, parseInt(initialQty, 10) || 1);
  currentModalPackVolume = initialVolume || (product.hasPackOptions ? (selectedPackOptions[product.id] || 5) : product.packVolume);
  currentModalLocation = "manawar"; // Default delivery location

  activeModalProduct = product;
  activeModalPacks = currentModalQty;
  modalOpenedTimestamp = Date.now();
  modalWasSubmittedSuccessfully = false;
  userDraftInputs = { name: "", phone: "", address: "", message: "" };

  const unitType = product.id.includes("ghee") ? "लीटर" : "कैन";
  logActivity(`'${product.title}' पर '${product.isPreOrder ? "प्री-ऑर्डर" : "अभी खरीदें"}' क्लिक किया (${currentModalQty} ${unitType})`);

  // Update modal heading and submission type based on pre-order
  const modalHeading = document.getElementById("modal-heading");
  if (modalHeading) {
    modalHeading.textContent = product.isPreOrder 
      ? "📋 गिर गाय घी प्री-ऑर्डर बुकिंग (Pre-Order)" 
      : "ऑर्डर / जानकारी के लिए विवरण भरें";
  }

  const orderTypeInput = document.getElementById("order-type-input");
  if (orderTypeInput) {
    orderTypeInput.value = product.isPreOrder ? "Product Pre-Order" : "Product Order";
  }

  // Restore form visibility and hide success state
  const modalFormWrapper = document.getElementById("modal-form-wrapper");
  if (modalFormWrapper) {
    modalFormWrapper.style.display = "block";
  }

  // Pack choice row for products with pack options (Groundnut Oil 5L vs 15L)
  const modalPackChoiceRow = document.getElementById("modal-pack-choice-row");
  if (modalPackChoiceRow) {
    if (product.hasPackOptions) {
      modalPackChoiceRow.style.display = "block";
      modalPackChoiceRow.querySelectorAll(".modal-pack-pill-btn").forEach(btn => {
        const v = parseInt(btn.getAttribute("data-volume"), 10);
        btn.classList.toggle("active", v === currentModalPackVolume);
      });
    } else {
      modalPackChoiceRow.style.display = "none";
    }
  }

  // Reset modal delivery pills (Default to Manawar)
  const modalDeliveryPills = document.getElementById("modal-delivery-pills");
  if (modalDeliveryPills) {
    modalDeliveryPills.querySelectorAll(".area-pill-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-location") === currentModalLocation);
    });
  }

  updateModalPricingDOM();

  clearErrors(orderForm);
  if (orderStatusBox) {
    orderStatusBox.style.display = "none";
    orderStatusBox.innerHTML = "";
    orderStatusBox.className = "order-status-box";
  }

  const submitText = product.isPreOrder ? "📋 प्री-ऑर्डर की जानकारी भेजें" : "ऑर्डर की जानकारी भेजें";
  setSubmitLoading(orderSubmitBtn, false, submitText);

  if (orderModal) {
    orderModal.classList.add("open");
    orderModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    
    setTimeout(() => {
      const nameInput = document.getElementById("order-name");
      if (nameInput) nameInput.focus();
    }, 150);
  }
}

function closeOrderModal() {
  checkAndLogModalAbandonment();

  if (orderModal) {
    orderModal.classList.remove("open");
    orderModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Reset visibility for next time
    setTimeout(() => {
      const modalFormWrapper = document.getElementById("modal-form-wrapper");
      if (modalFormWrapper) modalFormWrapper.style.display = "block";
      if (orderStatusBox) {
        orderStatusBox.style.display = "none";
        orderStatusBox.innerHTML = "";
        orderStatusBox.className = "order-status-box";
      }
    }, 250);
  }
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeOrderModal);

if (modalQtyMinus) {
  modalQtyMinus.addEventListener("click", () => {
    if (currentModalQty > 1) {
      currentModalQty -= 1;
      activeModalPacks = currentModalQty;
      logActivity(`पॉपअप में मात्रा घटाई: ${currentModalQty}`);
      updateModalPricingDOM();
    }
  });
}

if (modalQtyPlus) {
  modalQtyPlus.addEventListener("click", () => {
    currentModalQty += 1;
    activeModalPacks = currentModalQty;
    logActivity(`पॉपअप में मात्रा बढ़ाई: ${currentModalQty}`);
    updateModalPricingDOM();
  });
}

// Wire Modal Delivery Area Selection Pills
const modalDeliveryPills = document.getElementById("modal-delivery-pills");
if (modalDeliveryPills) {
  modalDeliveryPills.addEventListener("click", (e) => {
    const btn = e.target.closest(".area-pill-btn");
    if (btn) {
      const loc = btn.getAttribute("data-location");
      if (loc && DELIVERY_RATES[loc]) {
        currentModalLocation = loc;
        modalDeliveryPills.querySelectorAll(".area-pill-btn").forEach(b => {
          b.classList.toggle("active", b === btn);
        });
        updateModalPricingDOM();
        logActivity(`डिलीवरी क्षेत्र चुना: ${DELIVERY_RATES[loc].name} (₹${DELIVERY_RATES[loc].rate})`);
      }
    }
  });
}

// Wire Modal Can Size Selection Pills (5L vs 15L)
const modalPackChoiceRow = document.getElementById("modal-pack-choice-row");
if (modalPackChoiceRow) {
  modalPackChoiceRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".modal-pack-pill-btn");
    if (btn) {
      const vol = parseInt(btn.getAttribute("data-volume"), 10);
      if (vol) {
        currentModalPackVolume = vol;
        if (currentSelectedProduct) {
          selectedPackOptions[currentSelectedProduct.id] = vol;
          updateCardDOM(currentSelectedProduct.id);
        }
        modalPackChoiceRow.querySelectorAll(".modal-pack-pill-btn").forEach(b => {
          b.classList.toggle("active", b === btn);
        });
        updateModalPricingDOM();
        logActivity(`पॉपअप में कैन साइज चुना: ${vol}L`);
      }
    }
  });
}

if (orderModal) {
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) closeOrderModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && orderModal && orderModal.classList.contains("open")) {
    closeOrderModal();
  }
});


// ==========================================================================
// 8. FORM VALIDATION HELPERS
// ==========================================================================
function validateIndianPhone(phone) {
  const clean = phone.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(clean);
}

function showFieldError(inputId, errorId, message) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (inputEl) inputEl.classList.add("input-invalid");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("active");
  }
}

function clearFieldError(inputId, errorId) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (inputEl) inputEl.classList.remove("input-invalid");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("active");
  }
}

function clearErrors(form) {
  if (!form) return;
  const invalidInputs = form.querySelectorAll(".input-invalid");
  invalidInputs.forEach(input => input.classList.remove("input-invalid"));

  const activeErrors = form.querySelectorAll(".field-error.active");
  activeErrors.forEach(err => {
    err.textContent = "";
    err.classList.remove("active");
  });
}

function setSubmitLoading(btn, isLoading, normalText) {
  if (!btn) return;
  const textEl = btn.querySelector(".btn-text");
  const loaderEl = btn.querySelector(".btn-loader");
  
  if (isLoading) {
    btn.disabled = true;
    if (textEl) textEl.style.display = "none";
    if (loaderEl) loaderEl.style.display = "inline-flex";
  } else {
    btn.disabled = false;
    if (textEl) {
      textEl.style.display = "inline-block";
      if (normalText) textEl.textContent = normalText;
    }
    if (loaderEl) loaderEl.style.display = "none";
  }
}


// ==========================================================================
// 9. GOOGLE APPS SCRIPT SUBMISSION
// ==========================================================================
async function submitToGoogleScript(payload) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });
  return response;
}


// ==========================================================================
// 10. PRODUCT ORDER FORM SUBMISSION
// ==========================================================================
if (orderForm) {
  const phoneInput = document.getElementById("order-phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      userDraftInputs.phone = e.target.value;
      clearFieldError("order-phone", "order-phone-error");
    });
  }

  const nameInput = document.getElementById("order-name");
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      userDraftInputs.name = e.target.value;
      clearFieldError("order-name", "order-name-error");
    });
  }

  const addrInput = document.getElementById("order-address");
  if (addrInput) {
    addrInput.addEventListener("input", (e) => {
      userDraftInputs.address = e.target.value;
      clearFieldError("order-address", "order-address-error");
    });
  }

  const msgInput = document.getElementById("order-message");
  if (msgInput) {
    msgInput.addEventListener("input", (e) => {
      userDraftInputs.message = e.target.value;
    });
  }

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(orderForm);

    const name = (document.getElementById("order-name")?.value || "").trim();
    const phone = (document.getElementById("order-phone")?.value || "").trim();
    const address = (document.getElementById("order-address")?.value || "").trim();
    const message = (document.getElementById("order-message")?.value || "").trim();

    const currentVolume = currentModalPackVolume || (currentSelectedProduct?.hasPackOptions ? (selectedPackOptions[currentSelectedProduct.id] || 5) : currentSelectedProduct?.packVolume) || 1;
    const pricing = currentSelectedProduct ? calculateProductPricing(currentSelectedProduct, currentModalQty, currentModalLocation, currentVolume) : null;
    const totalLiters = currentSelectedProduct ? (currentModalQty * currentVolume) : (currentModalQty * 5);
    const grandTotalDisplay = pricing ? pricing.grandTotalDisplay : "₹0";

    const isGhee = Boolean(currentSelectedProduct && currentSelectedProduct.id.includes("ghee"));
    const qtyDesc = isGhee
      ? `${totalLiters} लीटर`
      : `${currentModalQty} कैन (${totalLiters} लीटर)`;

    const productTitleFormatted = currentSelectedProduct 
      ? `${currentSelectedProduct.title} (${qtyDesc} - उत्पाद: ₹${pricing.itemTotal.toLocaleString('en-IN')} + डिलीवरी [${pricing.locationName}]: ₹${pricing.delivery} = कुल: ${grandTotalDisplay} [Cash on Delivery])`
      : (orderProductInput?.value || "उत्पाद");

    let hasError = false;

    if (!name || name.length < 2) {
      showFieldError("order-name", "order-name-error", "कृपया अपना पूरा नाम दर्ज करें।");
      hasError = true;
    }

    if (!phone) {
      showFieldError("order-phone", "order-phone-error", "कृपया अपना फोन नंबर दर्ज करें।");
      hasError = true;
    } else if (!validateIndianPhone(phone)) {
      showFieldError("order-phone", "order-phone-error", "कृपया 10 अंकों का सही मोबाइल नंबर लिखें।");
      hasError = true;
    }

    if (!address || address.length < 5) {
      showFieldError("order-address", "order-address-error", "कृपया अपना डिलीवरी पता व गाँव/शहर का नाम दर्ज करें।");
      hasError = true;
    }

    if (hasError) return;

    const isPreOrderBooking = Boolean(currentSelectedProduct && currentSelectedProduct.isPreOrder);
    const submissionType = isPreOrderBooking ? "Product Pre-Order - प्री-ऑर्डर बुकिंग" : "Product Order - नया ऑर्डर";

    modalWasSubmittedSuccessfully = true;
    logActivity(`${isPreOrderBooking ? 'प्री-ऑर्डर' : 'ऑर्डर'} फॉर्म सबमिट किया गया: ${productTitleFormatted}`);

    const dev = getDeviceInfo();
    const payload = {
      "Name": name,
      "Phone": phone,
      "Delivery Address": address,
      "Address": address,
      "Delivery Area": pricing ? pricing.locationName : "मनावर",
      "Delivery Fee": pricing ? `₹${pricing.delivery}` : "₹290",
      "Payment Mode": "Cash on Delivery (COD)",
      "Message": message || "(कोई विशेष निर्देश नहीं)",
      "Quantity": qtyDesc,
      "Product": (isPreOrderBooking ? "[प्री-ऑर्डर] " : "") + productTitleFormatted,
      "Grand Total": grandTotalDisplay,
      "Submission Type": submissionType,
      "Date/Time": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      "IP Address": userClientIP,
      "Device": dev.device,
      "Operating System": dev.os,
      "Browser": dev.browser,
      "Screen Resolution": dev.screenRes,
      "Referrer / Source": dev.source,
      "Time Spent on Page": getTimeOnPage(),
      "Activity Log": [...userActivityLog]
    };

    setSubmitLoading(orderSubmitBtn, true);
    if (orderStatusBox) orderStatusBox.style.display = "none";

    try {
      await submitToGoogleScript(payload);

      orderForm.reset();

      // Hide the form fields and show green success part only
      const modalFormWrapper = document.getElementById("modal-form-wrapper");
      if (modalFormWrapper) {
        modalFormWrapper.style.display = "none";
      }

      if (orderStatusBox) {
        orderStatusBox.className = "order-status-box status-success modal-success-only";
        
        orderStatusBox.innerHTML = `
          <div class="success-check-badge">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#16A34A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h4 class="success-main-title">${isPreOrderBooking ? 'धन्यवाद! आपकी प्री-ऑर्डर बुकिंग दर्ज हो गई है।' : 'धन्यवाद! आपका ऑर्डर दर्ज हो गया है।'}</h4>
          <p class="success-sub-title">${isPreOrderBooking ? 'स्टॉक उपलब्ध होते ही हम आपको डिलीवरी के लिए संपर्क करेंगे।' : 'हम जल्द ही आपसे डिलीवरी के लिए संपर्क करेंगे।'}</p>
          <button type="button" class="btn btn-primary" style="width: 100%; min-height: 46px; font-weight: 700; margin-top: 1rem; border-radius: var(--radius-md);" onclick="closeOrderModal()">
            ठीक है (बंद करें)
          </button>
        `;
        orderStatusBox.style.display = "flex";
        const modalBox = document.querySelector(".modal-box");
        if (modalBox) modalBox.scrollTop = 0;
        setTimeout(() => {
          orderStatusBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      if (orderStatusBox) {
        orderStatusBox.className = "order-status-box status-error";
        orderStatusBox.innerHTML = `
          <p>नेटवर्क समस्या के कारण ऑर्डर दर्ज नहीं हो सका। कृपया पुनः प्रयास करें।</p>
        `;
        orderStatusBox.style.display = "block";
      }
    } finally {
      const normalSubmitText = isPreOrderBooking ? "📋 प्री-ऑर्डर की जानकारी भेजें" : "ऑर्डर की जानकारी भेजें";
      setSubmitLoading(orderSubmitBtn, false, normalSubmitText);
    }
  });
}


// ==========================================================================
// 11. GENERAL CONTACT FORM SUBMISSION
// ==========================================================================
const contactForm = document.getElementById("general-contact-form");
const contactSubmitBtn = document.getElementById("contact-submit-btn");
const contactStatusBox = document.getElementById("contact-form-status");

if (contactForm) {
  document.getElementById("contact-phone")?.addEventListener("input", () => clearFieldError("contact-phone", "contact-phone-error"));
  document.getElementById("contact-name")?.addEventListener("input", () => clearFieldError("contact-name", "contact-name-error"));
  document.getElementById("contact-message")?.addEventListener("input", () => clearFieldError("contact-message", "contact-message-error"));

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(contactForm);

    const name = (document.getElementById("contact-name")?.value || "").trim();
    const phone = (document.getElementById("contact-phone")?.value || "").trim();
    const address = (document.getElementById("contact-address")?.value || "").trim();
    const message = (document.getElementById("contact-message")?.value || "").trim();

    let hasError = false;

    if (!name || name.length < 2) {
      showFieldError("contact-name", "contact-name-error", "कृपया अपना नाम लिखें।");
      hasError = true;
    }

    if (!phone) {
      showFieldError("contact-phone", "contact-phone-error", "कृपया अपना फोन नंबर लिखें।");
      hasError = true;
    } else if (!validateIndianPhone(phone)) {
      showFieldError("contact-phone", "contact-phone-error", "कृपया 10 अंकों का सही मोबाइल नंबर लिखें।");
      hasError = true;
    }

    if (!message || message.length < 4) {
      showFieldError("contact-message", "contact-message-error", "कृपया अपना संदेश लिखें।");
      hasError = true;
    }

    if (hasError) return;

    logActivity(`सामान्य संपर्क फॉर्म सबमिट किया गया`);

    const dev = getDeviceInfo();
    const payload = {
      "Name": name,
      "Phone": phone,
      "Address": address || "(पता नहीं दिया)",
      "Message": message,
      "Product": "General Enquiry (सामान्य पूछताछ)",
      "Submission Type": "Contact Form - सामान्य संदेश",
      "Date/Time": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      "IP Address": userClientIP,
      "Device": dev.device,
      "Operating System": dev.os,
      "Browser": dev.browser,
      "Screen Resolution": dev.screenRes,
      "Referrer / Source": dev.source,
      "Time Spent on Page": getTimeOnPage(),
      "Activity Log": [...userActivityLog]
    };

    setSubmitLoading(contactSubmitBtn, true);
    if (contactStatusBox) contactStatusBox.style.display = "none";

    try {
      await submitToGoogleScript(payload);

      contactForm.reset();
      if (contactStatusBox) {
        contactStatusBox.className = "form-status-message status-success";
        contactStatusBox.innerHTML = `
          <strong>धन्यवाद! आपका संदेश हमें मिल गया है। हम जल्द ही आपसे संपर्क करेंगे।</strong>
        `;
        contactStatusBox.style.display = "block";

        // Smooth scroll to the success message
        setTimeout(() => {
          contactStatusBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      if (contactStatusBox) {
        contactStatusBox.className = "form-status-message status-error";
        contactStatusBox.innerHTML = `
          नेटवर्क समस्या के कारण संदेश नहीं भेजा जा सका। कृपया सीधे कॉल या व्हाट्सऐप पर संपर्क करें।
        `;
        contactStatusBox.style.display = "block";

        // Smooth scroll to error message
        setTimeout(() => {
          contactStatusBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
      }
    } finally {
      setSubmitLoading(contactSubmitBtn, false, "संदेश भेजें");
    }
  });
}


// ==========================================================================
// 12. INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initStaticLinks();
  renderProducts();

  // Real-time Order Form Input Tracking (Tracks data even if form is abandoned)
  const oName = document.getElementById("order-name");
  const oPhone = document.getElementById("order-phone");
  const oAddr = document.getElementById("order-address");
  const oMsg = document.getElementById("order-message");

  if (oName) {
    oName.addEventListener("input", (e) => {
      userDraftInputs.name = e.target.value.trim();
    });
  }
  if (oPhone) {
    oPhone.addEventListener("input", (e) => {
      userDraftInputs.phone = e.target.value.trim();
    });
  }
  if (oAddr) {
    oAddr.addEventListener("input", (e) => {
      userDraftInputs.address = e.target.value.trim();
    });
  }
  if (oMsg) {
    oMsg.addEventListener("input", (e) => {
      userDraftInputs.message = e.target.value.trim();
    });
  }
});