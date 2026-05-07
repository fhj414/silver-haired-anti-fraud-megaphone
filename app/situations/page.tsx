import { PageHeader } from "@/components/PageHeader";
import { SituationCard } from "@/components/SituationCard";
import { situations } from "@/data/situations";

export default function SituationsPage() {
  return (
    <main className="pb-12">
      <PageHeader title="老人常见情况" subtitle="遇到可疑事情，先点开看看。先停下，再核实。" />
      <div className="safe-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {situations.map((situation) => (
          <SituationCard situation={situation} key={situation.id} />
        ))}
      </div>
    </main>
  );
}
