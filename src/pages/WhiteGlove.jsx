import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sendLeadNotification } from "../leadNotify.js";

const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

const STEPS = [
  {
    num: "01",
    title: "Requirements Discovery",
    desc: "We interview your team, map your workflows, document everything. You talk \u2014 we listen, ask the right questions, and translate your world into a clear technical plan.",
  },
  {
    num: "02",
    title: "UI/UX Design",
    desc: "Wireframes and mockups you approve before we write a single line of code. You see exactly what you\u2019re getting, and you sign off at every step.",
  },
  {
    num: "03",
    title: "Development",
    desc: "Full-stack build in focused sprints with daily updates. You always know where things stand \u2014 no radio silence, no surprises three months in.",
  },
  {
    num: "04",
    title: "Testing & QA",
    desc: "We break it before your users do. Rigorous manual and automated testing across devices, browsers, and edge cases.",
  },
  {
    num: "05",
    title: "Deployment",
    desc: "Production infrastructure, SSL, monitoring, backups \u2014 all handled. Your software goes live on robust, scalable infrastructure without you touching a terminal.",
  },
  {
    num: "06",
    title: "Training",
    desc: "Live walkthroughs for your team, plus documentation they\u2019ll actually read. Everyone knows how to use what we built, from day one.",
  },
  {
    num: "07",
    title: "Ongoing Support & Maintenance",
    desc: "Bug fixes, updates, feature additions on retainer. We don\u2019t disappear after launch \u2014 we stick around to make sure everything keeps running.",
  },
];

const AUDIENCE = [
  {
    title: "Non-Technical Founders",
    desc: "You have the domain expertise and the vision, not the tech background. You shouldn\u2019t need one. Tell us what the software should do \u2014 we\u2019ll figure out how.",
    icon: "\u25C8",
    color: "#1558CB",
  },
  {
    title: "Busy Teams",
    desc: "You can\u2019t afford to pull people off their day jobs to manage a software project. Hand it to us, check in when it\u2019s convenient, and get back to running your business.",
    icon: "\u29BF",
    color: "#15CB88",
  },
  {
    title: "Growing Companies",
    desc: "You\u2019ve outgrown spreadsheets and manual processes but don\u2019t have an IT department. We become your dev team \u2014 without the overhead of hiring one.",
    icon: "\u2B21",
    color: "#588FEE",
  },
];

export default function WhiteGlove() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.title = "White Glove Software Development | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "End-to-end custom software development. From requirements gathering to deployment, training, and ongoing support \u2014 doITbetter labs handles everything so you don\u2019t have to."
      );
    } else {
      const tag = document.createElement("meta");
      tag.name = "description";
      tag.content =
        "End-to-end custom software development. From requirements gathering to deployment, training, and ongoing support \u2014 doITbetter labs handles everything so you don\u2019t have to.";
      document.head.appendChild(tag);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

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
          name,
          email,
          message: "[White Glove] " + message,
        }),
      });

      if (res.ok) {
        sendLeadNotification(name, email, "[White Glove] " + message, "Landing Page — White Glove");
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "form_submit",
            form_name: "white_glove",
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

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "100px 40px 80px",
        }}
      >
        {/* Grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `
              linear-gradient(rgba(21,88,203,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(21,88,203,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "450px",
            background:
              "radial-gradient(ellipse, rgba(21,88,203,0.16) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "8%",
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(ellipse, rgba(21,203,136,0.1) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "860px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "6px 18px",
              marginBottom: "32px",
              fontSize: "0.72rem",
              color: "var(--primary-llt)",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "var(--accent)",
                borderRadius: "50%",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            END-TO-END &middot; REQUIREMENTS TO LAUNCH &middot; ONGOING SUPPORT
          </div>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
              lineHeight: 1.08,
              color: "var(--text-hi)",
              margin: "0 0 24px 0",
              letterSpacing: "-0.025em",
            }}
          >
            The White Glove Experience{" "}
            <span style={{ color: "var(--accent)" }}>&mdash;</span>
            <br />
            We Handle Everything
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-mid)",
              maxWidth: "640px",
              margin: "0 auto 48px",
              lineHeight: 1.75,
            }}
          >
            You bring the idea. We handle the requirements, design, development,
            deployment, training, and support. From first conversation to live
            product &mdash; you never have to think about the technical side.
          </p>

          <a
            href="#contact-cta"
            style={{
              display: "inline-block",
              background:
                "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "white",
              padding: "16px 40px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "1rem",
              letterSpacing: "0.02em",
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(21,88,203,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            Tell Us Your Idea
          </a>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 40px",
          background: "var(--bg-dark)",
          borderTop: "1px solid rgba(12,52,121,0.2)",
          borderBottom: "1px solid rgba(12,52,121,0.2)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              What&rsquo;s Included
            </p>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "var(--text-hi)",
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              Every Step, Handled
            </h2>
            <p
              style={{
                color: "var(--text-mid)",
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.7,
                fontSize: "0.95rem",
              }}
            >
              Seven phases. One team. Zero gaps.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              position: "relative",
            }}
          >
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: "31px",
                top: "28px",
                bottom: "28px",
                width: "2px",
                background:
                  "linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%)",
                opacity: 0.25,
                borderRadius: "2px",
              }}
            />

            {STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "28px",
                  position: "relative",
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    color: "var(--accent)",
                    minWidth: "40px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(21,203,136,0.08)",
                    borderRadius: "10px",
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      color: "var(--text-hi)",
                      margin: "0 0 8px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-mid)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "740px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              color: "var(--text-hi)",
              margin: "0 0 28px",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            You Focus on Your Business.
            <br />
            <span style={{ color: "var(--accent)" }}>
              We Focus on the Software.
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-mid)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: "620px",
              margin: "0 auto",
            }}
          >
            Most business owners don&rsquo;t want to become project managers. They
            don&rsquo;t want to learn what a sprint is, debate database schemas, or
            sit through standups. They want to describe what they need and have it
            appear &mdash; built right, on time, and ready to use. That&rsquo;s
            what white glove means. You stay in your lane of expertise. We stay in
            ours. The result is software that actually fits your business, delivered
            without the headache of managing a technical team you never wanted to
            manage in the first place.
          </p>
        </div>
      </section>

      {/* ── SAAS COST COMPARISON ────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 20px",
          background: "var(--bg-dark)",
          borderTop: "1px solid rgba(12,52,121,0.2)",
          borderBottom: "1px solid rgba(12,52,121,0.2)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              The Math Doesn&rsquo;t Lie
            </p>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "var(--text-hi)",
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              SaaS Licensing vs. Custom Software
            </h2>
            <p
              style={{
                color: "var(--text-mid)",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.7,
                fontSize: "0.95rem",
              }}
            >
              Per-seat pricing looks affordable on day one. But SaaS costs
              compound every year while custom software pays for itself.
            </p>
          </div>

          {/* Comparison Table */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            {/* SaaS Column */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: "16px",
                padding: "32px 28px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#F87171",
                  margin: "0 0 8px",
                }}
              >
                Typical SaaS Platform
              </h3>
              <p
                style={{
                  color: "var(--text-lo)",
                  fontSize: "0.82rem",
                  margin: "0 0 24px",
                }}
              >
                50 users &times; $45/seat/mo &middot; Annual price increases
              </p>
              {[
                { year: "Year 1", cost: "$27,000", note: "Base pricing" },
                { year: "Year 2", cost: "$31,050", note: "+15% price hike" },
                { year: "Year 3", cost: "$35,700", note: "Another increase" },
              ].map((row) => (
                <div
                  key={row.year}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "var(--text-hi)",
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {row.year}
                    </div>
                    <div
                      style={{
                        color: "var(--text-lo)",
                        fontSize: "0.78rem",
                        marginTop: "2px",
                      }}
                    >
                      {row.note}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "#F87171",
                    }}
                  >
                    {row.cost}
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 0 0",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    color: "var(--text-hi)",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  3-Year Total
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "#F87171",
                  }}
                >
                  $93,750
                </div>
              </div>
            </div>

            {/* Custom Column */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(21,203,136,0.3)",
                borderRadius: "16px",
                padding: "32px 28px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "var(--accent)",
                  margin: "0 0 8px",
                }}
              >
                Custom Software
              </h3>
              <p
                style={{
                  color: "var(--text-lo)",
                  fontSize: "0.82rem",
                  margin: "0 0 24px",
                }}
              >
                Unlimited users &middot; You own it &middot; Flat maintenance
              </p>
              {[
                { year: "Year 1", cost: "$15,000", note: "Build + deploy" },
                { year: "Year 2", cost: "$3,600", note: "Maintenance only" },
                { year: "Year 3", cost: "$3,600", note: "Maintenance only" },
              ].map((row) => (
                <div
                  key={row.year}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "var(--text-hi)",
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {row.year}
                    </div>
                    <div
                      style={{
                        color: "var(--text-lo)",
                        fontSize: "0.78rem",
                        marginTop: "2px",
                      }}
                    >
                      {row.note}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "var(--accent)",
                    }}
                  >
                    {row.cost}
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 0 0",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    color: "var(--text-hi)",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  3-Year Total
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "var(--accent)",
                  }}
                >
                  $22,200
                </div>
              </div>
            </div>
          </div>

          {/* Savings callout */}
          <div
            style={{
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(21,88,203,0.08), rgba(21,203,136,0.08))",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "28px",
            }}
          >
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "var(--accent)",
                margin: "0 0 4px",
              }}
            >
              Save $71,550 over 3 years
            </p>
            <p
              style={{
                color: "var(--text-mid)",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              And that&rsquo;s before you factor in the per-seat price hikes,
              add-on fees, and workaround labor you eliminate.
            </p>
          </div>
        </div>
      </section>

      {/* ── UNLIMITED USERS CALLOUT ──────────────────────────────────────────── */}
      <section style={{ padding: "80px 20px" }}>
        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              number: "0",
              label: "Per-Seat Fees",
              desc: "Add 5 users or 500. Your cost doesn\u2019t change. Ever.",
              prefix: "$",
            },
            {
              number: "0",
              label: "Annual Price Hikes",
              desc: "You own the software. Nobody\u2019s raising your rate next January.",
              prefix: "$",
            },
            {
              number: "\u221E",
              label: "Users Included",
              desc: "Your team grows. Your software bill doesn\u2019t.",
              prefix: "",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "36px 28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: "3rem",
                  lineHeight: 1,
                  color: "var(--accent)",
                  marginBottom: "8px",
                }}
              >
                {item.prefix}
                {item.number}
              </div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "var(--text-hi)",
                  marginBottom: "8px",
                }}
              >
                {item.label}
              </div>
              <p
                style={{
                  color: "var(--text-mid)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GANTT TIMELINE COMPARISON ────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 20px",
          background: "var(--bg-dark)",
          borderTop: "1px solid rgba(12,52,121,0.2)",
          borderBottom: "1px solid rgba(12,52,121,0.2)",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                color: "var(--primary-lt)",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Speed Matters
            </p>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "var(--text-hi)",
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              Months Become Weeks
            </h2>
            <p
              style={{
                color: "var(--text-mid)",
                maxWidth: "560px",
                margin: "0 auto",
                lineHeight: 1.7,
                fontSize: "0.95rem",
              }}
            >
              AI-accelerated development with a focused team means you get to
              production faster &mdash; and for less.
            </p>
          </div>

          {/* Gantt Charts */}
          {(() => {
            const tradPhases = [
              { name: "Requirements", short: "Reqs", start: 0, width: 12.5, people: "3\u20134", color: "rgba(248,113,113,0.6)" },
              { name: "Design", short: "Design", start: 10, width: 15, people: "2\u20133", color: "rgba(248,113,113,0.5)" },
              { name: "Development", short: "Dev", start: 22, width: 40, people: "6\u201310", color: "rgba(248,113,113,0.7)" },
              { name: "QA / Testing", short: "QA", start: 55, width: 20, people: "3\u20134", color: "rgba(248,113,113,0.5)" },
              { name: "UAT / Fixes", short: "UAT", start: 70, width: 15, people: "4\u20135", color: "rgba(248,113,113,0.45)" },
              { name: "Deployment", short: "Deploy", start: 82, width: 10, people: "2\u20133", color: "rgba(248,113,113,0.4)" },
              { name: "Training", short: "Train", start: 90, width: 10, people: "1\u20132", color: "rgba(248,113,113,0.35)" },
            ];
            const dibPhases = [
              { name: "Discovery", short: "Disc.", start: 0, width: 14, people: "2", color: "rgba(21,203,136,0.6)" },
              { name: "Design + Build", short: "Build", start: 10, width: 50, people: "2\u20133", color: "rgba(21,203,136,0.7)" },
              { name: "Test + Deploy", short: "Ship", start: 55, width: 30, people: "2", color: "rgba(21,203,136,0.55)" },
              { name: "Training", short: "Train", start: 82, width: 18, people: "1\u20132", color: "rgba(21,203,136,0.45)" },
            ];
            const months = ["M1", "M2", "M3", "M4", "M5", "M6"];
            const weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
            const barH = 32;
            const barGap = 8;

            const renderGantt = (phases, labels, labelColor, title, subtitle, borderColor) => (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "16px",
                  padding: "clamp(16px, 4vw, 28px)",
                  marginBottom: "24px",
                  overflowX: "auto",
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
                      color: labelColor,
                      margin: "0 0 4px",
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ color: "var(--text-lo)", fontSize: "clamp(0.7rem, 2vw, 0.82rem)", margin: 0 }}>{subtitle}</p>
                </div>

                <div style={{ minWidth: "320px" }}>
                  {/* Time axis */}
                  <div style={{ display: "flex", marginBottom: "10px", paddingLeft: "clamp(70px, 15vw, 130px)" }}>
                    {labels.map((l) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          fontSize: "clamp(0.6rem, 1.8vw, 0.72rem)",
                          color: "var(--text-lo)",
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>

                  {/* Bars */}
                  <div style={{ position: "relative" }}>
                    {phases.map((phase, i) => (
                      <div
                        key={phase.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: barH,
                          marginBottom: i < phases.length - 1 ? barGap : 0,
                        }}
                      >
                        {/* Label — shows short name on small screens via CSS min() trick */}
                        <div
                          style={{
                            width: "clamp(70px, 15vw, 130px)",
                            flexShrink: 0,
                            fontSize: "clamp(0.68rem, 1.8vw, 0.82rem)",
                            color: "var(--text-mid)",
                            fontWeight: 500,
                            paddingRight: "8px",
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {phase.name}
                        </div>
                        {/* Track */}
                        <div
                          style={{
                            flex: 1,
                            position: "relative",
                            height: "100%",
                            background: "rgba(255,255,255,0.02)",
                            borderRadius: "6px",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: `${phase.start}%`,
                              width: `${phase.width}%`,
                              height: "100%",
                              background: phase.color,
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "clamp(0.58rem, 1.5vw, 0.72rem)",
                              fontWeight: 600,
                              color: "#fff",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              transition: "width 0.5s ease",
                            }}
                          >
                            {phase.width > 12 && (
                              <span style={{ opacity: 0.9 }}>{phase.people}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

            return (
              <>
                {renderGantt(
                  tradPhases,
                  months,
                  "#F87171",
                  "Traditional Development",
                  "6+ months \u00B7 8\u201315 people \u00B7 $150K\u2013$500K+",
                  "rgba(248,113,113,0.3)"
                )}
                {renderGantt(
                  dibPhases,
                  weeks,
                  "var(--accent)",
                  "doITbetter Approach",
                  "2\u20134 weeks \u00B7 2\u20133 people \u00B7 $5K\u2013$20K",
                  "rgba(21,203,136,0.3)"
                )}
              </>
            );
          })()}

          {/* Summary stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
              gap: "16px",
            }}
          >
            {[
              { stat: "10\u00D7", label: "Faster Delivery" },
              { stat: "5\u00D7", label: "Smaller Team" },
              { stat: "90%", label: "Lower Cost" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, rgba(21,88,203,0.06), rgba(21,203,136,0.06))",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.8rem",
                    color: "var(--accent)",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  {item.stat}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-mid)",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 40px",
          background: "var(--bg-dark)",
          borderTop: "1px solid rgba(12,52,121,0.2)",
          borderBottom: "1px solid rgba(12,52,121,0.2)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                color: "var(--primary-lt)",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Who This Is For
            </p>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "var(--text-hi)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Built for People Who Build Businesses
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {AUDIENCE.map((card) => (
              <div
                key={card.title}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "36px 28px",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${card.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    color: card.color,
                    marginBottom: "20px",
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    color: "var(--text-hi)",
                    margin: "0 0 12px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-mid)",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: "var(--accent)",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Transparent Pricing
          </p>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "var(--text-hi)",
              margin: "0 0 28px",
              letterSpacing: "-0.02em",
            }}
          >
            What It Costs
          </h2>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "40px 36px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                color: "var(--text-hi)",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                margin: "0 0 28px",
              }}
            >
              Most white glove projects run{" "}
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  color: "var(--accent)",
                  fontSize: "1.2rem",
                }}
              >
                $5,000 &ndash; $20,000
              </span>{" "}
              depending on complexity. You get a fixed-price quote after the
              discovery call &mdash; before we write a line of code.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                {
                  label: "No hourly billing",
                  sub: "Fixed price, fixed scope. You know exactly what you're paying.",
                },
                {
                  label: "No scope creep",
                  sub: "Changes happen \u2014 we handle them transparently with clear change orders.",
                },
                {
                  label: "30 days post-launch support",
                  sub: "Bug fixes and adjustments included after go-live, at no extra cost.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "var(--bg-card2)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "var(--accent)",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      marginBottom: "8px",
                    }}
                  >
                    {item.label}
                  </div>
                  <p
                    style={{
                      color: "var(--text-mid)",
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / CONTACT ────────────────────────────────────────────────────── */}
      <section
        id="contact-cta"
        style={{
          padding: "80px 40px",
          background: "var(--bg-dark)",
          borderTop: "1px solid rgba(12,52,121,0.2)",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: "var(--primary-lt)",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Get Started
          </p>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: "var(--text-hi)",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            Tell Us What You Need &mdash;
            <br />
            We&rsquo;ll Handle the Rest
          </h2>
          <p
            style={{
              color: "var(--text-mid)",
              marginBottom: "36px",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            Describe your project in plain English. No technical jargon required.
            We&rsquo;ll get back to you within 24 hours with a clear plan and a
            fixed-price quote.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-mid)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    marginBottom: "6px",
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-mid)",
                    color: "var(--text-hi)",
                    fontSize: "0.9rem",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-mid)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    marginBottom: "6px",
                  }}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-mid)",
                    color: "var(--text-hi)",
                    fontSize: "0.9rem",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "var(--text-mid)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  marginBottom: "6px",
                }}
              >
                Tell Us About Your Project
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I need a system that... / We currently use spreadsheets for... / Our team needs a way to..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-mid)",
                  color: "var(--text-hi)",
                  fontSize: "0.9rem",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting
                  ? "var(--bg-card2)"
                  : "linear-gradient(135deg, var(--primary), var(--accent))",
                border: "none",
                color: "white",
                padding: "16px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: submitting ? "wait" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: submitting
                  ? "none"
                  : "0 4px 20px rgba(21,88,203,0.35)",
                opacity: submitting ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  background: "rgba(21,203,136,0.12)",
                  border: "1px solid rgba(21,203,136,0.3)",
                  color: "var(--accent)",
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                Message received. We&rsquo;ll be in touch within 24 hours with a
                plan and quote.
              </div>
            )}
            {status === "error" && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  background: "rgba(248,113,113,0.12)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  color: "#F87171",
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                Something went wrong. Please email us directly at
                lambentlabs247@gmail.com.
              </div>
            )}
          </form>

          <p
            style={{
              color: "var(--text-lo)",
              fontSize: "0.78rem",
              marginTop: "16px",
            }}
          >
            Or email us directly at{" "}
            <a
              href="mailto:lambentlabs247@gmail.com"
              style={{ color: "var(--primary-lt)", textDecoration: "none" }}
            >
              lambentlabs247@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
