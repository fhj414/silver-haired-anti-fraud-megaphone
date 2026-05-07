import { notFound } from "next/navigation";
import { BigButton } from "@/components/BigButton";
import { EmergencyPanel } from "@/components/EmergencyPanel";
import { FavoriteButton } from "@/components/FavoriteButton";
import { InlineSpeakButton } from "@/components/InlineSpeakButton";
import { PageHeader } from "@/components/PageHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { formatDate } from "@/lib/date";
import { getScamById, getScamFullAudioFromScam } from "@/lib/scams";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export default async function ScamDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const scam = await getScamById(id);
  if (!scam) notFound();

  const fullAudio = getScamFullAudioFromScam(scam);

  return (
    <main className="pb-12">
      <PageHeader title={scam.title} subtitle={scam.summary}>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <RiskBadge level={scam.riskLevel} />
          <FavoriteButton scamId={scam.id} />
        </div>
        <div className="mt-5 max-w-sm">
          <InlineSpeakButton text={fullAudio}>听全文</InlineSpeakButton>
        </div>
      </PageHeader>

      <div className="safe-container grid gap-6">
        <section className="safe-card rounded-[1.5rem] p-5">
          <h2 className="text-[1.5rem] font-black text-[#111827]">骗子常用话术</h2>
          <p className="mt-3 rounded-[1rem] bg-[#fff7ed] p-4 text-[1.15rem] font-bold text-[#7c2d12]">
            “{scam.fakeWords}”
          </p>
        </section>

        <InfoSection title="骗局怎么一步步发生" items={scam.howItWorks} />
        <InfoSection title="老人应该怎么做" items={scam.elderAdvice} tone="green" />
        <InfoSection title="如果已经被骗怎么办" items={scam.whatToDo} tone="red" />

        <section className="safe-card rounded-[1.5rem] p-5">
          <h2 className="text-[1.5rem] font-black text-[#111827]">来源和时间</h2>
          <p className="mt-3 text-[1rem] text-[#374151]">
            来源：<a className="font-bold text-[#0f766e] underline" href={scam.sourceUrl}>{scam.sourceName}</a>
          </p>
          <p className="text-[1rem] text-[#374151]">发布时间：{formatDate(scam.publishDate)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {scam.tags.map((tag) => (
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[0.85rem] font-bold text-[#3730a3]" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        <InlineSpeakButton text={fullAudio}>听全文</InlineSpeakButton>
        <EmergencyPanel />
        <BigButton href="/" variant="secondary">
          回到首页
        </BigButton>
      </div>
    </main>
  );
}

function InfoSection({
  title,
  items,
  tone = "plain",
}: {
  title: string;
  items: string[];
  tone?: "plain" | "green" | "red";
}) {
  const toneClass = {
    plain: "border-[#f1d6aa] bg-white",
    green: "border-[#14b8a6] bg-[#f0fdfa]",
    red: "border-[#ef4444] bg-[#fef2f2]",
  };

  return (
    <section className={`rounded-[1.5rem] border-2 p-5 shadow-sm ${toneClass[tone]}`}>
      <h2 className="text-[1.5rem] font-black text-[#111827]">{title}</h2>
      <ol className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <li className="flex gap-3 rounded-[1rem] bg-white/75 p-4 text-[1.05rem] font-bold text-[#1f2933]" key={item}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b42318] text-white">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
