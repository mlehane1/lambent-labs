import { useState, useEffect } from "react";
import { sendLeadNotification } from "../leadNotify.js";
import { trackFormSubmit, getStoredUTMs } from "../tracker.js";

const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

export default function AdsLanding() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.title = "Custom Software Development — Free Quote in 48 Hours | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Get a custom web app, dashboard, or internal tool built in as little as 2 weeks. Fixed pricing from $5,000. Free consultation — no obligations.");
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    trackFormSubmit("ads_landing");
    setSubmitting(true);
    setStatus(null);

    const utms = getStoredUTMs();
    const source = [utms.utm_source, utms.utm_medium, utms.utm_campaign].filter(Boolean).join(" / ") || "Google Ads";

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: name || "Ads Lead",
          email,
          message: `[Ads Landing] ${message || "Requested consultation"}\n\nSource: ${source}`,
        }),
      });

      if (res.ok) {
        setStatus("success");
        sendLeadNotification(name || "Ads Lead", email, message || "Requested consultation", `Ads Landing — ${source}`);
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "form_submit",
            form_name: "ads_landing",
            conversion_value: 100,
            currency: "USD",
            ...utms,
          });
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh", background: "var(--bg-deep)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    },
    card: {
      maxWidth: 960, width: "100%", display: "grid",
      gridTemplateColumns: "1.2fr 1fr", gap: 48,
      alignItems: "center",
    },
    left: {},
    badge: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(21,203,136,0.1)", border: "1px solid rgba(21,203,136,0.25)",
      borderRadius: 20, padding: "6px 16px", marginBottom: 24,
      fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600,
      letterSpacing: "0.06em",
    },
    h1: {
      fontFamily: "'Outfit', sans-serif", fontWeight: 800,
      fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.1,
      color: "var(--text-hi)", marginBottom: 20, letterSpacing: "-0.02em",
    },
    sub: {
      fontSize: "1.05rem", color: "var(--text-mid)", lineHeight: 1.7,
      marginBottom: 32, maxWidth: 480,
    },
    stats: { display: "flex", gap: 32, flexWrap: "wrap" },
    stat: { textAlign: "center" },
    statNum: {
      fontFamily: "'Outfit', sans-serif", fontWeight: 700,
      fontSize: "1.8rem", color: "var(--accent)",
    },
    statLabel: { fontSize: "0.78rem", color: "var(--text-lo)", marginTop: 4 },
    form: {
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 16, padding: 32,
    },
    formTitle: {
      fontFamily: "'Outfit', sans-serif", fontWeight: 600,
      fontSize: "1.2rem", color: "var(--text-hi)", marginBottom: 4,
    },
    formSub: {
      fontSize: "0.85rem", color: "var(--text-lo)", marginBottom: 20,
    },
    input: {
      width: "100%", background: "var(--bg-card2)", border: "1px solid var(--border-mid)",
      borderRadius: 8, padding: "10px 14px", color: "var(--text-hi)",
      fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none",
      boxSizing: "border-box", marginBottom: 12,
    },
    btn: {
      width: "100%", padding: "14px",
      background: "linear-gradient(135deg, var(--primary), var(--accent))",
      border: "none", borderRadius: 10, color: "#fff",
      fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem",
      cursor: "pointer", marginTop: 8,
    },
    trust: {
      display: "flex", flexDirection: "column", gap: 8, marginTop: 20,
      fontSize: "0.8rem", color: "var(--text-lo)",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.left}>
          <div style={s.badge}>
            <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", display: "inline-block" }} />
            FREE CONSULTATION
          </div>

          <h1 style={s.h1}>
            Your custom app.<br />
            Live in 2 weeks.
          </h1>

          <p style={s.sub}>
            We build custom web apps, dashboards, and internal tools for small
            businesses — faster and cheaper than you thought possible. AI-accelerated
            development. Fixed pricing. No surprises.
          </p>

          <div style={s.stats}>
            <div style={s.stat}>
              <div style={s.statNum}>2 wk</div>
              <div style={s.statLabel}>Avg. first deploy</div>
            </div>
            <div style={s.stat}>
              <div style={s.statNum}>60%</div>
              <div style={s.statLabel}>Less than agencies</div>
            </div>
            <div style={s.stat}>
              <div style={s.statNum}>$5K</div>
              <div style={s.statLabel}>Starting price</div>
            </div>
          </div>
        </div>

        <div style={s.form}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✓</div>
              <h3 style={{ ...s.formTitle, fontSize: "1.3rem", marginBottom: 8 }}>We'll be in touch within 24 hours.</h3>
              <p style={{ color: "var(--text-mid)", fontSize: "0.9rem" }}>
                Check your email for a confirmation. We'll reach out to schedule your free discovery call.
              </p>
            </div>
          ) : (
            <>
              <h3 style={s.formTitle}>Get Your Free Quote</h3>
              <p style={s.formSub}>
                Tell us what you need. We'll respond within 48 hours with a scope and fixed price.
              </p>
              <form onSubmit={handleSubmit}>
                <input
                  type="text" placeholder="Your name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={s.input} required
                />
                <input
                  type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={s.input} required
                />
                <textarea
                  placeholder="Briefly describe what you need (optional)"
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  style={{ ...s.input, minHeight: 80, resize: "vertical" }}
                />
                <button type="submit" disabled={submitting} style={{ ...s.btn, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Sending..." : "Get My Free Quote"}
                </button>
              </form>
              {status === "error" && (
                <p style={{ color: "#F87171", fontSize: "0.82rem", marginTop: 8, textAlign: "center" }}>
                  Something went wrong. Try again or email us directly.
                </p>
              )}
              <div style={s.trust}>
                <span>✓ No commitment — just a conversation</span>
                <span>✓ Fixed pricing — no hourly billing surprises</span>
                <span>✓ 30-day post-launch support included</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          [style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
