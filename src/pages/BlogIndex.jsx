import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "76% of Americans Don't Trust AI. Here's What That Means for Your Business.",
    slug: "/blog/ai-trust-gap",
    excerpt:
      "AI adoption is up but trust is down. The smart play: use AI to build faster behind the scenes while keeping humans in the loop where it counts.",
    tags: ["AI", "Strategy", "Trust"],
    date: "Apr 2026",
    readTime: "5 min read",
  },
  {
    title: "The $5 Million AI Model: Why Custom Software Is About to Get Cheaper",
    slug: "/blog/ai-cost-collapse",
    excerpt:
      "AI costs are collapsing from both ends — open-source and commercial. Here's what that means for the price of your next project.",
    tags: ["AI", "Pricing", "Development"],
    date: "Apr 2026",
    readTime: "5 min read",
  },
  {
    title: "AI Agents Are Here. Here's What Small Businesses Need to Know.",
    slug: "/blog/ai-agents-guide",
    excerpt:
      "AI agents aren't science fiction anymore. They're booking appointments, processing invoices, and managing workflows. Here's what to actually do about it.",
    tags: ["AI", "Agents", "Operations"],
    date: "Apr 2026",
    readTime: "6 min read",
  },
  {
    title: "From High Code to Low Code to AI: The Full Circle",
    slug: "/blog/high-code-low-code-ai",
    excerpt:
      "We went from writing Java by hand, to Mendix, and back to code with AI. Here's what we learned — and why model-driven platforms are uniquely positioned for what's next.",
    tags: ["Strategy", "AI", "Low-Code", "Mendix"],
    date: "Apr 2026",
    readTime: "8 min read",
  },
  {
    title: "How Much Does Custom Software Actually Cost?",
    slug: "/blog/custom-software-cost",
    excerpt:
      "The real numbers behind custom development — and why it's more affordable than you think.",
    tags: ["Pricing", "Software Development"],
    date: "Apr 2026",
    readTime: "5 min read",
  },
  {
    title: "Build vs Buy: When Off-the-Shelf Software Isn't Enough",
    slug: "/blog/build-vs-buy",
    excerpt:
      "How to know when it's time to stop wrestling with tools that weren't built for you.",
    tags: ["Strategy", "Software"],
    date: "Apr 2026",
    readTime: "6 min read",
  },
  {
    title: "Why AI-Accelerated Development Changes Everything",
    slug: "/blog/ai-accelerated-development",
    excerpt:
      "How modern AI tooling lets small teams ship production software in days, not months.",
    tags: ["AI", "Development", "Innovation"],
    date: "Apr 2026",
    readTime: "4 min read",
  },
  {
    title: "5 Signs Your Franchise Needs Custom Software",
    slug: "/blog/franchise-software-signs",
    excerpt:
      "If any of these sound familiar, spreadsheets aren't cutting it anymore.",
    tags: ["Franchise", "Operations"],
    date: "Apr 2026",
    readTime: "5 min read",
  },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-deep)",
    padding: "120px 24px 80px",
  },
  container: {
    maxWidth: 1080,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 64,
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
    fontWeight: 700,
    color: "var(--text-hi)",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: "1.15rem",
    color: "var(--text-mid)",
    maxWidth: 560,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
    gap: 28,
  },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 32,
    transition: "border-color 0.25s, transform 0.25s",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  cardTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "1.35rem",
    fontWeight: 600,
    color: "var(--text-hi)",
    lineHeight: 1.35,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: "0.85rem",
    color: "var(--text-lo)",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "var(--text-lo)",
    flexShrink: 0,
  },
  excerpt: {
    fontSize: "1rem",
    color: "var(--text-mid)",
    lineHeight: 1.65,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  tag: {
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: 100,
    background: "var(--bg-card2)",
    color: "var(--primary-llt)",
    border: "1px solid var(--border)",
  },
  readMore: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--accent)",
    marginTop: "auto",
    paddingTop: 8,
  },
};

export default function BlogIndex() {
  const [dynamicPosts, setDynamicPosts] = useState([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) =>
        setDynamicPosts(
          (Array.isArray(data) ? data : []).map((p) => ({
            title: p.title,
            slug: `/blog/${p.slug}`,
            excerpt: p.excerpt,
            tags: p.tags || [],
            date: p.published_at
              ? new Date(p.published_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Recent",
            readTime: p.read_time,
          }))
        )
      )
      .catch(() => {});
  }, []);

  const allPosts = [...dynamicPosts, ...posts];

  useEffect(() => {
    document.title = "Blog | doITbetter labs — Software Development Insights";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Insights on software development, technology, and building better businesses from doITbetter labs."
      );
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Blog</h1>
          <p style={styles.subtitle}>
            Insights on software development, technology, and building better
            businesses.
          </p>
        </header>

        <div style={styles.grid}>
          {allPosts.map((post) => (
            <Link
              key={post.slug}
              to={post.slug}
              style={{ textDecoration: "none" }}
            >
              <article
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h2 style={styles.cardTitle}>{post.title}</h2>

                <div style={styles.meta}>
                  <span>{post.date}</span>
                  <span style={styles.dot} />
                  <span>{post.readTime}</span>
                </div>

                <p style={styles.excerpt}>{post.excerpt}</p>

                <div style={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} style={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <span style={styles.readMore}>Read article &rarr;</span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
