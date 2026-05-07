import { notFound } from "next/navigation";
import { BigButton } from "@/components/BigButton";
import { CopyButton } from "@/components/CopyButton";
import { EmergencyPanel } from "@/components/EmergencyPanel";
import { PageHeader } from "@/components/PageHeader";
import { getSituationById, situations } from "@/data/situations";

export function generateStaticParams() {
  return situations.map((situation) => ({ id: situation.id }));
}

export default function SituationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const situation = getSituationById(id);
  if (!situation) notFound();

  return (
    <main className="pb-12">
      <PageHeader title={situation.title} subtitle={situation.urgent} />
      <div className="safe-container grid gap-6">
        <AdviceSection title="不能做什么" items={situation.cannotDo} danger />
        <AdviceSection title="应该做什么" items={situation.shouldDo} />

        <section className="safe-card rounded-[1.5rem] p-5">
          <h2 className="text-[1.5rem] font-black text-[#111827]">可以拨打什么电话</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {situation.phones.map((phone) => (
              <BigButton href={`tel:${phone}`} variant={phone === "110" ? "danger" : "secondary"} key={phone}>
                拨打 {phone}
              </BigButton>
            ))}
          </div>
        </section>

        <section className="safe-card rounded-[1.5rem] p-5">
          <h2 className="text-[1.5rem] font-black text-[#111827]">可以复制给子女的提醒文案</h2>
          <p className="mt-3 rounded-[1rem] bg-[#f0fdfa] p-4 text-[1.05rem] font-bold text-[#115e59]">
            {situation.familyMessage}
          </p>
          <div className="mt-4">
            <CopyButton text={situation.familyMessage} />
          </div>
        </section>

        <EmergencyPanel />
        <BigButton href="/situations" variant="secondary">
          回到常见情况
        </BigButton>
      </div>
    </main>
  );
}

function AdviceSection({ title, items, danger = false }: { title: string; items: string[]; danger?: boolean }) {
  return (
    <section className={`rounded-[1.5rem] border-2 p-5 shadow-sm ${danger ? "border-[#ef4444] bg-[#fef2f2]" : "border-[#14b8a6] bg-[#f0fdfa]"}`}>
      <h2 className="text-[1.5rem] font-black text-[#111827]">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li className="rounded-[1rem] bg-white/80 p-4 text-[1.08rem] font-bold text-[#1f2933]" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
