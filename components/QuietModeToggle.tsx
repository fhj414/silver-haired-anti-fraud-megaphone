"use client";

import { useEffect, useState } from "react";

export function QuietModeToggle() {
  const [quiet, setQuiet] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("quiet-mode");
    if (saved === null) {
      window.localStorage.setItem("quiet-mode", "true");
      return;
    }
    setQuiet(saved === "true");
  }, []);

  function toggle() {
    const next = !quiet;
    setQuiet(next);
    window.localStorage.setItem("quiet-mode", String(next));
  }

  return (
    <button
      className={`rounded-full border-2 px-4 py-2 text-[0.8rem] font-bold ${
        quiet ? "border-[#0f766e] bg-[#e6fffb] text-[#115e59]" : "border-[#b45309] bg-[#fff7ed] text-[#92400e]"
      }`}
      onClick={toggle}
      type="button"
    >
      {quiet ? "安静模式开" : "安静模式关"}
    </button>
  );
}
