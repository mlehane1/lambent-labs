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
    title: "Every Vendor, Different Format",
    desc: "One vendor sends a clean PDF with tables. Another sends a scanned image with handwritten notes. A third has continuation tables spanning multiple pages with embedded chassis pairs. Your AP team has to decode every single one.",
  },
  {
    icon: "\u{23F3}",
    title: "Manual Processing Doesn't Scale",
    desc: "Your accounts payable team is keying in line items one by one. At 500+ invoices per month, that's a full-time job with a 1-4% error rate. Every hour spent on data entry is an hour not spent on analysis, reconciliation, or vendor negotiations.",
  },
  {
    icon: "\u{26A0}\u{FE0F}",
    title: "Billing Errors Go Undetected",
    desc: "Duplicate charges across invoices. Rates that don't match your contract. Missing line items. Without cross-invoice validation, these discrepancies slip through and cost you real money every single month.",
  },
];

const steps = [
  { num: "01", title: "Upload Any Invoice", desc: "PDFs, scanned documents, or photos from the field. Our automated invoice processing platform ingests them all." },
  { num: "02", title: "AI Extracts Every Field", desc: "Invoice OCR software reads every field and line item \u2014 invoice numbers, dates, chassis IDs, rates, service types, and totals \u2014 with high accuracy." },
  { num: "03", title: "Vendor Template Auto-Match", desc: "The system recognizes the vendor format and applies the correct extraction template. Process invoices from any vendor without manual configuration." },
  { num: "04", title: "Handwriting Recognition", desc: "Field work orders with handwritten notes? Our handwritten invoice OCR learns and improves accuracy with every correction your team makes." },
  { num: "05", title: "Validate, Reconcile, Export", desc: "Extracted data is validated against business rules, reconciled across vendors for invoice discrepancy detection, and exported to your system of record." },
];

const features = [
  { icon: "\u{1F4F7}", label: "Multi-Format Intelligence", desc: "Handles printed PDFs, scanned images, and handwritten documents. If a human can read it, our invoice OCR software can extract it." },
  { icon: "\u{1F4D1}", label: "Vendor Template Engine", desc: "Learn a vendor's invoice format once, then process every future invoice automatically. Multi-vendor invoice processing without repetitive setup." },
  { icon: "\u{1F4C3}", label: "Line-Item Level Extraction", desc: "Not just headers \u2014 every chassis ID, date range, rate, service type, and charge is captured. Full invoice line item extraction for complete data." },
  { icon: "\u{270D}\u{FE0F}", label: "Handwriting Learning", desc: "AI-powered handwriting recognition that improves with every correction. Field work orders and handwritten notes become searchable, structured data." },
  { icon: "\u{1F50D}", label: "Cross-Invoice Reconciliation", desc: "Detect duplicate charges, rate discrepancies, and missing items across vendors. Invoice reconciliation software that catches what humans miss." },
  { icon: "\u{1F9E9}", label: "Pluggable AI Providers", desc: "Claude, GPT-4o, Gemini \u2014 pick the best AI model for each vendor's format. Swap providers without changing your pipeline." },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$299",
    period: "/mo billed annually",
    features: [
      "Up to 500 pages/month",
      "10 vendor templates",
      "Email support",
      "Standard OCR extraction",
      "CSV & JSON export",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$799",
    period: "/mo billed annually",
    features: [
      "Up to 5,000 pages/month",
      "Unlimited vendor templates",
      "Priority support",
      "Handwriting recognition",
      "Cross-invoice reconciliation",
      "API integration",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    features: [
      "Unlimited pages",
      "Dedicated onboarding",
      "Custom integrations",
      "SLA guarantee",
      "Pluggable AI providers",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const caseStudyStats = [
  { value: "4,353+", label: "chassis rows extracted" },
  { value: "100%", label: "date accuracy" },
  { value: "100%", label: "rate accuracy" },
  { value: "9", label: "vendor formats automated" },
];

const audiences = [
  {
    icon: "\u{1F69A}",
    title: "Chassis & Container Logistics",
    desc: "Process chassis invoices from multiple depots and vendors. Extract chassis IDs, per-diem charges, flip fees, and storage rates automatically.",
  },
  {
    icon: "\u{1F697}",
    title: "Fleet Management Companies",
    desc: "Consolidate invoices from fuel suppliers, maintenance shops, parts distributors, and tire vendors into one structured dataset for fleet invoice management.",
  },
  {
    icon: "\u{1F4E6}",
    title: "3PL & Intermodal Transport",
    desc: "Handle the complexity of multi-modal logistics invoicing. Drayage, rail, warehouse \u2014 every format standardized through logistics invoice automation.",
  },
  {
    icon: "\u{1F4B0}",
    title: "Any Multi-Vendor AP Department",
    desc: "If your accounts payable team processes invoices from more than a handful of vendors, our vendor invoice management platform eliminates the manual work.",
  },
];

const faqs = [
  {
    q: "What types of invoices can you process?",
    a: "Any invoice format \u2014 printed PDFs, scanned documents, photos, and even handwritten field work orders. Our platform handles multi-page invoices, continuation tables, embedded chassis pairs, and non-standard layouts. If your AP team can read it, we can extract it.",
  },
  {
    q: "How does the handwriting recognition work?",
    a: "Our handwritten invoice OCR uses AI models that learn from corrections. When the system encounters handwriting it's unsure about, it flags the field for review. Every correction improves future accuracy for that vendor and handwriting style. Most clients see 90%+ handwriting accuracy within the first month.",
  },
  {
    q: "How accurate is the extraction?",
    a: "For standard printed invoices, we achieve 95%+ accuracy out of the box. With vendor-specific templates tuned to your documents, accuracy typically exceeds 98%. Every extracted field includes a confidence score \u2014 high-confidence data flows through automatically while low-confidence fields are flagged for review.",
  },
  {
    q: "Can I reconcile invoices across vendors?",
    a: "Yes. Our invoice reconciliation software compares line items across vendors and time periods to detect duplicate charges, rate discrepancies, and missing items. You can set custom business rules for what constitutes a discrepancy and get alerts when something doesn't match.",
  },
  {
    q: "How long does setup take?",
    a: "Most clients are processing invoices within 1-2 weeks. Initial setup includes configuring 5-10 vendor templates and connecting to your export destination. Adding new vendors after that typically takes minutes \u2014 the system often auto-detects the format.",
  },
  {
    q: "What if a vendor changes their invoice format?",
    a: "The platform detects format changes automatically. If a vendor updates their invoice layout, the system flags the change and either adapts automatically or alerts you to update the template. No invoices get silently misprocessed.",
  },
];

export default function InvoiceIntelligence() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = "Invoice Intelligence - Automated Invoice Extraction & Reconciliation | doITbetter labs";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Extract, reconcile, and validate vendor invoices automatically. AI-powered invoice processing that handles any format \u2014 printed, scanned, or handwritten. Built for logistics, fleet management, and multi-vendor AP teams.";
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
          message: `[Invoice Intelligence] ${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "form_submit", form_name: "invoice_intelligence" });
      sendLeadNotification(form.name, form.email, `[Invoice Intelligence] ${form.message}`, "Landing Page \u2014 Invoice Intelligence");
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
          AI-Powered Invoice Intelligence Platform
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
          Your Vendors Send Invoices in 50 Different Formats.{" "}
          <span style={gradientText}>We Read All of Them.</span>
        </h1>

        <p
          style={{
            ...body,
            fontSize: "1.15rem",
            maxWidth: 620,
            margin: "0 auto 2.5rem",
          }}
        >
          Eliminate manual data entry and catch billing errors before they cost you.
          One platform to extract, reconcile, and validate every vendor invoice &mdash;
          regardless of format. Automated invoice processing for logistics, fleet
          management, and accounts payable teams.
        </p>

        <a href="#contact-cta" style={ctaBtn}>
          See It In Action
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
          The Invoice Problem Nobody Talks About
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
          Multi-vendor invoice processing is broken. Here's why your AP team is
          spending more time on data entry than on actual accounts payable automation.
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
          How Invoice Intelligence Works
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
          From invoice upload to validated, reconciled data &mdash; five steps,
          no manual keying. Invoice data extraction that just works.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
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

      {/* ════════════════ KEY CAPABILITIES ════════════════ */}
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
          Key Capabilities
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
          Everything you need for end-to-end vendor invoice management &mdash;
          from intake to reconciliation.
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

      {/* ════════════════ PRICING ════════════════ */}
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
          Transparent Pricing That Scales With You
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
          Annual license includes platform access, vendor template setup, and
          API integration. Pay only for what you process.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              style={{
                ...card,
                textAlign: "center",
                padding: "2.5rem 2rem",
                border: tier.highlighted
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border)",
                position: "relative",
              }}
            >
              {tier.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    ...headingSm,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#fff",
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                    borderRadius: 100,
                    padding: "4px 16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3
                style={{
                  ...headingSm,
                  fontSize: "1.3rem",
                  color: "var(--text-hi)",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                {tier.name}
              </h3>
              <div
                style={{
                  ...heading,
                  fontSize: "2.4rem",
                  ...gradientText,
                  marginBottom: "0.25rem",
                }}
              >
                {tier.price}
              </div>
              <div
                style={{
                  ...body,
                  fontSize: "0.85rem",
                  color: "var(--text-mid)",
                  marginBottom: "1.5rem",
                }}
              >
                {tier.period}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem",
                  textAlign: "left",
                }}
              >
                {tier.features.map((feat) => (
                  <li
                    key={feat}
                    style={{
                      ...body,
                      fontSize: "0.9rem",
                      padding: "0.4rem 0",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>{"\u2713"}</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="#contact-cta"
                style={{
                  ...ctaBtn,
                  width: "100%",
                  textAlign: "center",
                  display: "block",
                  boxSizing: "border-box",
                  background: tier.highlighted
                    ? "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)"
                    : "transparent",
                  border: tier.highlighted ? "none" : "1px solid var(--border-mid)",
                  color: tier.highlighted ? "#fff" : "var(--text-hi)",
                }}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p
          style={{
            ...body,
            textAlign: "center",
            fontSize: "0.95rem",
            color: "var(--accent)",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          All plans include a 30-day free trial. No credit card required to start.
        </p>
        <p
          style={{
            ...body,
            textAlign: "center",
            fontSize: "0.82rem",
            color: "var(--text-mid)",
            margin: 0,
          }}
        >
          Processing fees: $0.02&ndash;0.05 per page depending on complexity
        </p>
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
            Chassis Logistics Company Processes 4,000+ Line Items from 10 Vendors in Minutes
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
            A chassis invoice processing company was receiving invoices from 10 different
            vendors &mdash; each with a completely different format. Some were clean PDFs
            with structured tables. Others were scanned documents with handwritten
            annotations. Several had continuation tables spanning multiple pages with
            embedded chassis pairs that required special parsing logic. Their AP team
            was spending days manually keying in line items, and billing errors were
            slipping through undetected.
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
            We built a custom Invoice Intelligence pipeline with vendor-specific templates
            for all 10 formats. The platform extracts every chassis ID, date range, rate,
            and service type &mdash; including handwritten fields. Cross-invoice
            reconciliation catches duplicate charges and rate discrepancies automatically.
            What took days now takes minutes, with 100% accuracy on dates and rates.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {caseStudyStats.map((s) => (
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

      {/* ════════════════ WHO IT'S FOR ════════════════ */}
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
          Who Invoice Intelligence Is For
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
          Any business that receives invoices from multiple vendors in different
          formats. If your AP team is drowning in data entry, we can help.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {audiences.map((a) => (
            <div
              key={a.title}
              style={{
                ...card,
                textAlign: "center",
                padding: "2rem 1.5rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{a.icon}</div>
              <h4
                style={{
                  ...headingSm,
                  fontSize: "1.05rem",
                  color: "var(--text-hi)",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                {a.title}
              </h4>
              <p style={{ ...body, fontSize: "0.88rem", margin: 0 }}>{a.desc}</p>
            </div>
          ))}
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
            See Invoice Intelligence in Action
          </h2>
          <p
            style={{
              ...body,
              fontSize: "1rem",
              maxWidth: 460,
              margin: "0 auto 2rem",
            }}
          >
            Tell us about your invoice processing challenges. We'll show you
            how Invoice Intelligence handles your exact vendor formats.
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
                  Tell us about your invoice processing needs
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="We process 500+ invoices a month from multiple vendors and need a better way to..."
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
                {status === "sending" ? "Sending..." : status === "error" ? "Try Again" : "Request a Demo"}
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
