"use client";

import { useEffect, useState } from "react";

const options = [
  { value: "standard", label: "标准" },
  { value: "large", label: "更大" },
  { value: "xlarge", label: "超大" },
] as const;

type FontSize = (typeof options)[number]["value"];

export function FontControls() {
  const [size, setSize] = useState<FontSize>("standard");

  useEffect(() => {
    const saved = window.localStorage.getItem("font-size") as FontSize | null;
    if (saved === "large" || saved === "xlarge") {
      setSize(saved);
      document.documentElement.classList.toggle("font-large", saved === "large");
      document.documentElement.classList.toggle("font-xlarge", saved === "xlarge");
    }
  }, []);

  function changeSize(next: FontSize) {
    setSize(next);
    window.localStorage.setItem("font-size", next);
    document.documentElement.classList.toggle("font-large", next === "large");
    document.documentElement.classList.toggle("font-xlarge", next === "xlarge");
  }

  return (
    <div className="flex rounded-full border-2 border-[#d7b46a] bg-white p-1" aria-label="字体大小">
      {options.map((option) => (
        <button
          className={`rounded-full px-3 py-2 text-[0.8rem] font-bold ${
            size === option.value ? "bg-[#0f766e] text-white" : "text-[#1f2933]"
          }`}
          key={option.value}
          onClick={() => changeSize(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
