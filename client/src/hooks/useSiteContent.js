import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import i18n from "@/i18n";
import en from "@/i18n/locales/en.json";
import ka from "@/i18n/locales/ka.json";

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

const DEFAULTS = { en, ka };

export function useSiteContent() {
  useEffect(() => {
    const unsubs = ["en", "ka"].map((code) =>
      onSnapshot(
        doc(db, "settings", `content_${code}`),
        (snap) => {
          const merged = deepMerge(DEFAULTS[code], snap.exists() ? snap.data() : {});
          // deep=false, overwrite=true → fully replaces the namespace
          i18n.addResourceBundle(code, "translation", merged, false, true);
        },
        (err) => console.warn(`[useSiteContent] Firestore error (${code}):`, err)
      )
    );
    return () => unsubs.forEach((u) => u());
  }, []);
}
