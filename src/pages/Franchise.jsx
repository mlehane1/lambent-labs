import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

const painPoints = [
  {
    title: "Every Location Does It Differently",
    desc: "Different spreadsheets, different processes, different tools. Inconsistency kills your brand.",
    icon: "🔀",
  },
  {
    title: "No Single Source of Truth",
    desc: "You can't see what's happening across locations without calling or emailing each one.",
    icon: "🔍",
  },
  {
    title: "Off-the-Shelf Doesn't Scale",
    desc: "Generic tools weren't built for franchise operations. You're paying to duct-tape five products together.",
    icon: "📦",
  },
];

const features = [
  {
    title: "Centralized Dashboards",
    desc: "HQ sees every location's metrics in real-time.",
    icon: "📊",
  },
  {
    title: "Standardized Workflows",
    desc: "Every location follows the same process, enforced by the software.",
    icon: "⚙️",
  },
  {
    title: "Communication Hub",
    desc: "Announcements, updates, and SOPs pushed to every location.",
    icon: "📡",
  },
  {
    title: "Reporting & Compliance",
    desc: "Automated reporting that proves every location meets standards.",
    icon: "📋",
  },
  {
    title: "Onboarding Tools",
    desc: "New locations get up and running faster with built-in training.",
    icon: "🚀",
  },
  {
    title: "Custom Integrations",
    desc: "Connect POS, inventory, scheduling, and accounting systems.",
    icon: "🔗",
  },
];

const industries = [
  { label: "Restaurant Franchises", icon: "🍽️" },
  { label: "Fitness & Gym Chains", icon: "💪" },
  { label: "Retail Chains", icon: "🏬" },
  { label: "Service Businesses", sub: "Cleaning, HVAC, Plumbing", icon: "🔧" },
  { label: "Healthcare Clinics", icon: "🏥" },
  { label: "Real Estate Brokerages", icon: "🏠" },
];

// ─── Shared styles ───────────────────────────────────────────────────────────

const sectionPad = {
  padding: "5rem clamp(1rem, 5vw, 4rem)",
};

const sectionInner = {
  maxWidth: 1100,
  margin: "0 auto",
};

const headingStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 700,
  color: "var(--text-hi)",
  letterSpacing: "-0.02em",
  lineHeight: 1.15,
  margin: 0,
};

const bodyText = {
  fontFamily: "'DM Sans', sans-serif",
  color: "var(--text-mid)",
  lineHeight: 1.7,
  fontSize: "1.05rem",
};

const cardBase = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "2rem",
  transition: "border-color 0.25s, transform 0.25s",
};

const btnPrimary = {
  display: "inline-block",
  background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
  color: "#fff",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  fontSize: "1rem",
  padding: "14px 36px",
  borderRadius: 10,
  border: "none",
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s, transform 0.2s",
};

const labelStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.85rem",
  fontWeight: 500,
  color: "var(--text-mid)",
  marginBottom: 6,
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-deep)",
  color: "var(--text-hi)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Franchise() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    document.title = "Custom Franchise Software | Multi-Location Operations Platform | Lambent Labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Lambent Labs builds custom software for franchise owners and multi-location businesses. Centralized dashboards, standardized workflows, and seamless integrations — built to scale."
      );
    } else {
      const tag = document.createElement("meta");
      tag.name = "description";
      tag.content =
        "Lambent Labs builds custom software for franchise owners and multi-location businesses. Centralized dashboards, standardized workflows, and seamless integrations — built to scale.";
      document.head.appendChild(tag);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: "[Franchise] " + formData.message,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "form_submission",
          form_name: "franchise",
        });
      }

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{ background: "var(--bg-deep)", color: "var(--text-hi)", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          ...sectionPad,
          paddingTop: "6rem",
          paddingBottom: "6rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "140%",
            height: "100%",
            background: "radial-gradient(ellipse at center, rgba(21,88,203,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ ...sectionInner, position: "relative", zIndex: 1 }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "rgba(21,203,136,0.08)",
              border: "1px solid rgba(21,203,136,0.2)",
              borderRadius: 100,
              padding: "6px 20px",
              marginBottom: "2rem",
            }}
          >
            FRANCHISE SOFTWARE &middot; MULTI-LOCATION &middot; STANDARDIZED OPS
          </span>

          <h1
            style={{
              ...headingStyle,
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              maxWidth: 800,
              margin: "0 auto 1.5rem",
            }}
          >
            One System. Every Location.{" "}
            <span style={{ color: "var(--accent)" }}>Zero Chaos.</span>
          </h1>

          <p
            style={{
              ...bodyText,
              maxWidth: 640,
              margin: "0 auto 2.5rem",
              fontSize: "1.1rem",
            }}
          >
            Franchises run on consistency. But when every location uses different tools,
            different processes, and different workarounds — you get anything but.
            We build custom software that standardizes your operations from HQ to every single location.
          </p>

          <a href="#contact-cta" style={btnPrimary}>
            Standardize Your Operations
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE FRANCHISE PROBLEM
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: "var(--bg-dark)" }}>
        <div style={sectionInner}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--primary-llt)",
              marginBottom: "0.75rem",
            }}
          >
            THE FRANCHISE PROBLEM
          </p>
          <h2 style={{ ...headingStyle, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", marginBottom: "3rem" }}>
            Sound Familiar?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {painPoints.map((p) => (
              <div key={p.title} style={cardBase}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }}>{p.icon}</span>
                <h3
                  style={{
                    ...headingStyle,
                    fontSize: "1.15rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ ...bodyText, fontSize: "0.95rem", margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHAT WE BUILD
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={sectionPad}>
        <div style={sectionInner}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.75rem",
            }}
          >
            WHAT WE BUILD FOR FRANCHISES
          </p>
          <h2
            style={{
              ...headingStyle,
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              marginBottom: "1rem",
            }}
          >
            Everything Your Franchise Needs in One Platform
          </h2>
          <p style={{ ...bodyText, maxWidth: 600, marginBottom: "3rem" }}>
            No more stitching together a dozen SaaS products. We build a single system designed around how your franchise actually operates.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  ...cardBase,
                  background: "var(--bg-card2)",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "1.6rem",
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(21,88,203,0.12)",
                    borderRadius: 10,
                  }}
                >
                  {f.icon}
                </span>
                <div>
                  <h3
                    style={{
                      ...headingStyle,
                      fontSize: "1.05rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ ...bodyText, fontSize: "0.9rem", margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INDUSTRIES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: "var(--bg-dark)" }}>
        <div style={sectionInner}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--primary-llt)",
              marginBottom: "0.75rem",
            }}
          >
            INDUSTRIES WE SERVE
          </p>
          <h2
            style={{
              ...headingStyle,
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              marginBottom: "3rem",
            }}
          >
            Built for Multi-Location Businesses
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {industries.map((ind) => (
              <div
                key={ind.label}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "1.5rem",
                  textAlign: "center",
                  transition: "border-color 0.25s",
                }}
              >
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>{ind.icon}</span>
                <h4
                  style={{
                    ...headingStyle,
                    fontSize: "0.95rem",
                    marginBottom: ind.sub ? "0.35rem" : 0,
                  }}
                >
                  {ind.label}
                </h4>
                {ind.sub && (
                  <p style={{ ...bodyText, fontSize: "0.8rem", margin: 0, color: "var(--text-lo)" }}>
                    {ind.sub}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SCALE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={sectionPad}>
        <div
          style={{
            ...sectionInner,
            background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card2) 100%)",
            border: "1px solid var(--border-mid)",
            borderRadius: 18,
            padding: "3.5rem clamp(2rem, 5vw, 4rem)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              ...headingStyle,
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              marginBottom: "1.25rem",
            }}
          >
            Built to Grow{" "}
            <span style={{ color: "var(--accent)" }}>With You</span>
          </h2>
          <p style={{ ...bodyText, maxWidth: 600, margin: "0 auto", fontSize: "1.05rem" }}>
            Whether you have 5 locations or 500, the system scales. No per-location licensing.
            Add locations in minutes, not months.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginTop: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "5–500+", label: "Locations supported" },
              { num: "1", label: "Unified platform" },
              { num: "0", label: "Per-location fees" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    ...headingStyle,
                    fontSize: "2.2rem",
                    color: "var(--accent)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {s.num}
                </div>
                <div style={{ ...bodyText, fontSize: "0.85rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA / CONTACT FORM
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="contact-cta" style={{ ...sectionPad, background: "var(--bg-dark)" }}>
        <div
          style={{
            ...sectionInner,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Left — copy */}
          <div>
            <h2
              style={{
                ...headingStyle,
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                marginBottom: "1.25rem",
              }}
            >
              Ready to Run Every Location Like Your{" "}
              <span style={{ color: "var(--accent)" }}>Best Location?</span>
            </h2>
            <p style={{ ...bodyText, marginBottom: "1.5rem" }}>
              Tell us about your franchise and we will show you what a custom operations platform looks like
              for your business. No obligation, no generic pitch — just a real conversation about what would move the needle.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Free initial consultation", "Scope & estimate within a week", "Built by senior engineers, not outsourced"].map(
                (item) => (
                  <li
                    key={item}
                    style={{
                      ...bodyText,
                      fontSize: "0.95rem",
                      marginBottom: "0.6rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>&#10003;</span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Right — form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "2.5rem",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
                placeholder="Your name"
              />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={inputStyle}
                placeholder="you@company.com"
              />
            </div>
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={labelStyle}>Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Tell us about your franchise — number of locations, biggest pain points, what you need..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                ...btnPrimary,
                width: "100%",
                textAlign: "center",
                opacity: status === "sending" ? 0.7 : 1,
              }}
            >
              {status === "sending" ? "Sending..." : "Get Started"}
            </button>

            {status === "sent" && (
              <p
                style={{
                  color: "var(--accent)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                Message sent. We will be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p
                style={{
                  color: "#e74c3c",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
