import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { POSTS } from "@constants/blog";

export function useBlogPosts() {
  const [posts, setPosts] = useState(POSTS);

  useEffect(() => {
    return onSnapshot(
      collection(db, "blog_posts"),
      (snap) => {
        if (!snap.empty) {
          setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      },
      () => {} // on error, keep default
    );
  }, []);

  return posts;
}
