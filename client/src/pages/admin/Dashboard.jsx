import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection, onSnapshot, deleteDoc, doc, orderBy, query,
  addDoc, updateDoc, setDoc, serverTimestamp, getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PRICING_PLANS, ADDON_PRICES, TIKTOK_PRICES } from "@constants/pricing";
import { CATEGORY_COLORS } from "@constants/blog";
import { PORTFOLIO_FILTERS } from "@constants/portfolio";
import enDefaults from "@/i18n/locales/en.json";
import kaDefaults from "@/i18n/locales/ka.json";

/* ─── helpers ──────────────────────────────────────────────── */
function deepMerge(target, source) {
  if (!source || typeof source !== "object") return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] === null || source[key] === undefined) continue;
    if (Array.isArray(source[key])) {
      result[key] = source[key];
    } else if (
      typeof source[key] === "object" &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

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
    { label: "კონტაქტები", value: counts.submissions, icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", nav: "submissions" },
    { label: "სტატიები", value: counts.blog, icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z", nav: "blog" },
  ];

  return (
    <div>
      <SectionHeader title="მიმოხილვა" />
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

      <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">სწრაფი მოქმედებები</h3>
      <div className="flex flex-wrap gap-3">
        <Btn size="md" onClick={() => onNavigate("blog")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ახალი სტატია
        </Btn>
        <Btn size="md" variant="outline" onClick={() => onNavigate("pricing")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          ფასების რედაქტირება
        </Btn>
        <Btn size="md" variant="outline" onClick={() => onNavigate("submissions")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          განაცხადების ნახვა
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

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const remove = async (id) => {
    if (!confirm("წაიშალოს ეს განაცხადი?")) return;
    await deleteDoc(doc(db, "submissions", id));
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="კონტაქტის განაცხადები" count={items.length}>
        <Btn variant="outline" size="md" onClick={fetchSubmissions}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          განახლება
        </Btn>
      </SectionHeader>
      {items.length === 0 ? (
        <Empty text="განაცხადები ჯერ არ არის." />
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
                    <Field label="სახელი"    value={item.name} />
                    <Field label="ელ-ფოსტა"   value={item.email} />
                    <Field label="სერვისი" value={item.service} />
                    <Field label="თარიღი"    value={formatDate(item.createdAt)} />
                  </div>
                  {item.message && (
                    <div className="mb-4">
                      <p className="text-white/40 text-xs uppercase tracking-wide mb-1">შეტყობინება</p>
                      <p className="text-white/80 text-sm leading-relaxed bg-white/3 rounded-lg px-4 py-3 border border-white/5">
                        {item.message}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <a href={`mailto:${item.email}`}
                      className="text-xs bg-[#e85d04]/10 hover:bg-[#e85d04]/20 text-[#e85d04] border border-[#e85d04]/20 px-3 py-1.5 rounded-lg transition-colors">
                      ელ-ფოსტით პასუხი
                    </a>
                    <Btn variant="danger" onClick={() => remove(item.id)}>წაშლა</Btn>
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
          უკან
        </Btn>
        <h2 className="text-white font-display font-700 text-lg">
          {isNew ? "ახალი სტატია" : "სტატიის რედაქტირება"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="სათაური"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="სტატიის სათაური..."
            required
          />
          <FormInput
            label="Slug"
            hint="URL: /blog/თქვენი-slug"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="ავტომატურად სათაურიდან"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormSelect
            label="კატეგორია"
            options={CATEGORIES}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          />
          <FormInput
            label="თარიღი"
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
          <FormInput
            label="კითხვის დრო"
            value={form.readTime}
            onChange={(e) => set("readTime", e.target.value)}
            placeholder="5 წუთი"
          />
        </div>

        <FormTextarea
          label="ამონაწერი"
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          placeholder="მოკლე აღწერა ბლოგის სიაში..."
          required
        />

        <FormTextarea
          label="შინაარსი"
          hint="მხარს უჭერს markdown სათაურებს (##), bold (**ტექსტი**), სიებს (- ელემენტი)"
          rows={16}
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="დაწერეთ სტატიის შინაარსი აქ..."
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
          <span className="text-white/60 text-sm">გამორჩეული სტატია</span>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <Btn type="submit" size="md" disabled={saving}>
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ინახება...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {isNew ? "სტატიის გამოქვეყნება" : "ცვლილებების შენახვა"}
              </>
            )}
          </Btn>
          <Btn variant="outline" size="md" type="button" onClick={onCancel}>გაუქმება</Btn>
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
      alert("სტატიის შენახვა ვერ მოხერხდა.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("წაიშალოს ეს სტატია? ეს შეუქცევადია.")) return;
    await deleteDoc(doc(db, "blog_posts", id));
  };

  if (view === "editor") {
    return <BlogEditor post={editPost} onSave={handleSave} onCancel={handleCancel} saving={saving} />;
  }

  return (
    <div>
      <SectionHeader title="სტატიები" count={posts.length}>
        <Btn size="md" onClick={handleNew}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ახალი სტატია
        </Btn>
      </SectionHeader>

      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <Empty
          text="Firestore-ში სტატიები ჯერ არ არის. საიტი ნაგულისხმევ სტატიებს აჩვენებს."
          action={
            <Btn size="md" onClick={handleNew}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              პირველი სტატიის შექმნა
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
                        გამორჩეული
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
                    რედაქტირება
                  </Btn>
                  <Btn variant="danger" onClick={() => handleDelete(post.firestoreId)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                    წაშლა
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
      alert("ფასების შენახვა ვერ მოხერხდა.");
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (!confirm("აღდგეს ნაგულისხმევი ფასები?")) return;
    setForm(DEFAULT_FORM);
  };

  if (loading) return <Spinner />;

  const PLAN_LABELS = { starter: "სტარტერი", business: "ბიზნესი", premium: "პრემიუმი" };

  return (
    <div>
      <SectionHeader title="ფასები">
        <div className="flex items-center gap-2">
          <Btn variant="outline" size="md" onClick={handleReset}>ნაგულისხმევის აღდგენა</Btn>
          <Btn size="md" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ინახება...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                შენახვა
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
            ფასები შენახულია! საიტზე ახლა ჩანს.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main plans */}
      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">მთავარი პაკეტები</p>
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
                  {plan.popular ? "★ პოპულარული" : "პოპულარულად მონიშვნა"}
                </button>
              </div>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wide mb-1.5">ფასი / თვეში</label>
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
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">დამატებითი სერვისები</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "reel",   label: "რილის პროდუქცია" },
            { key: "google", label: "Google Ads-ის დაყენება" },
            { key: "audio",  label: "ოდიო ბრენდინგი"   },
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
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">TikTok პაკეტები</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "starter", label: "საწყისი პაკეტი" },
            { key: "growth",  label: "ზრდის პაკეტი"  },
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
  { label: "ნარინჯისფერი",  value: "from-orange-950 to-stone-950"   },
  { label: "ქარვისფერი",   value: "from-amber-950 to-stone-950"    },
  { label: "წითელი",     value: "from-red-950 to-stone-950"      },
  { label: "ყვითელი",  value: "from-yellow-950 to-stone-950"   },
  { label: "ვარდისფერი",    value: "from-rose-950 to-stone-950"     },
  { label: "იისფერი",  value: "from-purple-950 to-neutral-950" },
  { label: "ლურჯი",    value: "from-blue-950 to-stone-950"     },
  { label: "მწვანე",   value: "from-green-950 to-stone-950"    },
  { label: "ცისფერი",    value: "from-teal-950 to-neutral-950"   },
  { label: "ნეიტრალური", value: "from-neutral-900 to-stone-950"  },
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
          უკან
        </Btn>
        <h2 className="text-white font-display font-700 text-lg">
          {isNew ? "ახალი პროექტი" : "პროექტის რედაქტირება"}
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
          <FormInput label="პროექტის სათაური" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="FitLife Brand Launch" required />
          <FormInput label="შედეგი / მეტრიკა" value={form.result} onChange={(e) => set("result", e.target.value)} placeholder="+520% brand reach" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormSelect label="კატეგორია" options={PORTFOLIO_TAGS} value={form.tag} onChange={(e) => set("tag", e.target.value)} />
          <FormInput label="იკონი (emoji)" value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="🏋️" />
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wide mb-1.5">აქცენტის ფერი</label>
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
          <label className="block text-white/50 text-xs uppercase tracking-wide mb-3">ფონის გრადიენტი</label>
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
              {isNew ? "პროექტის დამატება" : "ცვლილებების შენახვა"}</>
            )}
          </Btn>
          <Btn variant="outline" size="md" type="button" onClick={onCancel}>გაუქმება</Btn>
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
      alert("პროექტის შენახვა ვერ მოხერხდა.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("წაიშალოს ეს პროექტი? ეს შეუქცევადია.")) return;
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
      <SectionHeader title="პორტფოლიო" count={projects.length}>
        <Btn size="md" onClick={handleNew}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ახალი პროექტი
        </Btn>
      </SectionHeader>

      {loading ? <Spinner /> : projects.length === 0 ? (
        <Empty
          text="Firestore-ში პროექტები ჯერ არ არის. საიტი ნაგულისხმევ პროექტებს აჩვენებს."
          action={<Btn size="md" onClick={handleNew}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            პირველი პროექტის დამატება
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
                    რედაქტირება
                  </Btn>
                  <Btn variant="danger" onClick={() => handleDelete(p.firestoreId)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                    წაშლა
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

/* ─── Site Content Admin ────────────────────────────────────── */
const CONTENT_SECTIONS = [
  { id: "hero",          label: "მთავარი" },
  { id: "nav",           label: "ნავიგაცია" },
  { id: "marquee",       label: "მარქი" },
  { id: "services",      label: "სერვისები" },
  { id: "benefits",      label: "უპირატესობები" },
  { id: "pricing_text",  label: "ფასების ტექსტი" },
  { id: "contact",       label: "საკონტაქტო" },
  { id: "footer",        label: "ქვედა ნაწილი" },
  { id: "about",         label: "ჩვენ შესახებ" },
  { id: "work",          label: "ჩვენი სამუშაო" },
  { id: "service_pages", label: "სერვ. გვერდები" },
  { id: "pricing_page",  label: "ფასების გვერდი" },
  { id: "blog",          label: "ბლოგი" },
];

function SiteContentAdmin() {
  const [lang, setLang] = useState("en");
  const [activeSection, setActiveSection] = useState("hero");
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    const defaults = lang === "en" ? enDefaults : kaDefaults;
    const unsub = onSnapshot(
      doc(db, "settings", `content_${lang}`),
      (snap) => {
        setDraft(deepMerge(defaults, snap.exists() ? snap.data() : {}));
        setLoading(false);
      },
      () => {
        setDraft(lang === "en" ? enDefaults : kaDefaults);
        setLoading(false);
      }
    );
    return unsub;
  }, [lang]);

  /* path-based getters / setters */
  const get = (path) => {
    const keys = path.split(".");
    let v = draft;
    for (const k of keys) {
      if (v == null) return "";
      v = v[k];
    }
    if (Array.isArray(v)) return v.join("\n");
    return typeof v === "string" ? v : "";
  };

  const set = (path, value) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof obj[keys[i]] !== "object" || obj[keys[i]] === null) {
          obj[keys[i]] = {};
        } else if (Array.isArray(obj[keys[i]])) {
          obj[keys[i]] = { ...obj[keys[i]] };
        }
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setArr = (path, text) =>
    set(path, text.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim() !== ""));

  const getObjArr = (path) => {
    const keys = path.split(".");
    let v = draft;
    for (const k of keys) {
      if (v == null) return [];
      v = v[k];
    }
    return Array.isArray(v) ? v : [];
  };

  const setObjArr = (path, arr) => set(path, arr);

  const save = async () => {
    setSaving(true);
    try {
      const clean = JSON.parse(JSON.stringify(draft));
      await setDoc(doc(db, "settings", `content_${lang}`), clean);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("კონტენტის შენახვა ვერ მოხერხდა.");
    }
    setSaving(false);
  };

  const renderSection = () => {
    switch (activeSection) {

      /* ── HERO ── */
      case "hero": return (
        <div className="space-y-4">
          <p className="text-white/30 text-xs">მთავარი სექცია — პირველი რასაც სტუმრები ხედავენ.</p>
          <FormInput label="Badge Text" value={get("hero.badge")} onChange={(e) => set("hero.badge", e.target.value)} />
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Headline Line 1" value={get("hero.line1")} onChange={(e) => set("hero.line1", e.target.value)} />
            <FormInput label="Headline Line 2 (orange)" value={get("hero.line2")} onChange={(e) => set("hero.line2", e.target.value)} />
            <FormInput label="Headline Line 3" value={get("hero.line3")} onChange={(e) => set("hero.line3", e.target.value)} />
          </div>
          <FormTextarea label="Sub-headline" rows={2} value={get("hero.sub")} onChange={(e) => set("hero.sub", e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Primary CTA Button" value={get("hero.cta_primary")} onChange={(e) => set("hero.cta_primary", e.target.value)} />
            <FormInput label="Secondary CTA Button" value={get("hero.cta_secondary")} onChange={(e) => set("hero.cta_secondary", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Stat: Brands Label" value={get("hero.stats.brands")} onChange={(e) => set("hero.stats.brands", e.target.value)} />
            <FormInput label="Stat: ROI Label" value={get("hero.stats.roi")} onChange={(e) => set("hero.stats.roi", e.target.value)} />
            <FormInput label="Stat: Reach Label" value={get("hero.stats.reach")} onChange={(e) => set("hero.stats.reach", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Float Card: Reach" value={get("hero.float.reach")} onChange={(e) => set("hero.float.reach", e.target.value)} />
            <FormInput label="Float Card: Conversions" value={get("hero.float.conversions")} onChange={(e) => set("hero.float.conversions", e.target.value)} />
            <FormInput label="Float Card: ROI" value={get("hero.float.roi")} onChange={(e) => set("hero.float.roi", e.target.value)} />
          </div>
          <FormInput label="Scroll Indicator Text" value={get("hero.scroll")} onChange={(e) => set("hero.scroll", e.target.value)} />
        </div>
      );

      /* ── NAVIGATION ── */
      case "nav": return (
        <div className="space-y-4">
          <p className="text-white/30 text-xs">ნავიგაციის ბმულები და CTA ღილაკი.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["nav.services", "Services Link"],
              ["nav.why_us", "Why Us Link"],
              ["nav.pricing", "Pricing Link"],
              ["nav.work", "Work Link"],
              ["nav.contact", "Contact Link"],
              ["nav.cta", "Nav CTA Button"],
            ].map(([key, label]) => (
              <FormInput key={key} label={label} value={get(key)} onChange={(e) => set(key, e.target.value)} />
            ))}
          </div>
        </div>
      );

      /* ── MARQUEE ── */
      case "marquee": return (
        <div className="space-y-4">
          <p className="text-white/30 text-xs">გადახვევის ზოლი — ერთი ელემენტი თითოეულ ხაზზე.</p>
          <FormTextarea
            label="Marquee Items"
            hint="Each line becomes one item in the infinite scroll."
            rows={14}
            value={get("marquee.items")}
            onChange={(e) => setArr("marquee.items", e.target.value)}
          />
        </div>
      );

      /* ── SERVICES ── */
      case "services": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">სერვისების სექცია მთავარ გვერდზე.</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Section Label" value={get("services.label")} onChange={(e) => set("services.label", e.target.value)} />
            <FormInput label="Section Title" value={get("services.title")} onChange={(e) => set("services.title", e.target.value)} />
            <FormInput label="Title Accent (orange)" value={get("services.title_accent")} onChange={(e) => set("services.title_accent", e.target.value)} />
            <FormInput label="Explore Button Text" value={get("services.explore")} onChange={(e) => set("services.explore", e.target.value)} />
          </div>
          {[
            { prefix: "services.social",   name: "Social Media" },
            { prefix: "services.content",  name: "Content Marketing" },
            { prefix: "services.ads",      name: "Digital Ads" },
            { prefix: "services.audio",    name: "Audio Services" },
          ].map(({ prefix, name }) => (
            <div key={prefix} className="rounded-xl border border-white/8 p-4 space-y-3">
              <p className="text-white/60 text-xs font-600 uppercase tracking-widest">{name} Card</p>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Title" value={get(`${prefix}.title`)} onChange={(e) => set(`${prefix}.title`, e.target.value)} />
                <FormInput label="Tagline" value={get(`${prefix}.tagline`)} onChange={(e) => set(`${prefix}.tagline`, e.target.value)} />
              </div>
              <FormTextarea
                label="Feature Items (one per line)"
                rows={4}
                value={get(`${prefix}.items`)}
                onChange={(e) => setArr(`${prefix}.items`, e.target.value)}
              />
            </div>
          ))}
        </div>
      );

      /* ── BENEFITS ── */
      case "benefits": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">„რატომ ჩვენ" სექცია მთავარ გვერდზე.</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Section Label" value={get("benefits.label")} onChange={(e) => set("benefits.label", e.target.value)} />
            <FormInput label="Section Title" value={get("benefits.title")} onChange={(e) => set("benefits.title", e.target.value)} />
            <FormInput label="Title Accent" value={get("benefits.title_accent")} onChange={(e) => set("benefits.title_accent", e.target.value)} />
          </div>
          {[
            { key: "awareness",     label: "Brand Awareness" },
            { key: "revenue",       label: "More Leads & Sales" },
            { key: "image",         label: "Premium Brand Image" },
            { key: "communication", label: "Effective Communication" },
          ].map(({ key, label }) => (
            <div key={key} className="rounded-xl border border-white/8 p-4 space-y-3">
              <p className="text-white/60 text-xs font-600 uppercase tracking-widest">{label}</p>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Title" value={get(`benefits.${key}.title`)} onChange={(e) => set(`benefits.${key}.title`, e.target.value)} />
                <FormInput label="Stat Label" value={get(`benefits.${key}.stat_label`)} onChange={(e) => set(`benefits.${key}.stat_label`, e.target.value)} />
              </div>
              <FormTextarea label="Description" rows={2} value={get(`benefits.${key}.description`)} onChange={(e) => set(`benefits.${key}.description`, e.target.value)} />
            </div>
          ))}
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Process Steps</p>
            {["01", "02", "03", "04"].map((num) => (
              <div key={num} className="grid grid-cols-2 gap-3">
                <FormInput label={`Step ${num} Title`} value={get(`benefits.process.${num}.title`)} onChange={(e) => set(`benefits.process.${num}.title`, e.target.value)} />
                <FormInput label={`Step ${num} Description`} value={get(`benefits.process.${num}.desc`)} onChange={(e) => set(`benefits.process.${num}.desc`, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      );

      /* ── PRICING TEXT ── */
      case "pricing_text": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">ფასების სექციის წარწერები. ფასების ცვლილებისთვის გადადი „ფასები" ჩანართზე.</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Section Label" value={get("pricing.label")} onChange={(e) => set("pricing.label", e.target.value)} />
            <FormInput label="Section Title" value={get("pricing.title")} onChange={(e) => set("pricing.title", e.target.value)} />
            <FormInput label="Title Accent" value={get("pricing.title_accent")} onChange={(e) => set("pricing.title_accent", e.target.value)} />
            <FormInput label="Popular Badge" value={get("pricing.popular")} onChange={(e) => set("pricing.popular", e.target.value)} />
            <FormInput label="Period Text" value={get("pricing.period")} onChange={(e) => set("pricing.period", e.target.value)} />
          </div>
          <FormTextarea label="Subtitle" rows={2} value={get("pricing.subtitle")} onChange={(e) => set("pricing.subtitle", e.target.value)} />
          {[
            { key: "pricing.starter",  name: "Starter Package" },
            { key: "pricing.business", name: "Business Package" },
            { key: "pricing.premium",  name: "Premium Package" },
          ].map(({ key, name }) => (
            <div key={key} className="rounded-xl border border-white/8 p-4 space-y-3">
              <p className="text-white/60 text-xs font-600 uppercase tracking-widest">{name}</p>
              <div className="grid grid-cols-3 gap-3">
                <FormInput label="Plan Name" value={get(`${key}.name`)} onChange={(e) => set(`${key}.name`, e.target.value)} />
                <FormInput label="Tagline" value={get(`${key}.tagline`)} onChange={(e) => set(`${key}.tagline`, e.target.value)} />
                <FormInput label="CTA Button" value={get(`${key}.cta`)} onChange={(e) => set(`${key}.cta`, e.target.value)} />
              </div>
              <FormTextarea
                label="Features (one per line)"
                rows={6}
                value={get(`${key}.features`)}
                onChange={(e) => setArr(`${key}.features`, e.target.value)}
              />
            </div>
          ))}
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Add-on & TikTok Labels</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["pricing.addons.title",      "Add-ons Title"],
                ["pricing.addons.note",       "Add-ons Note"],
                ["pricing.addons.group_video","Video Group Header"],
                ["pricing.addons.reel_name",  "Reel Service Name"],
                ["pricing.addons.reel_desc",  "Reel Service Desc"],
                ["pricing.addons.google_name","Google Ads Name"],
                ["pricing.addons.google_desc","Google Ads Desc"],
                ["pricing.addons.group_audio","Audio Group Header"],
                ["pricing.addons.audio_name", "Audio Service Name"],
                ["pricing.addons.audio_desc", "Audio Service Desc"],
                ["pricing.tiktok.title",      "TikTok Section Title"],
                ["pricing.tiktok.starter_name",  "TikTok Starter Name"],
                ["pricing.tiktok.starter_videos","TikTok Starter Videos"],
                ["pricing.tiktok.growth_name",   "TikTok Growth Name"],
                ["pricing.tiktok.growth_videos", "TikTok Growth Videos"],
              ].map(([key, label]) => (
                <FormInput key={key} label={label} value={get(key)} onChange={(e) => set(key, e.target.value)} />
              ))}
            </div>
          </div>
        </div>
      );

      /* ── CONTACT / CTA ── */
      case "contact": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">საკონტაქტო სექცია საკვლევი ფორმით.</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Section Label" value={get("cta.label")} onChange={(e) => set("cta.label", e.target.value)} />
            <FormInput label="Title" value={get("cta.title")} onChange={(e) => set("cta.title", e.target.value)} />
            <FormInput label="Title Accent (orange)" value={get("cta.title_accent")} onChange={(e) => set("cta.title_accent", e.target.value)} />
          </div>
          <FormTextarea label="Subtitle" rows={2} value={get("cta.subtitle")} onChange={(e) => set("cta.subtitle", e.target.value)} />
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Form Labels & Placeholders</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["cta.form.name",                "Name Label"],
                ["cta.form.email",               "Email Label"],
                ["cta.form.name_placeholder",    "Name Placeholder"],
                ["cta.form.email_placeholder",   "Email Placeholder"],
                ["cta.form.service",             "Service Label"],
                ["cta.form.service_placeholder", "Service Placeholder"],
                ["cta.form.message",             "Message Label"],
                ["cta.form.message_placeholder", "Message Placeholder"],
                ["cta.form.submit",              "Submit Button"],
                ["cta.form.disclaimer",          "Disclaimer Text"],
                ["cta.form.success_title",       "Success Title"],
                ["cta.form.success_text",        "Success Message"],
              ].map(([key, label]) => (
                <FormInput key={key} label={label} value={get(key)} onChange={(e) => set(key, e.target.value)} />
              ))}
            </div>
          </div>
          <FormTextarea
            label="Service Dropdown Options"
            hint="One service per line — shown in the service selector."
            rows={7}
            value={get("cta.services")}
            onChange={(e) => setArr("cta.services", e.target.value)}
          />
        </div>
      );

      /* ── FOOTER ── */
      case "footer": return (
        <div className="space-y-4">
          <p className="text-white/30 text-xs">საიტის ქვედა ნაწილის ტექსტი, ბმულები და საკონტაქტო ინფო.</p>
          <FormTextarea label="Agency Tagline" rows={2} value={get("footer.tagline")} onChange={(e) => set("footer.tagline", e.target.value)} />
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Services Column Title" value={get("footer.services.title")} onChange={(e) => set("footer.services.title", e.target.value)} />
            <FormInput label="Company Column Title" value={get("footer.company.title")} onChange={(e) => set("footer.company.title", e.target.value)} />
            <FormInput label="Contact Column Title" value={get("footer.contact.title")} onChange={(e) => set("footer.contact.title", e.target.value)} />
          </div>
          <FormTextarea
            label="Contact Info Items"
            hint="One item per line — email, phone, availability, response time."
            rows={4}
            value={get("footer.contact.items")}
            onChange={(e) => setArr("footer.contact.items", e.target.value)}
          />
          <FormInput label="Copyright Text" value={get("footer.copyright")} onChange={(e) => set("footer.copyright", e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Privacy Policy Link" value={get("footer.privacy")} onChange={(e) => set("footer.privacy", e.target.value)} />
            <FormInput label="Terms Link" value={get("footer.terms")} onChange={(e) => set("footer.terms", e.target.value)} />
          </div>
        </div>
      );

      /* ── ABOUT ── */
      case "about": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">„ჩვენ შესახებ" გვერდი.</p>
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Hero</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Label" value={get("about.hero_label")} onChange={(e) => set("about.hero_label", e.target.value)} />
              <FormInput label="Title" value={get("about.hero_title")} onChange={(e) => set("about.hero_title", e.target.value)} />
              <FormInput label="Title Accent" value={get("about.hero_title_accent")} onChange={(e) => set("about.hero_title_accent", e.target.value)} />
            </div>
            <FormTextarea label="Subtitle" rows={2} value={get("about.hero_subtitle")} onChange={(e) => set("about.hero_subtitle", e.target.value)} />
          </div>
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Stats</p>
            {getObjArr("about.stats").map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <FormInput label={`Stat ${i + 1} Value`} value={stat.value || ""} onChange={(e) => {
                  const arr = [...getObjArr("about.stats")];
                  arr[i] = { ...arr[i], value: e.target.value };
                  setObjArr("about.stats", arr);
                }} />
                <FormInput label={`Stat ${i + 1} Label`} value={stat.label || ""} onChange={(e) => {
                  const arr = [...getObjArr("about.stats")];
                  arr[i] = { ...arr[i], label: e.target.value };
                  setObjArr("about.stats", arr);
                }} />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Mission</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Label" value={get("about.mission_label")} onChange={(e) => set("about.mission_label", e.target.value)} />
              <FormInput label="Title" value={get("about.mission_title")} onChange={(e) => set("about.mission_title", e.target.value)} />
              <FormInput label="Title Accent" value={get("about.mission_title_accent")} onChange={(e) => set("about.mission_title_accent", e.target.value)} />
            </div>
            <FormTextarea label="Paragraph 1" rows={3} value={get("about.mission_p1")} onChange={(e) => set("about.mission_p1", e.target.value)} />
            <FormTextarea label="Paragraph 2" rows={3} value={get("about.mission_p2")} onChange={(e) => set("about.mission_p2", e.target.value)} />
            <FormTextarea label="Mission Points (one per line)" rows={5} value={get("about.mission_points")} onChange={(e) => setArr("about.mission_points", e.target.value)} />
          </div>
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Values</p>
            {getObjArr("about.values").map((val, i) => (
              <div key={i} className="rounded-lg border border-white/5 p-3 space-y-2">
                <p className="text-white/40 text-xs">Value {i + 1}</p>
                <FormInput label="Title" value={val.title || ""} onChange={(e) => {
                  const arr = [...getObjArr("about.values")];
                  arr[i] = { ...arr[i], title: e.target.value };
                  setObjArr("about.values", arr);
                }} />
                <FormTextarea label="Description" rows={2} value={val.desc || ""} onChange={(e) => {
                  const arr = [...getObjArr("about.values")];
                  arr[i] = { ...arr[i], desc: e.target.value };
                  setObjArr("about.values", arr);
                }} />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Team Members</p>
            {getObjArr("about.team").map((member, i) => (
              <div key={i} className="rounded-lg border border-white/5 p-3 space-y-2">
                <p className="text-white/40 text-xs">Member {i + 1}</p>
                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Name" value={member.name || ""} onChange={(e) => {
                    const arr = [...getObjArr("about.team")];
                    arr[i] = { ...arr[i], name: e.target.value };
                    setObjArr("about.team", arr);
                  }} />
                  <FormInput label="Role / Title" value={member.role || ""} onChange={(e) => {
                    const arr = [...getObjArr("about.team")];
                    arr[i] = { ...arr[i], role: e.target.value };
                    setObjArr("about.team", arr);
                  }} />
                </div>
                <FormTextarea label="Bio" rows={2} value={member.desc || ""} onChange={(e) => {
                  const arr = [...getObjArr("about.team")];
                  arr[i] = { ...arr[i], desc: e.target.value };
                  setObjArr("about.team", arr);
                }} />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Page CTA</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Title" value={get("about.cta_title")} onChange={(e) => set("about.cta_title", e.target.value)} />
              <FormInput label="Title Accent" value={get("about.cta_title_accent")} onChange={(e) => set("about.cta_title_accent", e.target.value)} />
            </div>
            <FormTextarea label="Subtitle" rows={2} value={get("about.cta_subtitle")} onChange={(e) => set("about.cta_subtitle", e.target.value)} />
            <FormInput label="Button Text" value={get("about.cta_button")} onChange={(e) => set("about.cta_button", e.target.value)} />
          </div>
        </div>
      );

      /* ── OUR WORK ── */
      case "work": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">„ჩვენი სამუშაო" / პორტფოლიოს გვერდი.</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Hero Label" value={get("our_work.hero_label")} onChange={(e) => set("our_work.hero_label", e.target.value)} />
            <FormInput label="Hero Title" value={get("our_work.hero_title")} onChange={(e) => set("our_work.hero_title", e.target.value)} />
            <FormInput label="Hero Title Accent" value={get("our_work.hero_title_accent")} onChange={(e) => set("our_work.hero_title_accent", e.target.value)} />
          </div>
          <FormTextarea label="Hero Subtitle" rows={2} value={get("our_work.hero_subtitle")} onChange={(e) => set("our_work.hero_subtitle", e.target.value)} />
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Stats</p>
            {getObjArr("our_work.stats").map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <FormInput label={`Stat ${i + 1} Value`} value={stat.v || ""} onChange={(e) => {
                  const arr = [...getObjArr("our_work.stats")];
                  arr[i] = { ...arr[i], v: e.target.value };
                  setObjArr("our_work.stats", arr);
                }} />
                <FormInput label={`Stat ${i + 1} Label`} value={stat.l || ""} onChange={(e) => {
                  const arr = [...getObjArr("our_work.stats")];
                  arr[i] = { ...arr[i], l: e.target.value };
                  setObjArr("our_work.stats", arr);
                }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="CTA Title" value={get("our_work.cta_title")} onChange={(e) => set("our_work.cta_title", e.target.value)} />
            <FormInput label="CTA Title Accent" value={get("our_work.cta_title_accent")} onChange={(e) => set("our_work.cta_title_accent", e.target.value)} />
          </div>
          <FormTextarea label="CTA Subtitle" rows={2} value={get("our_work.cta_subtitle")} onChange={(e) => set("our_work.cta_subtitle", e.target.value)} />
          <FormInput label="CTA Button" value={get("our_work.cta_button")} onChange={(e) => set("our_work.cta_button", e.target.value)} />
        </div>
      );

      /* ── SERVICE PAGES ── */
      case "service_pages": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">სერვისების ცალკეული გვერდები (hero + CTA). სტატისტიკა და ფუნქციები ასევე რედაქტირებადია.</p>
          {[
            { key: "social_media_page", name: "Social Media Marketing" },
            { key: "content_page",      name: "Content Marketing" },
            { key: "ads_page",          name: "Digital Advertising" },
            { key: "audio_page",        name: "Audio Services" },
          ].map(({ key, name }) => (
            <div key={key} className="rounded-xl border border-white/8 p-4 space-y-3">
              <p className="text-white/60 text-xs font-600 uppercase tracking-widest">{name}</p>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Hero Label" value={get(`${key}.hero_label`)} onChange={(e) => set(`${key}.hero_label`, e.target.value)} />
                <FormInput label="Hero Title" value={get(`${key}.hero_title`)} onChange={(e) => set(`${key}.hero_title`, e.target.value)} />
                <FormInput label="Hero Title Accent" value={get(`${key}.hero_title_accent`)} onChange={(e) => set(`${key}.hero_title_accent`, e.target.value)} />
                <FormInput label="CTA Button" value={get(`${key}.hero_cta`)} onChange={(e) => set(`${key}.hero_cta`, e.target.value)} />
                <FormInput label="Link Button" value={get(`${key}.hero_link`)} onChange={(e) => set(`${key}.hero_link`, e.target.value)} />
              </div>
              <FormTextarea label="Hero Subtitle" rows={2} value={get(`${key}.hero_subtitle`)} onChange={(e) => set(`${key}.hero_subtitle`, e.target.value)} />
              <div className="rounded-lg border border-white/5 p-3 space-y-2">
                <p className="text-white/30 text-xs">CTA Bottom</p>
                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="CTA Title" value={get(`${key}.cta_title`)} onChange={(e) => set(`${key}.cta_title`, e.target.value)} />
                  <FormInput label="CTA Title Accent" value={get(`${key}.cta_title_accent`)} onChange={(e) => set(`${key}.cta_title_accent`, e.target.value)} />
                  <FormInput label="CTA Button" value={get(`${key}.cta_button`)} onChange={(e) => set(`${key}.cta_button`, e.target.value)} />
                </div>
                <FormTextarea label="CTA Subtitle" rows={2} value={get(`${key}.cta_subtitle`)} onChange={(e) => set(`${key}.cta_subtitle`, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      );

      /* ── PRICING PAGE ── */
      case "pricing_page": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">ფასების გვერდი — hero და FAQ სექცია.</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Hero Label" value={get("pricing_page.hero_label")} onChange={(e) => set("pricing_page.hero_label", e.target.value)} />
            <FormInput label="Hero Title" value={get("pricing_page.hero_title")} onChange={(e) => set("pricing_page.hero_title", e.target.value)} />
            <FormInput label="Hero Title Accent" value={get("pricing_page.hero_title_accent")} onChange={(e) => set("pricing_page.hero_title_accent", e.target.value)} />
          </div>
          <FormTextarea label="Hero Subtitle" rows={2} value={get("pricing_page.hero_subtitle")} onChange={(e) => set("pricing_page.hero_subtitle", e.target.value)} />
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">FAQ Items</p>
            {getObjArr("pricing_page.faq").map((item, i) => (
              <div key={i} className="rounded-lg border border-white/5 p-3 space-y-2">
                <p className="text-white/40 text-xs">FAQ {i + 1}</p>
                <FormInput label="Question" value={item.q || ""} onChange={(e) => {
                  const arr = [...getObjArr("pricing_page.faq")];
                  arr[i] = { ...arr[i], q: e.target.value };
                  setObjArr("pricing_page.faq", arr);
                }} />
                <FormTextarea label="Answer" rows={2} value={item.a || ""} onChange={(e) => {
                  const arr = [...getObjArr("pricing_page.faq")];
                  arr[i] = { ...arr[i], a: e.target.value };
                  setObjArr("pricing_page.faq", arr);
                }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="CTA Title" value={get("pricing_page.cta_title")} onChange={(e) => set("pricing_page.cta_title", e.target.value)} />
            <FormInput label="CTA Title Accent" value={get("pricing_page.cta_title_accent")} onChange={(e) => set("pricing_page.cta_title_accent", e.target.value)} />
          </div>
          <FormTextarea label="CTA Subtitle" rows={2} value={get("pricing_page.cta_subtitle")} onChange={(e) => set("pricing_page.cta_subtitle", e.target.value)} />
          <FormInput label="CTA Button" value={get("pricing_page.cta_button")} onChange={(e) => set("pricing_page.cta_button", e.target.value)} />
        </div>
      );

      /* ── BLOG ── */
      case "blog": return (
        <div className="space-y-6">
          <p className="text-white/30 text-xs">ბლოგის სია გვერდი.</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Hero Label" value={get("blog.hero_label")} onChange={(e) => set("blog.hero_label", e.target.value)} />
            <FormInput label="Hero Title" value={get("blog.hero_title")} onChange={(e) => set("blog.hero_title", e.target.value)} />
            <FormInput label="Hero Title Accent" value={get("blog.hero_title_accent")} onChange={(e) => set("blog.hero_title_accent", e.target.value)} />
          </div>
          <FormTextarea label="Hero Subtitle" rows={2} value={get("blog.hero_subtitle")} onChange={(e) => set("blog.hero_subtitle", e.target.value)} />
          <div className="rounded-xl border border-white/8 p-4 space-y-3">
            <p className="text-white/60 text-xs font-600 uppercase tracking-widest">Newsletter Widget</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["blog.newsletter.label",    "Label"],
                ["blog.newsletter.title",    "Title"],
                ["blog.newsletter.title_accent", "Title Accent"],
                ["blog.newsletter.button",   "Subscribe Button"],
                ["blog.newsletter.placeholder", "Email Placeholder"],
                ["blog.newsletter.success",  "Success Message"],
              ].map(([key, label]) => (
                <FormInput key={key} label={label} value={get(key)} onChange={(e) => set(key, e.target.value)} />
              ))}
            </div>
            <FormTextarea label="Subtitle" rows={2} value={get("blog.newsletter.subtitle")} onChange={(e) => set("blog.newsletter.subtitle", e.target.value)} />
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div>
      <SectionHeader title="საიტის ტექსტის რედაქტორი">
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {["en", "ka"].map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setActiveSection("hero"); }}
                className={`px-4 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  lang === l
                    ? "bg-[#e85d04] text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {l === "en" ? "ინგლისური" : "ქართული"}
              </button>
            ))}
          </div>
          <Btn
            size="md"
            onClick={save}
            disabled={saving}
            className={saved ? "bg-green-600 hover:bg-green-600" : ""}
          >
            {saving ? "ინახება..." : saved ? "✓ შენახულია" : "ცვლილებების შენახვა"}
          </Btn>
        </div>
      </SectionHeader>

      {loading ? (
        <Spinner />
      ) : (
        <div className="flex gap-5">
          {/* Section sidebar */}
          <div className="w-36 flex-shrink-0">
            <div className="space-y-0.5 sticky top-24">
              {CONTENT_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
                    activeSection === s.id
                      ? "bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20"
                      : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 min-w-0 space-y-5 pb-16">
            {renderSection()}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar nav ───────────────────────────────────────────── */
const NAV = [
  {
    id: "overview", label: "მიმოხილვა",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>,
  },
  {
    id: "submissions", label: "განაცხადები",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>,
  },
  {
    id: "blog", label: "სტატიები",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>,
  },
  {
    id: "pricing", label: "ფასები",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>,
  },
  {
    id: "portfolio", label: "პორტფოლიო",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>,
  },
  {
    id: "sitetext", label: "საიტის ტექსტი",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      <line x1="4" y1="10" x2="8" y2="10"/><line x1="4" y1="14" x2="10" y2="14"/>
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
    sitetext:    () => <SiteContentAdmin />,
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
              <p className="text-white/30 text-xs mt-0.5">ადმინ პანელი</p>
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
            <span>გასვლა</span>
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
            საიტის ნახვა
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
