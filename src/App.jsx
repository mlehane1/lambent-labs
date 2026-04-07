import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { sendLeadNotification } from "./leadNotify.js";
import { trackFormStart, trackFormSubmit, trackCTAClick, trackScrollDepth, getStoredUTMs } from "./tracker.js";
import VisitorDashboard from "./components/VisitorDashboard.jsx";
import BlogAdmin from "./components/BlogAdmin.jsx";

// ─── localStorage helpers ──────────────────────────────────────────────────────
function loadSiteContent() {
  try {
    let raw = localStorage.getItem("doitbetter-content");
    if (!raw) {
      raw = localStorage.getItem("lambent-content");
      if (raw) {
        localStorage.setItem("doitbetter-content", raw);
        localStorage.removeItem("lambent-content");
      }
    }
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveSiteContent(content) {
  try { localStorage.setItem("doitbetter-content", JSON.stringify(content)); } catch {}
}

// ─── Default data ──────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 1,
    icon: "🚀",
    title: "Rapid MVP Development",
    description: "Go from napkin sketch to production app in as little as 2 weeks. We use modern tooling and AI-accelerated workflows to ship real software at startup speed — without the startup price tag.",
    tags: ["React", "Node.js", "Full-Stack", "MVP"],
    color: "#1558CB",
  },
  {
    id: 2,
    icon: "🌐",
    title: "Custom Web Applications",
    description: "Internal tools, client portals, dashboards, and workflow apps — tailored to how your business actually works. No cookie-cutter templates. No bloated platforms.",
    tags: ["Web Apps", "Dashboards", "Portals", "APIs"],
    color: "#15CB88",
  },
  {
    id: 3,
    icon: "📊",
    title: "SEO & Digital Presence",
    description: "Technical SEO audits, Google Analytics setup, conversion tracking, and content strategy. We make sure people find you — and that you know what they do when they get there.",
    tags: ["SEO", "Analytics", "Google Ads", "Tracking"],
    color: "#588FEE",
  },
  {
    id: 4,
    icon: "🔗",
    title: "Data & API Integration",
    description: "Connect your systems. We build custom integrations, ETL pipelines, and reporting layers that pull your data together into one clear picture.",
    tags: ["Supabase", "REST APIs", "SQL", "Automation"],
    color: "#E9812A",
  },
  {
    id: 5,
    icon: "📱",
    title: "Ad Campaigns & Lead Gen",
    description: "Google Ads, Meta Ads, TikTok — we set up your campaigns, install your tracking pixels, and build landing pages that convert. Data-driven from day one.",
    tags: ["Google Ads", "Meta Ads", "Landing Pages", "Pixels"],
    color: "#CB1558",
  },
  {
    id: 6,
    icon: "🛠️",
    title: "Custom Query & Reporting",
    description: "Need to slice your data a different way? We write custom SQL queries, build automated reports, and create dashboards so you can make decisions faster.",
    tags: ["SQL", "Reporting", "Dashboards", "BI"],
    color: "#8B5CF6",
  },
];

const RESULTS = [
  { metric: "2 weeks", label: "Average time to first deploy" },
  { metric: "60%", label: "Less than traditional dev costs" },
  { metric: "24hr", label: "Response time on all inquiries" },
  { metric: "100%", label: "Custom — no templates, no lock-in" },
];

const PROCESS_STEPS = [
  { step: "01", title: "Discovery Call", description: "Free 30-minute consultation. We learn your problem, you learn our approach. No pressure, no jargon." },
  { step: "02", title: "Scope & Quote", description: "Within 48 hours you get a clear scope document and fixed-price quote. No surprises, no hourly billing games." },
  { step: "03", title: "Build Sprint", description: "We build in focused 1-2 week sprints with daily progress updates. You see working software from day one." },
  { step: "04", title: "Launch & Support", description: "We deploy to production, set up monitoring, and provide 30 days of post-launch support included." },
];

const FAQ_ITEMS = [
  {
    q: "How can you build so fast?",
    a: "We leverage modern frameworks, AI-accelerated development workflows, and reusable architecture patterns. This isn't corner-cutting — it's using better tools. The same way a CNC machine doesn't make worse furniture than hand tools, it makes it faster.",
  },
  {
    q: "What does '2 weeks to production' actually mean?",
    a: "It means a working, deployed application that real users can access. The scope varies — a simple internal tool might be done in one week, a complex multi-user platform might take four. But our average first deploy is 2 weeks from kickoff.",
  },
  {
    q: "How much does it cost?",
    a: "Most projects fall between $2,000 and $15,000. We give fixed-price quotes after a free discovery call — no hourly billing, no scope creep surprises. You know the number before we write a line of code.",
  },
  {
    q: "What technologies do you use?",
    a: "React, Node.js, PostgreSQL, and Supabase are our core stack. We also work with Python, PHP, and can integrate with virtually any API or database. We pick the right tool for the job, not the trendy one.",
  },
  {
    q: "Do you do ongoing maintenance?",
    a: "Yes. Every project includes 30 days of post-launch support. After that, we offer affordable monthly maintenance plans or can hand off the codebase to your team with full documentation.",
  },
  {
    q: "Can you help with SEO and marketing too?",
    a: "Absolutely. We set up analytics, tracking pixels, Google Search Console, and can manage ad campaigns on Google, Meta, and TikTok. A beautiful app means nothing if nobody finds it.",
  },
];

const DEFAULT_CONTENT = {
  heroTagline: "Your app. Live in 2 weeks.",
  heroSub: "We build custom software, websites, and data tools faster and for less than you thought possible. No bloated timelines. No six-figure invoices. Just working software, deployed.",
  contactEmail: "lambentlabs247@gmail.com",
};

const ADMIN_PASSWORD = "doitbetter2024";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronDown = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{
        background: "var(--bg-dark)", border: "1px solid var(--border)",
        borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "520px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 25px 80px rgba(0,0,0,0.6)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ margin: 0, color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif", fontSize: "1.2rem" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-lo)", cursor: "pointer", padding: "4px" }}>
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, textarea, type = "text", placeholder }) {
  const style = {
    width: "100%", background: "var(--bg-card2)", border: "1px solid var(--border-mid)",
    borderRadius: "8px", padding: "10px 14px", color: "var(--text-hi)",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
    outline: "none", boxSizing: "border-box", resize: textarea ? "vertical" : "none",
    minHeight: textarea ? "90px" : undefined,
  };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", color: "var(--text-mid)", fontSize: "0.78rem",
        marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase"
      }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} style={style} placeholder={placeholder} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style} placeholder={placeholder} />
      }
    </div>
  );
}

// ─── SaveBtn ───────────────────────────────────────────────────────────────────
function SaveBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: "100%",
      background: "linear-gradient(135deg, var(--primary), var(--accent))",
      border: "none", color: "white", padding: "12px", borderRadius: "10px",
      fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", marginTop: "8px",
    }}>{children}</button>
  );
}

// ─── Service Card ──────────────────────────────────────────────────────────────
function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card2)" : "var(--bg-card)",
        border: `1px solid ${hovered ? service.color + "66" : "var(--border)"}`,
        borderRadius: "16px", padding: "28px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 40px ${service.color}22` : "none",
      }}
    >
      <div style={{
        fontSize: "2.2rem", marginBottom: "16px",
        background: service.color + "18", borderRadius: "12px",
        width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center",
      }}>{service.icon}</div>

      <h3 style={{ margin: "0 0 10px 0", color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>
        {service.title}
      </h3>
      <p style={{ margin: "0 0 18px 0", color: "var(--text-mid)", fontSize: "0.875rem", lineHeight: 1.6 }}>
        {service.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {service.tags.map(tag => (
          <span key={tag} style={{
            fontSize: "0.72rem", padding: "3px 10px", borderRadius: "20px",
            background: service.color + "18", color: service.color,
            fontWeight: 500, letterSpacing: "0.04em",
          }}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

// ─── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "12px", overflow: "hidden",
      transition: "border-color 0.2s",
      borderColor: open ? "var(--border-mid)" : "var(--border)",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", color: "var(--text-hi)",
        padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
        fontWeight: 500, textAlign: "left",
      }}>
        {item.q}
        <ChevronDown open={open} />
      </button>
      <div style={{
        maxHeight: open ? "300px" : "0",
        overflow: "hidden",
        transition: "max-height 0.3s ease, padding 0.3s ease",
        padding: open ? "0 24px 20px" : "0 24px",
      }}>
        <p style={{ color: "var(--text-mid)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
          {item.a}
        </p>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [content, setContent] = useState(() => loadSiteContent() || DEFAULT_CONTENT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVisitorDashboard, setShowVisitorDashboard] = useState(false);
  const [showBlogAdmin, setShowBlogAdmin] = useState(false);

  // Email capture (lead magnet)
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureSubmitting, setCaptureSubmitting] = useState(false);
  const [captureStatus, setCaptureStatus] = useState(null);

  // Contact form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState(null); // "success" | "error" | null

  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      if (isAdmin) { setIsAdmin(false); } else { setShowAdminLogin(true); }
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleSaveContent = (c) => {
    setContent(c);
    saveSiteContent(c);
    setShowContentEditor(false);
  };

  // ── Supabase email capture (lead magnet) ──
  const handleCaptureSubmit = async (e) => {
    e.preventDefault();
    trackFormSubmit("email_capture");
    setCaptureSubmitting(true);
    setCaptureStatus(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ name: "Email Capture", email: captureEmail, message: "[Lead Magnet Download]" }),
      });

      if (res.ok) {
        setCaptureStatus("success");
        sendLeadNotification("Email Capture", captureEmail, "[Lead Magnet Download]", "Homepage — Guide Download");
        setCaptureEmail("");
        if (window.dataLayer) {
          window.dataLayer.push({ event: "form_submit", form_name: "email_capture", conversion_value: 5, currency: "USD", ...getStoredUTMs() });
        }
      } else {
        setCaptureStatus("error");
      }
    } catch {
      setCaptureStatus("error");
    } finally {
      setCaptureSubmitting(false);
    }
  };

  // ── Supabase lead submission ──
  const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    trackFormSubmit("contact");
    setContactSubmitting(true);
    setContactStatus(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage }),
      });

      if (res.ok) {
        setContactStatus("success");
        sendLeadNotification(contactName, contactEmail, contactMessage, "Homepage — Contact Form");
        setContactName("");
        setContactEmail("");
        setContactMessage("");
        // Push event to GTM dataLayer for conversion tracking
        if (window.dataLayer) {
          window.dataLayer.push({ event: "form_submit", form_name: "contact", conversion_value: 50, currency: "USD", ...getStoredUTMs() });
        }
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    } finally {
      setContactSubmitting(false);
    }
  };

  const navLinks = ["home", "about", "services", "process", "faq", "contact"];

  // Scroll depth tracking (fires at 25%, 50%, 75%, 100%)
  const scrollMilestones = useRef(new Set());
  useEffect(() => {
    const onScroll = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !scrollMilestones.current.has(m)) {
          scrollMilestones.current.add(m);
          trackScrollDepth(m);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* Admin banner */}
      {isAdmin && (
        <div style={{
          background: "linear-gradient(90deg, var(--bg-dark), var(--bg-card))",
          borderBottom: "1px solid rgba(21,203,136,0.2)",
          padding: "8px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 500,
        }}>
          <span style={{ color: "var(--accent)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em" }}>
            ADMIN MODE
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setShowVisitorDashboard(true)} style={{
              background: "rgba(10,44,101,0.5)", border: "1px solid rgba(21,203,136,0.27)",
              color: "var(--accent)", borderRadius: "8px", padding: "4px 14px",
              fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Visitors</button>
            <button onClick={() => setShowBlogAdmin(true)} style={{
              background: "rgba(10,44,101,0.5)", border: "1px solid rgba(21,203,136,0.27)",
              color: "var(--accent)", borderRadius: "8px", padding: "4px 14px",
              fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Blog</button>
            <button onClick={() => { setEditingContent({ ...content }); setShowContentEditor(true); }} style={{
              background: "rgba(10,44,101,0.5)", border: "1px solid rgba(21,203,136,0.27)",
              color: "var(--accent)", borderRadius: "8px", padding: "4px 14px",
              fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Edit Content</button>
            <button onClick={() => setIsAdmin(false)} style={{
              background: "none", border: "1px solid var(--border)", color: "var(--text-mid)",
              borderRadius: "8px", padding: "4px 14px", fontSize: "0.78rem", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>Exit Admin</button>
          </div>
        </div>
      )}

      {/* ── NAV ───────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: isAdmin ? undefined : 0, zIndex: 400,
        background: "rgba(2,8,20,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(12,52,121,0.33)",
        padding: "0 40px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "64px",
      }}>
        <div onClick={handleLogoClick} style={{
          display: "flex", alignItems: "center", gap: "10px",
          cursor: "pointer", userSelect: "none",
        }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            borderRadius: "10px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.1rem", color: "white",
          }}>◈</div>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "1.1rem", color: "var(--text-hi)", letterSpacing: "0.02em",
          }}>
            doITbetter<span style={{ color: "var(--primary-lt)" }}> labs</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {navLinks.map(s => (
            <a key={s} href={`#${s}`} onClick={() => setActiveSection(s)} style={{
              color: activeSection === s ? "var(--primary-lt)" : "var(--text-mid)",
              fontWeight: 500, fontSize: "0.88rem", letterSpacing: "0.04em",
              textTransform: "capitalize", transition: "color 0.2s",
            }}>{s}</a>
          ))}
          <Link to="/blog" style={{
            color: "var(--text-mid)",
            fontWeight: 500, fontSize: "0.88rem", letterSpacing: "0.04em",
            transition: "color 0.2s",
          }}>Blog</Link>
          <Link to="/build" style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "white", padding: "8px 20px", borderRadius: "8px",
            fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.02em",
          }}>Preview Your Project</Link>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
          background: "none", border: "none", cursor: "pointer", padding: "8px",
          display: "none", flexDirection: "column", gap: "5px",
        }}>
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-mid)",
            transition: "all 0.3s", transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-mid)",
            transition: "all 0.3s", opacity: mobileMenuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-mid)",
            transition: "all 0.3s", transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, bottom: 0,
          background: "rgba(2,8,20,0.97)", backdropFilter: "blur(12px)",
          zIndex: 399, padding: "24px 40px",
          display: "flex", flexDirection: "column", gap: "8px",
          animation: "fadeInUp 0.2s ease",
        }}>
          {navLinks.map(s => (
            <a key={s} href={`#${s}`} onClick={() => { setActiveSection(s); setMobileMenuOpen(false); }} style={{
              color: activeSection === s ? "var(--primary-lt)" : "var(--text-mid)",
              fontWeight: 600, fontSize: "1.1rem", letterSpacing: "0.04em",
              textTransform: "capitalize", padding: "12px 0",
              borderBottom: "1px solid var(--border)",
            }}>{s}</a>
          ))}
          <Link to="/blog" onClick={() => setMobileMenuOpen(false)} style={{
            color: "var(--text-mid)", fontWeight: 600, fontSize: "1.1rem",
            padding: "12px 0", borderBottom: "1px solid var(--border)",
          }}>Blog</Link>
          <Link to="/build" onClick={() => setMobileMenuOpen(false)} style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "white", padding: "14px 24px", borderRadius: "10px",
            fontWeight: 600, fontSize: "1rem", textAlign: "center",
            marginTop: "16px",
          }}>Preview Your Project</Link>
        </div>
      )}

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section id="home" style={{ position: "relative", overflow: "hidden", padding: "100px 40px 80px" }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(21,88,203,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,88,203,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
        <div style={{
          position: "absolute", top: "-100px", left: "50%",
          transform: "translateX(-50%)", width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(21,88,203,0.14) 0%, transparent 70%)",
          zIndex: 0,
        }} />
        <div style={{
          position: "absolute", bottom: 0, right: "10%",
          width: "300px", height: "300px",
          background: "radial-gradient(ellipse, rgba(21,203,136,0.09) 0%, transparent 70%)",
          zIndex: 0,
        }} />

        <div style={{
          position: "relative", zIndex: 1, maxWidth: "900px",
          margin: "0 auto", textAlign: "center",
          animation: "fadeInUp 0.8s ease",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "20px", padding: "6px 16px", marginBottom: "32px",
            fontSize: "0.78rem", color: "var(--primary-llt)", letterSpacing: "0.08em",
          }}>
            <span style={{
              width: "6px", height: "6px", background: "var(--accent)",
              borderRadius: "50%", animation: "pulse 2s infinite",
              display: "inline-block",
            }} />
            CUSTOM SOFTWARE · SEO · DATA · INTEGRATIONS
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: "clamp(2.4rem, 6vw, 4rem)", lineHeight: 1.1,
            color: "var(--text-hi)", margin: "0 0 20px 0", letterSpacing: "-0.02em",
          }}>
            {content.heroTagline}
          </h1>

          <p style={{
            fontSize: "1.1rem", color: "var(--text-mid)",
            maxWidth: "640px", margin: "0 auto 48px", lineHeight: 1.7,
          }}>
            {content.heroSub}
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/build" style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "white", padding: "14px 32px", borderRadius: "12px",
              fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.02em",
              boxShadow: "0 4px 20px rgba(21,88,203,0.35)",
            }}>See Your Project Come to Life</Link>
            <a href="#services" style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text-mid)", padding: "14px 32px", borderRadius: "12px",
              fontWeight: 500, fontSize: "0.95rem",
            }}>See What We Build</a>
          </div>
        </div>
      </section>

      {/* ── RESULTS BAR ───────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--bg-dark)", borderTop: "1px solid rgba(12,52,121,0.2)",
        borderBottom: "1px solid rgba(12,52,121,0.2)",
        padding: "40px 40px",
      }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px", textAlign: "center",
        }}>
          {RESULTS.map(r => (
            <div key={r.label}>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                fontSize: "2rem", color: "var(--accent)",
                marginBottom: "8px",
              }}>{r.metric}</div>
              <div style={{ color: "var(--text-mid)", fontSize: "0.85rem" }}>{r.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT / WHY US ───────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{
              color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
            }}>Why doITbetter labs</p>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--text-hi)",
              margin: "0 0 20px", letterSpacing: "-0.02em",
            }}>We're not here to sell you software you don't need.</h2>
          </div>

          {/* Main narrative */}
          <div style={{
            maxWidth: "720px", margin: "0 auto 48px",
            fontSize: "1.05rem", lineHeight: 1.85, color: "var(--text-mid)",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <p style={{ marginBottom: "20px" }}>
              We've spent years in the trenches — analyzing business processes, designing products, building custom software, and supporting the people who use it. That experience taught us something most dev shops won't tell you:
            </p>
            <p style={{
              fontSize: "1.25rem", fontWeight: 600, color: "var(--text-hi)",
              fontFamily: "'Outfit', sans-serif", lineHeight: 1.5,
              borderLeft: "3px solid var(--accent)", paddingLeft: "20px",
              margin: "32px 0",
            }}>
              Sometimes the right answer isn't custom software. Sometimes it's pointing you to an off-the-shelf product that already does what you need — and saving you the money.
            </p>
            <p style={{ marginBottom: "20px" }}>
              We'd rather be honest than profitable on a single deal. If a COTS solution fits your workflow, we'll tell you. We'll even help you evaluate and implement it. Our goal is a long-term relationship built on trust, not a one-time invoice.
            </p>
            <p style={{ marginBottom: "20px" }}>
              But here's the reality we all know: most off-the-shelf software forces <em>you</em> to fit into <em>its</em> workflow. It doesn't connect to the rest of your business. It doesn't flex when your processes change. And the "customization" they offer is really just picking from a menu of options someone else designed.
            </p>
            <p style={{ marginBottom: "0" }}>
              <strong style={{ color: "var(--text-hi)" }}>That's why we exist.</strong> When off-the-shelf falls short — when you need software that fits your business instead of the other way around — that's where we come in.
            </p>
          </div>

          {/* What we bring */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px", marginBottom: "48px",
          }}>
            {[
              {
                icon: "🔍",
                title: "Process Analysis",
                desc: "We start by understanding how your business actually works — not how a software vendor thinks it should work. We map your workflows, identify bottlenecks, and find where technology can make the biggest impact.",
                color: "#1558CB",
              },
              {
                icon: "🎯",
                title: "Honest Recommendations",
                desc: "If an existing product solves your problem, we'll tell you. We'll help you evaluate options, negotiate with vendors, and implement the right solution — even if it means we don't write a line of code.",
                color: "#15CB88",
              },
              {
                icon: "🏗️",
                title: "Custom When It Counts",
                desc: "When off-the-shelf can't cut it — when you need systems that talk to each other, workflows that match your reality, and software that grows with you — we build exactly what you need. No more, no less.",
                color: "#588FEE",
              },
              {
                icon: "🎨",
                title: "Product Design & UX",
                desc: "Software nobody uses is software nobody needed. We design interfaces that make sense to the people who use them every day — not just the people who sign the check.",
                color: "#E9812A",
              },
              {
                icon: "🔗",
                title: "Integration & Connection",
                desc: "The biggest pain point we hear: 'None of our systems talk to each other.' We connect your tools, automate your data flow, and give you one clear picture instead of five disconnected ones.",
                color: "#8B5CF6",
              },
              {
                icon: "🤝",
                title: "Ongoing Partnership",
                desc: "We don't disappear after launch. We provide training, support, and ongoing development. Your business changes — your software should change with it.",
                color: "#CB1558",
              },
            ].map(item => (
              <div key={item.title} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "28px",
              }}>
                <div style={{
                  fontSize: "2rem", marginBottom: "14px",
                  background: item.color + "18", borderRadius: "12px",
                  width: "52px", height: "52px", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>{item.icon}</div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                  fontSize: "1.05rem", color: "var(--text-hi)", margin: "0 0 10px",
                }}>{item.title}</h3>
                <p style={{
                  color: "var(--text-mid)", fontSize: "0.875rem",
                  lineHeight: 1.65, margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* The bottom line */}
          <div style={{
            background: "linear-gradient(135deg, rgba(21,88,203,0.1), rgba(21,203,136,0.06))",
            border: "1px solid rgba(21,88,203,0.2)",
            borderRadius: "16px", padding: "36px 40px",
            textAlign: "center", maxWidth: "720px", margin: "0 auto",
          }}>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700,
              fontSize: "1.15rem", color: "var(--text-hi)", lineHeight: 1.6,
              margin: "0 0 12px",
            }}>
              Our job isn't to build software. Our job is to solve your problem.
            </p>
            <p style={{
              color: "var(--text-mid)", fontSize: "0.9rem", lineHeight: 1.7,
              margin: "0 0 20px",
            }}>
              Sometimes that means custom code. Sometimes it means pointing you to the right vendor. Always it means understanding your business first.
            </p>
            <a href="#contact" style={{
              display: "inline-block",
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "white", padding: "12px 28px", borderRadius: "10px",
              fontWeight: 600, fontSize: "0.9rem",
              boxShadow: "0 4px 16px rgba(21,88,203,0.3)",
            }}>Let's Talk About Your Business</a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{
            color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
          }}>What We Do</p>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--text-hi)",
            margin: "0 0 16px", letterSpacing: "-0.02em",
          }}>Software Development & Digital Services</h2>
          <p style={{ color: "var(--text-mid)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7, fontSize: "0.95rem" }}>
            From custom web apps to SEO and paid advertising — we handle the technical side so you can focus on your business.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "24px",
        }}>
          {SERVICES.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────────── */}
      <section id="process" style={{
        padding: "80px 40px",
        background: "var(--bg-dark)",
        borderTop: "1px solid rgba(12,52,121,0.2)",
        borderBottom: "1px solid rgba(12,52,121,0.2)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{
              color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
            }}>How It Works</p>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--text-hi)",
              margin: "0 0 16px", letterSpacing: "-0.02em",
            }}>From Idea to Production</h2>
            <p style={{ color: "var(--text-mid)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7, fontSize: "0.95rem" }}>
              A simple, transparent process. No mystery, no surprises.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.step} style={{
                display: "flex", gap: "24px", alignItems: "flex-start",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "28px",
              }}>
                <div style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                  fontSize: "1.8rem", color: "var(--primary)", opacity: 0.6,
                  minWidth: "48px",
                }}>{s.step}</div>
                <div>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                    fontSize: "1.05rem", color: "var(--text-hi)", margin: "0 0 8px",
                  }}>{s.title}</h3>
                  <p style={{ color: "var(--text-mid)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "80px 40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{
            color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
          }}>FAQ</p>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--text-hi)",
            margin: 0, letterSpacing: "-0.02em",
          }}>Common Questions</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </div>
      </section>

      {/* ── EMAIL CAPTURE / LEAD MAGNET ──────────────────────────────────────── */}
      <section style={{
        padding: "60px 40px",
        background: "linear-gradient(135deg, rgba(21,88,203,0.12) 0%, rgba(21,203,136,0.08) 100%)",
        borderTop: "1px solid rgba(21,88,203,0.2)",
        borderBottom: "1px solid rgba(21,203,136,0.2)",
      }}>
        <div style={{
          maxWidth: "700px", margin: "0 auto", textAlign: "center",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>📋</div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "var(--text-hi)",
            margin: "0 0 12px", letterSpacing: "-0.02em",
          }}>Free Guide: 5 Questions to Ask Before Hiring a Dev Shop</h2>
          <p style={{ color: "var(--text-mid)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px" }}>
            Don't waste money on the wrong team. Get our free checklist — the same questions we'd ask if we were in your shoes.
          </p>

          {captureStatus === "success" ? (
            <div style={{
              padding: "16px 24px", borderRadius: "12px",
              background: "rgba(21,203,136,0.15)", border: "1px solid rgba(21,203,136,0.3)",
              color: "var(--accent)", fontSize: "0.95rem",
            }}>
              Check your inbox! (And your spam folder, just in case.)
            </div>
          ) : (
            <form onSubmit={handleCaptureSubmit} style={{
              display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap",
              maxWidth: "480px", margin: "0 auto",
            }}>
              <input
                type="email"
                required
                value={captureEmail}
                onChange={e => setCaptureEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  flex: "1 1 240px", padding: "14px 18px", borderRadius: "10px",
                  background: "var(--bg-card)", border: "1px solid var(--border-mid)",
                  color: "var(--text-hi)", fontSize: "0.9rem",
                  fontFamily: "'DM Sans', sans-serif", outline: "none",
                }}
              />
              <button type="submit" disabled={captureSubmitting} style={{
                padding: "14px 28px", borderRadius: "10px",
                background: captureSubmitting ? "var(--bg-card2)" : "linear-gradient(135deg, var(--primary), var(--accent))",
                border: "none", color: "white", fontWeight: 600, fontSize: "0.9rem",
                cursor: captureSubmitting ? "wait" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: captureSubmitting ? "none" : "0 4px 16px rgba(21,88,203,0.3)",
                whiteSpace: "nowrap",
              }}>
                {captureSubmitting ? "Sending..." : "Get the Guide"}
              </button>
            </form>
          )}
          {captureStatus === "error" && (
            <p style={{ color: "#F87171", fontSize: "0.82rem", marginTop: "12px" }}>
              Something went wrong. Try again or email us directly.
            </p>
          )}
          <p style={{ color: "var(--text-lo)", fontSize: "0.72rem", marginTop: "12px" }}>
            No spam, ever. Just the guide.
          </p>
        </div>
      </section>

      {/* ── CONTACT / LEAD CAPTURE ────────────────────────────────────────────── */}
      <section id="contact" style={{
        padding: "80px 40px",
        background: "var(--bg-dark)",
        borderTop: "1px solid rgba(12,52,121,0.2)",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
          }}>Start Your Project</p>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "var(--text-hi)",
            margin: "0 0 12px", letterSpacing: "-0.02em",
          }}>Get a Free Consultation</h2>
          <p style={{ color: "var(--text-mid)", marginBottom: "36px", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Tell us about your project and we'll get back to you within 24 hours with a no-obligation quote.
          </p>

          <form onSubmit={handleContactSubmit} style={{
            display: "flex", flexDirection: "column", gap: "16px", textAlign: "left",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Field label="Your Name" value={contactName} onChange={setContactName} placeholder="Jane Smith" />
              <Field label="Your Email" value={contactEmail} onChange={setContactEmail} type="email" placeholder="jane@company.com" />
            </div>
            <Field label="Tell Us About Your Project" value={contactMessage} onChange={setContactMessage} textarea
              placeholder="I need a web app that... / I want better SEO for... / I need to connect my systems..." />

            <button type="submit" disabled={contactSubmitting} style={{
              width: "100%",
              background: contactSubmitting
                ? "var(--bg-card2)"
                : "linear-gradient(135deg, var(--primary), var(--accent))",
              border: "none", color: "white", padding: "16px", borderRadius: "12px",
              fontWeight: 600, fontSize: "1rem",
              cursor: contactSubmitting ? "wait" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: contactSubmitting ? "none" : "0 4px 20px rgba(21,88,203,0.35)",
              opacity: contactSubmitting ? 0.7 : 1,
              transition: "all 0.2s",
            }}>
              {contactSubmitting ? "Sending..." : "Send Message"}
            </button>

            {contactStatus === "success" && (
              <div style={{
                marginTop: "16px", padding: "14px 20px", borderRadius: "10px",
                background: "rgba(21,203,136,0.12)", border: "1px solid rgba(21,203,136,0.3)",
                color: "var(--accent)", fontSize: "0.9rem", textAlign: "center",
              }}>
                Message sent! We'll get back to you within 24 hours.
              </div>
            )}
            {contactStatus === "error" && (
              <div style={{
                marginTop: "16px", padding: "14px 20px", borderRadius: "10px",
                background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)",
                color: "#F87171", fontSize: "0.9rem", textAlign: "center",
              }}>
                Something went wrong. Please email us directly at {content.contactEmail}.
              </div>
            )}
          </form>

          <p style={{ color: "var(--text-lo)", fontSize: "0.78rem", marginTop: "16px" }}>
            Or email us directly at{" "}
            <a href={`mailto:${content.contactEmail}`} style={{ color: "var(--primary-lt)" }}>
              {content.contactEmail}
            </a>
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(12,52,121,0.2)",
        padding: "40px",
        color: "var(--text-lo)", fontSize: "0.8rem",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          flexWrap: "wrap", gap: "32px",
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px",
            }}>
              <div style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                borderRadius: "8px", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "0.8rem", color: "white",
              }}>◈</div>
              <span style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                fontSize: "0.95rem", color: "var(--text-mid)",
              }}>
                doITbetter<span style={{ color: "var(--primary-lt)" }}> labs</span>
              </span>
            </div>
            <p style={{ color: "var(--text-lo)", maxWidth: "300px", lineHeight: 1.6, fontSize: "0.78rem" }}>
              Custom software development, SEO, and data solutions. Building better software, faster.
            </p>
          </div>

          <div>
            <h4 style={{ color: "var(--text-mid)", fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", marginBottom: "12px" }}>Services</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["MVP Development", "Web Applications", "SEO & Analytics", "API Integration", "Ad Campaigns", "Data & Reporting"].map(s => (
                <a key={s} href="#services" style={{ color: "var(--text-lo)", fontSize: "0.78rem" }}>{s}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "var(--text-mid)", fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", marginBottom: "12px" }}>Contact</h4>
            <a href={`mailto:${content.contactEmail}`} style={{ color: "var(--primary-lt)", fontSize: "0.82rem" }}>
              {content.contactEmail}
            </a>
          </div>
        </div>

        <div style={{
          maxWidth: "1200px", margin: "24px auto 0",
          paddingTop: "24px", borderTop: "1px solid rgba(12,52,121,0.15)",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
        }}>
          <span>&copy; {new Date().getFullYear()} doITbetter labs. All rights reserved. | <Link to="/privacy" style={{ color: "inherit", textDecoration: "underline" }}>Privacy Policy</Link></span>
          <span style={{ fontSize: "0.72rem", opacity: 0.5 }}>React &middot; Node.js &middot; PostgreSQL</span>
        </div>
      </footer>

      {/* ── MODALS ────────────────────────────────────────────────────────────── */}

      {showAdminLogin && (
        <Modal title="Admin Login" onClose={() => { setShowAdminLogin(false); setAdminPassword(""); setLoginError(false); }}>
          <Field label="Password" value={adminPassword} onChange={setAdminPassword} type="password" />
          {loginError && (
            <p style={{ color: "#F87171", fontSize: "0.82rem", marginTop: "-8px", marginBottom: "16px" }}>
              Incorrect password. Try again.
            </p>
          )}
          <SaveBtn onClick={handleAdminLogin}>Enter Admin Mode</SaveBtn>
        </Modal>
      )}

      {showContentEditor && editingContent && (
        <Modal title="Edit Site Content" onClose={() => setShowContentEditor(false)}>
          <Field label="Hero Tagline" value={editingContent.heroTagline} onChange={v => setEditingContent(c => ({ ...c, heroTagline: v }))} />
          <Field label="Hero Subtitle" value={editingContent.heroSub} onChange={v => setEditingContent(c => ({ ...c, heroSub: v }))} textarea />
          <Field label="Contact Email" value={editingContent.contactEmail} onChange={v => setEditingContent(c => ({ ...c, contactEmail: v }))} />
          <SaveBtn onClick={() => handleSaveContent(editingContent)}>Save Content</SaveBtn>
        </Modal>
      )}

      {showVisitorDashboard && (
        <VisitorDashboard onClose={() => setShowVisitorDashboard(false)} />
      )}

      {showBlogAdmin && (
        <BlogAdmin onClose={() => setShowBlogAdmin(false)} adminPassword={ADMIN_PASSWORD} />
      )}
    </div>
  );
}
