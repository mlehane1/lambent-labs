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
  strong: { color: "var(--text-hi)" },
  callout: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "24px 28px",
    margin: "32px 0",
    fontSize: "0.95rem",
    lineHeight: 1.8,
  },
  cta: {
    marginTop: 56,
    background: "linear-gradient(135deg, rgba(21,88,203,0.12), rgba(21,203,136,0.08))",
    border: "1px solid rgba(21,88,203,0.2)",
    borderRadius: 16,
    padding: "40px 32px",
    textAlign: "center",
  },
  ctaTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "var(--text-hi)",
    marginBottom: 12,
  },
  ctaText: {
    color: "var(--text-mid)",
    fontSize: "0.95rem",
    lineHeight: 1.7,
    marginBottom: 20,
    maxWidth: 480,
    marginLeft: "auto",
    marginRight: "auto",
  },
  ctaBtn: {
    display: "inline-block",
    background: "linear-gradient(135deg, var(--primary), var(--accent))",
    color: "white",
    padding: "14px 32px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "0.95rem",
    boxShadow: "0 4px 20px rgba(21,88,203,0.35)",
  },
  // Timeline styles
  timeline: {
    position: "relative",
    margin: "40px 0",
    paddingLeft: 32,
  },
  timelineLine: {
    position: "absolute",
    left: 11,
    top: 8,
    bottom: 8,
    width: 2,
    background: "linear-gradient(180deg, var(--primary), var(--accent))",
    borderRadius: 2,
  },
  timelineItem: {
    position: "relative",
    marginBottom: 40,
    paddingLeft: 24,
  },
  timelineDot: {
    position: "absolute",
    left: -32,
    top: 6,
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
  },
  // Comparison graphic
  eraCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "24px",
    textAlign: "center",
  },
  eraLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  eraTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: "1.3rem",
    color: "var(--text-hi)",
    marginBottom: 6,
  },
  eraIcon: {
    fontSize: "2.5rem",
    marginBottom: 12,
  },
  eraStat: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 800,
    fontSize: "1.6rem",
    marginTop: 12,
  },
  eraDetail: {
    fontSize: "0.82rem",
    color: "var(--text-mid)",
    lineHeight: 1.6,
    marginTop: 4,
  },
};

export default function HighCodeLowCodeAI() {
  useEffect(() => {
    document.title =
      "From High Code to Low Code to AI: The Full Circle of Software Development | Lambent Labs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "We went from writing everything by hand, to low-code platforms like Mendix, and now back to high code through AI. Here's what we learned — and why Mendix might be perfectly positioned for what's next."
      );
    }
  }, []);

  return (
    <div style={s.page}>
      <div style={s.article}>
        <Link to="/blog" style={s.back}>
          &larr; Back to Blog
        </Link>

        <h1 style={s.title}>
          From High Code to Low Code to AI: The Full Circle of Software Development
        </h1>

        <div style={s.meta}>
          <span>April 2026</span>
          <div style={s.dot} />
          <span>8 min read</span>
          <div style={s.dot} />
          <span>Strategy, AI, Low-Code</span>
        </div>

        <div style={s.body}>
          <p style={s.p}>
            We've lived through every era of modern software development. We wrote Java by hand, line by line, for years. Then we moved to Mendix and watched our delivery speed triple. Now we're back to writing code — but with AI doing the heavy lifting.
          </p>
          <p style={s.p}>
            This isn't a story about picking sides. It's about understanding where each approach shines, where it breaks down, and why the industry is coming full circle in a way almost nobody predicted.
          </p>

          {/* ── THE THREE ERAS GRAPHIC ──────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            margin: "40px 0",
          }}>
            <div style={s.eraCard}>
              <div style={s.eraIcon}>⌨️</div>
              <div style={{ ...s.eraLabel, color: "var(--text-lo)" }}>Era 1</div>
              <div style={s.eraTitle}>High Code</div>
              <div style={{ ...s.eraStat, color: "#F87171" }}>6-12 mo</div>
              <div style={s.eraDetail}>Average time to production</div>
              <div style={{ ...s.eraDetail, marginTop: 8 }}>
                Full control. Full complexity.<br />Full dev team required.
              </div>
            </div>
            <div style={{ ...s.eraCard, borderColor: "rgba(21,88,203,0.4)" }}>
              <div style={s.eraIcon}>🧩</div>
              <div style={{ ...s.eraLabel, color: "var(--primary-lt)" }}>Era 2</div>
              <div style={s.eraTitle}>Low Code</div>
              <div style={{ ...s.eraStat, color: "var(--primary-lt)" }}>2-4 mo</div>
              <div style={s.eraDetail}>Average time to production</div>
              <div style={{ ...s.eraDetail, marginTop: 8 }}>
                Faster delivery. Visual models.<br />Platform governance built in.
              </div>
            </div>
            <div style={{ ...s.eraCard, borderColor: "rgba(21,203,136,0.4)" }}>
              <div style={s.eraIcon}>🤖</div>
              <div style={{ ...s.eraLabel, color: "var(--accent)" }}>Era 3</div>
              <div style={s.eraTitle}>AI + Code</div>
              <div style={{ ...s.eraStat, color: "var(--accent)" }}>1-4 wk</div>
              <div style={s.eraDetail}>Average time to production</div>
              <div style={{ ...s.eraDetail, marginTop: 8 }}>
                Full control. Full speed.<br />AI handles the boilerplate.
              </div>
            </div>
          </div>

          <h2 style={s.h2}>Era 1: The High-Code Years</h2>
          <p style={s.p}>
            If you built enterprise software in the 2010s, you know the drill. Java, Spring Boot, Angular or React on the front end. Every feature hand-coded. Every test hand-written. Every deployment hand-managed (or at least, managed through a CI/CD pipeline you spent three weeks configuring).
          </p>
          <p style={s.p}>
            The results were powerful. You could build anything. But the cost was brutal — six-figure budgets, six-month timelines, and teams of five to ten developers just to get an internal tool to production.
          </p>
          <p style={s.p}>
            For enterprise companies with deep pockets, this worked. For everyone else, it meant custom software was out of reach.
          </p>

          <h2 style={s.h2}>Era 2: Why We Went Low-Code (and Why Mendix Was the Right Call)</h2>
          <p style={s.p}>
            We moved to Mendix because the math made sense. A project that took six months in Java took six weeks in Mendix. The visual modeling layer meant we could show clients a working prototype in days, not weeks. The platform handled deployment, security, and scalability out of the box.
          </p>
          <p style={s.p}>
            But here's what most people miss about Mendix — it's not just drag-and-drop. Under the hood, Mendix applications are <strong style={s.strong}>model-driven</strong>. Every page, every microflow, every entity is represented as a structured, machine-readable model. The platform enforces consistency through its metamodel. It has built-in:
          </p>

          <div style={s.callout}>
            <div style={{ marginBottom: 12, fontWeight: 600, color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif" }}>
              What Mendix Gets Right
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
              {[
                "Full CI/CD pipeline",
                "Role-based access control",
                "Version control & branching",
                "One-click deployment",
                "Model-driven architecture",
                "Built-in testing frameworks",
                "API integration layer",
                "Enterprise governance",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.9rem" }}>&#10003;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={s.p}>
            For organizations that need governance — audit trails, role-based access, deployment pipelines, change management — Mendix is still one of the best platforms on the market. We built dozens of applications on it and we'd do it again.
          </p>
          <p style={s.p}>
            But low-code has ceilings. When you need a custom UI that doesn't fit the widget library, you're fighting the platform. When you need to integrate with a niche API that doesn't have a connector, you're writing Java extensions anyway. And when the platform vendor raises prices or changes licensing terms, you're locked in.
          </p>

          <h2 style={s.h2}>Era 3: The AI-Powered Return to High Code</h2>
          <p style={s.p}>
            Here's what changed: AI didn't just get better at writing code. It got better at writing <em>the right</em> code — the boilerplate, the CRUD operations, the routing, the form validation, the API integrations, the responsive layouts. The tedious 80% that used to eat up months of developer time.
          </p>
          <p style={s.p}>
            What's left for humans? The hard 20%: understanding the business problem, designing the architecture, making trade-off decisions, handling edge cases, and ensuring the system works in the real world.
          </p>
          <p style={s.p}>
            The result is that a skilled developer with AI tools can now deliver at the speed of low-code platforms — but with the full flexibility of custom code. No vendor lock-in. No widget limitations. No licensing fees per user.
          </p>

          <div style={{
            background: "linear-gradient(135deg, rgba(21,88,203,0.1), rgba(21,203,136,0.06))",
            border: "1px solid rgba(21,88,203,0.25)",
            borderRadius: 14,
            padding: "28px",
            margin: "36px 0",
          }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--text-hi)",
              marginBottom: 16,
            }}>
              The Speed Comparison
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Traditional High Code", time: "6-12 months", pct: "100%", color: "#F87171" },
                { label: "Mendix / Low Code", time: "2-4 months", pct: "33%", color: "var(--primary-lt)" },
                { label: "AI-Accelerated High Code", time: "1-4 weeks", pct: "12%", color: "var(--accent)" },
              ].map((row) => (
                <div key={row.label}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "0.85rem", marginBottom: 6,
                  }}>
                    <span style={{ color: "var(--text-hi)", fontWeight: 500 }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{row.time}</span>
                  </div>
                  <div style={{
                    height: 8, borderRadius: 4,
                    background: "var(--bg-card2)", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: row.color, width: row.pct,
                      transition: "width 1s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 style={s.h2}>The Mendix Opportunity Nobody's Talking About</h2>
          <p style={s.p}>
            Here's the twist that makes this interesting: Mendix might actually be <em>better positioned</em> for the AI era than traditional high-code platforms. And the reason is the model.
          </p>
          <p style={s.p}>
            Every Mendix application is a structured, consistent, machine-readable model. Pages are defined as models. Business logic is defined as models. Data structures are defined as models. This isn't spaghetti code in a thousand files — it's a well-defined, well-documented, internally consistent structure.
          </p>

          <div style={s.callout}>
            <div style={{
              fontWeight: 600, color: "var(--accent)",
              fontFamily: "'Outfit', sans-serif", marginBottom: 12,
            }}>
              Why models matter for AI
            </div>
            <p style={{ ...s.p, marginBottom: 12 }}>
              AI systems learn patterns. The more consistent and structured the input, the faster and more accurately they learn it. Mendix's metamodel is essentially a <strong style={s.strong}>grammar for software</strong> — and AI is exceptionally good at learning grammars.
            </p>
            <p style={{ ...s.p, marginBottom: 0 }}>
              This means AI can understand, generate, modify, and validate Mendix applications with a level of consistency that's much harder to achieve with freeform code across dozens of frameworks and conventions.
            </p>
          </div>

          <p style={s.p}>
            Think about it: when an AI generates React code, it has to account for hundreds of different patterns, folder structures, state management approaches, and styling conventions. When it generates a Mendix model, the structure is defined. The rules are fixed. The guardrails are built in.
          </p>
          <p style={s.p}>
            For organizations that need governance — regulated industries, large enterprises, franchises with compliance requirements — this combination of AI speed and platform-enforced consistency could be the best of both worlds.
          </p>

          <h2 style={s.h2}>Where Does That Leave Us?</h2>
          <p style={s.p}>
            We're not ideological about this. We use high code when it's the right tool. We recommend Mendix when governance and structure matter more than flexibility. And we're watching the convergence closely.
          </p>
          <p style={s.p}>
            Here's our framework for choosing:
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            margin: "24px 0 32px",
          }}>
            {[
              {
                title: "Choose High Code + AI",
                when: "Custom UI, unique workflows, no vendor lock-in needed, cost-sensitive",
                color: "var(--accent)",
              },
              {
                title: "Choose Mendix",
                when: "Enterprise governance, regulated industry, large team, existing Mendix investment",
                color: "var(--primary-lt)",
              },
              {
                title: "Choose Hybrid",
                when: "Core on Mendix for governance, custom front-ends or integrations in code",
                color: "#E9812A",
              },
            ].map((card) => (
              <div key={card.title} style={{
                background: "var(--bg-card)",
                border: `1px solid ${card.color}33`,
                borderRadius: 12,
                padding: "20px",
              }}>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: card.color,
                  marginBottom: 8,
                }}>
                  {card.title}
                </div>
                <div style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text-mid)" }}>
                  {card.when}
                </div>
              </div>
            ))}
          </div>

          <p style={s.p}>
            The point isn't which era is "best." The point is that the best developers understand all three — and know when to use each one. That's what we bring to the table.
          </p>

          <h2 style={s.h2}>The Bottom Line</h2>
          <p style={s.p}>
            The software industry went from high code to low code because high code was too slow and expensive. Now it's going back to high code because AI eliminated the speed and cost problem — while keeping the flexibility that low-code platforms traded away.
          </p>
          <p style={s.p}>
            But the story isn't over. Platforms like Mendix that are built on structured, model-driven architectures are uniquely positioned to leverage AI in ways that traditional code can't. The future isn't high code <em>or</em> low code. It's both — and the teams that understand the full spectrum will build the best software.
          </p>

          {/* Further Reading */}
          <h2 style={s.h2}>Further Reading</h2>
          <ul style={{ ...s.body, paddingLeft: 24, marginBottom: 32 }}>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.infoq.com/news/2026/03/ai-dora-report/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                AI Is Amplifying Software Engineering Performance — 2025 DORA Report
              </a>{" "}
              — How AI is changing delivery metrics across the industry.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://www.index.dev/blog/developer-productivity-statistics-with-ai-tools" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                Top 100 Developer Productivity Statistics with AI Tools 2026
              </a>{" "}
              — The data behind AI-accelerated development.
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="https://devops.com/ai-in-software-development-productivity-at-the-cost-of-code-quality-2/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-lt)" }}>
                AI in Software Development: Productivity at the Cost of Code Quality?
              </a>{" "}
              — The balanced view on trade-offs.
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
                  How modern AI tooling lets small teams ship production software in days, not months.
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
                  The decision framework for choosing between custom and off-the-shelf.
                </span>
              </Link>
              <Link to="/solutions/white-glove" style={{
                display: "block", padding: "20px 24px", borderRadius: 12,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "1rem",
              }}>
                The White Glove Experience
                <span style={{ display: "block", color: "var(--text-mid)", fontSize: "0.85rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  End-to-end development — from requirements to production.
                </span>
              </Link>
            </div>
          </div>

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Want to talk about the right approach for your project?</h3>
            <p style={s.ctaText}>
              Whether it's high code, low code, or a hybrid — we'll recommend what actually fits your business. No platform loyalty, just honest advice.
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
