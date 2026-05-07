"use client";

import { useState } from "react";
import { BigButton } from "@/components/BigButton";
import { isSpeechSupported, speak, stopSpeak } from "@/lib/speech";

export function InlineSpeakButton({ text, children = "听一听" }: { text: string; children?: string }) {
  const [speaking, setSpeaking] = useState(false);

  function onClick() {
    if (speaking) {
      stopSpeak();
      setSpeaking(false);
      return;
    }

    if (!isSpeechSupported()) {
      window.alert("不支持语音播报，请直接阅读文字");
      return;
    }

    speak(text);
    setSpeaking(true);
    window.setTimeout(() => setSpeaking(false), Math.min(18000, Math.max(5000, text.length * 160)));
  }

  return (
    <BigButton onClick={onClick} variant="secondary">
      {speaking ? "停止播报" : children}
    </BigButton>
  );
}
