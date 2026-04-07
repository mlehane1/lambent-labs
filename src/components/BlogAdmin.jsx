import { useState, useEffect } from "react";
import BlogLeadCapture from "./BlogLeadCapture.jsx";

const API = "/api/admin/blog";

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Reuse the same block renderer from DynamicBlogPost for preview
function renderBlock(block, index) {
  const s = {
    h2: { fontFamily: "'Outfit', sans-serif", fontSize: "1.55rem", fontWeight: 600, color: "var(--text-hi)", margin: "48px 0 16px" },
    p: { marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "var(--text-mid)" },
    highlight: { color: "var(--accent)", fontWeight: 600, marginBottom: 20, fontSize: "1.05rem" },
    list: { paddingLeft: 24, marginBottom: 24, fontFamily: "'DM Sans', sans-serif", color: "var(--text-mid)" },
    li: { marginBottom: 10 },
  };
  switch (block.type) {
    case "heading": return <h2 key={index} style={s.h2}>{block.text}</h2>;
    case "paragraph": return <p key={index} style={s.p} dangerouslySetInnerHTML={{ __html: block.text }} />;
    case "highlight": return <p key={index} style={s.highlight}>{block.text}</p>;
    case "list": return <ul key={index} style={s.list}>{(block.items || []).map((item, i) => <li key={i} style={s.li} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>;
    case "lead-capture": return <div key={index} style={{ padding: "16px", border: "1px dashed var(--border)", borderRadius: 8, textAlign: "center", color: "var(--text-lo)", fontSize: "0.85rem", margin: "24px 0" }}>[Email Capture Form]</div>;
    default: return null;
  }
}

export default function BlogAdmin({ onClose, adminPassword }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | editor
  const [editingPost, setEditingPost] = useState(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiEditInstruction, setAiEditInstruction] = useState("");

  const headers = {
    "Content-Type": "application/json",
    "x-admin-password": adminPassword,
  };

  const fetchPosts = () => {
    setLoading(true);
    fetch(API, { headers })
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const newPost = () => {
    setEditingPost({
      title: "", slug: "", excerpt: "", meta_description: "",
      content: [], tags: [], read_time: "5 min read", status: "draft",
    });
    setView("editor");
    setPreview(false);
  };

  const editPost = (post) => {
    fetch(`${API}/../admin/blog`, { headers })
      .then(r => r.json())
      .then(all => {
        const full = all.find(p => p.id === post.id);
        // Need full content — refetch with the list data we have
        // Actually the list endpoint returns enough to edit. Let's fetch single.
        return fetch(`/api/blog/${post.slug}`).then(r => r.ok ? r.json() : post);
      })
      .then(data => {
        setEditingPost({ ...post, ...data });
        setView("editor");
        setPreview(false);
      })
      .catch(() => {
        setEditingPost(post);
        setView("editor");
        setPreview(false);
      });
  };

  const deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers });
    fetchPosts();
  };

  const savePost = async (status) => {
    setSaving(true);
    const body = {
      ...editingPost,
      status: status || editingPost.status,
      tags: Array.isArray(editingPost.tags) ? editingPost.tags : editingPost.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      const isNew = !editingPost.id;
      const url = isNew ? API : `${API}/${editingPost.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        setEditingPost(data);
        fetchPosts();
      } else {
        alert(data.error || "Save failed");
      }
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const aiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai-generate`, {
        method: "POST", headers, body: JSON.stringify({ topic: aiPrompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingPost(prev => ({
          ...prev,
          title: data.title || prev.title,
          slug: data.slug || slugify(data.title || ""),
          excerpt: data.excerpt || prev.excerpt,
          meta_description: data.meta_description || prev.meta_description,
          content: data.content || prev.content,
          tags: data.tags || prev.tags,
          read_time: data.read_time || prev.read_time,
        }));
        setAiPrompt("");
      } else {
        alert(data.error || "AI generation failed");
      }
    } catch (err) {
      alert("AI generation failed: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const aiEdit = async () => {
    if (!aiEditInstruction.trim() || !editingPost?.content?.length) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai-edit`, {
        method: "POST", headers,
        body: JSON.stringify({ content: editingPost.content, instruction: aiEditInstruction }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setEditingPost(prev => ({ ...prev, content: data }));
        setAiEditInstruction("");
      } else {
        alert(data?.error || "AI edit failed");
      }
    } catch (err) {
      alert("AI edit failed: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%", background: "var(--bg-card2)", border: "1px solid var(--border-mid)",
    borderRadius: 8, padding: "8px 12px", color: "var(--text-hi)",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", color: "var(--text-lo)", fontSize: "0.72rem",
    marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase",
  };

  const btnStyle = (bg = "var(--primary)", border = "none") => ({
    padding: "8px 18px", background: bg, border,
    borderRadius: 8, color: "#fff", fontFamily: "'Outfit', sans-serif",
    fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "var(--bg-dark)", border: "1px solid var(--border)",
        borderRadius: 16, width: "100%", maxWidth: 1100, maxHeight: "90vh",
        display: "flex", flexDirection: "column", boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {view === "editor" && (
              <button onClick={() => { setView("list"); setEditingPost(null); }} style={{
                background: "none", border: "none", color: "var(--text-mid)",
                cursor: "pointer", fontSize: "0.88rem",
              }}>&larr; Back</button>
            )}
            <h3 style={{ margin: 0, color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem" }}>
              {view === "list" ? "Blog Manager" : editingPost?.id ? "Edit Post" : "New Post"}
            </h3>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {view === "list" && (
              <button onClick={newPost} style={btnStyle("var(--accent)")}>+ New Post</button>
            )}
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-lo)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
          {view === "list" ? (
            /* Post List */
            loading ? (
              <p style={{ color: "var(--text-lo)", textAlign: "center", padding: 40 }}>Loading...</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {posts.length === 0 && (
                  <p style={{ color: "var(--text-lo)", textAlign: "center", padding: 40 }}>
                    No blog posts yet. Click "+ New Post" to create one with AI.
                  </p>
                )}
                {posts.map((p) => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: 10, gap: 12,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{
                          fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                          background: p.status === "published" ? "rgba(21,203,136,0.15)" : p.status === "scheduled" ? "rgba(234,179,8,0.15)" : "rgba(139,92,246,0.15)",
                          color: p.status === "published" ? "var(--accent)" : p.status === "scheduled" ? "#CA8A04" : "#8B5CF6",
                        }}>
                          {p.status}{p.status === "scheduled" && p.scheduled_at ? " — " + new Date(p.scheduled_at).toLocaleDateString() : ""}
                        </span>
                        <span style={{ color: "var(--text-hi)", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.title}
                        </span>
                      </div>
                      <span style={{ color: "var(--text-lo)", fontSize: "0.75rem" }}>
                        /blog/{p.slug}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => editPost(p)} style={btnStyle("rgba(21,88,203,0.3)", "1px solid rgba(21,88,203,0.4)")}>Edit</button>
                      <button onClick={() => deletePost(p.id)} style={btnStyle("rgba(203,21,88,0.2)", "1px solid rgba(203,21,88,0.3)")}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Editor */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, minHeight: 0 }}>
              {/* Left: Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "auto" }}>
                {/* AI Generate */}
                <div style={{
                  padding: 16, background: "linear-gradient(135deg, rgba(21,88,203,0.08), rgba(21,203,136,0.06))",
                  border: "1px solid rgba(21,88,203,0.2)", borderRadius: 10,
                }}>
                  <label style={labelStyle}>Generate with AI</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && aiGenerate()}
                      placeholder="e.g. Why small businesses should invest in custom software in 2026"
                      style={{ ...fieldStyle, flex: 1 }}
                    />
                    <button onClick={aiGenerate} disabled={aiLoading} style={{ ...btnStyle("var(--accent)"), opacity: aiLoading ? 0.6 : 1 }}>
                      {aiLoading ? "Generating..." : "Generate"}
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <div>
                  <label style={labelStyle}>Title</label>
                  <input value={editingPost?.title || ""} onChange={(e) => {
                    const title = e.target.value;
                    setEditingPost(p => ({ ...p, title, slug: p.slug || slugify(title) }));
                  }} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input value={editingPost?.slug || ""} onChange={(e) => setEditingPost(p => ({ ...p, slug: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Excerpt</label>
                  <textarea value={editingPost?.excerpt || ""} onChange={(e) => setEditingPost(p => ({ ...p, excerpt: e.target.value }))} style={{ ...fieldStyle, minHeight: 60, resize: "vertical" }} />
                </div>
                <div>
                  <label style={labelStyle}>Meta Description</label>
                  <input value={editingPost?.meta_description || ""} onChange={(e) => setEditingPost(p => ({ ...p, meta_description: e.target.value }))} style={fieldStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Tags (comma-separated)</label>
                    <input value={Array.isArray(editingPost?.tags) ? editingPost.tags.join(", ") : editingPost?.tags || ""} onChange={(e) => setEditingPost(p => ({ ...p, tags: e.target.value }))} style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Read Time</label>
                    <input value={editingPost?.read_time || ""} onChange={(e) => setEditingPost(p => ({ ...p, read_time: e.target.value }))} style={fieldStyle} />
                  </div>
                </div>

                {/* AI Edit */}
                {editingPost?.content?.length > 0 && (
                  <div style={{
                    padding: 12, background: "rgba(139,92,246,0.06)",
                    border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10,
                  }}>
                    <label style={labelStyle}>Edit Content with AI</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={aiEditInstruction}
                        onChange={(e) => setAiEditInstruction(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && aiEdit()}
                        placeholder="e.g. Add a section about cost savings, shorten the intro"
                        style={{ ...fieldStyle, flex: 1 }}
                      />
                      <button onClick={aiEdit} disabled={aiLoading} style={{ ...btnStyle("#8B5CF6"), opacity: aiLoading ? 0.6 : 1 }}>
                        {aiLoading ? "Editing..." : "AI Edit"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Schedule */}
                <div style={{
                  padding: 12, background: "rgba(139,92,246,0.06)",
                  border: "1px solid rgba(139,92,246,0.15)", borderRadius: 10,
                }}>
                  <label style={labelStyle}>Schedule Publish Date (optional)</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="datetime-local"
                      value={editingPost.scheduled_at ? editingPost.scheduled_at.slice(0, 16) : ""}
                      onChange={(e) => setEditingPost({ ...editingPost, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      style={{ ...fieldStyle, flex: 1 }}
                    />
                    {editingPost.scheduled_at && (
                      <button onClick={() => setEditingPost({ ...editingPost, scheduled_at: null })} style={{ ...btnStyle("transparent", "1px solid var(--border)"), fontSize: "0.75rem" }}>
                        Clear
                      </button>
                    )}
                  </div>
                  {editingPost.status === "scheduled" && editingPost.scheduled_at && (
                    <p style={{ fontSize: "0.75rem", color: "#8B5CF6", margin: "6px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
                      Scheduled for {new Date(editingPost.scheduled_at).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, paddingTop: 8, flexWrap: "wrap" }}>
                  <button onClick={() => savePost("draft")} disabled={saving} style={btnStyle("rgba(21,88,203,0.4)", "1px solid rgba(21,88,203,0.5)")}>
                    {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button onClick={() => {
                    if (!editingPost.scheduled_at) { alert("Set a date above first"); return; }
                    savePost("scheduled");
                  }} disabled={saving} style={btnStyle("rgba(139,92,246,0.4)", "1px solid rgba(139,92,246,0.5)")}>
                    {saving ? "Scheduling..." : "Schedule"}
                  </button>
                  <button onClick={() => savePost("published")} disabled={saving} style={btnStyle("var(--accent)")}>
                    {saving ? "Publishing..." : "Publish Now"}
                  </button>
                  <button onClick={() => setPreview(!preview)} style={btnStyle("transparent", "1px solid var(--border)")}>
                    {preview ? "Hide Preview" : "Preview"}
                  </button>
                </div>
              </div>

              {/* Right: Preview */}
              <div style={{
                overflow: "auto", padding: 20,
                background: preview ? "var(--bg-deep)" : "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: 10,
              }}>
                {preview && editingPost?.content?.length > 0 ? (
                  <div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--text-hi)", lineHeight: 1.2, marginBottom: 24 }}>
                      {editingPost.title}
                    </h1>
                    {editingPost.content.map((block, i) => renderBlock(block, i))}
                  </div>
                ) : editingPost?.content?.length > 0 ? (
                  <div>
                    <label style={labelStyle}>Content Blocks ({editingPost.content.length})</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {editingPost.content.map((block, i) => (
                        <div key={i} style={{
                          padding: "8px 10px", background: "var(--bg-card2)", borderRadius: 6,
                          border: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-mid)",
                        }}>
                          <span style={{
                            display: "inline-block", fontSize: "0.68rem", fontWeight: 600,
                            padding: "1px 6px", borderRadius: 3, marginRight: 8,
                            background: "rgba(21,88,203,0.15)", color: "var(--primary-lt)",
                          }}>
                            {block.type}
                          </span>
                          {block.type === "lead-capture" ? "[email form]" :
                            block.type === "list" ? (block.items || []).join(", ").substring(0, 80) + "..." :
                              (block.text || "").substring(0, 80) + ((block.text || "").length > 80 ? "..." : "")}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "var(--text-lo)", textAlign: "center", padding: 40, fontSize: "0.88rem" }}>
                    Use "Generate with AI" to create content, or content blocks will appear here.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
