import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@components/layout/PageLayout";
import { EASE_OUT_EXPO } from "@utils/animations";

/* ─── page data ─────────────────────────────────────────────────────────── */
const LAST_UPDATED = "March 1, 2026";

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    content: `REVOLVER Agency ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.

When you visit our website, use our services, or communicate with us, you trust us with your personal information. We take this responsibility seriously. This policy applies to all information collected through our website, services, sales, marketing, and events.

Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.`,
    highlight: "We never sell your personal data to third parties — period.",
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: `We collect information you provide directly to us, information collected automatically, and information from third-party sources.

**Information you provide:**
• Contact details (name, email, phone number) when you fill out our contact form or request a consultation
• Business information you share during onboarding (company name, industry, goals)
• Communications you send to us via email, chat, or forms
• Payment information when you purchase our services (processed securely via third-party payment providers)

**Information collected automatically:**
• Log data (IP address, browser type, pages visited, time spent on pages)
• Device information (hardware model, operating system, unique device identifiers)
• Cookies and similar tracking technologies (see Section 4)
• Referral source (how you found us)

**Information from third parties:**
• Analytics data from Google Analytics and Meta Pixel
• Social media profile information if you contact us via social platforms`,
    highlight: "Payment data is processed by secure third-party providers. We never store your card details.",
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: `We use the information we collect for the following purposes:

**Service Delivery:** To provide, maintain, and improve our digital marketing services. To onboard new clients, manage campaigns, and deliver reports.

**Communication:** To respond to your inquiries, send service updates, and provide customer support. To send you relevant marketing communications if you have opted in.

**Analytics & Improvement:** To understand how visitors use our website, identify areas of improvement, and optimize user experience.

**Legal Compliance:** To comply with applicable laws, respond to legal requests, and protect our legal rights.

**Fraud Prevention:** To detect, investigate, and prevent fraudulent transactions and other illegal activity.

We will only use your personal information for the purposes listed above, or for other compatible purposes as permitted by law. We will never use your data in ways that are incompatible with these stated purposes without first obtaining your consent.`,
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: `We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text files placed on your device that allow us to remember your preferences and understand how you use our site.

**Types of cookies we use:**

**Essential Cookies** — Required for the website to function correctly. These cannot be disabled. They include session management and security cookies.

**Analytics Cookies** — Help us understand how visitors interact with our website (e.g., Google Analytics). Data collected is aggregated and anonymized where possible.

**Marketing Cookies** — Used to serve relevant advertisements and measure campaign effectiveness (e.g., Meta Pixel, Google Ads conversion tracking).

**Preference Cookies** — Remember your settings and preferences (e.g., language selection, dark/light mode).

You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website. You can also opt out of Google Analytics tracking at tools.google.com/dlpage/gaoptout.`,
    highlight: "You can opt out of non-essential cookies at any time via your browser settings.",
  },
  {
    id: "third-parties",
    title: "Third-Party Services",
    content: `We work with trusted third-party service providers to operate our business and deliver services to you. These partners may have access to certain personal information as necessary to perform their services.

**Our key service providers include:**
• **Google** (Analytics, Ads, Workspace) — analytics, advertising, email
• **Meta/Facebook** (Business Suite, Pixel) — advertising campaign management
• **Stripe or similar** — secure payment processing
• **Vercel / Hosting provider** — website hosting
• **Email service providers** — transactional and marketing emails

All third-party providers are contractually obligated to handle your data securely and only for the purposes we specify. We do not allow them to use your data for their own purposes.

Links to third-party websites on our site are not covered by this policy — please review their respective privacy policies.`,
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: `We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.

**Retention periods:**
• **Client records** — Retained for the duration of the service relationship plus 5 years for legal and accounting purposes
• **Contact form submissions** — Retained for 12 months, then deleted unless a business relationship is formed
• **Marketing emails** — Retained until you unsubscribe
• **Website analytics** — Aggregated data retained for 26 months (Google Analytics default)
• **Financial records** — Retained for 7 years as required by tax law

When personal data is no longer needed, we securely delete or anonymize it. You may request deletion of your data at any time (see Your Rights below).`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal data:

**Right to Access** — Request a copy of the personal information we hold about you.

**Right to Rectification** — Request correction of inaccurate or incomplete personal information.

**Right to Erasure ("Right to be Forgotten")** — Request deletion of your personal data where there is no legitimate reason for us to continue processing it.

**Right to Restrict Processing** — Request that we restrict processing of your personal data in certain circumstances.

**Right to Data Portability** — Request that we transfer your data to you or to another organization in a commonly used, machine-readable format.

**Right to Object** — Object to our processing of your personal data for direct marketing purposes at any time.

**Right to Withdraw Consent** — If processing is based on consent, you can withdraw it at any time without affecting prior lawful processing.

To exercise any of these rights, please contact us at the address below. We will respond within 30 days. We may need to verify your identity before processing the request.`,
    highlight: "To exercise your rights, email us at amirandolidze5@gmail.com — we respond within 30 days.",
  },
  {
    id: "security",
    title: "Data Security",
    content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

**Security measures include:**
• SSL/TLS encryption for all data transmitted between your browser and our servers
• Restricted access to personal data — only authorized personnel with a need-to-know basis
• Regular security reviews and updates
• Secure, encrypted data storage
• Employee training on data protection and privacy

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.

In the event of a data breach that is likely to result in high risk to your rights and freedoms, we will notify you and relevant authorities as required by law.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have questions about this Privacy Policy, want to exercise your rights, or have concerns about how we handle your data, please contact us:

**REVOLVER Agency**
Email: amirandolidze5@gmail.com
Phone: (995+) 555 451 003
Available: Monday – Friday, 9:00 – 18:00

We take privacy concerns seriously and will address your inquiry promptly. If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.`,
  },
];

/* ─── helpers ────────────────────────────────────────────────────────────── */
function parseContent(text) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      const inner = line.slice(2, -2);
      return <p key={i} className="font-display font-700 text-fg text-sm sm:text-base mt-5 mb-1">{inner}</p>;
    }
    if (line.startsWith("• ")) {
      return (
        <li key={i} className="flex gap-2 items-start text-fg-50 text-sm sm:text-base leading-relaxed">
          <span className="text-[#e85d04] mt-1.5 flex-shrink-0">▸</span>
          <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong class='text-fg font-600'>$1</strong>") }} />
        </li>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-fg-50 text-sm sm:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-fg font-600'>$1</strong>") }} />
    );
  });
}

/* ─── section component ─────────────────────────────────────────────────── */
function Section({ section, index }) {
  return (
    <motion.div
      id={section.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="scroll-mt-28"
    >
      <div className="flex items-center gap-4 mb-5">
        <span className="font-display text-4xl font-800 text-[#e85d04]/20 select-none leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h2 className="font-display text-lg sm:text-xl font-800 text-fg">{section.title}</h2>
        </div>
      </div>

      {section.highlight && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-[#e85d04]/08 border border-[#e85d04]/20 flex gap-3 items-start">
          <svg className="flex-shrink-0 mt-0.5 text-[#e85d04]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-[#e85d04] text-sm font-600">{section.highlight}</p>
        </div>
      )}

      <div className="space-y-1.5 pl-0">
        {parseContent(section.content)}
      </div>
    </motion.div>
  );
}

/* ─── table of contents ─────────────────────────────────────────────────── */
function TableOfContents({ sections, activeId }) {
  return (
    <nav className="space-y-1">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={[
            "block text-sm py-1.5 px-3 rounded-lg transition-all duration-200 font-500",
            activeId === s.id
              ? "text-[#e85d04] bg-[#e85d04]/10 font-700"
              : "text-fg-40 hover:text-fg hover:bg-fg-5",
          ].join(" ")}
        >
          {s.title}
        </a>
      ))}
    </nav>
  );
}

/* ─── JS-driven sticky sidebar (works despite overflow-x:hidden on body) ── */
function ScrollSidebar({ sections, activeId, containerRef }) {
  const tocRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const HEADER_H = 112; // 7rem — matches header height

    function update() {
      const container = containerRef?.current;
      const toc = tocRef.current;
      if (!container || !toc) return;

      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const maxY = Math.max(0, container.offsetHeight - toc.offsetHeight - 32);
      const raw = window.scrollY - containerTop + HEADER_H;
      setTranslateY(Math.max(0, Math.min(raw, maxY)));
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return (
    <aside className="hidden lg:block w-52 flex-shrink-0">
      <div
        ref={tocRef}
        style={{ transform: `translateY(${translateY}px)`, transition: "transform 0.12s ease-out", willChange: "transform" }}
      >
        <p className="text-xs font-700 font-display uppercase tracking-widest text-fg-30 mb-4 px-3">
          Contents
        </p>
        <TableOfContents sections={sections} activeId={activeId} />
      </div>
    </aside>
  );
}

/* ─── mobile TOC dropdown ────────────────────────────────────────────────── */
function MobileTOC({ sections, activeId }) {
  const [open, setOpen] = useState(false);
  const active = sections.find((s) => s.id === activeId) || sections[0];

  return (
    <div className="relative mb-8 lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 glass rounded-xl text-sm font-600 text-fg"
      >
        <span>Jump to: <span className="text-[#e85d04]">{active?.title}</span></span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 glass rounded-xl p-2 z-50 shadow-xl"
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-fg-60 hover:text-fg hover:bg-fg-5 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── main page ─────────────────────────────────────────────────────────── */
export default function Privacy() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const sectionEls = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sectionEls.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <PageLayout>
      {/* hero */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,93,4,0.10) 0%, transparent 65%)" }}
        />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-fg-10 text-fg-50 text-xs font-600 font-display uppercase tracking-widest mb-6">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Legal
            </div>
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-800 leading-tight text-fg mb-4">
              Privacy <span className="text-gradient">Policy.</span>
            </h1>
            <p className="text-fg-50 text-base sm:text-lg max-w-2xl leading-relaxed mb-4">
              We believe privacy is a right, not a feature. Here's exactly how we collect, use, and protect your information.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-fg-30 text-sm">
              <span>Last updated: <span className="text-fg-60 font-600">{LAST_UPDATED}</span></span>
              <span className="w-1 h-1 rounded-full bg-fg-20" />
              <span>{SECTIONS.length} sections</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* content */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div ref={containerRef} className="flex gap-12 lg:gap-16 relative items-start">

            <ScrollSidebar sections={SECTIONS} activeId={activeId} containerRef={containerRef} />

            {/* main content */}
            <main className="flex-1 min-w-0">
              <MobileTOC sections={SECTIONS} activeId={activeId} />
              <div className="space-y-12 sm:space-y-16 divide-y divide-fg-5">
                {SECTIONS.map((section, i) => (
                  <div key={section.id} className="pt-12 sm:pt-16 first:pt-0">
                    <Section section={section} index={i} />
                  </div>
                ))}
              </div>

              {/* footer note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className="mt-16 p-6 glass rounded-2xl"
              >
                <p className="text-fg-40 text-sm leading-relaxed">
                  This Privacy Policy may be updated periodically to reflect changes in our practices or applicable law. The date at the top of this page indicates when it was last revised. We encourage you to review this policy regularly.
                </p>
              </motion.div>
            </main>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
