import { useState } from "react";
import { sendLeadNotification } from "../leadNotify.js";
import { trackFormSubmit } from "../tracker.js";

const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

export default function BlogLeadCapture({ source }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    trackFormSubmit("blog_lead_capture");
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
          name: "Blog Reader",
          email,
          message: `[Blog Lead Capture] Source: ${source || "unknown"}`,
        }),
      });

      if (res.ok) {
        setStatus("success");
        sendLeadNotification("Blog Reader", email, `Blog lead from: ${source}`, `Blog — ${source}`);
        setEmail("");
        if (window.dataLayer) {
          window.dataLayer.push({ event: "form_submit", form_name: "blog_lead_capture" });
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
    <div style={{
      margin: "48px 0",
      padding: "28px 32px",
      background: "linear-gradient(135deg, rgba(21,88,203,0.08) 0%, rgba(21,203,136,0.06) 100%)",
      border: "1px solid rgba(21,88,203,0.2)",
      borderRadius: 14,
    }}>
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 600,
        fontSize: "1.1rem",
        color: "var(--text-hi)",
        marginBottom: 8,
      }}>
        Want to explore what this means for your business?
      </p>
      <p style={{
        fontSize: "0.9rem",
        color: "var(--text-mid)",
        marginBottom: 16,
        lineHeight: 1.6,
      }}>
        Drop your email and we'll send you a free breakdown of how AI-accelerated development could apply to your specific situation. No spam, no sales pitch — just useful information.
      </p>
      {status === "success" ? (
        <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>
          Got it — we'll be in touch shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: "1 1 240px",
              padding: "10px 16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              borderRadius: 8,
              color: "var(--text-hi)",
              fontSize: "0.9rem",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {submitting ? "Sending..." : "Send Me the Breakdown"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p style={{ color: "#F87171", fontSize: "0.82rem", marginTop: 8 }}>
          Something went wrong. Try again or email us directly.
        </p>
      )}
    </div>
  );
}
