import Link from "next/link";
import type { Situation } from "@/data/situations";

export function SituationCard({ situation }: { situation: Situation }) {
  return (
    <Link
      className="safe-card block rounded-[1.5rem] p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
      href={`/situations/${situation.id}`}
    >
      <h3 className="text-[1.3rem] font-black leading-snug text-[#111827]">{situation.title}</h3>
      <p className="mt-3 text-[0.98rem] text-[#4b5563]">{situation.urgent}</p>
      <span className="mt-4 inline-flex rounded-full bg-[#b42318] px-4 py-2 text-[0.9rem] font-bold text-white">
        点开看看怎么办
      </span>
    </Link>
  );
}
