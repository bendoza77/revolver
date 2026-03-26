import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection, onSnapshot, deleteDoc, doc, orderBy, query,
  addDoc, updateDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PRICING_PLANS, ADDON_PRICES, TIKTOK_PRICES } from "@constants/pricing";
import { CATEGORY_COLORS } from "@constants/blog";
import { PORTFOLIO_FILTERS } from "@constants/portfolio";

/* ─── helpers ──────────────────────────────────────────────── */
function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const toSlug = (t) =>
  t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

const toDisplayDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const toInputDate = (display) => {
  if (!display) return "";
  const d = new Date(display);
  return isNaN(d) ? "" : d.toISOString().split("T")[0];
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

/* ─── shared UI ────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#e85d04] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Empty({ text, action }) {
  return (
    <div className="text-center py-16">
      <p className="text-white/30 text-sm mb-4">{text}</p>
      {action}
    </div>
  );
}

function SectionHeader({ title, count, children }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-white font-display font-700 text-lg">{title}</h2>
        {count !== undefined && (
          <span className="text-xs bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Badge({ children, color = "orange" }) {
  const cls = color === "orange"
    ? "bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20"
    : "bg-white/5 text-white/50 border border-white/10";
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{children}</span>;
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-white/80 text-sm">{value || "—"}</p>
    </div>
  );
}

function FormInput({ label, hint, ...props }) {
  return (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wide mb-1.5">{label}</label>
      {hint && <p className="text-white/30 text-xs mb-1.5">{hint}</p>}
      <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#e85d04]/40 focus:bg-white/8 transition-colors"
      />
    </div>
  );
}

function FormTextarea({ label, hint, rows = 4, ...props }) {
  return (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wide mb-1.5">{label}</label>
      {hint && <p className="text-white/30 text-xs mb-1.5">{hint}</p>}
      <textarea
        rows={rows}
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#e85d04]/40 focus:bg-white/8 transition-colors resize-y"
      />
    </div>
  );
}

function FormSelect({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wide mb-1.5">{label}</label>
      <select
        {...props}
        className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#e85d04]/40 transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Btn({ children, variant = "primary", size = "sm", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 font-medium rounded-xl transition-colors duration-150 cursor-pointer";
  const sizes = { sm: "text-xs px-3 py-2", md: "text-sm px-4 py-2.5" };
  const variants = {
    primary: "bg-[#e85d04] hover:bg-[#ff6a0a] text-white",
    outline: "border border-white/15 hover:border-white/30 text-white/70 hover:text-white bg-transparent",
    ghost:   "text-white/50 hover:text-white hover:bg-white/5 bg-transparent",
    danger:  "text-red-400/70 hover:text-red-400 hover:bg-red-400/5 bg-transparent border border-transparent",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ─── Overview ─────────────────────────────────────────────── */
function Overview({ onNavigate }) {
  const [counts, setCounts] = useState({ submissions: 0, blog: 0 });

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "submissions"), (s) => {
      setCounts((c) => ({ ...c, submissions: s.size }));
    });
    const u2 = onSnapshot(collection(db, "blog_posts"), (s) => {
      setCounts((c) => ({ ...c, blog: s.size }));
    });
    return () => { u1(); u2(); };
  }, []);

  const stats = [
    { label: "Contact Leads", value: counts.submissions, icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", nav: "submissions" },
    { label: "Blog Posts", value: counts.blog, icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z", nav: "blog" },
  ];

  return (
    <div>
      <SectionHeader title="Overview" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.nav)}
            className="rounded-2xl border border-white/8 bg-white/3 px-6 py-5 text-left hover:border-[#e85d04]/20 hover:bg-white/5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#e85d04]/10 border border-[#e85d04]/20 flex items-center justify-center text-[#e85d04]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="text-white/20 group-hover:text-white/50 transition-colors">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <p className="text-white font-display font-700 text-3xl">{s.value}</p>
            <p className="text-white/40 text-xs mt-1 tracking-wide">{s.label}</p>
          </button>
        ))}
      </div>

      <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        <Btn size="md" onClick={() => onNavigate("blog")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Blog Post
        </Btn>
        <Btn size="md" variant="outline" onClick={() => onNavigate("pricing")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Edit Pricing
        </Btn>
        <Btn size="md" variant="outline" onClick={() => onNavigate("submissions")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          View Submissions
        </Btn>
      </div>
    </div>
  );
}

/* ─── Submissions ───────────────────────────────────────────── */
function Submissions() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this submission?")) return;
    await deleteDoc(doc(db, "submissions", id));
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Contact Submissions" count={items.length} />
      {items.length === 0 ? (
        <Empty text="No submissions yet." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#e85d04]/10 border border-[#e85d04]/20 flex items-center justify-center text-[#e85d04] font-display font-700 text-sm flex-shrink-0">
                    {(item.name || "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-600 truncate">{item.name || "Unknown"}</p>
                    <p className="text-white/40 text-xs truncate">{item.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {item.service && <Badge>{item.service}</Badge>}
                  <span className="text-white/30 text-xs hidden sm:block">{formatDate(item.createdAt)}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-white/30 transition-transform duration-200 ${expanded === item.id ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              {expanded === item.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Field label="Name"    value={item.name} />
                    <Field label="Email"   value={item.email} />
                    <Field label="Service" value={item.service} />
                    <Field label="Date"    value={formatDate(item.createdAt)} />
                  </div>
                  {item.message && (
                    <div className="mb-4">
                      <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Message</p>
                      <p className="text-white/80 text-sm leading-relaxed bg-white/3 rounded-lg px-4 py-3 border border-white/5">
                        {item.message}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <a href={`mailto:${item.email}`}
                      className="text-xs bg-[#e85d04]/10 hover:bg-[#e85d04]/20 text-[#e85d04] border border-[#e85d04]/20 px-3 py-1.5 rounded-lg transition-colors">
                      Reply via Email
                    </a>
                    <Btn variant="danger" onClick={() => remove(item.id)}>Delete</Btn>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Blog admin ────────────────────────────────────────────── */
const BLANK_POST = {
  title:    "",
  slug:     "",
  category: CATEGORIES[0],
  excerpt:  "",
  date:     new Date().toISOString().split("T")[0],
  readTime: "5 min read",
  featured: false,
  body:     "",
};

function BlogEditor({ post, onSave, onCancel, saving }) {
  const isNew = !post?.firestoreId;
  const [form, setForm] = useState(() => {
    if (!post) return BLANK_POST;
    return {
      title:    post.title    ?? "",
      slug:     post.slug     ?? "",
      category: post.category ?? CATEGORIES[0],
      excerpt:  post.excerpt  ?? "",
      date:     toInputDate(post.date) || new Date().toISOString().split("T")[0],
      readTime: post.readTime ?? "5 min read",
      featured: post.featured ?? false,
      body:     post.body     ?? "",
    };
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v) => {
    set("title", v);
    if (isNew) set("slug", toSlug(v));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, date: toDisplayDate(form.date) || form.date });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Btn variant="ghost" onClick={onCancel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </Btn>
        <h2 className="text-white font-display font-700 text-lg">
          {isNew ? "New Blog Post" : "Edit Post"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="Title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title…"
            required
          />
          <FormInput
            label="Slug"
            hint="URL: /blog/your-slug"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-generated-from-title"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormSelect
            label="Category"
            options={CATEGORIES}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          />
          <FormInput
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
          <FormInput
            label="Read Time"
            value={form.readTime}
            onChange={(e) => set("readTime", e.target.value)}
            placeholder="5 min read"
          />
        </div>

        <FormTextarea
          label="Excerpt"
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          placeholder="Short description shown on blog listing…"
          required
        />

        <FormTextarea
          label="Body"
          hint="Supports markdown headings (##), bold (**text**), bullet lists (- item)"
          rows={16}
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="Write your post content here…"
          required
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("featured", !form.featured)}
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0 ${
              form.featured ? "bg-[#e85d04]" : "bg-white/15"
            }`}
            style={{ height: "22px" }}
          >
            <span
              className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${
                form.featured ? "translate-x-5" : "translate-x-0.5"
              }`}
              style={{ width: "18px", height: "18px" }}
            />
          </button>
          <span className="text-white/60 text-sm">Featured post</span>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <Btn type="submit" size="md" disabled={saving}>
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {isNew ? "Publish Post" : "Save Changes"}
              </>
            )}
          </Btn>
          <Btn variant="outline" size="md" type="button" onClick={onCancel}>Cancel</Btn>
        </div>
      </form>
    </div>
  );
}

function BlogAdmin() {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState("list"); // "list" | "editor"
  const [editPost, setEditPost] = useState(null);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    const q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const handleNew = () => { setEditPost(null); setView("editor"); };
  const handleEdit = (post) => { setEditPost(post); setView("editor"); };
  const handleCancel = () => setView("list");

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editPost?.firestoreId) {
        const { firestoreId, ...rest } = data;
        await updateDoc(doc(db, "blog_posts", editPost.firestoreId), { ...rest, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "blog_posts"), { ...data, createdAt: serverTimestamp() });
      }
      setView("list");
    } catch (err) {
      console.error(err);
      alert("Failed to save post. Check console.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await deleteDoc(doc(db, "blog_posts", id));
  };

  if (view === "editor") {
    return <BlogEditor post={editPost} onSave={handleSave} onCancel={handleCancel} saving={saving} />;
  }

  return (
    <div>
      <SectionHeader title="Blog Posts" count={posts.length}>
        <Btn size="md" onClick={handleNew}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Post
        </Btn>
      </SectionHeader>

      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <Empty
          text="No posts in Firestore yet. The site is showing built-in posts."
          action={
            <Btn size="md" onClick={handleNew}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create First Post
            </Btn>
          }
        />
      ) : (
        <div className="space-y-2">
          {posts.map((post) => {
            const catColor = CATEGORY_COLORS[post.category] ?? "#e85d04";
            return (
              <div
                key={post.firestoreId}
                className="rounded-xl border border-white/8 bg-white/3 px-5 py-4 flex items-center gap-4 hover:border-white/15 transition-colors"
              >
                {/* Category dot */}
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: catColor }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-600 truncate">{post.title}</p>
                    {post.featured && (
                      <span className="text-[10px] bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-white/35 text-xs mt-0.5 truncate">
                    <span style={{ color: catColor + "cc" }}>{post.category}</span>
                    {post.date && <> · {post.date}</>}
                    {post.readTime && <> · {post.readTime}</>}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Btn variant="ghost" onClick={() => handleEdit(post)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </Btn>
                  <Btn variant="danger" onClick={() => handleDelete(post.firestoreId)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                    Delete
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Pricing admin ─────────────────────────────────────────── */
const DEFAULT_FORM = {
  plans:  PRICING_PLANS,
  addons: ADDON_PRICES,
  tiktok: TIKTOK_PRICES,
};

function PricingAdmin() {
  const [form,   setForm]   = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "pricing"),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setForm({
            plans:  d.plans  ?? DEFAULT_FORM.plans,
            addons: d.addons ?? DEFAULT_FORM.addons,
            tiktok: d.tiktok ?? DEFAULT_FORM.tiktok,
          });
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const updatePlanPrice  = (key, price) => setForm((f) => ({ ...f, plans: f.plans.map((p) => p.key === key ? { ...p, price } : p) }));
  const togglePopular    = (key)        => setForm((f) => ({ ...f, plans: f.plans.map((p) => ({ ...p, popular: p.key === key ? !p.popular : false })) }));
  const updateAddon      = (key, price) => setForm((f) => ({ ...f, addons: { ...f.addons, [key]: price } }));
  const updateTiktok     = (key, price) => setForm((f) => ({ ...f, tiktok: { ...f.tiktok, [key]: price } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "pricing"), form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save pricing. Check console.");
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (!confirm("Reset pricing to built-in defaults?")) return;
    setForm(DEFAULT_FORM);
  };

  if (loading) return <Spinner />;

  const PLAN_LABELS = { starter: "Starter", business: "Business", premium: "Premium" };

  return (
    <div>
      <SectionHeader title="Pricing">
        <div className="flex items-center gap-2">
          <Btn variant="outline" size="md" onClick={handleReset}>Reset to Defaults</Btn>
          <Btn size="md" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Save Changes
              </>
            )}
          </Btn>
        </div>
      </SectionHeader>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Pricing saved! Live on the site.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main plans */}
      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Main Plans</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {form.plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-xl border p-5 transition-colors ${
                plan.popular
                  ? "border-[#e85d04]/40 bg-[#e85d04]/5"
                  : "border-white/8 bg-white/3"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/70 text-sm font-600 uppercase tracking-wider">
                  {PLAN_LABELS[plan.key] ?? plan.key}
                </span>
                <button
                  onClick={() => togglePopular(plan.key)}
                  className={`text-[10px] px-2 py-1 rounded-full border font-medium transition-colors ${
                    plan.popular
                      ? "bg-[#e85d04]/10 text-[#e85d04] border-[#e85d04]/30"
                      : "bg-white/5 text-white/30 border-white/10 hover:border-white/20"
                  }`}
                >
                  {plan.popular ? "★ Popular" : "Set Popular"}
                </button>
              </div>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wide mb-1.5">Price / month</label>
                <input
                  value={plan.price}
                  onChange={(e) => updatePlanPrice(plan.key, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-display font-700 text-lg placeholder-white/20 focus:outline-none focus:border-[#e85d04]/40 transition-colors"
                  placeholder="1,500₾"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Add-ons</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "reel",   label: "Reel Production" },
            { key: "google", label: "Google Ads Setup" },
            { key: "audio",  label: "Audio Branding"   },
          ].map(({ key, label }) => (
            <div key={key} className="rounded-xl border border-white/8 bg-white/3 p-5">
              <label className="block text-white/50 text-xs uppercase tracking-wide mb-3">{label}</label>
              <input
                value={form.addons[key] ?? ""}
                onChange={(e) => updateAddon(key, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#e85d04] font-display font-700 text-lg placeholder-white/20 focus:outline-none focus:border-[#e85d04]/40 transition-colors"
                placeholder="350₾"
              />
            </div>
          ))}
        </div>
      </div>

      {/* TikTok */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">TikTok Packages</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "starter", label: "Starter Package" },
            { key: "growth",  label: "Growth Package"  },
          ].map(({ key, label }) => (
            <div key={key} className="rounded-xl border border-white/8 bg-white/3 p-5">
              <label className="block text-white/50 text-xs uppercase tracking-wide mb-3">{label}</label>
              <input
                value={form.tiktok[key] ?? ""}
                onChange={(e) => updateTiktok(key, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#e85d04] font-display font-700 text-lg placeholder-white/20 focus:outline-none focus:border-[#e85d04]/40 transition-colors"
                placeholder="1,200₾/mo"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Portfolio admin ───────────────────────────────────────── */
const PORTFOLIO_TAGS = PORTFOLIO_FILTERS.filter((f) => f !== "All");

const BG_PRESETS = [
  { label: "Orange",  value: "from-orange-950 to-stone-950"   },
  { label: "Amber",   value: "from-amber-950 to-stone-950"    },
  { label: "Red",     value: "from-red-950 to-stone-950"      },
  { label: "Yellow",  value: "from-yellow-950 to-stone-950"   },
  { label: "Rose",    value: "from-rose-950 to-stone-950"     },
  { label: "Purple",  value: "from-purple-950 to-neutral-950" },
  { label: "Blue",    value: "from-blue-950 to-stone-950"     },
  { label: "Green",   value: "from-green-950 to-stone-950"    },
  { label: "Teal",    value: "from-teal-950 to-neutral-950"   },
  { label: "Neutral", value: "from-neutral-900 to-stone-950"  },
];

const BLANK_PROJECT = {
  title:  "",
  result: "",
  tag:    PORTFOLIO_TAGS[0],
  icon:   "✨",
  color:  "#e85d04",
  bg:     BG_PRESETS[0].value,
};

function PortfolioEditor({ project, onSave, onCancel, saving }) {
  const isNew = !project?.firestoreId;
  const [form, setForm] = useState(() => project ? {
    title:  project.title  ?? "",
    result: project.result ?? "",
    tag:    project.tag    ?? PORTFOLIO_TAGS[0],
    icon:   project.icon   ?? "✨",
    color:  project.color  ?? "#e85d04",
    bg:     project.bg     ?? BG_PRESETS[0].value,
  } : { ...BLANK_PROJECT });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Btn variant="ghost" onClick={onCancel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </Btn>
        <h2 className="text-white font-display font-700 text-lg">
          {isNew ? "New Project" : "Edit Project"}
        </h2>
      </div>

      {/* Live preview card */}
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${form.bg} border border-white/10 h-36 mb-6 flex flex-col justify-between p-5`}>
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/30 border border-white/10 text-white/70">
            {form.tag}
          </span>
          <span className="text-2xl">{form.icon || "✨"}</span>
        </div>
        <div>
          <div className="font-display text-sm font-700 text-white mb-0.5">{form.title || "Project Title"}</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: form.color }} />
            <span className="text-white/60 text-xs">{form.result || "Result metric"}</span>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 100%, ${form.color}22 0%, transparent 60%)` }} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput label="Project Title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="FitLife Brand Launch" required />
          <FormInput label="Result / Metric" value={form.result} onChange={(e) => set("result", e.target.value)} placeholder="+520% brand reach" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormSelect label="Tag / Category" options={PORTFOLIO_TAGS} value={form.tag} onChange={(e) => set("tag", e.target.value)} />
          <FormInput label="Icon (emoji)" value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="🏋️" />
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wide mb-1.5">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
              <input value={form.color} onChange={(e) => set("color", e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#e85d04]/40 transition-colors"
                placeholder="#e85d04" />
            </div>
          </div>
        </div>

        {/* Background gradient picker */}
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wide mb-3">Background Gradient</label>
          <div className="grid grid-cols-5 gap-2">
            {BG_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => set("bg", preset.value)}
                className={`rounded-xl h-10 bg-gradient-to-br ${preset.value} border-2 transition-all ${
                  form.bg === preset.value ? "border-[#e85d04] scale-105" : "border-transparent hover:border-white/20"
                }`}
                title={preset.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <Btn type="submit" size="md" disabled={saving}>
            {saving ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {isNew ? "Add Project" : "Save Changes"}</>
            )}
          </Btn>
          <Btn variant="outline" size="md" type="button" onClick={onCancel}>Cancel</Btn>
        </div>
      </form>
    </div>
  );
}

function PortfolioAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const handleNew    = () => { setEditItem(null); setView("editor"); };
  const handleEdit   = (p)  => { setEditItem(p);  setView("editor"); };
  const handleCancel = ()   => setView("list");

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editItem?.firestoreId) {
        await updateDoc(doc(db, "portfolio", editItem.firestoreId), { ...data, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "portfolio"), { ...data, createdAt: serverTimestamp() });
      }
      setView("list");
    } catch (err) {
      console.error(err);
      alert("Failed to save project.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteDoc(doc(db, "portfolio", id));
  };

  if (view === "editor") {
    return <PortfolioEditor project={editItem} onSave={handleSave} onCancel={handleCancel} saving={saving} />;
  }

  const TAG_COLORS = {
    "Social Media": "#3b82f6",
    "Video":        "#a855f7",
    "Branding":     "#f59e0b",
    "Ads":          "#10b981",
  };

  return (
    <div>
      <SectionHeader title="Portfolio" count={projects.length}>
        <Btn size="md" onClick={handleNew}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </Btn>
      </SectionHeader>

      {loading ? <Spinner /> : projects.length === 0 ? (
        <Empty
          text="No Firestore projects yet. The site shows built-in projects."
          action={<Btn size="md" onClick={handleNew}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add First Project
          </Btn>}
        />
      ) : (
        <div className="space-y-2">
          {projects.map((p) => {
            const tagColor = TAG_COLORS[p.tag] ?? "#e85d04";
            return (
              <div key={p.firestoreId}
                className="rounded-xl border border-white/8 bg-white/3 px-5 py-4 flex items-center gap-4 hover:border-white/15 transition-colors">
                {/* Mini preview */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.bg} flex items-center justify-center flex-shrink-0 text-lg border border-white/10`}>
                  {p.icon}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-600 truncate">{p.title}</p>
                  <p className="text-white/35 text-xs mt-0.5 truncate">
                    <span style={{ color: tagColor + "cc" }}>{p.tag}</span>
                    {p.result && <> · {p.result}</>}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Btn variant="ghost" onClick={() => handleEdit(p)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </Btn>
                  <Btn variant="danger" onClick={() => handleDelete(p.firestoreId)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                    Delete
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar nav ───────────────────────────────────────────── */
const NAV = [
  {
    id: "overview", label: "Overview",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>,
  },
  {
    id: "submissions", label: "Submissions",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>,
  },
  {
    id: "blog", label: "Blog Posts",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>,
  },
  {
    id: "pricing", label: "Pricing",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>,
  },
  {
    id: "portfolio", label: "Portfolio",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>,
  },
];

/* ─── Shell ─────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { logout }  = useAuth();
  const navigate    = useNavigate();
  const [active,      setActive]      = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/revolver-studio/login");
  };

  const goTo = (id) => {
    setActive(id);
    setSidebarOpen(false);
  };

  const Panel = {
    overview:    () => <Overview onNavigate={goTo} />,
    submissions: () => <Submissions />,
    blog:        () => <BlogAdmin />,
    pricing:     () => <PricingAdmin />,
    portfolio:   () => <PortfolioAdmin />,
  }[active];

  return (
    <div className="min-h-screen bg-[#080808] flex">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-30 w-60 flex flex-col
        bg-[#0d0d0d] border-r border-white/5
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border-2 border-[#e85d04] flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" fill="#e85d04" />
                <path d="M10 2v3M10 15v3M2 10h3M15 10h3" stroke="#e85d04" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-white font-display font-800 text-sm tracking-wider leading-none">REVOLVER</p>
              <p className="text-white/30 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150 ${
                active === item.id
                  ? "bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20"
                  : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-colors duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#080808] sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white/50 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <h1 className="text-white/60 text-sm hidden lg:block">
            {NAV.find((n) => n.id === active)?.label}
          </h1>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View Site
          </a>
        </header>

        {/* Panel */}
        <main className="flex-1 p-5 sm:p-8 max-w-4xl w-full">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Panel />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
