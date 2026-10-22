"use client";

import { useState } from "react";

export function FollowButton() {
  const [followed, setFollowed] = useState(false);
  return (
    <button
      type="button"
      className={`nd-btn nd-btn--outline-black${followed ? " is-followed" : ""}`}
      onClick={() => setFollowed((v) => !v)}
      aria-pressed={followed}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={followed ? "#FBBF24" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" />
      </svg>
      <span>{followed ? "Diikuti" : "Follow Toko"}</span>
    </button>
  );
}
