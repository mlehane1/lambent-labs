import { useState, useEffect, useRef } from "react";

// ─── localStorage helpers ──────────────────────────────────────────────────────
function loadApps() {
  try {
    const raw = localStorage.getItem("lambent-apps");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveApps(apps) {
  try { localStorage.setItem("lambent-apps", JSON.stringify(apps)); } catch {}
}
function loadSiteContent() {
  try {
    const raw = localStorage.getItem("lambent-content");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveSiteContent(content) {
  try { localStorage.setItem("lambent-content", JSON.stringify(content)); } catch {}
}

// ─── Default data ──────────────────────────────────────────────────────────────
const DEFAULT_APPS = [
  {
    id: 1,
    title: "Field Inspection Manager",
    description: "A Mendix-powered mobile app for real-time field inspections, photo capture, and automated reporting workflows.",
    tags: ["Mendix", "Mobile", "Workflow"],
    status: "Live",
    color: "#1558CB",
    link: "#",
    icon: "🔍",
  },
  {
    id: 2,
    title: "Asset Tracker Pro",
    description: "Enterprise asset management platform built on Mendix with barcode scanning, GPS tracking, and lifecycle analytics.",
    tags: ["Mendix", "Enterprise", "Analytics"],
    status: "Live",
    color: "#15CB88",
    link: "#",
    icon: "📦",
  },
  {
    id: 3,
    title: "Client Portal",
    description: "Secure self-service portal for clients to submit requests, track project status, and access documentation.",
    tags: ["Mendix", "Portal", "TypeScript"],
    status: "Beta",
    color: "#588FEE",
    link: "#",
    icon: "🔐",
  },
];

const DEFAULT_CONTENT = {
  heroTagline: "We build software that actually works.",
  heroSub: "Mendix-native applications crafted for real businesses, real workflows, and real results.",
  aboutText: "Lambent Labs was founded by Marc Lehane and Jon Lamb — two developers who got tired of watching good ideas die in bad software. We specialize in low-code and custom application development on the Mendix platform, with deep expertise in Java, TypeScript, and React.",
  marcBio: "Full-stack Mendix developer with a passion for clean architecture and user-centric design.",
  jonBio: "Platform architect and integration specialist. If it has an API, Jon has connected it to something.",
  contactEmail: "hello@lambentlabs.dev",
};

const ADMIN_PASSWORD = "lambent2024";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
function Field({ label, value, onChange, textarea, type = "text" }) {
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
        ? <textarea value={value} onChange={e => onChange(e.target.value)} style={style} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  );
}

// ─── Save Button ───────────────────────────────────────────────────────────────
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

// ─── App Card ──────────────────────────────────────────────────────────────────
function AppCard({ app, isAdmin, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card2)" : "var(--bg-card)",
        border: `1px solid ${hovered ? app.color + "66" : "var(--border)"}`,
        borderRadius: "16px", padding: "28px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 40px ${app.color}22` : "none",
        position: "relative",
      }}
    >
      {/* Status badge */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <span style={{
          fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em",
          padding: "3px 10px", borderRadius: "20px",
          background: app.status === "Live" ? "rgba(10,44,101,0.8)" : "rgba(7,28,77,0.8)",
          color: app.status === "Live" ? "var(--accent)" : "var(--primary-llt)",
          border: `1px solid ${app.status === "Live" ? "rgba(21,203,136,0.3)" : "rgba(88,143,238,0.3)"}`,
          textTransform: "uppercase",
        }}>{app.status}</span>
      </div>

      {/* Icon */}
      <div style={{
        fontSize: "2.2rem", marginBottom: "16px",
        background: app.color + "18", borderRadius: "12px",
        width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center",
      }}>{app.icon}</div>

      <h3 style={{ margin: "0 0 10px 0", color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>
        {app.title}
      </h3>
      <p style={{ margin: "0 0 18px 0", color: "var(--text-mid)", fontSize: "0.875rem", lineHeight: 1.6 }}>
        {app.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: (isAdmin || (app.link && app.link !== "#")) ? "16px" : 0 }}>
        {app.tags.map(tag => (
          <span key={tag} style={{
            fontSize: "0.72rem", padding: "3px 10px", borderRadius: "20px",
            background: app.color + "18", color: app.color,
            fontWeight: 500, letterSpacing: "0.04em",
          }}>{tag}</span>
        ))}
      </div>

      {/* View link */}
      {app.link && app.link !== "#" && (
        <a href={app.link} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          color: app.color, fontSize: "0.82rem", fontWeight: 500,
        }}>
          View App →
        </a>
      )}

      {/* Admin controls */}
      {isAdmin && (
        <div style={{ display: "flex", gap: "8px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <button onClick={() => onEdit(app)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "var(--bg-card2)", border: "1px solid var(--border-mid)",
            color: "var(--text-mid)", borderRadius: "8px", padding: "6px 12px",
            cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif",
          }}>
            <PencilIcon /> Edit
          </button>
          <button onClick={() => onDelete(app.id)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(4,17,40,0.8)", border: "1px solid rgba(127,29,29,0.8)",
            color: "#F87171", borderRadius: "8px", padding: "6px 12px",
            cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif",
          }}>
            <TrashIcon /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [apps, setApps] = useState(() => loadApps() || DEFAULT_APPS);
  const [content, setContent] = useState(() => loadSiteContent() || DEFAULT_CONTENT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showAppEditor, setShowAppEditor] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  // Secret admin trigger: click logo 5x rapidly
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

  const handleSaveApp = (app) => {
    const tags = typeof app.tags === "string"
      ? app.tags.split(",").map(t => t.trim()).filter(Boolean)
      : app.tags;
    const updated = app.id
      ? apps.map(a => a.id === app.id ? { ...app, tags } : a)
      : [...apps, { ...app, tags, id: Date.now() }];
    setApps(updated);
    saveApps(updated);
    setShowAppEditor(false);
    setEditingApp(null);
  };

  const handleDeleteApp = (id) => {
    if (!window.confirm("Delete this app?")) return;
    const updated = apps.filter(a => a.id !== id);
    setApps(updated);
    saveApps(updated);
  };

  const handleSaveContent = (c) => {
    setContent(c);
    saveSiteContent(c);
    setShowContentEditor(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
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
            ✦ ADMIN MODE ACTIVE
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => { setEditingContent({ ...content }); setShowContentEditor(true); }} style={{
              background: "rgba(10,44,101,0.5)", border: "1px solid rgba(21,203,136,0.27)",
              color: "var(--accent)", borderRadius: "8px", padding: "4px 14px",
              fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Edit Site Content</button>
            <button onClick={() => {
              setEditingApp({ title: "", description: "", tags: "", status: "Live", color: "#1558CB", link: "", icon: "🚀" });
              setShowAppEditor(true);
            }} style={{
              background: "rgba(10,44,101,0.5)", border: "1px solid rgba(21,203,136,0.27)",
              color: "var(--accent)", borderRadius: "8px", padding: "4px 14px",
              fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>+ Add App</button>
            <button onClick={() => setIsAdmin(false)} style={{
              background: "none", border: "1px solid var(--border)", color: "var(--text-mid)",
              borderRadius: "8px", padding: "4px 14px", fontSize: "0.78rem", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>Exit Admin</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 400,
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
            Lambent<span style={{ color: "var(--primary-lt)" }}>Labs</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["home", "apps", "about", "contact"].map(s => (
            <a key={s} href={`#${s}`} onClick={() => setActiveSection(s)} style={{
              color: activeSection === s ? "var(--primary-lt)" : "var(--text-mid)",
              fontWeight: 500, fontSize: "0.88rem", letterSpacing: "0.04em",
              textTransform: "capitalize", transition: "color 0.2s",
            }}>{s}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section id="home" style={{ position: "relative", overflow: "hidden", padding: "100px 40px 80px" }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(21,88,203,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,88,203,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
        {/* Glow blobs */}
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
            MENDIX · TYPESCRIPT · REACT · JAVA
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
            maxWidth: "600px", margin: "0 auto 48px", lineHeight: 1.7,
          }}>
            {content.heroSub}
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#apps" style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "white", padding: "14px 32px", borderRadius: "12px",
              fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.02em",
              boxShadow: "0 4px 20px rgba(21,88,203,0.35)",
            }}>View Our Apps</a>
            <a href="#about" style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text-mid)", padding: "14px 32px", borderRadius: "12px",
              fontWeight: 500, fontSize: "0.95rem",
            }}>About Us</a>
          </div>
        </div>
      </section>

      {/* ── APPS ──────────────────────────────────────────────────────────────── */}
      <section id="apps" style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{
            color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
          }}>What We've Built</p>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--text-hi)",
            margin: 0, letterSpacing: "-0.02em",
          }}>Live Applications</h2>
        </div>

        {apps.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-lo)", padding: "80px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🚀</div>
            <p>{isAdmin ? 'Click "+ Add App" to get started.' : "Coming soon."}</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}>
            {apps.map(app => (
              <AppCard key={app.id} app={app} isAdmin={isAdmin}
                onEdit={a => {
                  setEditingApp({ ...a, tags: Array.isArray(a.tags) ? a.tags.join(", ") : a.tags });
                  setShowAppEditor(true);
                }}
                onDelete={handleDeleteApp}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────────── */}
      <section id="about" style={{
        padding: "80px 40px",
        background: "var(--bg-dark)",
        borderTop: "1px solid rgba(12,52,121,0.2)",
        borderBottom: "1px solid rgba(12,52,121,0.2)",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{
              color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
            }}>Who We Are</p>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--text-hi)",
              margin: "0 0 24px", letterSpacing: "-0.02em",
            }}>The Team</h2>
            <p style={{ color: "var(--text-mid)", maxWidth: "620px", margin: "0 auto", lineHeight: 1.8, fontSize: "0.95rem" }}>
              {content.aboutText}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {[
              { name: "Marc Lehane", initial: "M", bio: content.marcBio, color: "#1558CB" },
              { name: "Jon Lamb",    initial: "J", bio: content.jonBio,  color: "#15CB88" },
            ].map(({ name, initial, bio, color }) => (
              <div key={name} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "32px",
                display: "flex", gap: "20px", alignItems: "flex-start",
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "14px", flexShrink: 0,
                  background: color + "28",
                  border: `1px solid ${color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.4rem", color,
                }}>{initial}</div>
                <div>
                  <h3 style={{
                    margin: "0 0 8px", fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600, color: "var(--text-hi)", fontSize: "1.05rem",
                  }}>{name}</h3>
                  <p style={{ margin: 0, color: "var(--text-mid)", fontSize: "0.875rem", lineHeight: 1.7 }}>{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            color: "var(--primary-lt)", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
          }}>Get In Touch</p>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "var(--text-hi)",
            margin: "0 0 20px", letterSpacing: "-0.02em",
          }}>Let's build something great.</h2>
          <p style={{ color: "var(--text-mid)", marginBottom: "36px", lineHeight: 1.7 }}>
            Have a project in mind? We'd love to hear about it.
          </p>
          <a href={`mailto:${content.contactEmail}`} style={{
            display: "inline-block",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "white", padding: "16px 40px", borderRadius: "12px",
            fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.02em",
            boxShadow: "0 4px 20px rgba(21,88,203,0.35)",
          }}>
            {content.contactEmail}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(12,52,121,0.2)",
        padding: "24px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "var(--text-lo)", fontSize: "0.8rem",
        flexWrap: "wrap", gap: "8px",
      }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: "var(--primary-lt)" }}>◈ Lambent Labs</span>
        <span>© {new Date().getFullYear()} Marc Lehane & Jon Lamb · All rights reserved</span>
        <span style={{ fontSize: "0.72rem", opacity: 0.5 }}>Built on Mendix · TypeScript · React</span>
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

      {showAppEditor && editingApp && (
        <Modal title={editingApp.id ? "Edit App" : "Add New App"} onClose={() => { setShowAppEditor(false); setEditingApp(null); }}>
          <Field label="App Title" value={editingApp.title} onChange={v => setEditingApp(a => ({ ...a, title: v }))} />
          <Field label="Description" value={editingApp.description} onChange={v => setEditingApp(a => ({ ...a, description: v }))} textarea />
          <Field label="Tags (comma-separated)" value={typeof editingApp.tags === "string" ? editingApp.tags : editingApp.tags.join(", ")} onChange={v => setEditingApp(a => ({ ...a, tags: v }))} />
          <Field label="Status (Live / Beta / Development)" value={editingApp.status} onChange={v => setEditingApp(a => ({ ...a, status: v }))} />
          <Field label="Accent Color (hex)" value={editingApp.color} onChange={v => setEditingApp(a => ({ ...a, color: v }))} />
          <Field label="Icon (emoji)" value={editingApp.icon} onChange={v => setEditingApp(a => ({ ...a, icon: v }))} />
          <Field label="App URL (optional)" value={editingApp.link} onChange={v => setEditingApp(a => ({ ...a, link: v }))} />
          <SaveBtn onClick={() => handleSaveApp(editingApp)}>Save App</SaveBtn>
        </Modal>
      )}

      {showContentEditor && editingContent && (
        <Modal title="Edit Site Content" onClose={() => setShowContentEditor(false)}>
          <Field label="Hero Tagline" value={editingContent.heroTagline} onChange={v => setEditingContent(c => ({ ...c, heroTagline: v }))} />
          <Field label="Hero Subtitle" value={editingContent.heroSub} onChange={v => setEditingContent(c => ({ ...c, heroSub: v }))} textarea />
          <Field label="About Paragraph" value={editingContent.aboutText} onChange={v => setEditingContent(c => ({ ...c, aboutText: v }))} textarea />
          <Field label="Marc's Bio" value={editingContent.marcBio} onChange={v => setEditingContent(c => ({ ...c, marcBio: v }))} textarea />
          <Field label="Jon's Bio" value={editingContent.jonBio} onChange={v => setEditingContent(c => ({ ...c, jonBio: v }))} textarea />
          <Field label="Contact Email" value={editingContent.contactEmail} onChange={v => setEditingContent(c => ({ ...c, contactEmail: v }))} />
          <SaveBtn onClick={() => handleSaveContent(editingContent)}>Save Content</SaveBtn>
        </Modal>
      )}
    </div>
  );
}
