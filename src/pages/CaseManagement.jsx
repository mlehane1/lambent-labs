import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sendLeadNotification } from "../leadNotify.js";

const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

const heading = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
};

const headingSm = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const body = {
  fontFamily: "'DM Sans', sans-serif",
  lineHeight: 1.7,
  color: "var(--text-mid)",
};

const section = {
  padding: "5rem clamp(1rem, 5vw, 4rem)",
  maxWidth: 1100,
  margin: "0 auto",
};

const card = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "2rem",
};

const gradientText = {
  background: "linear-gradient(135deg, var(--primary-llt) 0%, var(--accent) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const ctaBtn = {
  display: "inline-block",
  background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
  color: "#fff",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  fontSize: "1rem",
  padding: "14px 32px",
  borderRadius: 10,
  border: "none",
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s, transform 0.2s",
};

const painPoints = [
  {
    icon: "📋",
    title: "Drowning in Spreadsheets",
    desc: "Your team is tracking cases across Excel files, email threads, and sticky notes. Things slip through the cracks. Nobody knows what's current. One wrong sort and you lose a week of work.",
  },
  {
    icon: "🧩",
    title: "Off-the-Shelf Doesn't Fit",
    desc: "You're paying enterprise prices for a tool built for someone else's workflow. Half the features you'll never touch. The one thing you actually need? \"Submit a feature request.\"",
  },
  {
    icon: "🔍",
    title: "No Visibility",
    desc: "Your manager asks how many cases are open. You spend 20 minutes pulling numbers. You can't see bottlenecks, can't spot trends, and can't report on outcomes without a manual deep dive.",
  },
];

const features = [
  { icon: "📝", label: "Custom intake forms and workflows", desc: "Forms that match your exact process — no workarounds, no \"just put it in the notes field.\"" },
  { icon: "👁️", label: "Role-based dashboards", desc: "Managers see the big picture. Caseworkers see their caseload. Clients see their status. Everyone gets exactly what they need." },
  { icon: "🔔", label: "Automated status updates & notifications", desc: "Cases move forward automatically. Stakeholders get notified. Nothing sits in limbo." },
  { icon: "📁", label: "Document management & e-signatures", desc: "Upload, organize, and sign documents without leaving the platform. No more email attachments." },
  { icon: "📊", label: "Reporting and analytics", desc: "Real-time dashboards, exportable reports, and trend analysis — built around the metrics that matter to you." },
  { icon: "🔗", label: "API integrations with existing systems", desc: "Connect to your CRM, billing system, email, calendar — whatever you're already using." },
];

const industries = [
  { icon: "⚖️", name: "Law Firms", desc: "Matter tracking, client portals, deadline management, and billing integration." },
  { icon: "🛡️", name: "Insurance", desc: "Claims processing, adjuster workflows, policy lookups, and compliance tracking." },
  { icon: "🏥", name: "Healthcare", desc: "Patient case coordination, referral management, and HIPAA-compliant documentation." },
  { icon: "🤝", name: "Social Services", desc: "Client intake, service plans, outcome tracking, and multi-agency collaboration." },
  { icon: "🏛️", name: "Government", desc: "Constituent case tracking, FOIA requests, permitting workflows, and audit trails." },
  { icon: "🏢", name: "Property Management", desc: "Maintenance requests, tenant communications, lease tracking, and vendor coordination." },
];

const stats = [
  { value: "2 weeks", label: "to first working prototype" },
  { value: "60%", label: "less than enterprise CM licenses" },
  { value: "100%", label: "custom to your workflow" },
  { value: "0", label: "shelfware risk" },
];

export default function CaseManagement() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    document.title = "Custom Case Management Software | doITbetter labs";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Custom case management software built for law firms, insurance, healthcare, social services, and government agencies. Replace spreadsheets with a system designed around your workflow.";
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
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
          name: form.name,
          email: form.email,
          message: `[Case Management] ${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "form_submit", form_name: "case_management" });
      sendLeadNotification(form.name, form.email, `[Case Management] ${form.message}`, "Landing Page — Case Management");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid var(--border-mid)",
    background: "var(--bg-dark)",
    color: "var(--text-hi)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: "var(--bg-deep)" }}>
      {/* ════════════════ HERO ════════════════ */}
      <section
        style={{
          ...section,
          paddingTop: "6rem",
          paddingBottom: "5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(21,88,203,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "inline-block",
            ...headingSm,
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--accent)",
            background: "rgba(21,203,136,0.08)",
            border: "1px solid rgba(21,203,136,0.2)",
            borderRadius: 100,
            padding: "6px 20px",
            marginBottom: "1.5rem",
          }}
        >
          React &middot; Node.js &middot; PostgreSQL &middot; Custom-Built
        </div>

        <h1
          style={{
            ...heading,
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            color: "var(--text-hi)",
            maxWidth: 820,
            margin: "0 auto 1.5rem",
          }}
        >
          Custom Case Management Software{" "}
          <span style={gradientText}>
            Built for How You Actually Work
          </span>
        </h1>

        <p
          style={{
            ...body,
            fontSize: "1.15rem",
            maxWidth: 620,
            margin: "0 auto 2.5rem",
          }}
        >
          Ditch the spreadsheets. Stop forcing your process into off-the-shelf software.
          We build case management systems that fit your workflow from day one — not the
          other way around.
        </p>

        <a href="#contact-cta" style={ctaBtn}>
          Get a Free Consultation
        </a>
      </section>

      {/* ════════════════ PAIN POINTS ════════════════ */}
      <section style={{ ...section, paddingTop: "2rem" }}>
        <h2
          style={{
            ...heading,
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            color: "var(--text-hi)",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          Sound Familiar?
        </h2>
        <p
          style={{
            ...body,
            textAlign: "center",
            maxWidth: 560,
            margin: "0 auto 3rem",
            fontSize: "1.05rem",
          }}
        >
          These are the problems we hear every week from teams still running on
          duct-taped systems.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {painPoints.map((p) => (
            <div key={p.title} style={card}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{p.icon}</div>
              <h3
                style={{
                  ...headingSm,
                  fontSize: "1.2rem",
                  color: "var(--text-hi)",
                  marginBottom: "0.6rem",
                }}
              >
                {p.title}
              </h3>
              <p style={{ ...body, fontSize: "0.92rem", margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ WHAT WE BUILD ════════════════ */}
      <section style={{ ...section }}>
        <h2
          style={{
            ...heading,
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            color: "var(--text-hi)",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          What We Build
        </h2>
        <p
          style={{
            ...body,
            textAlign: "center",
            maxWidth: 560,
            margin: "0 auto 3rem",
            fontSize: "1.05rem",
          }}
        >
          Every system is custom, but here's what a typical case management
          platform includes.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.label}
              style={{
                ...card,
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg-card2)",
                  borderRadius: 10,
                }}
              >
                {f.icon}
              </div>
              <div>
                <h4
                  style={{
                    ...headingSm,
                    fontSize: "1rem",
                    color: "var(--text-hi)",
                    marginBottom: "0.35rem",
                    marginTop: 0,
                  }}
                >
                  {f.label}
                </h4>
                <p style={{ ...body, fontSize: "0.88rem", margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ INDUSTRIES ════════════════ */}
      <section
        style={{
          ...section,
          background: "var(--bg-dark)",
          maxWidth: "none",
          padding: "5rem clamp(1rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              ...heading,
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              color: "var(--text-hi)",
              textAlign: "center",
              marginBottom: "0.75rem",
            }}
          >
            Industries We Serve
          </h2>
          <p
            style={{
              ...body,
              textAlign: "center",
              maxWidth: 560,
              margin: "0 auto 3rem",
              fontSize: "1.05rem",
            }}
          >
            If your team manages cases, clients, or claims, we've probably built
            something like what you need.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {industries.map((ind) => (
              <div
                key={ind.name}
                style={{
                  ...card,
                  textAlign: "center",
                  padding: "1.75rem 1.25rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>{ind.icon}</div>
                <h4
                  style={{
                    ...headingSm,
                    fontSize: "1rem",
                    color: "var(--text-hi)",
                    marginBottom: "0.4rem",
                    marginTop: 0,
                  }}
                >
                  {ind.name}
                </h4>
                <p style={{ ...body, fontSize: "0.82rem", margin: 0 }}>{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ RESULTS / SOCIAL PROOF ════════════════ */}
      <section style={{ ...section }}>
        <h2
          style={{
            ...heading,
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            color: "var(--text-hi)",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          Why Teams Choose{" "}
          <span style={gradientText}>doITbetter labs</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                ...card,
                textAlign: "center",
                padding: "2.5rem 1.5rem",
                background: "var(--bg-card2)",
              }}
            >
              <div
                style={{
                  ...heading,
                  fontSize: "2.6rem",
                  ...gradientText,
                  marginBottom: "0.5rem",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  ...body,
                  fontSize: "0.92rem",
                  color: "var(--text-mid)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ CONTACT CTA ════════════════ */}
      <section
        id="contact-cta"
        style={{
          ...section,
          paddingTop: "4rem",
          paddingBottom: "6rem",
        }}
      >
        <div
          style={{
            ...card,
            maxWidth: 640,
            margin: "0 auto",
            padding: "3rem clamp(1.5rem, 4vw, 3rem)",
            background: "linear-gradient(180deg, var(--bg-card2) 0%, var(--bg-card) 100%)",
            border: "1px solid var(--border-mid)",
            borderRadius: 18,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              ...heading,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "var(--text-hi)",
              marginBottom: "0.6rem",
            }}
          >
            Ready to Replace the Spreadsheets?
          </h2>
          <p
            style={{
              ...body,
              fontSize: "1rem",
              maxWidth: 460,
              margin: "0 auto 2rem",
            }}
          >
            Tell us about your case management challenges. We'll schedule a free
            30-minute consultation to map out a solution.
          </p>

          {status === "sent" ? (
            <div
              style={{
                background: "rgba(21,203,136,0.1)",
                border: "1px solid rgba(21,203,136,0.3)",
                borderRadius: 12,
                padding: "2rem",
                color: "var(--accent)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 600,
              }}
            >
              Thanks! We'll be in touch within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    ...headingSm,
                    fontSize: "0.82rem",
                    color: "var(--text-mid)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    ...headingSm,
                    fontSize: "0.82rem",
                    color: "var(--text-mid)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@company.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    ...headingSm,
                    fontSize: "0.82rem",
                    color: "var(--text-mid)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Tell us about your case management needs
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="We currently track 200+ cases in Excel and need a better way to..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  ...ctaBtn,
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.05rem",
                  padding: "14px 24px",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "Sending..." : status === "error" ? "Try Again" : "Get My Free Consultation"}
              </button>

              {status === "error" && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    marginTop: "0.75rem",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Something went wrong. Please try again or email us directly at{" "}
                  <a href="mailto:lambentlabs247@gmail.com" style={{ color: "var(--accent)" }}>
                    lambentlabs247@gmail.com
                  </a>
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
