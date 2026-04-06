import { useEffect } from "react";
import { Link } from "react-router-dom";
import BlogLeadCapture from "../../components/BlogLeadCapture.jsx";

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
  p: { marginBottom: 20 },
  strong: { color: "var(--text-hi)" },
  highlight: { color: "var(--accent)", fontWeight: 600 },
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

export default function AIAgentsGuide() {
  useEffect(() => {
    document.title =
      "AI Agents Are Here — What Small Businesses Need to Know | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "AI agents are no longer theoretical — they're booking appointments, processing invoices, and managing workflows right now. Here's what small businesses actually need to know."
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
          AI Agents Are Here. Here's What Small Businesses Actually Need to Know.
        </h1>

        <div style={s.meta}>
          <span>Apr 2026</span>
          <span style={s.dot} />
          <span>6 min read</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            If you've been hearing the term "AI agent" thrown around more
            lately, you're not imagining things. In the past six months, AI
            agents went from a niche developer concept to something your
            competitors are quietly starting to use. Not as a gimmick — as
            actual operational software that handles real work.
          </p>
          <p style={s.p}>
            OpenClaw, an app that let people interact with AI agents through
            iMessage, Discord, Slack, and WhatsApp, went viral earlier this
            year — and was quickly acquired by OpenAI. Anthropic's Model
            Context Protocol (MCP), which defines how AI agents connect to
            external tools and data sources, crossed{" "}
            <span style={s.highlight}>97 million installs in March 2026</span>.
            Every major AI provider now ships MCP-compatible tooling. The
            infrastructure for AI agents isn't coming. It's here.
          </p>
          <p style={s.p}>
            But if you're running a small business, the question isn't "are
            agents cool?" It's: <strong style={s.strong}>should I care yet,
            and what should I actually do about it?</strong>
          </p>

          <h2 style={s.h2}>What AI Agents Actually Are (No Jargon)</h2>
          <p style={s.p}>
            A chatbot answers questions. An AI agent does things. That's the
            simplest way to think about the difference.
          </p>
          <p style={s.p}>
            An AI agent can look up information in your CRM, send an email
            based on what it finds, update a spreadsheet, book an appointment
            on your calendar, and then summarize what it did — all from a
            single request. It doesn't just generate text. It takes actions
            across your actual tools.
          </p>
          <p style={s.p}>
            The reason this is suddenly possible at scale is that the
            industry settled on a standard protocol — MCP — for how agents
            connect to external systems. Think of it like USB for AI. Before
            USB, every device had its own proprietary connector. Once the
            standard existed, everything could talk to everything. MCP is
            doing the same thing for AI agents and business software.
          </p>

          <h2 style={s.h2}>Where Agents Are Already Doing Real Work</h2>
          <p style={s.p}>
            Forget the hypotheticals. Here's what AI agents are handling for
            small businesses right now:
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Support email triage.</strong> An agent
            reads every incoming support email, categorizes it by urgency and
            topic, routes it to the right person, and drafts a response for
            review. A plumbing company doing 200 service requests a month
            saves 15+ hours of admin time weekly.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Appointment scheduling.</strong> A
            scheduling agent handles the back-and-forth of booking — checking
            availability, sending confirmations, handling reschedules — without
            a human touching it. Clients interact through text or chat, and
            the agent handles the rest.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Weekly reporting.</strong> A data agent
            pulls numbers from your CRM, accounting software, or project
            management tool every Monday morning and delivers a plain-English
            summary of where the business stands. No dashboards to log into.
            No spreadsheets to build.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Invoice processing.</strong> An agent
            extracts line items from incoming invoices, matches them to
            purchase orders, flags discrepancies, and queues clean entries for
            your bookkeeper. What used to take hours of manual data entry
            happens automatically.
          </p>

          <h2 style={s.h2}>
            You Don't Need to Build an Agent. You Need Software That Can
            Connect to One.
          </h2>
          <p style={s.p}>
            Here's where most of the advice out there gets it wrong. The
            takeaway for small businesses is not "go build an AI agent." You
            don't need to hire an AI team or subscribe to the latest agent
            platform. What you need is{" "}
            <span style={s.highlight}>
              software that's built to connect to the agent ecosystem as it
              matures
            </span>
            .
          </p>
          <p style={s.p}>
            That means clean APIs. Standard data formats. Systems designed
            with integration points rather than locked-down silos. If your
            customer data lives in a spreadsheet that only one person can
            access, no agent in the world can help you. If it lives in a
            system with a proper API, you're one connection away from
            automation.
          </p>
          <p style={s.p}>
            The businesses that will benefit most from AI agents over the
            next two years are the ones making smart infrastructure decisions
            now. Not by chasing hype, but by building flexible systems that
            are ready to plug in when the right use case shows up.
          </p>

          <h2 style={s.h2}>
            What to Actually Do About This — A Practical Checklist
          </h2>
          <p style={s.p}>
            You don't need a strategy deck. You need a few concrete steps:
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Audit your repetitive work.</strong>{" "}
            Where are you or your team spending hours on tasks that follow
            the same pattern every time? Email sorting, data entry, report
            generation, appointment coordination — these are your agent
            candidates.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>
              Check if your current tools have APIs.
            </strong>{" "}
            Your CRM, scheduling tool, accounting software — do they expose
            APIs? If not, you may be locked out of the agent ecosystem
            entirely. This is worth factoring into your next software
            decision.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>
              Build new systems with integration in mind.
            </strong>{" "}
            If you're investing in custom software — a client portal, an
            internal tool, an operational dashboard — make sure it's built
            with clean APIs and standard protocols from day one. The cost
            difference is minimal now but the flexibility it gives you later
            is enormous.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>Start small.</strong> Pick one workflow.
            One pain point. Test an agent on it. See if it saves time. If it
            does, expand. If it doesn't, you've lost a few hours, not a few
            thousand dollars.
          </p>

          <h2 style={s.h2}>How We Build Agent-Ready Software</h2>
          <p style={s.p}>
            At doITbetter labs, we use Anthropic's Claude — the company behind
            MCP — as our primary development tool. That means we're not just
            reading about the agent ecosystem. We're building with it every day.
            When we architect your custom software, we build in the API
            endpoints, webhook handlers, and data structures that let agents
            plug in seamlessly.
          </p>
          <p style={s.p}>
            A client portal we build today can have an AI support agent
            added next quarter. A CRM we deliver this month can connect to a
            scheduling agent when you're ready. We don't charge you for
            "AI-readiness" as an upsell —{" "}
            <span style={s.highlight}>
              it's just how modern software should be built
            </span>
            .
          </p>
          <p style={s.p}>
            The window for early advantage is open now. In two years, this will
            be table stakes. The businesses that win won't be the ones that
            built the fanciest AI agent. They'll be the ones that built
            flexible, well-connected systems that were ready when the agents
            showed up.
          </p>

          <BlogLeadCapture source="AI Agents Guide" />

          {/* Further Reading */}
          <h2 style={s.h2}>Further Reading</h2>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <a href="https://techcrunch.com/2026/03/13/the-biggest-ai-stories-of-the-year-so-far/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                The biggest AI stories of the year (so far)
              </a>{" "}
              — TechCrunch on OpenClaw, AI agents, and the stories shaping 2026.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.crescendo.ai/news/latest-ai-news-and-updates" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Latest AI News and Breakthroughs: 2026
              </a>{" "}
              — Crescendo's running tracker of major AI developments and model releases.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.technologyreview.com/2026/01/05/1130662/whats-next-for-ai-in-2026/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                What's next for AI in 2026
              </a>{" "}
              — MIT Technology Review's predictions on agents, infrastructure, and enterprise adoption.
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
              <Link to="/blog/high-code-low-code-ai" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                From High Code to Low Code to AI: The Full Circle
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  How the development landscape evolved — and where it's heading next.
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
                  What modern AI tooling means for timelines, cost, and quality.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Ready to make your systems agent-ready?</h3>
            <p style={s.ctaText}>
              We build software with clean APIs and modern architecture — so
              when the right agent shows up, you're ready to plug it in.
            </p>
            <Link to="/#contact" style={s.ctaBtn}>
              Let's Talk About Your Workflow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
