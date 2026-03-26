import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { POSTS } from "@constants/blog";

export function useBlogPosts() {
  const [firestorePosts, setFirestorePosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setFirestorePosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => {});
  }, []);

  // Firestore posts come first (newest on top), then hardcoded posts.
  // If a slug exists in both, the Firestore version wins (dedup).
  const firestoreSlugs = new Set(firestorePosts.map((p) => p.slug));
  const uniqueHardcoded = POSTS.filter((p) => !firestoreSlugs.has(p.slug));

  return [...firestorePosts, ...uniqueHardcoded];
}
