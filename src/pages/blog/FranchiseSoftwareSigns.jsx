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
  signNum: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 8,
  },
  signTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "1.35rem",
    fontWeight: 600,
    color: "var(--text-hi)",
    marginBottom: 12,
  },
  p: { marginBottom: 20 },
  strong: { color: "var(--text-hi)" },
  signBlock: {
    marginBottom: 40,
    paddingLeft: 20,
    borderLeft: "3px solid var(--border-mid)",
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
    marginRight: 12,
  },
  ctaBtnSecondary: {
    display: "inline-block",
    padding: "12px 28px",
    background: "transparent",
    color: "var(--primary-llt)",
    borderRadius: 8,
    border: "1px solid var(--border-mid)",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "border-color 0.2s",
  },
};

export default function FranchiseSoftwareSigns() {
  useEffect(() => {
    document.title =
      "5 Signs Your Franchise Needs Custom Software | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Five warning signs that your franchise has outgrown spreadsheets and generic SaaS tools. Learn when custom software becomes the smarter investment."
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
          5 Signs Your Franchise Needs Custom Software
        </h1>

        <div style={s.meta}>
          <span>Apr 2026</span>
          <span style={s.dot} />
          <span>5 min read</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            Franchises face a unique challenge: you need consistency across
            locations, but every location has its own people, pace, and quirks.
            In the early stages, spreadsheets and off-the-shelf tools hold
            things together. But as you grow, the cracks start to show. Here are
            five signs it's time to invest in software built for the way you
            actually operate.
          </p>

          <div style={s.signBlock}>
            <p style={s.signNum}>Sign 1</p>
            <h2 style={s.signTitle}>
              Every Location Uses Different Tools and Spreadsheets
            </h2>
            <p style={s.p}>
              One location tracks inventory in Google Sheets. Another uses a
              whiteboard. A third bought their own subscription to some niche
              SaaS tool. You asked everyone to use the same system, but adoption
              was spotty and now you have data scattered across a dozen platforms
              you didn't approve.
            </p>
            <p style={s.p}>
              Custom software solves this by giving every location a single,
              purpose-built tool that's actually designed for their daily
              workflow. When the tool fits the work, people use it — no
              enforcement required. Standardized input means standardized data,
              which means you can finally compare apples to apples across your
              entire network.
            </p>
          </div>

          <div style={s.signBlock}>
            <p style={s.signNum}>Sign 2</p>
            <h2 style={s.signTitle}>
              You Can't Get a Clear Picture Without Calling Each Location
            </h2>
            <p style={s.p}>
              If understanding how your business is performing requires a round
              of phone calls, email chains, or waiting for someone to update a
              shared spreadsheet, you're flying blind. By the time you aggregate
              the data manually, it's already outdated.
            </p>
            <p style={s.p}>
              A custom dashboard that pulls real-time data from every location
              gives you the full picture at a glance. Revenue, inventory,
              staffing, customer metrics — all in one place, updated
              automatically. Make decisions based on today's numbers, not last
              week's estimates.
            </p>
          </div>

          <div style={s.signBlock}>
            <p style={s.signNum}>Sign 3</p>
            <h2 style={s.signTitle}>
              Onboarding New Locations Takes Weeks Instead of Days
            </h2>
            <p style={s.p}>
              Opening a new franchise location should be exciting, not a
              logistical nightmare. If your onboarding process involves
              configuring five different SaaS accounts, training staff on
              multiple disconnected tools, importing data into spreadsheets, and
              crossing your fingers that everything syncs — you have a systems
              problem.
            </p>
            <p style={s.p}>
              With custom software, onboarding a new location can be as simple
              as creating an account. The workflows, templates, and
              configurations are built in. New staff learn one tool instead of
              five. What used to take weeks of setup and training can happen in
              days.
            </p>
          </div>

          <div style={s.signBlock}>
            <p style={s.signNum}>Sign 4</p>
            <h2 style={s.signTitle}>
              You're Paying for 5+ SaaS Subscriptions That Overlap
            </h2>
            <p style={s.p}>
              Scheduling tool. Communication platform. Inventory tracker. CRM.
              Reporting dashboard. Payment processing. Each one costs $20 — $100
              per user per month. Multiply by your number of locations and staff,
              and you're looking at thousands per month — for tools that each do
              one thing and don't talk to each other.
            </p>
            <p style={s.p}>
              A unified custom platform replaces the patchwork. One login, one
              interface, one source of truth. The subscription fees disappear,
              and the workarounds disappear with them. In many cases, the custom
              build pays for itself within the first year just in eliminated SaaS
              costs.
            </p>
          </div>

          <div style={s.signBlock}>
            <p style={s.signNum}>Sign 5</p>
            <h2 style={s.signTitle}>
              Your Customers Get Inconsistent Experiences Across Locations
            </h2>
            <p style={s.p}>
              When every location runs on different systems, the customer
              experience drifts. Pricing might vary. Service quality depends on
              which manager set up which spreadsheet. Customer data doesn't
              transfer between locations. Loyalty programs work at one location
              but not another.
            </p>
            <p style={s.p}>
              Custom software enforces the consistency your brand depends on
              while still giving individual locations the flexibility they need.
              Standardized pricing, shared customer profiles, consistent service
              workflows — your customers get the same experience at location
              number three that they got at location number one.
            </p>
          </div>

          <h2 style={s.h2}>The Bottom Line</h2>
          <p style={s.p}>
            If even two of these signs ring true for your franchise, you've
            likely outgrown generic tools. The cost of custom software is almost
            always less than the combined cost of the SaaS subscriptions,
            workaround labor, and missed opportunities you're absorbing today.
          </p>
          <p style={s.p}>
            Modern development has made custom franchise software faster and
            more affordable to build than ever. What used to be a six-figure,
            six-month project can now be scoped, built, and deployed in weeks.
          </p>

          {/* Further Reading */}
          <h2 style={s.h2}>Further Reading</h2>
          <p style={s.p}>
            More on franchise technology and operations standardization:
          </p>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <a href="https://franchisecreator.com/the-role-of-technology-in-modern-franchise-management-systems/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                The Role of Technology in Modern Franchise Management Systems
              </a>{" "}
              — How technology is reshaping franchise operations and brand consistency.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.getomnify.com/blog/why-franchise-businesses-outgrow-their-software-and-how-to-scale-smarter" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Why Franchise Businesses Outgrow Their Software (And How to Scale Smarter)
              </a>{" "}
              — Why the tools that got you to 5 locations won't get you to 50.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://sentrytechsolutions.com/blog/5-technology-mistakes-killing-your-franchise-expansion-plans" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                5 Technology Mistakes Killing Your Franchise Expansion Plans
              </a>{" "}
              — Common tech pitfalls that slow franchise growth.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.claromentis.com/blog/must-have-franchise-software-features" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                19 Must-Have Franchise Software Features
              </a>{" "}
              — A comprehensive checklist of what your franchise software should include.
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
                  The framework for deciding when generic tools stop cutting it.
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
                  Real pricing for custom franchise and business software.
                </span>
              </Link>
              <Link to="/solutions/franchise" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                Our Franchise Solutions
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  One system. Every location. Zero chaos.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Ready to streamline your franchise?</h3>
            <p style={s.ctaText}>
              We build software for multi-location businesses. Let's talk about
              what's slowing you down and what a custom solution looks like.
            </p>
            <div>
              <Link to="/#contact" style={s.ctaBtn}>
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
