import { useEffect } from "react";
import { Link } from "react-router-dom";

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-deep)",
    padding: "120px 24px 80px",
  },
  article: {
    maxWidth: 720,
    margin: "0 auto",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--primary-llt)",
    marginBottom: 40,
    fontFamily: "'Outfit', sans-serif",
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "clamp(2rem, 5vw, 2.8rem)",
    fontWeight: 700,
    color: "var(--text-hi)",
    lineHeight: 1.2,
    marginBottom: 16,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: "0.85rem",
    color: "var(--text-lo)",
    marginBottom: 40,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "var(--text-lo)",
  },
  body: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    lineHeight: 1.8,
    color: "var(--text-mid)",
  },
  h2: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "1.55rem",
    fontWeight: 600,
    color: "var(--text-hi)",
    margin: "48px 0 16px",
  },
  h3: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "var(--text-hi)",
    margin: "32px 0 12px",
  },
  p: {
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "24px 0 32px",
    fontSize: "0.9rem",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    background: "var(--bg-card2)",
    color: "var(--text-hi)",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    borderBottom: "2px solid var(--border-mid)",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid var(--border)",
    color: "var(--text-mid)",
  },
  highlight: {
    color: "var(--accent)",
    fontWeight: 600,
  },
  cta: {
    marginTop: 56,
    padding: 32,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    textAlign: "center",
  },
  ctaTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "1.35rem",
    fontWeight: 600,
    color: "var(--text-hi)",
    marginBottom: 12,
  },
  ctaText: {
    color: "var(--text-mid)",
    marginBottom: 20,
    fontSize: "1rem",
  },
  ctaBtn: {
    display: "inline-block",
    padding: "12px 28px",
    background: "var(--accent)",
    color: "#fff",
    borderRadius: 8,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "opacity 0.2s",
  },
};

export default function CustomSoftwareCost() {
  useEffect(() => {
    document.title =
      "How Much Does Custom Software Actually Cost? | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "The real cost of custom software development for small and mid-size businesses. Honest pricing ranges, what drives cost, and why it's more affordable than you think."
      );
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={s.page}>
      <div style={s.article}>
        <Link to="/blog" style={s.back}>
          &larr; Back to Blog
        </Link>

        <h1 style={s.title}>How Much Does Custom Software Actually Cost?</h1>

        <div style={s.meta}>
          <span>Apr 2026</span>
          <span style={s.dot} />
          <span>5 min read</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            If you've ever Googled "custom software cost," you've probably seen
            numbers that range from $10,000 to $500,000+. That's not helpful.
            The truth is that for most small and mid-size businesses, custom
            software is far more affordable than those enterprise-focused
            estimates suggest — especially with the tooling available in 2026.
          </p>

          <h2 style={s.h2}>The Real Range for Small & Mid-Size Projects</h2>
          <p style={s.p}>
            For the kinds of projects most growing businesses actually need —
            internal dashboards, client portals, workflow automation tools, CRM
            integrations — you're typically looking at{" "}
            <span style={s.highlight}>$2,000 to $15,000</span>. That's the
            realistic range when you work with a modern, efficient agency that
            leverages current tooling.
          </p>
          <p style={s.p}>
            Enterprise consulting firms quote $50,000 to $500,000+ for the same
            scope because their overhead is massive: layers of project managers,
            lengthy discovery phases, and billing models designed for Fortune 500
            budgets. You're paying for their office space and org chart, not
            better code.
          </p>

          <h2 style={s.h2}>What Drives the Cost</h2>
          <p style={s.p}>
            Not all projects are equal. Here are the factors that move the needle
            on pricing:
          </p>
          <p style={s.p}>
            <strong style={{ color: "var(--text-hi)" }}>Complexity.</strong> A
            single-purpose internal tool is simpler (and cheaper) than a
            multi-role platform with complex business logic. The number of
            distinct user types, permission levels, and workflows directly
            affects scope.
          </p>
          <p style={s.p}>
            <strong style={{ color: "var(--text-hi)" }}>Integrations.</strong>{" "}
            Connecting to one API is straightforward. Syncing data between five
            different systems with different formats and authentication methods
            takes more work. Each integration adds time.
          </p>
          <p style={s.p}>
            <strong style={{ color: "var(--text-hi)" }}>
              Data migration.
            </strong>{" "}
            If you're moving off spreadsheets or an existing system, cleaning and
            importing historical data adds a layer of effort. The messier the
            existing data, the more time it takes.
          </p>
          <p style={s.p}>
            <strong style={{ color: "var(--text-hi)" }}>Design polish.</strong>{" "}
            A functional tool with clean, minimal design costs less than a
            consumer-facing product with custom animations and pixel-perfect
            branding across every screen.
          </p>

          <h2 style={s.h2}>
            Why Modern Tooling Has Dropped Prices Dramatically
          </h2>
          <p style={s.p}>
            Five years ago, building a custom web app meant writing everything
            from scratch — authentication, database management, deployment
            infrastructure, email sending, file storage. Each of those was a
            mini-project on its own.
          </p>
          <p style={s.p}>
            Today, platforms like Supabase, Vercel, and modern component
            libraries handle most of the infrastructure. AI-assisted development
            workflows let skilled developers move 3-5x faster on routine code.
            The result: what used to take a team of five three months can now be
            built by a small team in two to four weeks.
          </p>
          <p style={s.p}>
            That efficiency translates directly to lower costs for you.
          </p>

          <h2 style={s.h2}>
            Comparison: Freelancer vs Agency vs Enterprise Firm
          </h2>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Factor</th>
                <th style={s.th}>Freelancer</th>
                <th style={s.th}>Small Agency</th>
                <th style={s.th}>Enterprise Firm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={s.td}>Typical Cost</td>
                <td style={s.td}>$1K — $8K</td>
                <td style={s.td}>$2K — $15K</td>
                <td style={s.td}>$50K — $500K+</td>
              </tr>
              <tr>
                <td style={s.td}>Timeline</td>
                <td style={s.td}>2 — 8 weeks</td>
                <td style={s.td}>2 — 6 weeks</td>
                <td style={s.td}>3 — 12 months</td>
              </tr>
              <tr>
                <td style={s.td}>Communication</td>
                <td style={s.td}>Direct</td>
                <td style={s.td}>Direct</td>
                <td style={s.td}>Through PMs</td>
              </tr>
              <tr>
                <td style={s.td}>Ongoing Support</td>
                <td style={s.td}>Variable</td>
                <td style={s.td}>Reliable</td>
                <td style={s.td}>Expensive retainer</td>
              </tr>
              <tr>
                <td style={s.td}>Risk Level</td>
                <td style={s.td}>Higher</td>
                <td style={s.td}>Low</td>
                <td style={s.td}>Low (but costly)</td>
              </tr>
            </tbody>
          </table>

          <h2 style={s.h2}>
            The Hidden Cost of <em>Not</em> Building
          </h2>
          <p style={s.p}>
            Before you dismiss custom software as an expense, consider what
            you're already spending by not having it:
          </p>
          <p style={s.p}>
            <strong style={{ color: "var(--text-hi)" }}>
              Manual processes.
            </strong>{" "}
            If someone on your team spends 10 hours a week on data entry,
            copy-pasting between systems, or generating reports by hand, that's
            $15,000 — $25,000 per year in labor costs alone.
          </p>
          <p style={s.p}>
            <strong style={{ color: "var(--text-hi)" }}>Errors.</strong> Manual
            work creates mistakes. A single pricing error, missed order, or
            incorrect report can cost thousands — or damage customer trust.
          </p>
          <p style={s.p}>
            <strong style={{ color: "var(--text-hi)" }}>
              Opportunity cost.
            </strong>{" "}
            Your team is spending time on work a machine should do. That's time
            they could spend on growth, customer relationships, or strategy.
          </p>
          <p style={s.p}>
            When you frame custom software as an investment that pays for itself
            in months — not years — the math gets very clear very fast.
          </p>

          {/* Further Reading */}
          <h2 style={s.h2}>Further Reading</h2>
          <p style={s.p}>
            Want to dig deeper into software pricing? These resources offer additional perspectives:
          </p>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.goodfirms.co/resources/custom-software-development-cost-survey" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Custom Software Development Cost Survey 2026
              </a>{" "}
              — GoodFirms' data-driven breakdown of what startups and SMEs are actually paying.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://clutch.co/developers/pricing" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Software Development Company Pricing Guide
              </a>{" "}
              — Clutch's comprehensive pricing survey across hundreds of development firms.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://keyholesoftware.com/cost-custom-software-development/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Custom Software Development Cost: 2026 Pricing & Timeline Benchmarks
              </a>{" "}
              — Keyhole Software's guide to realistic timelines and budgets.
            </li>
          </ul>

          {/* Related on Our Blog */}
          <div style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 40,
            marginTop: 40,
          }}>
            <h3 style={{ ...s.h2, fontSize: "1.3rem", marginTop: 0 }}>Related on Our Blog</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Link to="/blog/build-vs-buy" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                Build vs Buy: When Off-the-Shelf Software Isn't Enough
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  How to decide whether buying or building is the right investment for your business.
                </span>
              </Link>
              <Link to="/blog/ai-accelerated-development" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                Why AI-Accelerated Development Changes Everything
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  How modern tooling is making custom software faster and cheaper than ever.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Want a quote for your project?</h3>
            <p style={s.ctaText}>
              Tell us what you're trying to build. We'll give you an honest
              estimate — no 40-page proposals, no surprise invoices.
            </p>
            <Link to="/#contact" style={s.ctaBtn}>
              Get a Free Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
