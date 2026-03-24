import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import SectionLabel from "@components/ui/SectionLabel";
import { EASE_OUT_EXPO } from "@utils/animations";
import { POSTS, CATEGORY_COLORS } from "@constants/blog";

/* ─── Arrow icon ─────────────────────────────────────────────────────────── */
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ─── featured post card ────────────────────────────────────────────────── */
function FeaturedCard({ post }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const color = CATEGORY_COLORS[post.category] || "#e85d04";
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      whileHover="hover"
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="relative glass rounded-3xl overflow-hidden cursor-pointer group col-span-full"
    >
      {/* background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 60% 60% at 30% 50%, ${color}10 0%, transparent 70%)` }}
      />

      <div className="relative z-10 p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* text */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-xs font-700 font-display uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color, background: `${color}18` }}
            >
              {post.category}
            </span>
            <span className="text-xs font-500 px-2 py-0.5 rounded-full bg-[#e85d04]/15 text-[#e85d04] uppercase tracking-wider">
              {t("blog.featured_badge")}
            </span>
          </div>
          <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-800 text-fg leading-tight mb-4 group-hover:text-[#e85d04] transition-colors duration-300">
            {post.title}
          </h2>
          <p className="text-fg-50 text-base leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-fg-40 text-sm">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-fg-20" />
              <span>{post.readTime}</span>
            </div>
            <motion.div
              className="w-10 h-10 rounded-full border border-[#e85d04]/40 flex items-center justify-center text-[#e85d04]"
              variants={{ hover: { scale: 1.1, borderColor: "#e85d04" } }}
              transition={{ duration: 0.2 }}
            >
              <ArrowIcon />
            </motion.div>
          </div>
        </div>

        {/* visual panel */}
        <div
          className="hidden lg:flex items-center justify-center rounded-2xl h-52 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}12 0%, ${color}06 100%)`, border: `1px solid ${color}20` }}
        >
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
          <div className="text-center relative z-10 px-6">
            <div className="font-display text-6xl font-800 mb-2" style={{ color: `${color}30` }}>01</div>
            <p className="font-display text-sm font-600 uppercase tracking-widest" style={{ color: `${color}80` }}>
              {post.category}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── regular post card ─────────────────────────────────────────────────── */
function PostCard({ post, index }) {
  const navigate = useNavigate();
  const color = CATEGORY_COLORS[post.category] || "#e85d04";
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE_OUT_EXPO }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="glass rounded-2xl p-6 sm:p-7 flex flex-col cursor-pointer group relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <div className="flex items-start justify-between mb-4">
        <span
          className="text-xs font-700 font-display uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ color, background: `${color}18` }}
        >
          {post.category}
        </span>
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#e85d04]"
          initial={false}
        >
          <ArrowIcon />
        </motion.div>
      </div>

      <h3 className="font-display text-base sm:text-lg font-700 text-fg leading-snug mb-3 group-hover:text-[#e85d04] transition-colors duration-300 flex-1">
        {post.title}
      </h3>
      <p className="text-fg-40 text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>

      <div className="flex items-center gap-3 text-fg-30 text-xs mt-auto pt-4 border-t border-fg-5">
        <span>{post.date}</span>
        <span className="w-1 h-1 rounded-full bg-fg-20" />
        <span>{post.readTime}</span>
      </div>
    </motion.article>
  );
}

/* ─── newsletter section ────────────────────────────────────────────────── */
function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email) { setSent(true); }
  }

  return (
    <section className="section-padding bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <SectionLabel>{t("blog.newsletter.label")}</SectionLabel>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-800 text-fg mt-4 mb-3">
            {t("blog.newsletter.title")}{" "}
            <span className="text-gradient">{t("blog.newsletter.title_accent")}</span>
          </h2>
          <p className="text-fg-50 text-base mb-8">
            {t("blog.newsletter.subtitle")}
          </p>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#e85d04]/10 border border-[#e85d04]/30 text-[#e85d04]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="font-display font-700">{t("blog.newsletter.success")}</span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("blog.newsletter.placeholder")}
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-bg border border-fg-10 text-fg text-sm placeholder:text-fg-30 focus:outline-none focus:border-[#e85d04]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#e85d04] text-white font-display font-700 text-sm hover:bg-[#d05200] transition-colors whitespace-nowrap"
                >
                  {t("blog.newsletter.button")}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── main page ─────────────────────────────────────────────────────────── */
export default function Blog() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("All");

  const CATEGORIES_KEYS = [
    { key: "all",         value: "All" },
    { key: "strategy",    value: "Strategy" },
    { key: "social_media",value: "Social Media" },
    { key: "advertising", value: "Advertising" },
    { key: "content",     value: "Content" },
    { key: "branding",    value: "Branding" },
  ];

  const filtered = activeCategory === "All"
    ? POSTS
    : POSTS.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);
  const rest     = filtered.filter((p) => !p.featured);

  return (
    <PageLayout>
      <PageHero
        label={t("blog.hero_label")}
        title={t("blog.hero_title")}
        titleAccent={t("blog.hero_title_accent")}
        subtitle={t("blog.hero_subtitle")}
      />

      {/* posts section */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* category filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14"
          >
            {CATEGORIES_KEYS.map(({ key, value }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-display font-600 transition-all duration-250 border",
                  activeCategory === value
                    ? "bg-[#e85d04] border-[#e85d04] text-white shadow-[0_0_20px_rgba(232,93,4,0.35)]"
                    : "border-fg-10 text-fg-50 hover:border-[#e85d04]/40 hover:text-fg",
                ].join(" ")}
              >
                {t(`blog.categories.${key}`)}
              </button>
            ))}
          </motion.div>

          {/* grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {/* featured */}
              {featured && <FeaturedCard post={featured} />}

              {/* regular cards */}
              {rest.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}

              {/* empty state */}
              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <p className="text-fg-40 text-lg">{t("blog.no_posts")}</p>
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="mt-4 text-[#e85d04] text-sm font-600 underline underline-offset-4"
                  >
                    {t("blog.view_all")}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Newsletter />
    </PageLayout>
  );
}
