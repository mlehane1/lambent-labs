import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { sendLeadNotification } from "../leadNotify.js";

const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

const heading = (extra = {}) => ({
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.15,
  color: "var(--text-hi)",
  ...extra,
});

const body = (extra = {}) => ({
  fontFamily: "'DM Sans', sans-serif",
  lineHeight: 1.7,
  color: "var(--text-mid)",
  ...extra,
});

const section = (extra = {}) => ({
  padding: "5rem clamp(1rem, 5vw, 4rem)",
  maxWidth: 1100,
  margin: "0 auto",
  ...extra,
});

const card = (extra = {}) => ({
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "2rem",
  ...extra,
});

const industries = [
  "Restaurant/Food",
  "Fitness/Gym",
  "Professional Services",
  "Retail/E-Commerce",
  "Healthcare",
  "Real Estate",
  "Construction/Trades",
  "Nonprofit",
  "Creative/Agency",
  "Technology",
  "Other",
];

const industryTaglines = {
  "Restaurant/Food": "Fresh flavors, unforgettable experiences",
  "Fitness/Gym": "Transform your body, elevate your life",
  "Professional Services": "Expert solutions you can trust",
  "Retail/E-Commerce": "Shop smarter, live better",
  "Healthcare": "Compassionate care for every patient",
  "Real Estate": "Find your perfect place to call home",
  "Construction/Trades": "Building quality that stands the test of time",
  "Nonprofit": "Making a difference, one step at a time",
  "Creative/Agency": "Where bold ideas become reality",
  "Technology": "Innovative solutions for a connected world",
  "Other": "Quality service, exceptional results",
};

function classifyProject(description) {
  const d = (description || "").toLowerCase();
  if (
    d.match(
      /mobile app|ios|android|push notification|app store|native app/
    )
  )
    return {
      type: "Native Mobile App",
      price: "$10K - $30K+",
      key: "mobile",
    };
  if (
    d.match(
      /login|users|dashboard|manage|track|automate|integrate|database|portal|booking|scheduling|inventory/
    )
  )
    return {
      type: "Web Application",
      price: "$2K - $15K",
      key: "webapp",
    };
  if (d.match(/connect|api|sync|migrate|data/))
    return {
      type: "Integration / Data Platform",
      price: "$3K - $12K",
      key: "integration",
    };
  return {
    type: "Standalone Website",
    price: "$999/yr",
    key: "website",
  };
}

function generateExplanation(classification, description, industry, customers) {
  const { key } = classification;
  const ind = industry || "your industry";
  const cust = customers
    ? "Your customers — " + customers.split(".")[0].toLowerCase().trim() + " —"
    : "Your audience";

  if (key === "mobile")
    return (
      "Based on what you described, a native mobile app is the right fit. " +
      cust +
      " expect a fast, on-the-go experience with features like push notifications and offline access. " +
      "We will build an app tailored for " +
      ind +
      " that lives right on their phone and keeps them coming back."
    );
  if (key === "webapp")
    return (
      "What you are describing is a custom web application — not just a website, but a tool that works for your business behind the scenes. " +
      cust +
      " will get a polished front-end, while you get a powerful dashboard to manage everything. " +
      "This is where " +
      ind +
      " businesses see the biggest ROI."
    );
  if (key === "integration")
    return (
      "Your project centers on connecting systems and making data flow seamlessly. " +
      cust +
      " will benefit from faster processes and fewer manual steps. " +
      "We will build a clean integration layer that ties your existing tools together and scales with your " +
      ind +
      " business."
    );
  return (
    "A professionally designed website is exactly what you need to establish credibility and attract new customers. " +
    cust +
    " will find you on Google, see a fast and polished site, and know they are in the right place. " +
    "For " +
    ind +
    ", this is the foundation everything else is built on."
  );
}

const techItemsWebsite = [
  {
    title: "Responsive Strategy",
    detail:
      "Mobile-first breakpoint system with fluid typography scaling from 320px to 2560px viewport widths",
  },
  {
    title: "SEO Architecture",
    detail:
      "Structured data markup with JSON-LD schema, dynamic sitemap generation, and canonical URL management",
  },
  {
    title: "Lead Capture Flow",
    detail:
      "Progressive form disclosure with micro-conversions, exit-intent triggers, and CRM webhook integration",
  },
  {
    title: "Analytics & Tracking",
    detail:
      "GA4 event taxonomy with custom dimensions, server-side tagging container, and conversion attribution modeling",
  },
  {
    title: "Content Management",
    detail:
      "Headless CMS with preview environments, scheduled publishing, and role-based editorial workflows",
  },
  {
    title: "Performance Budget",
    detail:
      "Sub-2s LCP target with image optimization pipeline, critical CSS extraction, and edge caching strategy",
  },
];

const techItemsWebApp = [
  {
    title: "Authentication Model",
    detail:
      "JWT-based session management with refresh token rotation, MFA support, and role-based access control",
  },
  {
    title: "Data Architecture",
    detail:
      "Normalized relational schema with row-level security policies, real-time subscriptions, and automated backups",
  },
  {
    title: "Notification System",
    detail:
      "Multi-channel dispatch engine supporting email, SMS, and in-app notifications with user preference management",
  },
  {
    title: "API Integration Plan",
    detail:
      "RESTful endpoints with rate limiting, webhook retry logic, and third-party OAuth connection management",
  },
];

const techItemsMobile = [
  {
    title: "Platform Strategy (iOS/Android)",
    detail:
      "Cross-platform React Native build with platform-specific UI adaptations and shared business logic layer",
  },
  {
    title: "Push Notification Architecture",
    detail:
      "APNs and FCM dual-provider setup with segmented targeting, A/B testing, and delivery analytics",
  },
  {
    title: "Offline Capability",
    detail:
      "Local SQLite persistence with background sync queue, conflict resolution, and optimistic UI updates",
  },
];

function getTechItems(key) {
  let items = [...techItemsWebsite];
  if (key === "webapp") items = items.concat(techItemsWebApp);
  if (key === "mobile") items = items.concat(techItemsWebApp, techItemsMobile);
  if (key === "integration")
    items = items.concat([
      techItemsWebApp[2],
      techItemsWebApp[3],
    ]);
  return items;
}

const inputStyle = (extra = {}) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.95rem",
  color: "var(--text-hi)",
  background: "var(--bg-deep)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "0.75rem 1rem",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
  ...extra,
});

const labelStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--text-hi)",
  marginBottom: "0.4rem",
  display: "block",
};

const btnPrimary = (extra = {}) => ({
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#fff",
  background: "linear-gradient(135deg, var(--primary), var(--primary-lt))",
  border: "none",
  borderRadius: 10,
  padding: "1rem 2.5rem",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 4px 24px rgba(21,88,203,0.3)",
  ...extra,
});

/* ─── Component ─── */

export default function BuildPreview() {
  const [state, setState] = useState("intake"); // intake | loading | preview
  const [fade, setFade] = useState(true);

  // Intake fields
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1558CB");
  const [accentColor, setAccentColor] = useState("#15CB88");
  const [needDescription, setNeedDescription] = useState("");
  const [customers, setCustomers] = useState("");
  const [services, setServices] = useState("");

  // AI-generated preview data
  const [aiData, setAiData] = useState(null);
  const [aiError, setAiError] = useState(false);
  const aiDataRef = useRef(null);

  // Contact form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactSending, setContactSending] = useState(false);

  const finalizeRef = useRef(null);

  useEffect(() => {
    document.title =
      "Build Your Project \u2014 See a Live Preview | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Describe what you need and see a live preview of your project in seconds. Website, web app, or mobile app \u2014 we'll show you what's possible."
      );
    }
  }, []);

  // Pre-fill contact message when switching to preview
  useEffect(() => {
    if (state === "preview") {
      const summary =
        "Hi, I used the Build Preview tool and here is what I am looking for:\n\n" +
        "Business: " +
        businessName +
        " (" +
        industry +
        ")\n" +
        "What I need: " +
        needDescription +
        "\n" +
        "My customers: " +
        customers +
        "\n" +
        "Services: " +
        services;
      setContactMsg(summary);
    }
  }, [state]);

  async function handleGenerate(e) {
    e.preventDefault();
    setAiError(false);
    setFade(false);
    await new Promise(r => setTimeout(r, 300));
    setState("loading");
    setFade(true);

    try {
      const res = await fetch("/api/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          industry,
          primaryColor,
          accentColor,
          description: needDescription,
          customers,
          services,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      aiDataRef.current = data;
      setAiData(data);
    } catch {
      setAiError(true);
      // Fall back to template-based generation (existing logic still works without aiData)
    }

    setFade(false);
    await new Promise(r => setTimeout(r, 300));
    setState("preview");
    setFade(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStartOver() {
    setFade(false);
    setTimeout(() => {
      setState("intake");
      setFade(true);
      setContactSent(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  }

  async function handleContactSubmit(e) {
    e.preventDefault();
    setContactSending(true);
    const fullMsg =
      "[Build Preview] " +
      contactMsg +
      "\n\nColors: " +
      primaryColor +
      " / " +
      accentColor;
    try {
      await fetch(SUPABASE_URL + "/rest/v1/leads", {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone || null,
          message: fullMsg,
        }),
      });
      sendLeadNotification(contactName, contactEmail, fullMsg, "Build Preview Tool");
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "form_submit",
          form_name: "build_preview",
        });
      }
      setContactSent(true);
    } catch (_) {
      /* silent */
    }
    setContactSending(false);
  }

  const ai = aiData || aiDataRef.current;
  const classification = ai
    ? { type: ai.projectTypeLabel, price: ai.estimatedRange, key: ai.projectType }
    : classifyProject(needDescription);
  const servicesList = ai
    ? (ai.serviceCards || []).map(s => s.name)
    : services.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
  const serviceDescriptions = ai
    ? (ai.serviceCards || []).reduce((acc, s) => { acc[s.name] = s.description; return acc; }, {})
    : {};
  const techItems = ai
    ? (ai.technicalConsiderations || [])
    : getTechItems(classification.key);
  const tagline = ai
    ? ai.tagline
    : (industryTaglines[industry] || industryTaglines["Other"]);
  const heroSub = ai ? ai.heroSubheadline : null;
  const aboutBlurb = ai ? ai.aboutBlurb : null;
  const recommendationText = ai
    ? ai.recommendation
    : generateExplanation(classification, needDescription, industry, customers);
  const fakeDomain =
    businessName
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/ /g, "-") + ".com";

  /* ── Render ── */

  // Loading state
  if (state === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-deep)",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            border: "4px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "bpSpin 0.9s linear infinite",
          }}
        />
        <p
          style={body({
            marginTop: "1.5rem",
            fontSize: "1.1rem",
            color: "var(--text-hi)",
          })}
        >
          Analyzing your project...
        </p>
        <style>{
          "@keyframes bpSpin { to { transform: rotate(360deg); } }"
        }</style>
      </div>
    );
  }

  // ── Intake Form ──
  if (state === "intake") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-deep)",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div style={section({ paddingTop: "6rem", paddingBottom: "4rem" })}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={heading({ fontSize: "clamp(2rem, 5vw, 3rem)" })}>
              See Your Project Come to Life
            </h1>
            <p
              style={body({
                fontSize: "1.15rem",
                maxWidth: 620,
                margin: "1rem auto 0",
              })}
            >
              Tell us what you&#39;re building. We&#39;ll show you what it could
              look like &mdash; in seconds.
            </p>
          </div>

          <form
            onSubmit={handleGenerate}
            style={card({
              maxWidth: 680,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            })}
          >
            {/* Business Name */}
            <div>
              <label style={labelStyle}>Business Name</label>
              <input
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Fitness"
                style={inputStyle()}
              />
            </div>

            {/* Industry */}
            <div>
              <label style={labelStyle}>Industry</label>
              <select
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={inputStyle({
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238AABE5' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  paddingRight: "2.5rem",
                })}
              >
                <option value="">Select your industry</option>
                {industries.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* Colors */}
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Primary Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{
                      width: 44,
                      height: 44,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 2,
                      background: "var(--bg-deep)",
                      cursor: "pointer",
                    }}
                  />
                  <span style={body({ fontSize: "0.9rem", color: "var(--text-lo)" })}>
                    {primaryColor}
                  </span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{
                      width: 44,
                      height: 44,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 2,
                      background: "var(--bg-deep)",
                      cursor: "pointer",
                    }}
                  />
                  <span style={body({ fontSize: "0.9rem", color: "var(--text-lo)" })}>
                    {accentColor}
                  </span>
                </div>
              </div>
            </div>

            {/* What do you need */}
            <div>
              <label style={labelStyle}>What do you need?</label>
              <textarea
                required
                rows={4}
                value={needDescription}
                onChange={(e) => setNeedDescription(e.target.value)}
                placeholder="Describe what you're looking for. A website? An app? A tool to manage your business? Tell us in plain English."
                style={inputStyle({ resize: "vertical" })}
              />
            </div>

            {/* Customers */}
            <div>
              <label style={labelStyle}>Who are your customers?</label>
              <textarea
                required
                rows={3}
                value={customers}
                onChange={(e) => setCustomers(e.target.value)}
                placeholder="Who visits your site or uses your product? What do they need from you?"
                style={inputStyle({ resize: "vertical" })}
              />
            </div>

            {/* Services */}
            <div>
              <label style={labelStyle}>
                What are your top 3-5 services or offerings?
              </label>
              <textarea
                required
                rows={3}
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="e.g. Personal Training, Group Classes, Nutrition Plans, Online Coaching, Corporate Wellness"
                style={inputStyle({ resize: "vertical" })}
              />
            </div>

            <button type="submit" style={btnPrimary({ alignSelf: "center", marginTop: "0.5rem" })}>
              Generate Preview
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Preview State ── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        opacity: fade ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* ─ Section A: Live Site Preview ─ */}
      <div style={section({ paddingBottom: "2rem" })}>
        <h2
          style={heading({
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            textAlign: "center",
            marginBottom: "2rem",
          })}
        >
          Here&#39;s what{" "}
          <span style={{ color: accentColor }}>{businessName || "Your Site"}</span>{" "}
          could look like
        </h2>

        {/* Browser chrome */}
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            position: "relative",
            border: "1px solid #2a2a3e",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1rem",
              background: "#1e1e2e",
              borderBottom: "1px solid #2a2a3e",
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
            <div
              style={{
                flex: 1,
                marginLeft: "0.75rem",
                background: "#12121e",
                borderRadius: 6,
                padding: "0.3rem 0.75rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#888",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ color: "#28c840", fontSize: "0.7rem" }}>&#128274;</span>
              {fakeDomain || "your-site.com"}
            </div>
          </div>

          {/* Viewport */}
          <div
            style={{
              height: 620,
              overflow: "hidden",
              position: "relative",
              background: "#ffffff",
            }}
          >
            {/* The mockup, scaled to 55% */}
            <div
              style={{
                transform: "scale(0.55)",
                transformOrigin: "top center",
                width: "181.81%",
                marginLeft: "-40.905%",
              }}
            >

              {/* ══════ Nav Variant ══════ */}
              {(function() {
                var navType = (ai && ai.navStyle) ? ai.navStyle : "solid";
                var heroType = (ai && ai.heroStyle) ? ai.heroStyle : "gradient";
                var isTransparent = navType === "transparent";
                var isMinimal = navType === "minimal";
                var navBg = isTransparent ? "transparent" : "#ffffff";
                var navPosition = isTransparent ? "absolute" : "relative";
                var navTextColor = isTransparent ? "#ffffff" : "#555";
                var navNameColor = isTransparent ? "#ffffff" : primaryColor;
                var navShadow = (!isTransparent && !isMinimal) ? "0 1px 8px rgba(0,0,0,0.06)" : "none";
                var navBorder = (!isTransparent && !isMinimal) ? "1px solid #eee" : "none";
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.1rem 3.5rem",
                      background: navBg,
                      borderBottom: navBorder,
                      boxShadow: navShadow,
                      position: navPosition,
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        fontSize: "1.35rem",
                        color: navNameColor,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {businessName || "Your Business"}
                    </span>
                    <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                      {!isMinimal && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: isTransparent ? "rgba(255,255,255,0.9)" : "#333", fontWeight: 500 }}>Home</span>
                      )}
                      {!isMinimal && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: navTextColor }}>Services</span>
                      )}
                      {!isMinimal && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: navTextColor }}>About</span>
                      )}
                      {!isMinimal && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: navTextColor }}>Contact</span>
                      )}
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.55rem 1.5rem",
                          background: isTransparent ? "transparent" : accentColor,
                          color: isTransparent ? "#fff" : "#fff",
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRadius: 6,
                          border: isTransparent ? "2px solid rgba(255,255,255,0.7)" : "none",
                        }}
                      >
                        {(ai && ai.ctaText) ? ai.ctaText : "Get a Quote"}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* ══════ Hero Variant ══════ */}
              {(function() {
                var heroType = (ai && ai.heroStyle) ? ai.heroStyle : "gradient";
                var ctaLabel = (ai && ai.ctaText) ? ai.ctaText : "Get Started Today";
                var badge = (ai && ai.featureHighlight) ? ai.featureHighlight : null;
                var secondCta = (ai && ai.secondaryCta) ? ai.secondaryCta : "Learn More";

                if (heroType === "split") {
                  return (
                    <div style={{ display: "flex", minHeight: 480, position: "relative" }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem 3.5rem", background: "#ffffff" }}>
                        {badge && (
                          <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: primaryColor, background: primaryColor + "14", padding: "0.35rem 1rem", borderRadius: 20, marginBottom: "1.2rem", alignSelf: "flex-start", letterSpacing: "0.03em" }}>{badge}</span>
                        )}
                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "3rem", color: "#1a1a2e", margin: "0 0 1rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                          {businessName || "Your Business Name"}
                        </h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.15rem", color: "#666", margin: "0 0 0.8rem", lineHeight: 1.6, maxWidth: 440 }}>
                          {tagline}
                        </p>
                        {heroSub && (
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#999", margin: "0 0 2rem", lineHeight: 1.6, maxWidth: 400 }}>{heroSub}</p>
                        )}
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          <span style={{ display: "inline-block", padding: "0.9rem 2.2rem", background: primaryColor, color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem", borderRadius: 8 }}>{ctaLabel}</span>
                          <span style={{ display: "inline-block", padding: "0.9rem 2.2rem", background: "transparent", color: primaryColor, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1rem", borderRadius: 8, border: "2px solid " + primaryColor }}>{secondCta}</span>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: "linear-gradient(135deg, " + primaryColor + " 0%, " + primaryColor + "cc 50%, " + primaryColor + "99 100%)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 40, right: 40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                        <div style={{ position: "absolute", bottom: 60, left: 30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 120, height: 120, borderRadius: 20, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2.5rem", color: "rgba(255,255,255,0.5)" }}>{(businessName || "B").charAt(0)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (heroType === "centered") {
                  return (
                    <div style={{ padding: "6rem 3.5rem 5rem", background: "#fafafa", textAlign: "center", position: "relative" }}>
                      {badge && (
                        <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: primaryColor, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5rem" }}>{badge}</span>
                      )}
                      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "3.6rem", color: "#1a1a2e", margin: "0 auto 0.5rem", letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 700, position: "relative", display: "inline-block" }}>
                        {businessName || "Your Business Name"}
                      </h2>
                      <div style={{ width: 80, height: 4, background: primaryColor, margin: "1rem auto 1.5rem", borderRadius: 2 }} />
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.25rem", color: "#777", margin: "0 auto 1rem", maxWidth: 550, lineHeight: 1.6 }}>
                        {tagline}
                      </p>
                      {heroSub && (
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#aaa", margin: "0 auto 2.5rem", maxWidth: 480, lineHeight: 1.6 }}>{heroSub}</p>
                      )}
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                        <span style={{ display: "inline-block", padding: "0.9rem 2.5rem", background: primaryColor, color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem", borderRadius: 8 }}>{ctaLabel}</span>
                      </div>
                    </div>
                  );
                }

                if (heroType === "fullwidth") {
                  return (
                    <div style={{ padding: "6rem 3.5rem 5.5rem", background: primaryColor, textAlign: "center", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -80, right: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", bottom: -40, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(0,0,0,0.08)", pointerEvents: "none" }} />
                      {badge && (
                        <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: primaryColor, background: "#ffffff", padding: "0.4rem 1.2rem", borderRadius: 20, marginBottom: "1.5rem", letterSpacing: "0.05em", textTransform: "uppercase", position: "relative" }}>{badge}</span>
                      )}
                      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "5rem", color: "#ffffff", margin: "0 0 1rem", letterSpacing: "-0.04em", lineHeight: 1.0, position: "relative" }}>
                        {businessName || "Your Business Name"}
                      </h2>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.3rem", color: "rgba(255,255,255,0.85)", margin: "0 auto 1rem", maxWidth: 600, lineHeight: 1.5, position: "relative" }}>
                        {tagline}
                      </p>
                      {heroSub && (
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", margin: "0 auto 2.5rem", maxWidth: 500, lineHeight: 1.6, position: "relative" }}>{heroSub}</p>
                      )}
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", position: "relative" }}>
                        <span style={{ display: "inline-block", padding: "1.1rem 2.8rem", background: "#ffffff", color: "#1a1a2e", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", borderRadius: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>{ctaLabel}</span>
                        <span style={{ display: "inline-block", padding: "1.1rem 2.8rem", background: "transparent", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.1rem", borderRadius: 8, border: "2px solid rgba(255,255,255,0.4)" }}>{secondCta}</span>
                      </div>
                    </div>
                  );
                }

                /* Default: gradient */
                return (
                  <div
                    style={{
                      padding: "5.5rem 3.5rem 5rem",
                      background: "linear-gradient(160deg, " + primaryColor + " 0%, " + primaryColor + "dd 40%, " + primaryColor + "88 70%, #ffffff 100%)",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "absolute", top: "-120px", right: "-80px", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-60px", left: "-40px", width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
                    {badge && (
                      <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.18)", padding: "0.4rem 1.2rem", borderRadius: 20, marginBottom: "1.5rem", letterSpacing: "0.05em", textTransform: "uppercase", position: "relative" }}>{badge}</span>
                    )}
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "3.4rem", color: "#fff", margin: "0 0 1.2rem", letterSpacing: "-0.03em", lineHeight: 1.1, position: "relative" }}>
                      {businessName || "Your Business Name"}
                    </h2>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.35rem", color: "rgba(255,255,255,0.92)", margin: "0 auto 1.2rem", maxWidth: 600, lineHeight: 1.5, position: "relative" }}>
                      {tagline}
                    </p>
                    {heroSub && (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.65)", margin: "0 auto 2.2rem", maxWidth: 520, lineHeight: 1.6, position: "relative" }}>{heroSub}</p>
                    )}
                    <div style={{ position: "relative", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-block", padding: "1rem 2.5rem", background: accentColor, color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.05rem", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>{ctaLabel}</span>
                      <span style={{ display: "inline-block", padding: "1rem 2.5rem", background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.05rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)" }}>{secondCta}</span>
                    </div>
                  </div>
                );
              })()}

              {/* ══════ Stats Bar ══════ */}
              {(ai && ai.stats && ai.stats.length > 0) && (function() {
                var layout = (ai && ai.layoutStyle) ? ai.layoutStyle : "warm";
                var isColored = (layout === "warm" || layout === "bold");
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0",
                      padding: "1.5rem 3rem",
                      background: isColored ? primaryColor : "#ffffff",
                      borderBottom: isColored ? "none" : "1px solid #eee",
                    }}
                  >
                    {ai.stats.map(function (stat, i) {
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center" }}>
                          {i > 0 && (
                            <span style={{ display: "inline-block", width: 1, height: 36, background: isColored ? "rgba(255,255,255,0.25)" : "#e0e0e0", margin: "0 2.5rem" }} />
                          )}
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: isColored ? "#ffffff" : "#1a1a2e", lineHeight: 1.2 }}>{stat.value}</div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: isColored ? "rgba(255,255,255,0.7)" : "#999", marginTop: "0.2rem", fontWeight: 500, letterSpacing: "0.02em" }}>{stat.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* ══════ Services Section ══════ */}
              {(function() {
                var layout = (ai && ai.layoutStyle) ? ai.layoutStyle : "warm";
                var svcs = servicesList.length > 0 ? servicesList : ["Service 1", "Service 2", "Service 3"];

                var cardStyle = {};
                if (layout === "warm") {
                  cardStyle = { background: "#ffffff", borderRadius: 14, padding: "0", boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.04)", overflow: "hidden" };
                } else if (layout === "bold") {
                  cardStyle = { background: "#f8f8fa", borderRadius: 4, padding: "0", borderLeft: "4px solid " + primaryColor, overflow: "hidden" };
                } else if (layout === "clean") {
                  cardStyle = { background: "#ffffff", borderRadius: 0, padding: "0", borderBottom: "1px solid #e8e8e8", overflow: "hidden" };
                } else {
                  cardStyle = { background: "#ffffff", borderRadius: 8, padding: "0", border: "1px solid #e0e0e0", overflow: "hidden" };
                }

                return (
                  <div style={{ padding: "4.5rem 3.5rem", background: "#ffffff" }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, textAlign: "center", margin: "0 0 0.5rem" }}>
                      Our Expertise
                    </p>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: layout === "elegant" ? 600 : 800, fontSize: "2.2rem", color: "#1a1a2e", textAlign: "center", margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
                      What We Offer
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "#888", textAlign: "center", margin: "0 auto 3rem", maxWidth: 480, lineHeight: 1.6 }}>
                      {"Tailored solutions designed to help " + (businessName || "your business") + " thrive."}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: layout === "clean" ? "0" : "1.5rem" }}>
                      {svcs.map(function (svc, i) {
                        var desc = serviceDescriptions[svc] || ("Professional " + svc.toLowerCase() + " services tailored to your needs.");
                        var descColor = serviceDescriptions[svc] ? "#777" : "#999";

                        if (layout === "warm") {
                          return (
                            <div key={i} style={cardStyle}>
                              <div style={{ height: 4, background: "linear-gradient(90deg, " + primaryColor + ", " + accentColor + ")" }} />
                              <div style={{ padding: "1.8rem 1.6rem" }}>
                                <p style={{ fontFamily: "'Outfit', sans-serif", color: "#1a1a2e", fontSize: "1.1rem", margin: "0 0 0.6rem", fontWeight: 700 }}>{svc}</p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", color: descColor, fontSize: "0.88rem", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                              </div>
                            </div>
                          );
                        }
                        if (layout === "bold") {
                          return (
                            <div key={i} style={cardStyle}>
                              <div style={{ padding: "1.5rem 1.6rem" }}>
                                <p style={{ fontFamily: "'Outfit', sans-serif", color: primaryColor, fontSize: "1.15rem", margin: "0 0 0.5rem", fontWeight: 800, letterSpacing: "-0.01em" }}>{svc}</p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", color: descColor, fontSize: "0.88rem", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                              </div>
                            </div>
                          );
                        }
                        if (layout === "clean") {
                          return (
                            <div key={i} style={cardStyle}>
                              <div style={{ padding: "1.8rem 1.2rem" }}>
                                <p style={{ fontFamily: "'Outfit', sans-serif", color: "#1a1a2e", fontSize: "1.05rem", margin: "0 0 0.5rem", fontWeight: 600 }}>{svc}</p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", color: descColor, fontSize: "0.85rem", margin: 0, lineHeight: 1.7 }}>{desc}</p>
                              </div>
                            </div>
                          );
                        }
                        /* elegant */
                        return (
                          <div key={i} style={cardStyle}>
                            <div style={{ padding: "2rem 1.8rem" }}>
                              <p style={{ fontFamily: "'Outfit', sans-serif", color: "#1a1a2e", fontSize: "1.1rem", margin: "0 0 0.7rem", fontWeight: 500, letterSpacing: "0.01em" }}>{svc}</p>
                              <div style={{ width: 30, height: 1, background: primaryColor, marginBottom: "0.8rem" }} />
                              <p style={{ fontFamily: "'DM Sans', sans-serif", color: descColor, fontSize: "0.88rem", margin: 0, lineHeight: 1.7 }}>{desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* ══════ Testimonial Section ══════ */}
              {(ai && ai.testimonial && ai.testimonial.quote) && (
                <div style={{ padding: "4rem 3.5rem", background: "#f7f8fa", textAlign: "center" }}>
                  <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: "5rem", lineHeight: 1, color: primaryColor, display: "block", marginBottom: "-1rem", opacity: 0.6 }}>&ldquo;</span>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.15rem", color: "#444", lineHeight: 1.8, fontStyle: "italic", margin: "0 0 1.5rem" }}>
                      {ai.testimonial.quote}
                    </p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", margin: "0 0 0.2rem" }}>
                      {ai.testimonial.author || "Happy Customer"}
                    </p>
                    {ai.testimonial.role && (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#999", margin: 0 }}>
                        {ai.testimonial.role}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ══════ About Section ══════ */}
              <div
                style={{
                  padding: "4.5rem 3.5rem",
                  background: (ai && ai.testimonial && ai.testimonial.quote) ? "#ffffff" : "#f7f8fa",
                }}
              >
                <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, margin: "0 0 0.5rem" }}>
                    About Us
                  </p>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#1a1a2e", margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>
                    {"Why Choose " + (businessName || "Us")}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "#555", lineHeight: 1.8, margin: 0 }}>
                    {aboutBlurb || ("At " + (businessName || "our company") + ", we are committed to delivering exceptional results for every client. With years of experience in " + (industry || "our field").toLowerCase() + ", our team brings the expertise and dedication your project deserves.")}
                  </p>
                </div>
              </div>

              {/* ══════ Contact Section ══════ */}
              <div style={{ padding: "4.5rem 3.5rem", background: "#ffffff" }}>
                <div style={{ maxWidth: 520, margin: "0 auto" }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, textAlign: "center", margin: "0 0 0.5rem" }}>
                    Contact
                  </p>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#1a1a2e", textAlign: "center", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
                    Get In Touch
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", textAlign: "center", margin: "0 0 2.5rem", fontSize: "1rem", lineHeight: 1.6 }}>
                    {"Ready to work with " + (businessName || "us") + "? Send us a message and we will get back to you within 24 hours."}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <div style={{ flex: 1, background: "#f7f8fa", border: "1px solid #e0e2e8", borderRadius: 8, padding: "0.85rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#aaa" }}>
                        Your Name
                      </div>
                      <div style={{ flex: 1, background: "#f7f8fa", border: "1px solid #e0e2e8", borderRadius: 8, padding: "0.85rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#aaa" }}>
                        Email Address
                      </div>
                    </div>
                    <div style={{ background: "#f7f8fa", border: "1px solid #e0e2e8", borderRadius: 8, padding: "0.85rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#aaa", height: 100 }}>
                      Tell us about your project...
                    </div>
                    <span style={{ display: "inline-block", padding: "0.9rem 2rem", background: accentColor, color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem", borderRadius: 8, textAlign: "center", boxShadow: "0 2px 12px " + accentColor + "44" }}>
                      Send Message
                    </span>
                  </div>
                </div>
              </div>

              {/* ══════ Footer ══════ */}
              <div style={{ padding: "2.5rem 3.5rem", background: "#1a1a2e", textAlign: "center" }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#ffffff", margin: "0 0 0.4rem" }}>
                  {businessName || "Your Business"}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                  {"\u00A9 2026 " + (businessName || "Your Business") + ". All rights reserved."}
                </p>
              </div>

            </div>

            {/* Watermark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                opacity: 0.12,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  transform: "rotate(-30deg)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                  justifyContent: "center",
                  gap: "3rem 5rem",
                }}
              >
                {Array.from({ length: 40 }).map(function (_, i) {
                  return (
                    <span
                      key={i}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "#000",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                      }}
                    >
                      PREVIEW &mdash; doITbetter labs
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─ Section B: Project Recommendation ─ */}
      <div style={section({ paddingTop: "1rem", paddingBottom: "2rem" })}>
        <div
          style={card({
            background:
              "linear-gradient(135deg, var(--bg-card) 0%, " +
              primaryColor +
              "18 100%)",
            borderColor: primaryColor + "66",
          })}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>&#128640;</span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: accentColor,
              }}
            >
              Recommended Approach
            </span>
          </div>
          <h3 style={heading({ fontSize: "1.6rem", marginBottom: "0.25rem" })}>
            {classification.type}
          </h3>
          <p
            style={body({
              fontSize: "1.05rem",
              color: accentColor,
              fontWeight: 600,
              marginBottom: "1.25rem",
            })}
          >
            Estimated Investment: {classification.price}
          </p>
          <p style={body({ fontSize: "1rem", margin: 0 })}>
            {recommendationText}
          </p>
        </div>
      </div>

      {/* ─ Section C: Technical Considerations (Redacted) ─ */}
      <div style={section({ paddingTop: "1rem", paddingBottom: "2rem" })}>
        <h3
          style={heading({
            fontSize: "1.4rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          })}
        >
          Technical Considerations
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {techItems.map((item, i) => (
            <div
              key={i}
              style={card({
                padding: "1.25rem 1.5rem",
                position: "relative",
                overflow: "hidden",
              })}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--text-hi)",
                  }}
                >
                  {item.title}
                </span>
                <span style={{ fontSize: "0.85rem", opacity: 0.5 }}>
                  &#128274;
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--text-mid)",
                  margin: 0,
                  filter: "blur(5px)",
                  userSelect: "none",
                }}
              >
                {item.detail}
              </p>
              {item.questions && item.questions.length > 0 && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Discovery Questions
                  </span>
                  {item.questions.map(function(q, qi) {
                    var isVisible = q.startsWith("[visible] ");
                    var text = q.replace(/^\[(visible|deep)\] /, "");
                    return (
                      <p
                        key={qi}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.78rem",
                          lineHeight: 1.5,
                          color: isVisible ? "var(--text-mid)" : "var(--text-mid)",
                          margin: "0 0 0.4rem",
                          paddingLeft: "0.75rem",
                          borderLeft: isVisible ? "2px solid var(--accent)" : "2px solid var(--primary)",
                          filter: isVisible ? "none" : "blur(4px)",
                          userSelect: isVisible ? "auto" : "none",
                        }}
                      >
                        {text}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        <p
          style={body({
            textAlign: "center",
            fontSize: "0.9rem",
            marginTop: "1.5rem",
            color: "var(--text-lo)",
            fontStyle: "italic",
          })}
        >
          These technical considerations are part of our discovery process.
          We&#39;ll walk through each one with you on a free consultation call.
        </p>
      </div>

      {/* ─ Section D: CTA + Contact Form ─ */}
      <div style={section({ paddingTop: "2rem", paddingBottom: "2rem" })}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h3
            style={heading({
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              marginBottom: "0.75rem",
            })}
          >
            Like what you see? Let&#39;s make it real.
          </h3>
          <p style={body({ fontSize: "1.05rem", maxWidth: 600, margin: "0 auto" })}>
            We&#39;ll review your project brief, finalize the technical details,
            and get you a fixed-price quote within 48 hours.
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <a
            href="#finalize"
            onClick={(e) => {
              e.preventDefault();
              finalizeRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              ...btnPrimary(),
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            Schedule a Call
          </a>
        </div>

        <div
          ref={finalizeRef}
          id="finalize"
          style={card({ maxWidth: 600, margin: "0 auto" })}
        >
          {contactSent ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <span style={{ fontSize: "2.5rem" }}>&#9989;</span>
              <h4
                style={heading({
                  fontSize: "1.3rem",
                  marginTop: "1rem",
                  marginBottom: "0.5rem",
                })}
              >
                We got your project brief!
              </h4>
              <p style={body()}>
                Expect a detailed quote in your inbox within 48 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleContactSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle()}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={inputStyle()}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  style={inputStyle()}
                />
              </div>
              <div>
                <label style={labelStyle}>Project Summary</label>
                <textarea
                  required
                  rows={6}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  style={inputStyle({ resize: "vertical" })}
                />
              </div>
              <button
                type="submit"
                disabled={contactSending}
                style={btnPrimary({
                  alignSelf: "center",
                  opacity: contactSending ? 0.6 : 1,
                })}
              >
                {contactSending ? "Sending..." : "Send Project Brief"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ─ Section E: Start Over ─ */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: "4rem",
        }}
      >
        <button
          onClick={handleStartOver}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: "var(--text-lo)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
