"use client";

import { useState } from "react";
import { BigButton } from "@/components/BigButton";
import { copyText } from "@/lib/copy";

export function CopyButton({ text, label = "复制给子女" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const ok = await copyText(text);
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <BigButton onClick={onCopy} variant="secondary">
      {copied ? "已复制" : label}
    </BigButton>
  );
}
