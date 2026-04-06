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

export default function AITrustGap() {
  useEffect(() => {
    document.title =
      "76% of Americans Don't Trust AI — What That Means for Your Business | doITbetter labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "AI adoption is up but trust is down. Here's how smart businesses are navigating the gap — using AI to build faster without alienating customers."
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
          76% of Americans Don't Trust AI. Here's What That Means for Your
          Business.
        </h1>

        <div style={s.meta}>
          <span>Apr 2026</span>
          <span style={s.dot} />
          <span>5 min read</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            More people are using AI than ever before. Fewer people trust it than
            ever before. That's not a contradiction — it's the most important
            dynamic in tech right now, and it should be shaping how you think
            about software for your business.
          </p>
          <p style={s.p}>
            A 2026 survey found that{" "}
            <span style={s.highlight}>
              76% of Americans say they trust AI only rarely or sometimes
            </span>
            . At the same time, the share of people who have never used an AI
            tool dropped from 33% in April 2025 to 27% today. People are trying
            these tools. They're just not sold on them.
          </p>
          <p style={s.p}>
            If you're a business owner thinking about building or buying
            software, this gap between adoption and trust isn't academic. It's
            the thing that will determine whether your next investment pays off
            or backfires.
          </p>

          <h2 style={s.h2}>Why Trust Collapsed This Fast</h2>
          <p style={s.p}>
            It helps to understand what happened. In early 2026, OpenAI signed a
            deal to deploy AI systems on classified Department of Defense
            networks. The backlash was immediate and massive. The #QuitGPT
            movement drew 2.5 million supporters. ChatGPT uninstalls surged
            295%.
          </p>
          <p style={s.p}>
            Meanwhile, Anthropic — the company behind Claude — publicly refused
            the same deal on ethical grounds. The contrast was stark, and it
            made people pay attention to who's building these tools and what
            their priorities are.
          </p>
          <p style={s.p}>
            But the trust problem isn't really about one deal. It's the
            accumulation of AI-generated misinformation, opaque decision-making,
            data privacy concerns, and companies racing to slap "AI-powered"
            labels on everything whether it helps the user or not. People notice.
            Your customers notice.
          </p>

          <h2 style={s.h2}>The Mistake Most Companies Are Making</h2>
          <p style={s.p}>
            Here's where businesses go wrong:{" "}
            <strong style={s.strong}>
              they treat AI as a marketing feature instead of a development tool
            </strong>
            . They plaster "AI-powered" across their product pages, add chatbots
            that frustrate more than they help, and automate customer-facing
            interactions that customers would rather have with a human.
          </p>
          <p style={s.p}>
            When three out of four Americans already don't trust AI, leading with
            "our software is AI-powered" is actively working against you. It
            doesn't signal innovation to your customers. It signals risk. It
            signals that their data might be going somewhere they didn't agree
            to, that decisions affecting them might be made by a system they
            can't question, and that you've prioritized cost-cutting over their
            experience.
          </p>
          <p style={s.p}>
            This doesn't mean AI has no place in your business. It means you
            need to be smarter about where you put it.
          </p>

          <h2 style={s.h2}>The Smart Approach: AI Behind the Scenes</h2>
          <p style={s.p}>
            The businesses getting this right are using AI as a{" "}
            <span style={s.highlight}>development accelerant</span>, not a
            customer-facing gimmick. There's a massive difference.
          </p>
          <p style={s.p}>
            When your development team uses AI-assisted workflows to build your
            software faster, you get shorter timelines, lower costs, and the
            same quality of output. Your customers never interact with an AI.
            They interact with well-designed software that a human team built,
            tested, and stands behind. The AI helped build the house — but a
            human designed it, inspected it, and handed you the keys.
          </p>
          <p style={s.p}>
            This is exactly how we work at doITbetter labs. We use Anthropic's
            Claude — the same company that refused the DOD deal on ethical
            grounds — as our primary development accelerant. Claude helps us
            deliver projects in weeks instead of months and at a fraction of
            traditional agency pricing. But every decision about your business
            logic, your user experience, and your data handling is made by
            experienced humans. The AI accelerates the boring parts — the
            boilerplate, the repetitive patterns, the standard implementations.
            The thinking stays human.
          </p>
          <p style={s.p}>
            For customer-facing features, keep humans in the loop. If you're
            adding a recommendation engine, have a person review its outputs. If
            you're automating communications, make sure a human wrote the
            templates and can intervene. If you're processing sensitive data,
            be transparent about what's automated and what isn't.
          </p>

          <h2 style={s.h2}>Focus on Outcomes, Not Buzzwords</h2>
          <p style={s.p}>
            Your customers don't care if your software was built with AI
            assistance. They care if it works. They care if it's fast, reliable,
            and easy to use. They care if their data is safe.
          </p>
          <p style={s.p}>
            <strong style={s.strong}>
              The best technology disappears into the experience.
            </strong>{" "}
            Nobody thinks about the power tools used to frame their house. They
            think about whether the house is well-built. Your software should
            work the same way.
          </p>
          <p style={s.p}>
            When you're evaluating a software partner, ask them how they use AI
            in their process. If the answer is "we use it to move faster and
            reduce costs while keeping experienced developers in control," that's
            a good answer. If the answer is "everything is AI-powered," ask more
            questions. Ask who reviews the output. Ask what happens when the AI
            gets something wrong. Ask where the humans are.
          </p>

          <h2 style={s.h2}>The Bottom Line</h2>
          <p style={s.p}>
            The trust gap isn't going away soon. If anything, it's going to get
            wider as AI gets embedded in more products and more high-profile
            incidents hit the news. Smart businesses will treat this as a
            competitive advantage.
          </p>
          <p style={s.p}>
            Use AI where it makes your team faster. Keep it away from places
            where it makes your customers uncomfortable. Build software that
            earns trust through quality, transparency, and human accountability
            — not through buzzwords on a landing page.
          </p>
          <p style={s.p}>
            The companies that figure this out will build better products at
            lower cost while their competitors are still trying to explain why
            their AI chatbot told a customer something insane.
          </p>

          <BlogLeadCapture source="AI Trust Gap" />

          {/* Further Reading */}
          <h2 style={s.h2}>Further Reading</h2>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <a href="https://techcrunch.com/2026/03/30/ai-trust-adoption-poll-more-americans-adopt-tools-fewer-say-they-can-trust-the-results/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                As more Americans adopt AI tools, fewer say they can trust the results
              </a>{" "}
              — TechCrunch's coverage of the 2026 AI trust survey.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.axios.com/2026/03/11/openai-anthropic-pentagon-google" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                OpenAI, Anthropic feud could prop up Google
              </a>{" "}
              — Axios on the Pentagon AI deal fallout and its industry implications.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://techcrunch.com/2026/01/02/in-2026-ai-will-move-from-hype-to-pragmatism/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                In 2026, AI will move from hype to pragmatism
              </a>{" "}
              — TechCrunch's analysis of AI's shift from hype cycle to practical deployment.
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
              <Link to="/blog/ai-accelerated-development" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                Why AI-Accelerated Development Changes Everything
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  How AI-assisted workflows let small teams build production software faster than ever.
                </span>
              </Link>
              <Link to="/blog/build-vs-buy" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                Build vs Buy: When Off-the-Shelf Software Isn't Enough
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  The real decision framework for choosing between custom and off-the-shelf.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Ready to build software your customers actually trust?</h3>
            <p style={s.ctaText}>
              We use AI to build faster and cheaper — but every decision is made
              by experienced humans. Let's talk about what you need.
            </p>
            <Link to="/#contact" style={s.ctaBtn}>
              Start a Conversation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
