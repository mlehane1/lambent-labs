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
    icon: "\u{1F4CB}",
    title: "Manual Data Entry Hell",
    desc: "Your AP team opens each invoice PDF, squints at the numbers, and types them into your system one by one. Multiply by hundreds of invoices a month and you've got a full-time job that adds zero value.",
  },
  {
    icon: "\u{1F4C4}",
    title: "Every Vendor, Different Format",
    desc: "Supplier A sends a PDF with line items on page 2. Supplier B puts the total in a different spot. Supplier C emails a scanned image. Your team has to figure out every single one.",
  },
  {
    icon: "\u{26A0}\u{FE0F}",
    title: "Errors That Cost Real Money",
    desc: "A transposed number. A missed line item. A duplicate entry. Manual data entry has an error rate of 1-4% \u2014 and in fleet management or logistics, those errors cascade into wrong payments, disputed invoices, and audit headaches.",
  },
];

const steps = [
  { num: "01", title: "Invoices Arrive", desc: "PDFs, scans, or images land in your inbox or upload portal. The system ingests them automatically." },
  { num: "02", title: "AI Reads the Document", desc: "Our AI-powered OCR identifies the vendor, reads every field \u2014 invoice number, dates, line items, totals \u2014 and extracts the data with 95%+ accuracy." },
  { num: "03", title: "Template Matching", desc: "Each vendor gets a reusable template. Once set up, future invoices from the same vendor are processed automatically \u2014 no human intervention needed." },
  { num: "04", title: "Data Hits Your System", desc: "Extracted data flows directly into your ERP, accounting software, or database. Clean, structured, ready to reconcile." },
];

const features = [
  { icon: "\u{1F916}", label: "AI-Powered OCR", desc: "Azure Document Intelligence reads invoices with 95%+ accuracy, including handwritten notes and low-quality scans." },
  { icon: "\u{1F4D1}", label: "Reusable Vendor Templates", desc: "Set up a template once per vendor. Every future invoice from that vendor processes automatically." },
  { icon: "\u{1F4C3}", label: "Line Item Extraction", desc: "Not just headers \u2014 we extract every line item, quantity, unit price, and total from multi-page invoices." },
  { icon: "\u{1F3AF}", label: "Confidence Scoring", desc: "Every extracted field gets a confidence score. High-confidence data flows through automatically. Low-confidence fields get flagged for human review." },
  { icon: "\u{1F4F7}", label: "Multi-Format Support", desc: "PDFs, scanned images, photos from a phone \u2014 if a human can read it, our system can extract it." },
  { icon: "\u{1F517}", label: "API Integration", desc: "Push extracted data to your ERP, accounting system, or any tool via REST API. No manual export/import." },
];

const stats = [
  { value: "40+ hrs/mo", label: "saved in manual data entry" },
  { value: "95%+", label: "extraction accuracy" },
  { value: "60+ vendors", label: "mapped with reusable templates" },
  { value: "< 5 sec", label: "processing time per invoice" },
];

const faqs = [
  {
    q: "What types of documents can you process?",
    a: "Invoices, purchase orders, receipts, bills of lading, packing slips \u2014 any structured or semi-structured document. If it has fields and tables, we can extract it.",
  },
  {
    q: "How accurate is the extraction?",
    a: "95%+ for standard formatted invoices using Azure Document Intelligence. For unusual formats, we use confidence scoring and flag anything below threshold for human review.",
  },
  {
    q: "How long does setup take?",
    a: "Typically 2-3 weeks for the initial deployment with 5-10 vendor templates. Adding new vendors after that takes minutes, not days.",
  },
  {
    q: "What systems can you integrate with?",
    a: "Any system with an API \u2014 QuickBooks, NetSuite, SAP, custom ERPs, databases, spreadsheets. We build the integration to match your workflow.",
  },
];

export default function DataExtraction() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = "Automated Invoice & Document Data Extraction | doITbetter labs";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Eliminate manual data entry from invoices, purchase orders, and vendor documents. AI-powered extraction with reusable templates. Built for fleet management, logistics, and any business drowning in paper.";
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
          message: `[Data Extraction] ${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "form_submit", form_name: "data_extraction" });
      sendLeadNotification(form.name, form.email, `[Data Extraction] ${form.message}`, "Landing Page \u2014 Data Extraction");
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
          Azure AI &middot; OCR &middot; Document Intelligence &middot; REST API
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
          Stop Typing Numbers from PDFs{" "}
        </h1>

        <p
          style={{
            ...body,
            fontSize: "1.15rem",
            maxWidth: 620,
            margin: "0 auto 2.5rem",
          }}
        >
          Your team shouldn't spend hours manually entering invoice data. Our intelligent
          document extraction platform reads invoices, maps them to vendors, and puts
          the data where it belongs &mdash; automatically.
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
          These are the problems we hear every week from teams still processing
          documents by hand.
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
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem", textAlign: "center" }}>{p.icon}</div>
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

      {/* ════════════════ HOW IT WORKS ════════════════ */}
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
          How It Works
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
          From document intake to structured data in your system — four steps,
          no manual entry.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {steps.map((s) => (
            <div
              key={s.num}
              style={{
                ...card,
                textAlign: "center",
                padding: "2rem 1.5rem",
              }}
            >
              <div
                style={{
                  ...heading,
                  fontSize: "2rem",
                  ...gradientText,
                  marginBottom: "0.75rem",
                }}
              >
                {s.num}
              </div>
              <h4
                style={{
                  ...headingSm,
                  fontSize: "1.05rem",
                  color: "var(--text-hi)",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                {s.title}
              </h4>
              <p style={{ ...body, fontSize: "0.88rem", margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
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
          What You Get
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
          Every extraction pipeline is custom, but here's what a typical
          deployment includes.
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

      {/* ════════════════ CASE STUDY ════════════════ */}
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
            Fleet Management Company Eliminates 40 Hours/Month of Manual Invoice Processing
          </h2>
          <p
            style={{
              ...body,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 2rem",
              fontSize: "1.05rem",
            }}
          >
            A fleet management company was receiving invoices from dozens of vendors &mdash;
            fuel suppliers, parts distributors, maintenance shops, tire vendors &mdash; each
            in a different format. Their AP team spent 40+ hours per month manually entering
            invoice data into their fleet management system. Errors were common: transposed
            numbers, missed line items, duplicate entries that led to overpayments.
          </p>
          <p
            style={{
              ...body,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 3rem",
              fontSize: "1.05rem",
            }}
          >
            We built a custom extraction pipeline using Azure Document Intelligence with
            vendor-specific templates. Each vendor's invoice format was mapped once. Now,
            invoices are uploaded in bulk, data is extracted automatically, matched to the
            correct vendor, and pushed into their system of record &mdash; no human touches
            the data unless a confidence score is low.
          </p>

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
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
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
          Frequently Asked Questions
        </h2>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "1.25rem 0",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <h4
                  style={{
                    ...headingSm,
                    fontSize: "1.05rem",
                    color: "var(--text-hi)",
                    margin: 0,
                  }}
                >
                  {faq.q}
                </h4>
                <span
                  style={{
                    color: "var(--accent)",
                    fontSize: "1.4rem",
                    flexShrink: 0,
                    marginLeft: "1rem",
                    transition: "transform 0.2s",
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <p
                  style={{
                    ...body,
                    fontSize: "0.92rem",
                    marginTop: "0.75rem",
                    marginBottom: 0,
                  }}
                >
                  {faq.a}
                </p>
              )}
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
            Ready to Stop Typing Numbers?
          </h2>
          <p
            style={{
              ...body,
              fontSize: "1rem",
              maxWidth: 460,
              margin: "0 auto 2rem",
            }}
          >
            Tell us about your document processing challenges. We'll schedule a free
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
                  Tell us about your document processing needs
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="We process 500+ invoices a month from dozens of vendors and need a better way to..."
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
