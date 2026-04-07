import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/#services" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/#contact" },
];

const footerServices = [
  "Web Applications",
  "API Development",
  "Cloud Infrastructure",
  "AI Integration",
  "Technical Consulting",
];

function NavLink({ to, label, current }) {
  const isActive =
    current === to || (to === "/" && current === "/");
  const isHash = to.startsWith("/#");

  const style = {
    color: isActive ? "var(--accent)" : "var(--text-mid)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "color 0.2s",
    letterSpacing: "0.01em",
  };

  if (isHash) {
    return (
      <a href={to} style={style}>
        {label}
      </a>
    );
  }

  return (
    <Link to={to} style={style}>
      {label}
    </Link>
  );
}

function Logo({ size = "default" }) {
  const isSmall = size === "small";
  return (
    <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: isSmall ? 30 : 34,
          height: isSmall ? 30 : 34,
          borderRadius: 8,
          background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
          fontSize: isSmall ? "1rem" : "1.15rem",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        ◈
      </span>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: isSmall ? "1rem" : "1.15rem",
          color: "var(--text-hi)",
          letterSpacing: "-0.02em",
        }}
      >
        doITbetter<span style={{ color: "var(--accent)" }}> labs</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-deep)",
        color: "var(--text-hi)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ─── Nav ─── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: 64,
          background: "rgba(2,8,20,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1rem, 4vw, 3rem)",
        }}
      >
        <Logo />

        {/* Desktop */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              label={link.label}
              current={currentPath}
            />
          ))}
          <a
            href="/#contact"
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              textDecoration: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Free Consultation
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-hamburger" onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: "none", border: "none", cursor: "pointer", padding: "8px",
          display: "none", flexDirection: "column", gap: "5px",
        }}>
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-mid)",
            transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-mid)",
            transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-mid)",
            transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, bottom: 0,
          background: "rgba(2,8,20,0.97)", backdropFilter: "blur(12px)",
          zIndex: 999, padding: "24px 24px",
          display: "flex", flexDirection: "column", gap: "8px",
        }}>
          {navLinks.map((link) => (
            link.to.startsWith("/#") ? (
              <a key={link.to} href={link.to} onClick={() => setMobileOpen(false)} style={{
                color: "var(--text-mid)", fontWeight: 600, fontSize: "1.1rem",
                padding: "12px 0", borderBottom: "1px solid var(--border)", textDecoration: "none",
              }}>{link.label}</a>
            ) : (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{
                color: "var(--text-mid)", fontWeight: 600, fontSize: "1.1rem",
                padding: "12px 0", borderBottom: "1px solid var(--border)", textDecoration: "none",
              }}>{link.label}</Link>
            )
          ))}
          <a href="/#contact" onClick={() => setMobileOpen(false)} style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "white", padding: "14px 24px", borderRadius: "10px",
            fontWeight: 600, fontSize: "1rem", textAlign: "center", textDecoration: "none",
            marginTop: "16px",
          }}>Free Consultation</a>
        </div>
      )}

      {/* ─── Page Content ─── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer
        style={{
          background: "var(--bg-dark)",
          borderTop: "1px solid var(--border)",
          padding: "3rem clamp(1rem, 4vw, 3rem) 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Col 1 — Brand */}
          <div>
            <Logo size="small" />
            <p
              style={{
                color: "var(--text-mid)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                marginTop: 14,
                maxWidth: 340,
              }}
            >
              Custom software that moves the needle. We design, build, and scale
              digital products for startups and growing businesses.
            </p>
          </div>

          {/* Col 2 — Services */}
          <div>
            <h4
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "var(--text-hi)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {footerServices.map((s) => (
                <li
                  key={s}
                  style={{
                    color: "var(--text-mid)",
                    fontSize: "0.85rem",
                    marginBottom: 8,
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "var(--text-hi)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              Contact
            </h4>
            <a
              href="mailto:lambentlabs247@gmail.com"
              style={{
                color: "var(--accent)",
                textDecoration: "none",
                fontSize: "0.85rem",
              }}
            >
              lambentlabs247@gmail.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.25rem",
            textAlign: "center",
            color: "var(--text-lo)",
            fontSize: "0.78rem",
          }}
        >
          &copy; {new Date().getFullYear()} doITbetter labs. All rights reserved.
          {" | "}
          <Link to="/privacy" style={{ color: "var(--text-lo)", textDecoration: "underline" }}>
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
