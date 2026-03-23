import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { useScrollReveal } from "@hooks/useScrollReveal";
import Button from "@components/ui/Button";
import SectionLabel from "@components/ui/SectionLabel";

const INITIAL_FORM = { name: "", email: "", service: "", message: "" };

const EJS = {
  serviceId:       import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateNotify:  import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFY,
  templateReply:   import.meta.env.VITE_EMAILJS_TEMPLATE_REPLY,
  publicKey:       import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

export default function CTA() {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal();
  const formRef = useRef(null);

  const [form, setForm]         = useState(INITIAL_FORM);
  const [status, setStatus]     = useState("idle"); // idle | sending | success | error

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const payload = {
      userName: e.target.userName.value,
      userEmail: e.target.userEmail.value,
      userService: e.target.userService.value,
      message: e.target.message.value,
    };

    try {
      // Send notification to agency + auto-reply to user in parallel
      await Promise.all([
        emailjs.send(EJS.serviceId, EJS.templateNotify, payload, EJS.publicKey),
        emailjs.send(EJS.serviceId, EJS.templateReply,  payload, EJS.publicKey),
      ]);
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  const services = t("cta.services", { returnObjects: true });
  const isSending = status === "sending";

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,93,4,0.12) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <SectionLabel>{t("cta.label")}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,6vw,5rem)] font-800 leading-tight text-fg mb-4">
            {t("cta.title")}
            <br />
            <span className="text-gradient">{t("cta.title_accent")}</span>
          </h2>
          <p className="text-fg-50 text-base sm:text-lg max-w-xl mx-auto px-2">
            {t("cta.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 80% 20%, rgba(232,93,4,0.06) 0%, transparent 60%)" }} />

          {/* ── Success state ── */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-[#e85d04]/20 border border-[#e85d04]/40 flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-700 text-fg mb-2">{t("cta.form.success_title")}</h3>
              <p className="text-fg-50">{t("cta.form.success_text")}</p>
            </motion.div>
          )}

          {/* ── Form state ── */}
          {status !== "success" && (
            <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block font-display text-xs font-600 tracking-widest uppercase text-fg-40 mb-2">
                    {t("cta.form.name")}
                  </label>
                  <input
                    name="userName"
                    type="text"
                    required
                    disabled={isSending}
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder={t("cta.form.name_placeholder")}
                    className="w-full bg-fg-5 border border-fg-10 rounded-xl px-4 py-3 text-fg focus:outline-none focus:border-[#e85d04]/50 transition-colors duration-200 text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block font-display text-xs font-600 tracking-widest uppercase text-fg-40 mb-2">
                    {t("cta.form.email")}
                  </label>
                  <input
                    type="email"
                    name="userEmail"
                    required
                    disabled={isSending}
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder={t("cta.form.email_placeholder")}
                    className="w-full bg-fg-5 border border-fg-10 rounded-xl px-4 py-3 text-fg focus:outline-none focus:border-[#e85d04]/50 transition-colors duration-200 text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-display text-xs font-600 tracking-widest uppercase text-fg-40 mb-2">
                  {t("cta.form.service")}
                </label>
                <select
                  name="userService"
                  disabled={isSending}
                  value={form.service}
                  onChange={handleChange("service")}
                  className="w-full bg-fg-5 border border-fg-10 rounded-xl px-4 py-3 text-fg focus:outline-none focus:border-[#e85d04]/50 transition-colors duration-200 text-sm appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">{t("cta.form.service_placeholder")}</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-display text-xs font-600 tracking-widest uppercase text-fg-40 mb-2">
                  {t("cta.form.message")}
                </label>
                <textarea
                  rows={4}
                  name="message"
                  disabled={isSending}
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder={t("cta.form.message_placeholder")}
                  className="w-full bg-fg-5 border border-fg-10 rounded-xl px-4 py-3 text-fg focus:outline-none focus:border-[#e85d04]/50 transition-colors duration-200 text-sm resize-none disabled:opacity-50"
                />
              </div>

              {/* Error banner */}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  Something went wrong. Please try again or email us directly.
                </motion.p>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-fg-30 text-xs">{t("cta.form.disclaimer")}</p>
                <Button type="submit" size="lg" disabled={isSending}>
                  {isSending ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>{t("cta.form.submit")}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
