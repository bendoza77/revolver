import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ka from "./locales/ka.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ka: { translation: ka },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "ka"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "revolver_lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Keep <html lang="..."> in sync so CSS :lang(ka) rules apply
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});
// Set on initial load
i18n.isInitialized
  ? (document.documentElement.lang = i18n.language)
  : i18n.on("initialized", () => { document.documentElement.lang = i18n.language; });

export default i18n;
