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

const includedItems = [
  {
    icon: "🎨",
    title: "Custom Design",
    desc: "Not a template. We design from scratch to match your brand, your industry, your personality.",
  },
  {
    icon: "📱",
    title: "Mobile-First",
    desc: "Looks perfect on every device. Over 60% of web traffic is mobile — we build for that first.",
  },
  {
    icon: "🔍",
    title: "SEO Foundation",
    desc: "Meta tags, structured data, sitemap, Google Search Console setup. We make sure Google finds you.",
  },
  {
    icon: "📊",
    title: "Analytics & Tracking",
    desc: "Google Analytics, conversion tracking, and session recording so you know what visitors do.",
  },
  {
    icon: "✉️",
    title: "Contact Forms & Lead Capture",
    desc: "Every form sends you an instant email notification. Never miss a lead.",
  },
  {
    icon: "🔒",
    title: "Hosting & SSL",
    desc: "Fast, secure hosting on enterprise infrastructure. HTTPS included. 99.9% uptime.",
  },
  {
    icon: "📅",
    title: "12 Months Included",
    desc: "Your first year of hosting is included in the $999. Renewals at $299/year.",
  },
  {
    icon: "🔄",
    title: "One Round of Revisions",
    desc: "After launch, you get one full revision round to dial everything in.",
  },
];

const processSteps = [
  {
    day: "Day 1",
    title: "Discovery Call",
    desc: "We learn your business, your audience, and your goals.",
  },
  {
    day: "Day 2-3",
    title: "Design",
    desc: "We create your site and share it for feedback.",
  },
  {
    day: "Day 4-5",
    title: "Revisions",
    desc: "We refine based on your input.",
  },
  {
    day: "Day 6-7",
    title: "Launch",
    desc: "Domain connected, SEO submitted, analytics live, you're open for business.",
  },
];

const audienceCards = [
  {
    icon: "🚀",
    title: "New Businesses",
    desc: "Need to get online fast without breaking the bank.",
  },
  {
    icon: "🔧",
    title: "Existing Businesses",
    desc: "Your current site is outdated, slow, or doesn't show up in search.",
  },
  {
    icon: "💡",
    title: "Side Projects & Personal Brands",
    desc: "Coaches, consultants, creators who need a professional presence.",
  },
];

const faqItems = [
  {
    q: "What about my domain?",
    a: "You buy it (we'll help you choose), or if you already have one, we connect it. Domain registration is typically $12-15/year through any registrar.",
  },
  {
    q: "Can I make changes after launch?",
    a: "One revision round is included. After that, content changes are $50/hour or we offer monthly retainer plans starting at $99/mo.",
  },
  {
    q: "What if I need more than a website?",
    a: "That's our sweet spot. We also build custom web apps, integrations, and data platforms. We'll be upfront about what needs custom development vs what a website handles.",
  },
  {
    q: "What happens after the first year?",
    a: "Hosting renews at $299/year. You can cancel anytime — we'll export your site and hand it over. No lock-in.",
  },
];

export default function Websites() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title =
      "Professional Website Design — Built in a Week, Hosted for a Year | $999 | Lambent Labs";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "A custom-designed, SEO-optimized website built in one week and hosted for a full year. $999 all-in. No templates, no DIY builders, no hidden fees. Lambent Labs.";
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
          message: "[Website Package] " + form.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      sendLeadNotification(
        form.name,
        form.email,
        "[Website Package] " + form.message,
        "Landing Page — $999 Website"
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "form_submit",
          form_name: "website_package",
        });
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
            style={body({
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "var(--primary-llt)",
            })}
          >
            CUSTOM DESIGN &middot; SEO &middot; HOSTING &middot; $999/YEAR
          </span>
        </div>

        <h1
          style={heading({
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            maxWidth: 850,
            margin: "0 auto 1.5rem",
          })}
        >
          A Professional Website. Built in a Week. Hosted for a Year.{" "}
          <span style={{ color: "var(--accent)" }}>$999.</span>
        </h1>

        <p
          style={body({
            fontSize: "1.15rem",
            maxWidth: 680,
            margin: "0 auto 2.5rem",
          })}
        >
          No templates. No DIY builders. No hidden fees. A real, custom-designed
          website — built by developers, optimized for search engines, and fully
          hosted. Everything your business needs to get found online.
        </p>

        <a
          href="#contact-cta"
          style={{
            display: "inline-block",
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
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
          Get Started
        </a>
      </section>

      {/* ════════════════════ WEBSITE VS WEB APP ════════════════════ */}
      <section
        style={{
          background: "var(--bg-dark)",
          padding: "5rem clamp(1rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={heading({
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              textAlign: "center",
              marginBottom: "3rem",
            })}
          >
            Website or Web App — Know the Difference
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
              gap: "2rem",
            }}
          >
            {/* Website side */}
            <div
              style={card({
                borderColor: "rgba(21,203,136,0.3)",
                background: "rgba(21,203,136,0.04)",
              })}
            >
              <h3
                style={heading({
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                })}
              >
                <span style={{ fontSize: "1.3rem" }}>🌐</span> What's a
                Website?
              </h3>
              <p
                style={body({
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  color: "var(--text-hi)",
                })}
              >
                Your digital storefront. Informs, converts, and represents your
                brand.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {[
                  "5-8 pages",
                  "Contact forms",
                  "SEO optimization",
                  "Analytics & tracking",
                  "Perfect for most businesses",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      ...body({ fontSize: "0.95rem", marginBottom: "0.6rem" }),
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--accent)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Web App side */}
            <div
              style={card({
                borderColor: "rgba(21,88,203,0.3)",
                background: "rgba(21,88,203,0.04)",
              })}
            >
              <h3
                style={heading({
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--primary-llt)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                })}
              >
                <span style={{ fontSize: "1.3rem" }}>⚙️</span> What's a Web
                App?
              </h3>
              <p
                style={body({
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  color: "var(--text-hi)",
                })}
              >
                A software tool. User logins, dashboards, databases,
                integrations.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {[
                  "User authentication",
                  "Dashboards & data",
                  "Third-party integrations",
                  "Think Salesforce, not a brochure",
                  "Custom software — different scope, different price",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      ...body({ fontSize: "0.95rem", marginBottom: "0.6rem" }),
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--primary-llt)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      ●
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p
            style={body({
              textAlign: "center",
              marginTop: "2rem",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "var(--text-lo)",
            })}
          >
            Not sure which you need? We'll tell you on the discovery call —
            honestly.
          </p>
        </div>
      </section>

      {/* ════════════════════ WHAT'S INCLUDED ════════════════════ */}
      <section style={section()}>
        <h2
          style={heading({
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            textAlign: "center",
            marginBottom: "0.75rem",
          })}
        >
          Everything That's Included
        </h2>
        <p
          style={body({
            textAlign: "center",
            maxWidth: 560,
            margin: "0 auto 3rem",
            fontSize: "1.05rem",
          })}
        >
          No surprise add-ons. No nickel-and-diming. Here's exactly what you get
          for $999.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
            gap: "1.25rem",
          }}
        >
          {includedItems.map((item, i) => (
            <div
              key={i}
              style={card({
                transition: "border-color 0.25s, transform 0.25s",
              })}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
                {item.icon}
              </div>
              <h3
                style={heading({
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                })}
              >
                {item.title}
              </h3>
              <p style={body({ fontSize: "0.9rem" })}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ PRICING ════════════════════ */}
      <section
        style={{
          background: "var(--bg-dark)",
          padding: "5rem clamp(1rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={card({
              padding: "3rem",
              textAlign: "center",
              borderColor: "var(--border-mid)",
              background:
                "linear-gradient(180deg, var(--bg-card2) 0%, var(--bg-card) 100%)",
            })}
          >
            <div
              style={heading({
                fontSize: "clamp(3rem, 8vw, 5rem)",
                marginBottom: "0.5rem",
                color: "var(--accent)",
              })}
            >
              $999
            </div>
            <p
              style={body({
                fontSize: "1.15rem",
                color: "var(--text-hi)",
                marginBottom: "0.5rem",
              })}
            >
              First year — design, development, hosting, and launch
            </p>
            <p
              style={body({
                fontSize: "1rem",
                marginBottom: "2rem",
              })}
            >
              Then <strong style={{ color: "var(--text-hi)" }}>$299/year</strong>{" "}
              to renew hosting
            </p>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "2rem",
                textAlign: "left",
              }}
            >
              <h3
                style={heading({
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: "1.25rem",
                  textAlign: "center",
                })}
              >
                How we compare
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    name: "Squarespace",
                    price: "$192/yr",
                    note: "+ your time building it",
                  },
                  {
                    name: "Wix",
                    price: "$204/yr",
                    note: "+ your time building it",
                  },
                  {
                    name: "Hiring a freelancer",
                    price: "$2,000-$5,000",
                    note: "+ you find hosting",
                  },
                  {
                    name: "Us",
                    price: "$999",
                    note: "all-in, done in a week",
                    highlight: true,
                  },
                ].map((comp, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1rem",
                      borderRadius: 10,
                      background: comp.highlight
                        ? "rgba(21,203,136,0.08)"
                        : "rgba(255,255,255,0.02)",
                      border: comp.highlight
                        ? "1px solid rgba(21,203,136,0.3)"
                        : "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={body({
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: comp.highlight
                          ? "var(--accent)"
                          : "var(--text-lo)",
                        marginBottom: 4,
                      })}
                    >
                      {comp.name}
                    </div>
                    <div
                      style={heading({
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: comp.highlight
                          ? "var(--accent)"
                          : "var(--text-hi)",
                        marginBottom: 2,
                      })}
                    >
                      {comp.price}
                    </div>
                    <div style={body({ fontSize: "0.8rem" })}>{comp.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ PROCESS ════════════════════ */}
      <section style={section()}>
        <h2
          style={heading({
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            textAlign: "center",
            marginBottom: "3rem",
          })}
        >
          What the Process Looks Like
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "1.5rem",
          }}
        >
          {processSteps.map((step, i) => (
            <div key={i} style={card()}>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                {step.day}
              </span>
              <h3
                style={heading({
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  marginBottom: "0.6rem",
                })}
              >
                {step.title}
              </h3>
              <p style={body({ fontSize: "0.9rem" })}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ WHO THIS IS FOR ════════════════════ */}
      <section
        style={{
          background: "var(--bg-dark)",
          padding: "5rem clamp(1rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={heading({
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              textAlign: "center",
              marginBottom: "3rem",
            })}
          >
            Who This Is For
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "1.5rem",
            }}
          >
            {audienceCards.map((c, i) => (
              <div key={i} style={card({ textAlign: "center" })}>
                <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
                  {c.icon}
                </div>
                <h3
                  style={heading({
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    marginBottom: "0.6rem",
                  })}
                >
                  {c.title}
                </h3>
                <p style={body({ fontSize: "0.95rem" })}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section style={section()}>
        <h2
          style={heading({
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            textAlign: "center",
            marginBottom: "3rem",
          })}
        >
          Frequently Asked Questions
        </h2>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {faqItems.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid var(--border)",
                marginBottom: 0,
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "1.25rem 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  textAlign: "left",
                }}
              >
                <span
                  style={heading({
                    fontSize: "1.05rem",
                    fontWeight: 700,
                  })}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    color: "var(--primary-llt)",
                    fontSize: "1.4rem",
                    fontWeight: 300,
                    flexShrink: 0,
                    transform:
                      openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.25s",
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  maxHeight: openFaq === i ? 200 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p
                  style={body({
                    fontSize: "0.95rem",
                    paddingBottom: "1.25rem",
                  })}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
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
            style={heading({
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              marginBottom: "1rem",
            })}
          >
            Ready to{" "}
            <span style={{ color: "var(--accent)" }}>Get Online?</span>
          </h2>
          <p
            style={body({
              fontSize: "1.05rem",
              marginBottom: "2.5rem",
            })}
          >
            Tell us about your business and what you need. We'll get back to you
            within 24 hours.
          </p>

          {status === "sent" ? (
            <div
              style={card({
                textAlign: "center",
                padding: "3rem 2rem",
                borderColor: "rgba(21,203,136,0.3)",
              })}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                ✓
              </div>
              <h3
                style={heading({
                  fontSize: "1.3rem",
                  marginBottom: "0.5rem",
                })}
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
                  style={body({
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-hi)",
                    marginBottom: 6,
                    display: "block",
                  })}
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
                  style={body({
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-hi)",
                    marginBottom: 6,
                    display: "block",
                  })}
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
                  style={body({
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-hi)",
                    marginBottom: 6,
                    display: "block",
                  })}
                >
                  Tell us about your business
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="What does your business do? What do you need from a website?"
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
                {status === "sending" ? "Sending..." : "Get Started"}
              </button>

              {status === "error" && (
                <p
                  style={body({
                    fontSize: "0.85rem",
                    color: "#ff6b6b",
                    textAlign: "center",
                  })}
                >
                  Something went wrong. Please try again or email us at{" "}
                  <a
                    href="mailto:lambentlabs247@gmail.com"
                    style={{ color: "var(--accent)" }}
                  >
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
