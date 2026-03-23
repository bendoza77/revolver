import { useTranslation } from "react-i18next";

export default function Marquee() {
  const { t } = useTranslation();
  const items = t("marquee.items", { returnObjects: true });
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-fg-5 py-5 bg-surface">
      <div className="flex whitespace-nowrap">
        <div className="marquee-track flex flex-shrink-0">
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8">
              <span className="font-display text-sm font-600 tracking-[0.12em] uppercase text-fg-35 hover:text-fg-70 transition-colors duration-200">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e85d04]/40 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
