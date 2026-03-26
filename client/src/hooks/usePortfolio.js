import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PORTFOLIO_PROJECTS } from "@constants/portfolio";

export function usePortfolio() {
  const [firestoreProjects, setFirestoreProjects] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setFirestoreProjects(snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() })));
    }, () => {});
  }, []);

  // Firestore projects first (newest on top), then hardcoded.
  // Deduplicate by title so admin edits override built-in entries.
  const firestoreTitles = new Set(firestoreProjects.map((p) => p.title));
  const uniqueHardcoded = PORTFOLIO_PROJECTS.filter((p) => !firestoreTitles.has(p.title));

  return [...firestoreProjects, ...uniqueHardcoded];
}
