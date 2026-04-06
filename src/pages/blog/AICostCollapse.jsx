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

export default function AICostCollapse() {
  useEffect(() => {
    document.title =
      "The $5 Million AI Model — Why Custom Software Is About to Get Cheaper | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "AI costs are collapsing from both ends — open-source and commercial. Here's what that means for the price of your next custom software project."
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
          The $5 Million AI Model: Why Custom Software Is About to Get a Lot
          Cheaper
        </h1>

        <div style={s.meta}>
          <span>Apr 2026</span>
          <span style={s.dot} />
          <span>5 min read</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            In March 2026, a Chinese AI lab called DeepSeek released a
            one-trillion-parameter model with fully open weights. It performs on
            par with frontier models from OpenAI and Google. The training cost?{" "}
            <span style={s.highlight}>$5.2 million.</span>
          </p>
          <p style={s.p}>
            For context, comparable US models cost $100 million or more to train.
            OpenAI raised $122 billion in Q1 2026 alone. Anthropic raised $30
            billion. xAI was acquired by SpaceX for $250 billion. The numbers at
            the top of the AI industry are staggering — and increasingly
            disconnected from what it actually costs to <em>use</em> these tools.
          </p>
          <p style={s.p}>
            That gap matters. Because while the headlines focus on who raised the
            most money, the story that affects your business is different: the
            cost of AI is collapsing, and it's pulling the cost of custom
            software down with it.
          </p>

          <h2 style={s.h2}>The Squeeze From Both Ends</h2>
          <p style={s.p}>
            AI costs are falling from two directions at once. On the open-source
            side, models like DeepSeek V4 prove you can build world-class AI
            without billion-dollar budgets. These models are free to download,
            free to modify, and free to run on your own infrastructure. Every
            company on earth now has access to capabilities that were locked
            behind API paywalls twelve months ago.
          </p>
          <p style={s.p}>
            On the commercial side, the major providers are competing on
            efficiency. Google released Gemini 3.1 Flash-Lite — 2.5x faster and
            45% cheaper than the previous generation. Anthropic's MCP protocol
            just crossed 97 million installs, standardizing how AI agents connect
            to external tools and making integrations faster to build.
          </p>
          <p style={s.p}>
            The result is a market where{" "}
            <span style={s.highlight}>
              high-quality AI is getting cheaper every quarter
            </span>
            , whether you're using open-source models or paying for commercial
            APIs. That's not a trend that's slowing down — it's accelerating.
          </p>

          <h2 style={s.h2}>What This Means for Building Software</h2>
          <p style={s.p}>
            If you're a business owner thinking about a custom application, this
            cost collapse affects you in two concrete ways.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>First, building software costs less.</strong>{" "}
            Developers today use AI-powered tools — code assistants, automated
            testing, intelligent scaffolding — that make them dramatically more
            productive. When those tools get cheaper and better, projects move
            faster. A feature that took a developer two days to build last year
            might take half a day now. That time savings goes directly into a
            lower project cost for you.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>
              Second, running AI features in your software costs less.
            </strong>{" "}
            Want an intelligent chatbot on your customer portal? A document
            processing pipeline that reads invoices and enters them into your
            system? A recommendation engine for your e-commerce site? These
            features used to carry significant ongoing API costs — sometimes
            dollars per query. Today, many of these can run for pennies, or even
            locally on commodity hardware using open models.
          </p>
          <p style={s.p}>
            The barrier to adding intelligence to your business software is lower
            than it has ever been.
          </p>

          <h2 style={s.h2}>
            AI Features That Used to Be Expensive — Now Aren't
          </h2>
          <p style={s.p}>
            Here are real capabilities that have shifted from "enterprise budget
            only" to "realistic for any business" in the last twelve months:
          </p>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <strong style={s.strong}>Intelligent document processing</strong>{" "}
              — extract data from PDFs, invoices, contracts, and forms
              automatically. No manual data entry.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong style={s.strong}>Natural language search</strong> — let
              your team or customers search your data using plain English instead
              of filters and dropdowns.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong style={s.strong}>Automated customer support triage</strong>{" "}
              — route incoming requests to the right person based on content, not
              just keywords.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong style={s.strong}>Content generation and summarization</strong>{" "}
              — generate reports, summarize long documents, or draft
              communications from structured data.
            </li>
          </ul>
          <p style={s.p}>
            A year ago, any of these would have added thousands to a project
            budget in API costs alone. Today, you can run them on a $20/month
            API plan — or for free using an open-source model. The economics
            have fundamentally changed.
          </p>

          <h2 style={s.h2}>The Shrinking Barrier to Entry</h2>
          <p style={s.p}>
            There's a bigger story here beyond just AI pricing. When development
            tools get better and AI features get cheaper, the overall barrier to
            custom software drops. Projects that were $50,000 three years ago are
            now $5,000 — $12,000. Timelines that were six months are now three
            weeks.
          </p>
          <p style={s.p}>
            This matters most for small and mid-size businesses — the ones who
            were previously priced out of custom development. If you've been
            duct-taping spreadsheets together, paying for a SaaS tool that only
            does 60% of what you need, or manually doing work that should be
            automated — the math on building something custom has changed.
          </p>
          <p style={s.p}>
            <span style={s.highlight}>
              Custom software is no longer a luxury reserved for companies with
              six-figure IT budgets.
            </span>{" "}
            The same AI cost collapse that makes headlines is quietly making it
            affordable for a 15-person company to have software built exactly for
            how they work.
          </p>

          <h2 style={s.h2}>How We Pass These Savings to You</h2>
          <p style={s.p}>
            At doITbetter labs, we build with Anthropic's Claude at the core of
            our development workflow. Claude handles the repetitive engineering
            work — scaffolding components, writing data transformations, building
            standard integrations — while our team focuses on your business
            logic, architecture, and the decisions that actually matter.
          </p>
          <p style={s.p}>
            The result:{" "}
            <span style={s.highlight}>
              projects that agencies quoted at $40,000 a year ago, we deliver for
              $5,000 — $12,000
            </span>
            . Not because we cut corners. Because the tools got dramatically
            better and we pass those efficiency gains directly to our clients.
          </p>
          <p style={s.p}>
            If you evaluated the cost of custom software a year ago and decided
            it was too expensive, the math has changed. Start with the problem:
            what process is costing you time every week? What data are you not
            using because it's locked in PDFs or spreadsheets? Those are the
            questions worth answering — and the answers are more affordable than
            you think.
          </p>

          <BlogLeadCapture source="AI Cost Collapse" />

          {/* Further Reading */}
          <h2 style={s.h2}>Further Reading</h2>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <a href="https://techcrunch.com/2026/03/13/the-biggest-ai-stories-of-the-year-so-far/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                The biggest AI stories of the year (so far)
              </a>{" "}
              — TechCrunch's roundup of the major AI developments in early 2026.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://techcrunch.com/2026/03/20/ai-startups-are-eating-the-venture-industry-and-the-returns-so-far-are-good/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                AI startups are eating the venture industry — and the returns are good
              </a>{" "}
              — How AI startup economics are reshaping the investment landscape.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.cnbc.com/2026/02/24/anthropic-openai-china-firms-distillation-deepseek.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Anthropic joins OpenAI in flagging distillation campaigns by Chinese AI firms
              </a>{" "}
              — CNBC on DeepSeek and the global AI cost competition.
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
                  See the real pricing behind modern custom development.
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
                  How modern AI tools let small teams ship production software faster.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Ready to see what custom software costs in 2026?</h3>
            <p style={s.ctaText}>
              We'll scope your project and give you a real number — no jargon,
              no obligations. Just a straightforward conversation about what's
              possible.
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
