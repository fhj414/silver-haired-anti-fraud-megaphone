"use client";

import { useEffect, useState } from "react";

export function FavoriteButton({ scamId }: { scamId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const ids = JSON.parse(window.localStorage.getItem("favorite-scams") || "[]") as string[];
    setSaved(ids.includes(scamId));
  }, [scamId]);

  function toggle() {
    const ids = JSON.parse(window.localStorage.getItem("favorite-scams") || "[]") as string[];
    const next = ids.includes(scamId) ? ids.filter((id) => id !== scamId) : [...ids, scamId];
    window.localStorage.setItem("favorite-scams", JSON.stringify(next));
    setSaved(next.includes(scamId));
  }

  return (
    <button
      className={`min-h-12 rounded-full border-2 px-5 py-2 text-[0.95rem] font-bold ${
        saved ? "border-[#b42318] bg-[#fee2e2] text-[#7f1d1d]" : "border-[#d7b46a] bg-white text-[#5f4215]"
      }`}
      onClick={toggle}
      type="button"
    >
      {saved ? "已收藏" : "收藏"}
    </button>
  );
}
