import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PRICING_PLANS, ADDON_PRICES, TIKTOK_PRICES } from "@constants/pricing";

const DEFAULT = {
  plans:  PRICING_PLANS,
  addons: ADDON_PRICES,
  tiktok: TIKTOK_PRICES,
};

export function usePricing() {
  const [pricing, setPricing] = useState(DEFAULT);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "pricing"),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setPricing({
            plans:  d.plans  ?? DEFAULT.plans,
            addons: d.addons ?? DEFAULT.addons,
            tiktok: d.tiktok ?? DEFAULT.tiktok,
          });
        }
      },
      () => {} // keep defaults on error
    );
    return unsub;
  }, []);

  return pricing;
}
