import { useEffect } from "react";
import { Link } from "react-router-dom";

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-deep)",
    padding: "120px 24px 80px",
  },
  article: { maxWidth: 720, margin: "0 auto" },
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
  p: { marginBottom: 20 },
  highlight: { color: "var(--accent)", fontWeight: 600 },
  strong: { color: "var(--text-hi)" },
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
  ctaText: { color: "var(--text-mid)", marginBottom: 20, fontSize: "1rem" },
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

export default function SaaSBillGrowing() {
  useEffect(() => {
    document.title =
      "Why Your SaaS Bill Will Never Stop Growing | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "SaaS licensing costs compound every year — per-seat pricing, annual hikes, and add-on fees. Here's why custom software is the smarter long-term investment."
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

        <h1 style={s.title}>
          Why Your SaaS Bill Will Never Stop Growing
        </h1>

        <div style={s.meta}>
          <span>Apr 2026</span>
          <span style={s.dot} />
          <span>7 min read</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            When you signed up for that first SaaS tool, the price felt
            reasonable. Maybe $30 per user per month. A rounding error on the
            P&L. But that was three years and four price increases ago. Now
            you're paying for 50 seats across three platforms, half your team
            uses features you don't need, and the bill looks nothing like what
            you budgeted. Here's the thing:{" "}
            <span style={s.highlight}>it's designed to work this way.</span>
          </p>

          <h2 style={s.h2}>The Per-Seat Trap</h2>
          <p style={s.p}>
            Per-seat pricing is the SaaS industry's favorite business model
            because it scales with your success — against you. Every new hire,
            every contractor, every intern who needs access adds another line
            to the invoice. Your business grows. Your SaaS vendor celebrates.
          </p>
          <p style={s.p}>
            Think about what that actually means: you're being penalized for
            growing. The software doesn't cost more to run with 50 users than
            it does with 10. The servers don't care. But the pricing model
            does, because it's optimized for the vendor's revenue, not your
            budget.
          </p>
          <p style={s.p}>
            A mid-size company with 50 employees paying $45 per seat per month
            across a single platform spends{" "}
            <strong style={s.strong}>$27,000 a year</strong>. Add a second
            tool at $25/seat and a third at $15/seat, and you're at{" "}
            <strong style={s.strong}>$51,000 annually</strong> — for software
            you don't own and can't modify.
          </p>

          <h2 style={s.h2}>Annual Price Hikes Are Baked In</h2>
          <p style={s.p}>
            SaaS companies report to investors. Investors expect growth.
            Growth comes from two places: new customers and higher prices from
            existing ones. When the new customer well slows down, guess which
            lever gets pulled.
          </p>
          <p style={s.p}>
            Industry data shows SaaS price increases averaging{" "}
            <strong style={s.strong}>8–15% annually</strong>. That $27,000
            bill becomes $31,000 next year, then $35,000. By year five, you're
            paying nearly double what you started with — for the exact same
            software. No new features you asked for. No improvements to your
            workflow. Just a higher invoice.
          </p>

          <h2 style={s.h2}>The Add-On Tax</h2>
          <p style={s.p}>
            Base pricing is the foot in the door. The real revenue comes from
            add-ons: custom fields, API access, advanced reporting, SSO,
            priority support, additional storage. The features that make the
            tool actually useful for your business are often locked behind
            higher tiers.
          </p>
          <p style={s.p}>
            You start on the "Professional" plan and realize you need one
            feature from the "Enterprise" tier. Suddenly you're paying 3x per
            seat for one checkbox. Sound familiar?
          </p>

          <h2 style={s.h2}>Vendor Lock-In Is the Real Cost</h2>
          <p style={s.p}>
            The longer you use a SaaS platform, the harder it is to leave.
            Your data is structured in their format. Your workflows are built
            around their limitations. Your team is trained on their UI. When
            they raise prices, you absorb it — because the cost of switching
            feels even higher.
          </p>
          <p style={s.p}>
            This is by design. Every integration you build, every report you
            customize, every process you adapt to fit the tool is another
            anchor. SaaS vendors call it "stickiness." You should call it what
            it is: leverage.
          </p>

          <h2 style={s.h2}>The Custom Software Alternative</h2>
          <p style={s.p}>
            Custom software flips the economics. You pay once to build it. You
            own it. There are no per-seat fees, no annual hikes, no add-on
            tiers. A flat monthly maintenance cost covers hosting, updates,
            and support — and that cost stays flat whether you have 5 users or
            500.
          </p>
          <p style={s.p}>
            Here's what the numbers actually look like for a typical mid-size
            company:
          </p>

          {/* Comparison table */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr 1fr",
              gap: 0,
              margin: "32px 0",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            {[
              ["", "SaaS Licensing", "Custom Software"],
              ["Year 1", "$27,000", "$15,000"],
              ["Year 2", "$31,050", "$3,600"],
              ["Year 3", "$35,700", "$3,600"],
              ["Year 4", "$41,055", "$3,600"],
              ["Year 5", "$47,213", "$3,600"],
              ["5-Year Total", "$182,018", "$29,400"],
            ].map((row, ri) => (
              row.map((cell, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  style={{
                    padding: "12px 18px",
                    background: ri === 0
                      ? "var(--bg-card2)"
                      : ri === 6
                        ? "var(--bg-card2)"
                        : "var(--bg-card)",
                    borderBottom: ri < 6 ? "1px solid var(--border)" : "none",
                    borderRight: ci < 2 ? "1px solid var(--border)" : "none",
                    fontFamily: ri === 0 || ri === 6 ? "'Outfit', sans-serif" : "'DM Sans', sans-serif",
                    fontWeight: ri === 0 || ri === 6 || ci === 0 ? 600 : 400,
                    fontSize: ri === 6 ? "1.05rem" : "0.9rem",
                    color: ci === 1 && ri > 0
                      ? "#F87171"
                      : ci === 2 && ri > 0
                        ? "var(--accent)"
                        : "var(--text-hi)",
                  }}
                >
                  {cell}
                </div>
              ))
            ))}
          </div>

          <p style={s.p}>
            That's a{" "}
            <span style={s.highlight}>$152,618 difference over five years</span>.
            And the custom software doesn't get more expensive when you hire
            your next ten employees. The SaaS bill does.
          </p>

          <h2 style={s.h2}>But Custom Software Takes Too Long, Right?</h2>
          <p style={s.p}>
            It used to. Traditional development shops quoted 6–12 month
            timelines with teams of 10+ people. The price tag matched:
            $150K–$500K for a basic business application.
          </p>
          <p style={s.p}>
            That's not how it works anymore. AI-accelerated development has
            collapsed both timelines and costs. What took a 12-person team
            six months now takes a focused 2–3 person team two to four weeks.
            The quality is the same — often better, because smaller teams make
            fewer coordination mistakes.
          </p>
          <p style={s.p}>
            A custom application built to your exact specifications, deployed
            on modern infrastructure, with ongoing maintenance and support —
            for <span style={s.highlight}>$5,000 to $20,000</span>. That's
            not a future promise. That's what we're delivering right now.
          </p>

          <h2 style={s.h2}>When to Make the Switch</h2>
          <p style={s.p}>
            Not every SaaS tool should be replaced. Gmail works fine. Slack
            works fine. The tools where custom makes sense are the ones where:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <li style={{ color: "var(--text-mid)", lineHeight: 1.7 }}>
              <strong style={s.strong}>You're paying per seat</strong> and the
              cost scales with headcount
            </li>
            <li style={{ color: "var(--text-mid)", lineHeight: 1.7 }}>
              <strong style={s.strong}>You use 20% of the features</strong>{" "}
              but pay for 100%
            </li>
            <li style={{ color: "var(--text-mid)", lineHeight: 1.7 }}>
              <strong style={s.strong}>Your workflows don't fit</strong> and
              you've built workarounds on top of workarounds
            </li>
            <li style={{ color: "var(--text-mid)", lineHeight: 1.7 }}>
              <strong style={s.strong}>You're duct-taping 3+ tools together</strong>{" "}
              with Zapier and spreadsheets
            </li>
            <li style={{ color: "var(--text-mid)", lineHeight: 1.7 }}>
              <strong style={s.strong}>The vendor keeps raising prices</strong>{" "}
              and you absorb it because switching feels impossible
            </li>
          </ul>
          <p style={s.p}>
            If two or more of those are true, you're almost certainly spending
            more on SaaS licensing than custom software would cost — and
            getting a worse product in return.
          </p>

          <h2 style={s.h2}>Own Your Tools. Control Your Costs.</h2>
          <p style={s.p}>
            The SaaS model works great for vendors. It works less great for
            the businesses paying the bills. Every year the price goes up.
            Every new hire adds another seat. Every "upgrade" locks another
            feature behind a higher tier.
          </p>
          <p style={s.p}>
            Custom software breaks that cycle. You pay to build it. You own
            it. You decide how many users get access. And your costs stay flat
            while your business grows. That's not a pitch — it's arithmetic.
          </p>

          {/* Related */}
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
                  How to know when it's time to stop wrestling with tools that weren't built for you.
                </span>
              </Link>
              <Link to="/blog/custom-software-cost" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                How Much Does Custom Software Actually Cost?
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  The real numbers behind custom development — and why it's more affordable than you think.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Ready to see the math for your business?</h3>
            <p style={s.ctaText}>
              Tell us what you're paying for SaaS today. We'll show you what
              custom software would cost instead — no obligation, no hard sell.
            </p>
            <Link to="/solutions/white-glove" style={s.ctaBtn}>
              Get a Free Comparison
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
