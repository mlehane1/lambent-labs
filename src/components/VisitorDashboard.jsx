import { useState, useEffect } from "react";

const SUPABASE_URL = "https://ltkapmacmylwfhufuozq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2FwbWFjbXlsd2ZodWZ1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU4OTcsImV4cCI6MjA5MDcxMTg5N30.uNtnYOBwPcIOkX0Yba2U6EJyywbL-lhjRa4sEJ8tj1c";

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

async function sbGet(table, params = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers });
  if (!res.ok) return [];
  return res.json();
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function VisitorDashboard({ onClose }) {
  const [visitors, setVisitors] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [tab, setTab] = useState("recent"); // recent | journey | stats
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sbGet("visitors", "order=created_at.desc&limit=100"),
      sbGet("visitor_events", "order=created_at.desc&limit=500"),
    ]).then(([v, e]) => {
      setVisitors(v);
      setEvents(e);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setSessionEvents(
        events
          .filter((e) => e.session_id === selectedSession)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      );
    }
  }, [selectedSession, events]);

  // Compute stats
  const topPages = events
    .filter((e) => e.event_type === "page_view")
    .reduce((acc, e) => {
      acc[e.page_path] = (acc[e.page_path] || 0) + 1;
      return acc;
    }, {});
  const topPagesSorted = Object.entries(topPages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topReferrers = visitors.reduce((acc, v) => {
    const ref = v.referrer || "(direct)";
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {});
  const topReferrersSorted = Object.entries(topReferrers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topCompanies = visitors
    .filter((v) => v.company)
    .reduce((acc, v) => {
      acc[v.company] = (acc[v.company] || 0) + 1;
      return acc;
    }, {});
  const topCompaniesSorted = Object.entries(topCompanies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const cellStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid var(--border)",
    fontSize: "0.78rem",
    color: "var(--text-mid)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  };

  const thStyle = {
    ...cellStyle,
    color: "var(--text-lo)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontSize: "0.7rem",
    position: "sticky",
    top: 0,
    background: "var(--bg-dark)",
  };

  const tabBtn = (name, label) => (
    <button
      onClick={() => setTab(name)}
      style={{
        background: tab === name ? "rgba(21,88,203,0.2)" : "none",
        border: tab === name ? "1px solid rgba(21,88,203,0.4)" : "1px solid var(--border)",
        color: tab === name ? "var(--primary-lt)" : "var(--text-mid)",
        borderRadius: "8px",
        padding: "6px 16px",
        fontSize: "0.8rem",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "var(--bg-dark)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "1000px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h3
              style={{
                margin: 0,
                color: "var(--text-hi)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.1rem",
              }}
            >
              Visitor Intelligence
            </h3>
            <span
              style={{
                background: "rgba(21,203,136,0.15)",
                color: "var(--accent)",
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              {visitors.length} visitors
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-lo)",
              cursor: "pointer",
              padding: "4px",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: "12px 24px", display: "flex", gap: "8px" }}>
          {tabBtn("recent", "Recent Visitors")}
          {tabBtn("journey", "Session Journey")}
          {tabBtn("stats", "Top Stats")}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px 24px" }}>
          {loading ? (
            <p style={{ color: "var(--text-lo)", textAlign: "center", padding: "40px" }}>
              Loading visitor data...
            </p>
          ) : tab === "recent" ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Time</th>
                    <th style={thStyle}>Company / ISP</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>First Page</th>
                    <th style={thStyle}>Referrer</th>
                    <th style={thStyle}>UTM Source</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr
                      key={v.id}
                      onClick={() => {
                        setSelectedSession(v.session_id);
                        setTab("journey");
                      }}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(21,88,203,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={cellStyle}>{timeAgo(v.created_at)}</td>
                      <td style={{ ...cellStyle, color: v.company ? "var(--accent)" : "var(--text-lo)" }}>
                        {v.company || v.isp || "—"}
                      </td>
                      <td style={cellStyle}>
                        {[v.city, v.region, v.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td style={cellStyle}>{v.first_page || "/"}</td>
                      <td style={{ ...cellStyle, maxWidth: "180px" }}>
                        {v.referrer
                          ? new URL(v.referrer).hostname.replace("www.", "")
                          : "(direct)"}
                      </td>
                      <td style={cellStyle}>{v.utm_source || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visitors.length === 0 && (
                <p style={{ color: "var(--text-lo)", textAlign: "center", padding: "40px" }}>
                  No visitors yet. Data will appear once the tracking tables are created in Supabase.
                </p>
              )}
            </div>
          ) : tab === "journey" ? (
            <div>
              {selectedSession ? (
                <>
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: "var(--text-mid)", fontSize: "0.82rem", margin: 0 }}>
                      Session: <code style={{ color: "var(--primary-lt)" }}>{selectedSession.slice(0, 8)}...</code>
                      {" — "}{sessionEvents.length} events
                    </p>
                    <button
                      onClick={() => setSelectedSession(null)}
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        color: "var(--text-mid)",
                        borderRadius: "6px",
                        padding: "4px 12px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {sessionEvents.map((e, i) => (
                      <div
                        key={e.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px 12px",
                          background: "var(--bg-card)",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <span
                          style={{
                            width: "20px",
                            textAlign: "center",
                            color: "var(--text-lo)",
                            fontSize: "0.7rem",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          style={{
                            background: eventColor(e.event_type),
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            minWidth: "80px",
                            textAlign: "center",
                          }}
                        >
                          {e.event_type}
                        </span>
                        <span style={{ color: "var(--text-mid)", fontSize: "0.78rem", flex: 1 }}>
                          {e.page_path}
                          {e.event_data?.cta && ` → ${e.event_data.cta}`}
                          {e.event_data?.form && ` → ${e.event_data.form}`}
                          {e.event_data?.depth && ` → ${e.event_data.depth}%`}
                        </span>
                        <span style={{ color: "var(--text-lo)", fontSize: "0.7rem" }}>
                          {new Date(e.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: "var(--text-lo)", textAlign: "center", padding: "40px" }}>
                  Click a visitor in the "Recent Visitors" tab to see their journey.
                </p>
              )}
            </div>
          ) : (
            /* Stats tab */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
              <StatList title="Top Pages" items={topPagesSorted} />
              <StatList title="Top Referrers" items={topReferrersSorted} />
              <StatList title="Top Companies" items={topCompaniesSorted} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function eventColor(type) {
  switch (type) {
    case "page_view": return "#1558CB";
    case "cta_click": return "#15CB88";
    case "form_submit": return "#CB1558";
    case "form_start": return "#E9812A";
    case "scroll_depth": return "#8B5CF6";
    default: return "#555";
  }
}

function StatList({ title, items }) {
  return (
    <div>
      <h4
        style={{
          color: "var(--text-hi)",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.9rem",
          marginBottom: "12px",
        }}
      >
        {title}
      </h4>
      {items.length === 0 ? (
        <p style={{ color: "var(--text-lo)", fontSize: "0.78rem" }}>No data yet</p>
      ) : (
        items.map(([label, count]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                color: "var(--text-mid)",
                fontSize: "0.78rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "180px",
              }}
            >
              {label}
            </span>
            <span style={{ color: "var(--primary-lt)", fontSize: "0.78rem", fontWeight: 600 }}>
              {count}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
