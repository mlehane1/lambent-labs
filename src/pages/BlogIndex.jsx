import { useEffect } from "react";
import { Link } from "react-router-dom";

const posts = [
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
  useEffect(() => {
    document.title = "Blog | Lambent Labs — Software Development Insights";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Insights on software development, technology, and building better businesses from Lambent Labs."
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
          {posts.map((post) => (
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
