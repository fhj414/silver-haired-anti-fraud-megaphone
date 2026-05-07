"use client";

import { useEffect, useState } from "react";
import { isSpeechSupported, speak, stopSpeak } from "@/lib/speech";

type SpeakerButtonProps = {
  text: string;
  className?: string;
  label?: string;
};

export function SpeakerButton({ text, className = "", label = "大喇叭" }: SpeakerButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isSpeechSupported()) return;

    const timer = window.setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 500);

    return () => window.clearInterval(timer);
  }, []);

  function handleClick() {
    if (isSpeaking) {
      stopSpeak();
      setIsSpeaking(false);
      return;
    }

    const ok = speak(text);
    if (ok) setIsSpeaking(true);
  }

  return (
    <button
      aria-label={isSpeaking ? "停止播报" : label}
      className={`fixed right-3 top-3 z-50 flex min-h-16 items-center justify-center gap-2 rounded-full border-4 border-white bg-[#b42318] px-5 py-3 text-[0.95rem] font-bold leading-tight text-white shadow-xl transition hover:bg-[#8a1c14] sm:right-6 sm:top-6 ${className}`}
      onClick={handleClick}
      type="button"
    >
      {!isSpeaking ? <MegaphoneIcon /> : null}
      <span>{isSpeaking ? "停止播报" : "听"}</span>
    </button>
  );
}

function MegaphoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
      viewBox="0 0 24 24"
    >
      <path d="m3 11 18-5v12L3 13v-2Z" />
      <path d="M11.6 16.6 13 21H8l-1.2-5.5" />
      <path d="M21 9.5c1.1 1 1.1 4 0 5" />
    </svg>
  );
}
