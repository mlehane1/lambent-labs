import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BlogLeadCapture from "../components/BlogLeadCapture.jsx";

const s = {
  page: { minHeight: "100vh", background: "var(--bg-deep)", padding: "120px 24px 80px" },
  article: { maxWidth: 720, margin: "0 auto" },
  back: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.9rem", fontWeight: 600, color: "var(--primary-llt)", marginBottom: 40, fontFamily: "'Outfit', sans-serif" },
  title: { fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "var(--text-hi)", lineHeight: 1.2, marginBottom: 16 },
  meta: { display: "flex", alignItems: "center", gap: 12, fontSize: "0.85rem", color: "var(--text-lo)", marginBottom: 40 },
  dot: { width: 4, height: 4, borderRadius: "50%", background: "var(--text-lo)" },
  body: { fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "var(--text-mid)" },
  h2: { fontFamily: "'Outfit', sans-serif", fontSize: "1.55rem", fontWeight: 600, color: "var(--text-hi)", margin: "48px 0 16px" },
  p: { marginBottom: 20 },
  highlight: { color: "var(--accent)", fontWeight: 600, marginBottom: 20, fontSize: "1.05rem" },
  list: { paddingLeft: 24, marginBottom: 24 },
  li: { marginBottom: 10 },
  cta: { marginTop: 56, padding: 32, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, textAlign: "center" },
  ctaTitle: { fontFamily: "'Outfit', sans-serif", fontSize: "1.35rem", fontWeight: 600, color: "var(--text-hi)", marginBottom: 12 },
  ctaText: { color: "var(--text-mid)", marginBottom: 20, fontSize: "1rem" },
  ctaBtn: { display: "inline-block", padding: "12px 28px", background: "var(--accent)", color: "#fff", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "0.95rem", transition: "opacity 0.2s" },
  loading: { textAlign: "center", padding: "120px 24px", color: "var(--text-lo)", fontSize: "1rem" },
  notFound: { textAlign: "center", padding: "120px 24px" },
};

function renderBlock(block, index, slug) {
  switch (block.type) {
    case "heading":
      return <h2 key={index} style={s.h2}>{block.text}</h2>;
    case "paragraph":
      return <p key={index} style={s.p} dangerouslySetInnerHTML={{ __html: block.text }} />;
    case "highlight":
      return <p key={index} style={s.highlight}>{block.text}</p>;
    case "list":
      return (
        <ul key={index} style={s.list}>
          {(block.items || []).map((item, i) => (
            <li key={i} style={s.li} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
    case "lead-capture":
      return <BlogLeadCapture key={index} source={slug} />;
    default:
      return null;
  }
}

export default function DynamicBlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setPost(data);
        document.title = `${data.title} | doITbetter labs`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", data.meta_description || data.excerpt);
        window.scrollTo(0, 0);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div style={s.loading}>Loading...</div>;
  }

  if (notFound || !post) {
    return (
      <div style={s.notFound}>
        <h1 style={{ ...s.title, fontSize: "2rem", marginBottom: 20 }}>Post not found</h1>
        <Link to="/blog" style={{ color: "var(--accent)", fontSize: "1rem" }}>
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Draft";

  return (
    <div style={s.page}>
      <div style={s.article}>
        <Link to="/blog" style={s.back}>
          &larr; Back to Blog
        </Link>

        <h1 style={s.title}>{post.title}</h1>

        <div style={s.meta}>
          <span>{date}</span>
          <span style={s.dot} />
          <span>{post.read_time}</span>
        </div>

        <div style={s.body}>
          {(post.content || []).map((block, i) => renderBlock(block, i, slug))}

          <div style={s.cta}>
            <h3 style={s.ctaTitle}>Want to talk about your project?</h3>
            <p style={s.ctaText}>
              Free consultation — we'll scope your idea and give you a real
              number. No jargon, no obligations.
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
