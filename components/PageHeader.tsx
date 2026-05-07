import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <header className="safe-container py-8">
      <div className="flex flex-wrap gap-3 text-[0.9rem] font-bold text-[#8a1c14]">
        <Link href="/">首页</Link>
        <Link href="/situations">常见场景</Link>
        <Link href="/help">紧急求助</Link>
        <Link href="/family">子女提醒</Link>
      </div>
      <h1 className="mt-6 text-[2rem] font-black leading-tight text-[#111827] sm:text-[2.6rem]">{title}</h1>
      {subtitle ? <p className="mt-3 max-w-2xl text-[1.15rem] font-bold text-[#5f4215]">{subtitle}</p> : null}
      {children}
    </header>
  );
}
