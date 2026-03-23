import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@components/layout/PageLayout";
import { EASE_OUT_EXPO } from "@utils/animations";

/* ─── page data ─────────────────────────────────────────────────────────── */
const LAST_UPDATED = "March 1, 2026";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: `By accessing our website at revolveragency.com or engaging our services, you confirm that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our website or services.

These Terms constitute a legally binding agreement between you (the "Client") and REVOLVER Agency ("Agency", "we", "us", or "our"). They apply to all visitors, users, and clients who access or use our services.

We reserve the right to update these Terms at any time. We will notify existing clients of material changes via email. Continued use of our services after changes are posted constitutes acceptance of the revised Terms.`,
    highlight: "Using our services means you agree to these terms. We'll email you about any material changes.",
  },
  {
    id: "services",
    title: "Services Description",
    content: `REVOLVER Agency provides digital marketing and creative services including, but not limited to:

• Social media marketing strategy and management
• Content creation (graphics, copy, video production)
• Paid advertising management (Meta, Google, TikTok Ads)
• Audio services (voiceover, music production, sonic branding)
• Brand strategy and consulting
• Analytics reporting and campaign optimization

**Service Delivery:** The specific services, deliverables, timelines, and scope are defined in a separate Service Agreement or Statement of Work ("SOW") signed by both parties. These Terms govern the general relationship; the SOW governs the specific engagement.

**Third-party platforms:** Many of our services involve managing campaigns on third-party platforms (Meta, Google, TikTok, etc.). The Client acknowledges that these platforms have their own terms of service, policies, and guidelines that must also be followed. REVOLVER Agency is not responsible for changes to platform policies that affect campaign delivery.

**No guarantees of results:** Digital marketing outcomes depend on numerous variables. While we commit to best-in-class execution, we cannot guarantee specific results such as a defined number of leads, follower counts, or return on ad spend.`,
  },
  {
    id: "client-obligations",
    title: "Client Obligations",
    content: `To enable us to deliver services effectively, the Client agrees to:

**Provide accurate information:** Supply complete, accurate, and up-to-date information about your business, products, services, target audience, and marketing goals. Inaccurate information may result in suboptimal campaign performance for which the Agency bears no responsibility.

**Timely approvals:** Review and approve content, creatives, and campaign materials within the agreed timelines. Delays in approvals may result in delayed delivery, for which the Agency is not liable.

**Provide necessary access:** Grant the Agency access to required platforms, accounts, and assets (ad accounts, website analytics, brand assets) within 5 business days of agreement commencement.

**Legal compliance:** Ensure that all products, services, and business practices you ask us to promote comply with applicable laws and regulations. The Client is solely responsible for the legality of their products and services.

**Brand guidelines:** Provide up-to-date brand guidelines, approved logos, and style preferences. If none are provided, the Agency will apply its professional judgment.

**Designated contact:** Assign a primary point of contact who has the authority to approve content and provide timely feedback.`,
  },
  {
    id: "payment",
    title: "Payment Terms",
    content: `**Pricing:** Service fees are outlined in the applicable Service Agreement or proposal. All prices are in the currency specified in the agreement (EUR or GEL).

**Invoicing:** Invoices are issued monthly, in advance, on the first business day of each service month unless otherwise agreed in writing.

**Payment due date:** Payment is due within 10 business days of invoice issuance.

**Late payments:** Overdue invoices accrue interest at 1.5% per month (18% annually) from the due date until paid in full. Persistently late payments may result in service suspension with 5 business days' notice.

**Ad spend:** Advertising budget (spend on Meta, Google, TikTok, etc.) is billed separately from Agency management fees and is typically paid directly by the Client to the advertising platform, unless otherwise arranged.

**Refund policy:** Due to the time and resource investment required to commence services, fees paid for work already commenced are non-refundable. If the Agency fails to deliver agreed services, refunds will be considered on a pro-rated basis at the Agency's discretion.

**Price changes:** The Agency reserves the right to revise service fees with 30 days' written notice. Clients who do not accept the new pricing may terminate the agreement per Section 8.`,
    highlight: "Ad spend is billed separately from our management fees and goes directly to the advertising platforms.",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: `**Client materials:** All materials, assets, and content provided by the Client (logos, photos, brand guidelines, proprietary data) remain the sole property of the Client. The Client grants the Agency a non-exclusive license to use these materials solely for the purpose of delivering the contracted services.

**Agency deliverables:** Upon receipt of full payment, all custom deliverables created specifically for the Client (ad creatives, copy, graphic designs, videos) are assigned to the Client.

**Agency tools & methodologies:** The Agency retains ownership of all pre-existing tools, templates, frameworks, methodologies, processes, and technologies used to deliver services. Client engagements do not grant any rights to these.

**Platform assets:** Ad account structures, campaign configurations, and audiences built within Client-owned ad accounts belong to the Client. Ad accounts under Agency ownership remain the Agency's property.

**Portfolio rights:** Unless the Client requests confidentiality in writing, the Agency reserves the right to reference the Client's name and use anonymized or approved campaign results and creative samples in the Agency's portfolio, case studies, and marketing materials.`,
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    content: `Both parties agree to maintain the confidentiality of proprietary information shared during the engagement.

**Confidential information includes:** Business strategies, financial data, customer lists, campaign performance data, unreleased product information, technical systems, and any other information designated as confidential.

**Obligations:** Each party agrees to: (a) use confidential information only for the purpose of the engagement; (b) not disclose confidential information to third parties without prior written consent; (c) protect confidential information with at least the same care used for its own confidential information.

**Exclusions:** Confidentiality obligations do not apply to information that: (a) is or becomes publicly known through no fault of the receiving party; (b) was independently developed without use of confidential information; (c) must be disclosed by law or court order (with prompt written notice to the disclosing party where legally permitted).

**Duration:** These confidentiality obligations survive termination of the engagement for a period of 3 years.`,
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: `**Disclaimer of warranties:** Services are provided "as is" with no warranty regarding specific outcomes. Digital marketing results depend on market conditions, platform algorithm changes, competitive environment, and the Client's own business factors, which are outside the Agency's control.

**Limitation:** To the maximum extent permitted by law, the Agency's total liability to the Client for any claim arising under or in connection with these Terms shall not exceed the total fees paid by the Client to the Agency in the 3 months preceding the event giving rise to the claim.

**Excluded damages:** In no event shall either party be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, even if advised of the possibility of such damages.

**Force majeure:** Neither party shall be liable for delays or failures in performance resulting from circumstances beyond its reasonable control, including platform outages, natural disasters, governmental actions, or internet service disruptions.

**Client responsibility:** The Client is solely responsible for the accuracy of their business information, legal compliance of their products/services, and the business decisions made based on Agency recommendations.`,
    highlight: "Our liability is capped at fees paid in the prior 3 months. Neither party is liable for indirect or consequential losses.",
  },
  {
    id: "termination",
    title: "Termination",
    content: `**Notice period:** Either party may terminate the service agreement by providing 30 days' written notice. Service continues, and the Client remains liable for fees, during the notice period.

**Immediate termination for cause:** Either party may terminate immediately upon written notice if:
• The other party materially breaches these Terms and fails to cure the breach within 14 days of written notice
• The other party becomes insolvent or enters bankruptcy proceedings
• The other party engages in illegal conduct

**Agency-initiated termination:** The Agency may suspend or terminate services with immediate effect if:
• The Client's outstanding invoices remain unpaid beyond 30 days after the due date
• The Client requests promotion of illegal, fraudulent, or harmful content
• The Client engages in conduct that materially damages the Agency's reputation

**Post-termination:** Upon termination, the Agency will deliver to the Client all completed deliverables and transfer ownership of all Client-owned accounts and assets. The Client will pay all outstanding fees for work completed to the date of termination. Provisions regarding intellectual property, confidentiality, and limitation of liability survive termination.`,
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of Georgia (the country), without regard to its conflict of law provisions.

**Dispute resolution:** In the event of a dispute arising under these Terms, the parties agree to first attempt to resolve the dispute through good-faith negotiation. If negotiation fails within 30 days, disputes shall be submitted to the exclusive jurisdiction of the courts of Tbilisi, Georgia.

**Entire agreement:** These Terms, together with any signed Service Agreement or SOW, constitute the entire agreement between the parties regarding the subject matter herein and supersede all prior representations, understandings, and agreements.

**Severability:** If any provision of these Terms is held to be invalid or unenforceable, that provision shall be construed to the maximum extent permissible, and the remaining provisions shall continue in full force and effect.

**Waiver:** Failure by either party to enforce any provision of these Terms shall not be construed as a waiver of future enforcement of that provision.`,
  },
  {
    id: "contact",
    title: "Contact & Questions",
    content: `If you have questions about these Terms of Service, please contact us before engaging our services:

**REVOLVER Agency**
Email: amirandolidze5@gmail.com
Phone: (995+) 555 451 003
Available: Monday – Friday, 9:00 – 18:00 (Tbilisi Time, GMT+4)

For formal legal notices, please send written correspondence via email with the subject line "Legal Notice – [Your Company Name]".

We strive to respond to all legal inquiries within 5 business days.`,
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
        <h2 className="font-display text-lg sm:text-xl font-800 text-fg">{section.title}</h2>
      </div>

      {section.highlight && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-[#e85d04]/08 border border-[#e85d04]/20 flex gap-3 items-start">
          <svg className="flex-shrink-0 mt-0.5 text-[#e85d04]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-[#e85d04] text-sm font-600">{section.highlight}</p>
        </div>
      )}

      <div className="space-y-1.5">
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
export default function Terms() {
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
              Legal
            </div>
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-800 leading-tight text-fg mb-4">
              Terms of <span className="text-gradient">Service.</span>
            </h1>
            <p className="text-fg-50 text-base sm:text-lg max-w-2xl leading-relaxed mb-4">
              Clear, plain-language terms governing the relationship between REVOLVER Agency and its clients.
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
                  These Terms of Service may be updated periodically. Continued use of our services after changes become effective constitutes acceptance of the revised Terms. Clients will be notified of material changes via email.
                </p>
              </motion.div>
            </main>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
