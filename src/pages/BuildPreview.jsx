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
      "Build Your Project \u2014 See a Live Preview | Lambent Labs";
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
          style={card({
            padding: 0,
            overflow: "hidden",
            position: "relative",
          })}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1rem",
              background: "var(--bg-dark)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#ff5f57",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#febc2e",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#28c840",
                display: "inline-block",
              }}
            />
            <div
              style={{
                flex: 1,
                marginLeft: "0.75rem",
                background: "var(--bg-deep)",
                borderRadius: 6,
                padding: "0.3rem 0.75rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "var(--text-lo)",
              }}
            >
              {fakeDomain || "your-site.com"}
            </div>
          </div>

          {/* Viewport */}
          <div
            style={{
              height: 520,
              overflow: "hidden",
              position: "relative",
              background: "#0a0a1a",
            }}
          >
            {/* The mockup, scaled */}
            <div
              style={{
                transform: "scale(0.6)",
                transformOrigin: "top center",
                width: "166.66%",
                marginLeft: "-33.33%",
              }}
            >
              {/* Nav */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.2rem 3rem",
                  background: "rgba(0,0,0,0.5)",
                  borderBottom: "1px solid " + primaryColor + "33",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "#fff",
                  }}
                >
                  {businessName || "Your Business"}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <span>Home</span>
                  <span>Services</span>
                  <span>About</span>
                  <span>Contact</span>
                </div>
              </div>

              {/* Hero */}
              <div
                style={{
                  padding: "5rem 3rem 4rem",
                  background:
                    "linear-gradient(135deg, " +
                    primaryColor +
                    " 0%, " +
                    primaryColor +
                    "88 50%, " +
                    accentColor +
                    "44 100%)",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "3rem",
                    color: "#fff",
                    margin: "0 0 1rem",
                  }}
                >
                  {businessName || "Your Business Name"}
                </h2>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.25rem",
                    color: "rgba(255,255,255,0.85)",
                    margin: "0 0 2rem",
                  }}
                >
                  {tagline}
                </p>
                {heroSub && (
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.6)",
                      margin: "-1rem 0 2rem",
                      maxWidth: 500,
                      marginLeft: "auto",
                      marginRight: "auto",
                      lineHeight: 1.6,
                    }}
                  >
                    {heroSub}
                  </p>
                )}
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.85rem 2.2rem",
                    background: accentColor,
                    color: "#fff",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 8,
                  }}
                >
                  Get Started
                </span>
              </div>

              {/* Services grid */}
              <div
                style={{
                  padding: "4rem 3rem",
                  background: "#0d0d1f",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.8rem",
                    color: "#fff",
                    textAlign: "center",
                    margin: "0 0 2.5rem",
                  }}
                >
                  Our Services
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {(servicesList.length > 0
                    ? servicesList
                    : ["Service 1", "Service 2", "Service 3"]
                  ).map((svc, i) => (
                    <div
                      key={i}
                      style={{
                        background:
                          "linear-gradient(145deg, " +
                          primaryColor +
                          "22, " +
                          primaryColor +
                          "0a)",
                        border: "1px solid " + primaryColor + "44",
                        borderRadius: 12,
                        padding: "1.8rem 1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: accentColor + "22",
                          border: "2px solid " + accentColor,
                          margin: "0 auto 1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "1rem",
                          color: accentColor,
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </div>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#fff",
                          fontSize: "1rem",
                          margin: 0,
                          fontWeight: 600,
                        }}
                      >
                        {svc}
                      </p>
                      {serviceDescriptions[svc] && (
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "0.8rem",
                            margin: "0.5rem 0 0",
                            lineHeight: 1.5,
                          }}
                        >
                          {serviceDescriptions[svc]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div
                style={{
                  padding: "3rem",
                  background:
                    "linear-gradient(180deg, #0d0d1f 0%, " +
                    primaryColor +
                    "15 100%)",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "#fff",
                    margin: "0 0 0.5rem",
                  }}
                >
                  Get In Touch
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,255,255,0.6)",
                    margin: "0 0 1.5rem",
                  }}
                >
                  Ready to work with {businessName || "us"}? Reach out today.
                </p>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 2rem",
                    border: "2px solid " + accentColor,
                    color: accentColor,
                    borderRadius: 8,
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Contact Us
                </span>
              </div>
            </div>

            {/* Watermark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                opacity: 0.2,
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
                {Array.from({ length: 40 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "#fff",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    PREVIEW &mdash; LAMBENT LABS
                  </span>
                ))}
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
