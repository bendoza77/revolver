import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@components/layout/PageLayout";
import { POSTS, CATEGORY_COLORS } from "@constants/blog";
import { EASE_OUT_EXPO } from "@utils/animations";

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

/* Very simple markdown-like renderer for the body */
function BodyContent({ text }) {
  const lines = text.trim().split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="font-display text-2xl font-800 text-fg mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-display font-700 text-fg text-base mt-5 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    } else if (/^\*\*.*\*\*/.test(line)) {
      // bold inline followed by rest of text
      const match = line.match(/^\*\*(.*?)\*\*(.*)/);
      elements.push(
        <p key={i} className="text-fg-70 text-base leading-relaxed mb-3">
          <strong className="text-fg font-700">{match[1]}</strong>{match[2]}
        </p>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="text-fg-60 text-base leading-relaxed ml-5 mb-1 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-fg-60 text-base leading-relaxed mb-4">
          {line}
        </p>
      );
    }
    i++;
  }

  return <div>{elements}</div>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);
  const color = post ? (CATEGORY_COLORS[post.category] || "#e85d04") : "#e85d04";

  if (!post) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl font-800 text-fg mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-[#e85d04] font-600 underline underline-offset-4">
            ← Back to Blog
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-600 font-display text-fg-50 hover:text-[#e85d04] transition-colors duration-200 mb-10 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200"><ArrowLeft /></span>
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.05 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-700 font-display uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color, background: `${color}18` }}
            >
              {post.category}
            </span>
            {post.featured && (
              <span className="text-xs font-500 px-2 py-0.5 rounded-full bg-[#e85d04]/15 text-[#e85d04] uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          <h1 className="font-display text-[clamp(1.8rem,4.5vw,3rem)] font-800 text-fg leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-fg-40 text-sm mb-8 pb-8 border-b border-fg-10">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-fg-20" />
            <span>{post.readTime}</span>
          </div>

          <p className="text-fg-50 text-lg leading-relaxed mb-10 italic border-l-2 pl-5" style={{ borderColor: color }}>
            {post.excerpt}
          </p>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.15 }}
        >
          <BodyContent text={post.body} />
        </motion.div>

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-fg-10"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-600 font-display text-fg-50 hover:text-[#e85d04] transition-colors duration-200 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200"><ArrowLeft /></span>
            Back to Blog
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
}
