import Link from "next/link";
import { AntiFraudFormula } from "@/components/AntiFraudFormula";
import { BigButton } from "@/components/BigButton";
import { EmergencyPanel } from "@/components/EmergencyPanel";
import { PageHeader } from "@/components/PageHeader";
import { ScamCard } from "@/components/ScamCard";
import { SituationCard } from "@/components/SituationCard";
import { situations } from "@/data/situations";
import { getScamFeed } from "@/lib/scams";

export const revalidate = 3600;

export default async function Home() {
  const { scams, sourceUrl, updatedAt, usingFallback } = await getScamFeed();
  const today = scams[0];
  const latest = scams.slice(0, 6);
  const firstSituations = situations.slice(0, 6);

  return (
    <main className="pb-12">
      <PageHeader title="银发防骗小喇叭" subtitle="每天看一眼，守好养老钱">
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <BigButton href="/help" variant="danger">
            我可能正在被骗
          </BigButton>
          <BigButton href="/situations" variant="secondary">
            按情况查办法
          </BigButton>
          <BigButton href="/family">发给爸妈</BigButton>
        </div>
      </PageHeader>

      <div className="safe-container grid gap-6">
        <section className="safe-card rounded-[1.5rem] p-5">
          <p className="text-[0.95rem] font-bold text-[#b42318]">今日重点提醒</p>
          <p className="mt-1 text-[0.85rem] font-bold text-[#5f4215]">
            {usingFallback ? "远程数据暂不可用，正在显示兜底提醒" : "已从远程数据源拉取"}
            {updatedAt ? ` · 更新于 ${updatedAt.slice(0, 10)}` : ""}
          </p>
          <h2 className="mt-2 text-[1.6rem] font-black leading-tight text-[#111827]">{today.title}</h2>
          <p className="mt-3 text-[1.1rem] text-[#374151]">{today.audioText}</p>
          <Link
            href={`/scams/${today.id}`}
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-[1.25rem] bg-[#b42318] px-5 py-4 text-center text-[1rem] font-bold text-white sm:w-auto"
          >
            查看今天提醒
          </Link>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.95rem] font-bold text-[#8a1c14]">最新骗局</p>
              <h2 className="text-[1.6rem] font-black text-[#111827]">先看这些高发套路</h2>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {latest.map((scam) => (
              <ScamCard scam={scam} key={scam.id} />
            ))}
          </div>
          <p className="mt-4 break-all text-[0.85rem] font-bold text-[#5f4215]">数据源：{sourceUrl}</p>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-[0.95rem] font-bold text-[#8a1c14]">老人常见场景入口</p>
            <h2 className="text-[1.6rem] font-black text-[#111827]">遇到事情，按情况点开</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {firstSituations.map((situation) => (
              <SituationCard situation={situation} key={situation.id} />
            ))}
          </div>
          <div className="mt-4">
            <BigButton href="/situations" variant="secondary">
              查看全部常见情况
            </BigButton>
          </div>
        </section>

        <AntiFraudFormula />
        <EmergencyPanel />
      </div>
    </main>
  );
}
