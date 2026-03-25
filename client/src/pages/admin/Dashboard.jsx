import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ── Sidebar nav items ─────────────────────────────────────── */
const NAV = [
  { id: "submissions", label: "Contact Submissions", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )},
  { id: "portfolio", label: "Portfolio", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  )},
  { id: "blog", label: "Blog Posts", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  )},
];

/* ── Helpers ───────────────────────────────────────────────── */
function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Badge({ children, color = "orange" }) {
  const cls = color === "orange"
    ? "bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20"
    : "bg-white/5 text-white/50 border border-white/10";
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{children}</span>;
}

/* ── Contact Submissions ───────────────────────────────────── */
function Submissions() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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
          {items.map(item => (
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
                    <polyline points="6 9 12 15 18 9"/>
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
                    <button onClick={() => remove(item.id)}
                      className="text-xs text-red-400/70 hover:text-red-400 transition-colors">
                      Delete
                    </button>
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

/* ── Portfolio placeholder ─────────────────────────────────── */
function Portfolio() {
  return (
    <div>
      <SectionHeader title="Portfolio" />
      <Empty text="Portfolio management coming soon." />
    </div>
  );
}

/* ── Blog placeholder ──────────────────────────────────────── */
function BlogAdmin() {
  return (
    <div>
      <SectionHeader title="Blog Posts" />
      <Empty text="Blog management coming soon." />
    </div>
  );
}

/* ── Small reusable components ─────────────────────────────── */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#e85d04] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-center py-16 text-white/30 text-sm">
      {text}
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-white font-display font-700 text-lg">{title}</h2>
      {count !== undefined && (
        <span className="text-xs bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-white/80 text-sm">{value || "—"}</p>
    </div>
  );
}

/* ── Dashboard shell ───────────────────────────────────────── */
const PANELS = { submissions: Submissions, portfolio: Portfolio, blog: BlogAdmin };

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [active,       setActive]       = useState("submissions");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/revolver-studio/login");
  };

  const ActivePanel = PANELS[active];

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* ── Sidebar ── */}
      <>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

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
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150 ${
                  active === item.id
                    ? "bg-[#e85d04]/10 text-[#e85d04] border border-[#e85d04]/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#080808] sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white/50 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <h1 className="text-white/60 text-sm hidden lg:block">
            {NAV.find(n => n.id === active)?.label}
          </h1>
          <a href="/" target="_blank" rel="noreferrer"
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
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
            transition={{ duration: 0.3 }}
          >
            <ActivePanel />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
