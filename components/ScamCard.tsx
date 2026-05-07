import Link from "next/link";
import type { Scam } from "@/data/scams";
import { FavoriteButton } from "@/components/FavoriteButton";
import { InlineSpeakButton } from "@/components/InlineSpeakButton";
import { RiskBadge } from "@/components/RiskBadge";

export function ScamCard({ scam }: { scam: Scam }) {
  return (
    <article className="safe-card rounded-[1.5rem] p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <RiskBadge level={scam.riskLevel} />
        <FavoriteButton scamId={scam.id} />
      </div>
      <h3 className="text-[1.45rem] font-black leading-snug text-[#111827]">{scam.title}</h3>
      <p className="mt-3 text-[1rem] text-[#374151]">{scam.summary}</p>
      <div className="mt-4 rounded-[1rem] bg-[#fff7ed] p-4">
        <p className="text-[0.9rem] font-bold text-[#9a3412]">骗子常用话术</p>
        <p className="mt-1 text-[1rem] text-[#1f2933]">“{scam.fakeWords}”</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          className="inline-flex min-h-14 items-center justify-center rounded-[1.25rem] bg-[#b42318] px-5 py-4 text-center text-[1rem] font-bold text-white shadow-sm hover:bg-[#8a1c14]"
          href={`/scams/${scam.id}`}
        >
          查看详情
        </Link>
        <InlineSpeakButton text={scam.audioText} />
      </div>
    </article>
  );
}
