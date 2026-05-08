"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy";
import { isWeChatBrowser } from "@/lib/speech";

export function SpeechFallbackDialog({
  text,
  open,
  onClose,
}: {
  text: string;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  async function handleCopy() {
    const ok = await copyText(text);
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 px-4 py-6" role="dialog" aria-modal="true">
      <section className="max-h-[86vh] w-full max-w-[34rem] overflow-auto rounded-[1.5rem] bg-white p-5 shadow-xl">
        <h2 className="text-[1.45rem] font-black leading-tight text-[#111827]">当前浏览器不能直接播报</h2>
        <p className="mt-3 text-[1rem] font-bold text-[#5f4215]">
          {isWeChatBrowser()
            ? "微信内置浏览器可能不支持网页语音播报。可以直接看下面的大字提醒，或点右上角菜单，选择在浏览器中打开后再试。"
            : "这个浏览器暂不支持网页语音播报。可以直接阅读下面的大字提醒，或换手机系统浏览器再试。"}
        </p>

        <div className="mt-4 rounded-[1rem] bg-[#fff7ed] p-4 text-[1.05rem] font-bold leading-loose text-[#1f2933]">
          {text}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            className="min-h-14 rounded-[1.25rem] bg-[#0f766e] px-5 py-4 text-[1rem] font-bold text-white"
            onClick={handleCopy}
            type="button"
          >
            {copied ? "已复制文字" : "复制文字"}
          </button>
          <button
            className="min-h-14 rounded-[1.25rem] border-2 border-[#d7b46a] bg-white px-5 py-4 text-[1rem] font-bold text-[#5f4215]"
            onClick={onClose}
            type="button"
          >
            我知道了
          </button>
        </div>
      </section>
    </div>
  );
}
