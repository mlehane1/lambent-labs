import { useState, useEffect } from "react";
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

const enterpriseItems = [
  { label: "$50K – $500K", desc: "Salesforce / SAP implementations" },
  { label: "6 – 12 months", desc: "before you see a working product" },
  { label: "Per-seat licensing", desc: "that grows forever" },
  { label: "Bloated feature sets", desc: "you'll never use" },
];

const ourItems = [
  { label: "$2K – $15K", desc: "custom-built for your workflow" },
  { label: "2 – 4 weeks", desc: "from kickoff to launch" },
  { label: "No per-seat fees", desc: "ever" },
  { label: "Only the features", desc: "you actually need" },
];

const buildExamples = [
  {
    icon: "🖥️",
    title: "Customer Portals",
    desc: "Give your clients a branded portal with real-time project tracking, file sharing, and communication — no more email chains.",
  },
  {
    icon: "📦",
    title: "Inventory Management",
    desc: "Barcode scanning, stock alerts, multi-location tracking. Know exactly what you have, where it is, and when to reorder.",
  },
  {
    icon: "💳",
    title: "Invoicing & Payments",
    desc: "Automated invoicing, payment reminders, and reconciliation workflows that eliminate hours of manual bookkeeping.",
  },
  {
    icon: "📅",
    title: "Employee Scheduling",
    desc: "Drag-and-drop scheduling, shift swaps, time tracking, and payroll integration — built around how your team actually works.",
  },
  {
    icon: "🤝",
    title: "Custom CRM",
    desc: "A CRM tailored to your sales process — not the other way around. Track leads, deals, and follow-ups without the Salesforce price tag.",
  },
];

const steps = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "We learn your business, your pain points, and what success looks like. No jargon, no pressure — just a real conversation about what you need.",
  },
  {
    num: "02",
    title: "Build Sprint",
    desc: "Our team designs and builds your software in a focused 2-4 week sprint. You see progress daily and give feedback in real time.",
  },
  {
    num: "03",
    title: "Launch & Support",
    desc: "We deploy to production, train your team, and stick around to make sure everything runs smoothly. No vanishing act.",
  },
];

export default function SmallBusiness() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    document.title = "Custom Software for Small Business | doITbetter labs";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Enterprise-grade custom software at small business prices. Customer portals, CRM, inventory management, and more — built in 2-4 weeks for a fraction of the cost.";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: "[Small Business] " + form.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      sendLeadNotification(form.name, form.email, `[Small Business] ${form.message}`, "Landing Page — Small Business");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      if (window.dataLayer) {
        window.dataLayer.push({ event: "form_submit", form_name: "small_business" });
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "var(--bg-deep)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text-hi)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div>
      {/* ════════════════════ HERO ════════════════════ */}
      <section
        style={{
          ...section(),
          paddingTop: "6rem",
          paddingBottom: "5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gradient blob */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(21,88,203,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "inline-block",
            padding: "6px 20px",
            borderRadius: 100,
            border: "1px solid var(--border-mid)",
            background: "rgba(21,88,203,0.12)",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              ...body({ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", color: "var(--primary-llt)" }),
            }}
          >
            CUSTOM SOFTWARE &middot; 60% LESS COST &middot; 2 WEEK DELIVERY
          </span>
        </div>

        <h1
          style={{
            ...heading({ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", maxWidth: 800, margin: "0 auto 1.5rem" }),
          }}
        >
          Enterprise Software at{" "}
          <span style={{ color: "var(--accent)" }}>Small Business Prices</span>
        </h1>

        <p
          style={{
            ...body({ fontSize: "1.15rem", maxWidth: 640, margin: "0 auto 2.5rem" }),
          }}
        >
          The tools Fortune 500 companies use cost millions. Yours doesn't have to.
          We build custom software that punches above its weight — for a fraction of
          what the big players charge.
        </p>

        <a
          href="#contact-cta"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            padding: "16px 36px",
            borderRadius: 12,
            border: "none",
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.2s, transform 0.2s",
          }}
        >
          See What We Can Build for You
        </a>
      </section>

      {/* ════════════════════ THE PROBLEM ════════════════════ */}
      <section style={{ background: "var(--bg-dark)", padding: "5rem clamp(1rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              ...heading({ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", textAlign: "center", marginBottom: "3rem" }),
            }}
          >
            The Real Cost of "Enterprise" Software
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))", gap: "2rem" }}>
            {/* Enterprise side */}
            <div
              style={{
                ...card({ borderColor: "rgba(255,80,80,0.25)", background: "rgba(255,40,40,0.04)" }),
              }}
            >
              <h3
                style={{
                  ...heading({
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#ff6b6b",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }),
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>✕</span> What Enterprise Software Costs
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {enterpriseItems.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      ...body({ fontSize: "0.95rem", marginBottom: "1.1rem" }),
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ color: "#ff6b6b", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>●</span>
                    <span>
                      <strong style={{ color: "var(--text-hi)" }}>{item.label}</strong> — {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our side */}
            <div
              style={{
                ...card({ borderColor: "rgba(21,203,136,0.3)", background: "rgba(21,203,136,0.04)" }),
              }}
            >
              <h3
                style={{
                  ...heading({
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }),
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>✓</span> What We Deliver
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {ourItems.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      ...body({ fontSize: "0.95rem", marginBottom: "1.1rem" }),
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>●</span>
                    <span>
                      <strong style={{ color: "var(--text-hi)" }}>{item.label}</strong> — {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ BUILD EXAMPLES ════════════════════ */}
      <section style={section()}>
        <h2
          style={{
            ...heading({ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", textAlign: "center", marginBottom: "0.75rem" }),
          }}
        >
          What Small Businesses Are Building With Us
        </h2>
        <p
          style={{
            ...body({ textAlign: "center", maxWidth: 560, margin: "0 auto 3rem", fontSize: "1.05rem" }),
          }}
        >
          Real solutions for real businesses — not bloated platforms dressed up as
          "custom."
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "1.25rem",
          }}
        >
          {buildExamples.map((ex, i) => (
            <div
              key={i}
              style={{
                ...card({
                  transition: "border-color 0.25s, transform 0.25s",
                }),
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{ex.icon}</div>
              <h3
                style={{
                  ...heading({ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }),
                }}
              >
                {ex.title}
              </h3>
              <p style={body({ fontSize: "0.9rem" })}>{ex.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ HOW IT WORKS ════════════════════ */}
      <section style={{ background: "var(--bg-dark)", padding: "5rem clamp(1rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              ...heading({ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", textAlign: "center", marginBottom: "3rem" }),
            }}
          >
            Three Steps. No Surprises.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "2rem",
            }}
          >
            {steps.map((step) => (
              <div key={step.num} style={card()}>
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "2.4rem",
                    color: "var(--primary)",
                    opacity: 0.35,
                    lineHeight: 1,
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  {step.num}
                </span>
                <h3
                  style={{
                    ...heading({ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.6rem" }),
                  }}
                >
                  {step.title}
                </h3>
                <p style={body({ fontSize: "0.9rem" })}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ OBJECTION ════════════════════ */}
      <section style={section()}>
        <div
          style={{
            ...card({ maxWidth: 780, margin: "0 auto", padding: "3rem", borderColor: "var(--border-mid)" }),
          }}
        >
          <h2
            style={{
              ...heading({ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", marginBottom: "1.25rem" }),
            }}
          >
            "But can a small team{" "}
            <span style={{ color: "var(--accent)" }}>really</span> build this?"
          </h2>

          <p style={body({ fontSize: "1rem", marginBottom: "1rem" })}>
            Short answer: yes — and faster than you'd think.
          </p>
          <p style={body({ fontSize: "0.95rem", marginBottom: "1rem" })}>
            Modern AI-accelerated development has fundamentally changed what a
            focused team can deliver. The same tools that power Silicon Valley
            startups are in our hands — and we use them to build software at a pace
            that would have been impossible five years ago.
          </p>
          <p style={body({ fontSize: "0.95rem", marginBottom: "1rem" })}>
            We build on battle-tested, open-source frameworks used by companies like
            Netflix, Shopify, and Stripe. Your software isn't duct-taped together —
            it's built on the same foundations as the products you already trust.
          </p>
          <p style={body({ fontSize: "0.95rem" })}>
            A 50-person consulting firm brings overhead, layers of management, and
            meetings about meetings. We bring a focused team of senior engineers who
            talk directly to you and ship real code every day. Less bureaucracy, more
            building.
          </p>
        </div>
      </section>

      {/* ════════════════════ CONTACT CTA ════════════════════ */}
      <section
        id="contact-cta"
        style={{
          background: "var(--bg-dark)",
          padding: "5rem clamp(1rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              ...heading({ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", marginBottom: "1rem" }),
            }}
          >
            Stop Paying Enterprise Prices for{" "}
            <span style={{ color: "var(--accent)" }}>Enterprise Software</span>
          </h2>
          <p
            style={{
              ...body({ fontSize: "1.05rem", marginBottom: "2.5rem" }),
            }}
          >
            Tell us what you're building (or what's broken). We'll get back to you
            within 24 hours with a plan and a price.
          </p>

          {status === "sent" ? (
            <div
              style={{
                ...card({ textAlign: "center", padding: "3rem 2rem", borderColor: "rgba(21,203,136,0.3)" }),
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✓</div>
              <h3
                style={heading({ fontSize: "1.3rem", marginBottom: "0.5rem" })}
              >
                We got your message
              </h3>
              <p style={body({ fontSize: "0.95rem" })}>
                Expect to hear from us within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                ...card({ textAlign: "left" }),
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={body({ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-hi)", marginBottom: 6, display: "block" })}
                >
                  Name
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={body({ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-hi)", marginBottom: 6, display: "block" })}
                >
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={body({ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-hi)", marginBottom: 6, display: "block" })}
                >
                  What do you need built?
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project, pain point, or idea..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  width: "100%",
                  padding: "16px",
                  background:
                    status === "sending"
                      ? "var(--border-mid)"
                      : "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  borderRadius: 10,
                  border: "none",
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                {status === "sending" ? "Sending..." : "Get Your Free Consultation"}
              </button>

              {status === "error" && (
                <p
                  style={body({ fontSize: "0.85rem", color: "#ff6b6b", textAlign: "center" })}
                >
                  Something went wrong. Please try again or email us at{" "}
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
