import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RB2B_KEY = "0OV0VHY03W6Z";

function loadRB2B() {
  if (window.reb2b?.loaded) return;
  window.reb2b = { loaded: true };
  const s = document.createElement("script");
  s.async = true;
  s.src =
    "https://ddwl4m2hdecbv.cloudfront.net/b/" +
    RB2B_KEY +
    "/" +
    RB2B_KEY +
    ".js.gz";
  document.getElementsByTagName("script")[0].parentNode.insertBefore(
    s,
    document.getElementsByTagName("script")[0]
  );
}

function getCookieConsent() {
  try {
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith("cookie_consent="))
      ?.split("=")[1];
  } catch {
    return null;
  }
}

function setCookieConsent(value) {
  const maxAge = 365 * 24 * 60 * 60; // 1 year
  document.cookie = `cookie_consent=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === "accepted") {
      loadRB2B();
    } else if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    // consent === "declined" → do nothing
  }, []);

  function handleAccept() {
    setCookieConsent("accepted");
    setVisible(false);
    loadRB2B();
  }

  function handleDecline() {
    setCookieConsent("declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        background: "var(--bg-card, #0a1628)",
        borderTop: "1px solid var(--border, #1a2a44)",
        padding: "1rem 1.5rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.88rem",
          color: "var(--text-mid, #8aabe5)",
          margin: 0,
          maxWidth: 600,
          lineHeight: 1.5,
        }}
      >
        We use cookies and similar technologies to improve your experience and
        identify potential business visitors.{" "}
        <Link
          to="/privacy"
          style={{ color: "var(--accent, #2a70e9)", textDecoration: "underline" }}
        >
          Privacy Policy
        </Link>
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            border: "1px solid var(--border, #1a2a44)",
            background: "transparent",
            color: "var(--text-mid, #8aabe5)",
            cursor: "pointer",
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            border: "none",
            background: "var(--accent, #2a70e9)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
