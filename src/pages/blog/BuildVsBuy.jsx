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
  ol: {
    paddingLeft: 24,
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  li: {
    color: "var(--text-mid)",
    lineHeight: 1.7,
  },
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

export default function BuildVsBuy() {
  useEffect(() => {
    document.title =
      "Build vs Buy: When Off-the-Shelf Software Isn't Enough | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "How to decide between buying off-the-shelf software and building custom. A practical framework for growing businesses tired of workarounds."
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
          Build vs Buy: When Off-the-Shelf Software Isn't Enough
        </h1>

        <div style={s.meta}>
          <span>Apr 2026</span>
          <span style={s.dot} />
          <span>6 min read</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            Every growing business hits this moment: the tools you started with
            aren't keeping up anymore. You're duct-taping spreadsheets to SaaS
            platforms, manually moving data between systems, and spending more
            time on workarounds than actual work. The question isn't whether to
            fix it — it's whether to buy another off-the-shelf tool or build
            something custom.
          </p>

          <h2 style={s.h2}>When Buying Makes Sense</h2>
          <p style={s.p}>
            Off-the-shelf software is the right call when your needs are
            genuinely standard. If you need basic email marketing, a shared
            calendar, or accounting software, there are mature products that do
            it well and cost very little. Don't build what already exists and
            works perfectly.
          </p>
          <p style={s.p}>
            Buying also makes sense when you're on a very tight budget and need
            something functional today. A $50/month SaaS tool that solves 80% of
            your problem is better than waiting six weeks for a custom solution
            if you genuinely can't afford the wait.
          </p>
          <p style={s.p}>
            The key word here is <em>standard</em>. If your workflow, data, and
            processes look like everyone else's in your industry, commodity
            software will serve you fine.
          </p>

          <h2 style={s.h2}>When Building Makes Sense</h2>
          <p style={s.p}>
            Custom software becomes the better investment when your needs
            diverge from the template:
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Unique workflows.</strong> If your
            operations have steps, rules, or approval chains that no standard
            tool supports, you're fighting the software instead of using it.
            Custom software molds to your process — not the other way around.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Competitive advantage.</strong> If the way
            you operate is part of what makes you better than competitors, don't
            flatten that into a generic tool. Your unique process deserves
            software that amplifies it.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Integration needs.</strong> When you need
            data flowing between multiple systems in real time — your CRM,
            inventory, scheduling platform, and accounting software all talking
            to each other — custom integration layers or a unified app become
            far cheaper than patching together Zapier automations.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Scaling constraints.</strong> Many SaaS
            tools charge per seat. At 10 users, that's fine. At 200 users across
            30 locations, the math changes fast. Custom software has a fixed cost
            regardless of how many people use it.
          </p>

          <h2 style={s.h2}>The Hidden Costs of Buying</h2>
          <p style={s.p}>
            Off-the-shelf software looks cheap until you factor in what it
            actually costs to make it work for you:
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Customization fees.</strong> Most SaaS
            platforms charge extra for custom fields, custom reports, and API
            access. Those "affordable" base plans rarely include what you
            actually need.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Per-seat licensing.</strong> $25/user/month
            sounds reasonable. Multiply that by 50 employees and 12 months and
            you're at $15,000/year — for software you don't own and can't
            modify.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Vendor lock-in.</strong> Your data lives in
            someone else's system. If they raise prices, change features, or
            shut down, you're scrambling. Migrating away from a platform you've
            built your operations around is painful and expensive.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Workaround labor.</strong> The biggest
            hidden cost. When the tool doesn't quite fit, someone on your team
            is spending hours each week on manual workarounds. That labor cost
            adds up silently.
          </p>

          <h2 style={s.h2}>The "Frankenstein Stack" Problem</h2>
          <p style={s.p}>
            This is the pattern we see most often: a business using five or more
            SaaS tools, each solving one piece of the puzzle, connected by a
            fragile web of Zapier automations, shared Google Sheets, and manual
            copy-pasting.
          </p>
          <p style={s.p}>
            The Frankenstein stack works — until it doesn't. Data gets out of
            sync. Automations break silently. Nobody has a single source of
            truth. And the total cost of all those subscriptions, plus the labor
            to maintain the connections, often exceeds what a custom solution
            would cost.
          </p>
          <p style={s.p}>
            If you recognize your business in this description, it's time to
            have the build conversation.
          </p>

          <h2 style={s.h2}>5 Questions to Help You Decide</h2>
          <ol style={s.ol}>
            <li style={s.li}>
              <strong style={s.strong}>
                Does an existing tool solve at least 90% of our need?
              </strong>{" "}
              If yes, buy it. If you're only getting 60-70% coverage, the
              workaround cost will eat you alive.
            </li>
            <li style={s.li}>
              <strong style={s.strong}>
                Is our workflow genuinely unique to our business?
              </strong>{" "}
              If your process is your competitive edge, custom software protects
              and scales that edge.
            </li>
            <li style={s.li}>
              <strong style={s.strong}>
                How many tools are we currently duct-taping together?
              </strong>{" "}
              If the answer is three or more, a single custom tool often costs
              less than the combined subscriptions — and eliminates the glue
              work.
            </li>
            <li style={s.li}>
              <strong style={s.strong}>
                What does our team spend on manual workarounds each week?
              </strong>{" "}
              Estimate the hours. Multiply by hourly cost. That's your
              "doing-nothing" price tag.
            </li>
            <li style={s.li}>
              <strong style={s.strong}>
                Will our needs grow significantly in the next 12-24 months?
              </strong>{" "}
              If you're scaling locations, adding users, or expanding services,
              custom software scales with you. Per-seat SaaS pricing scales
              against you.
            </li>
          </ol>

          {/* Further Reading */}
          <h2 style={s.h2}>Further Reading</h2>
          <p style={s.p}>
            These resources go deeper on the build vs. buy decision:
          </p>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.thoughtworks.com/content/dam/thoughtworks/documents/e-book/tw_ebook_build_vs_buy_2022.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Build vs. Buy: A Strategic Framework for Evaluating Third-Party Solutions
              </a>{" "}
              — ThoughtWorks' comprehensive e-book on making the decision systematically.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.cio.com/article/4056428/build-vs-buy-a-cios-journey-through-the-software-decision-maze.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Build vs. Buy: A CIO's Journey Through the Software Decision Maze
              </a>{" "}
              — CIO Magazine's perspective on navigating the decision at the executive level.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.betsol.com/blog/build-vs-buy-software-decision-framework/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                The Enterprise Build vs. Buy Decision Framework for Software
              </a>{" "}
              — A quantitative scoring approach for evaluating your options.
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
              <Link to="/solutions/small-business" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                Enterprise Software at Small Business Prices
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  See how we deliver enterprise-grade tools without the enterprise price tag.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Not sure which path is right?</h3>
            <p style={s.ctaText}>
              We'll give you an honest assessment — even if the answer is "just
              buy the SaaS tool." No hard sell, no 40-page proposal.
            </p>
            <Link to="/#contact" style={s.ctaBtn}>
              Let's Talk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
