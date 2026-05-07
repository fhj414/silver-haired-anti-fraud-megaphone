import type { Metadata } from "next";
import "./globals.css";
import { FontControls } from "@/components/FontControls";
import { GlobalSpeakerButton } from "@/components/GlobalSpeakerButton";
import { QuietModeToggle } from "@/components/QuietModeToggle";

export const metadata: Metadata = {
  title: "银发防骗小喇叭",
  description: "适合老人使用的防骗提醒网站，每天看一眼，守好养老钱。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <GlobalSpeakerButton />
        <div className="safe-container pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] bg-white/70 px-4 py-3 text-[0.9rem]">
            <a href="/" className="font-bold text-[#8a1c14]">
              银发防骗小喇叭
            </a>
            <div className="flex flex-wrap items-center gap-2">
              <FontControls />
              <QuietModeToggle />
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
