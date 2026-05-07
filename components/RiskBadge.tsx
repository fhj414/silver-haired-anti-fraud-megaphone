import type { RiskLevel } from "@/data/scams";

export function RiskBadge({ level }: { level: RiskLevel }) {
  const classes = {
    高危: "bg-[#fee2e2] text-[#991b1b] border-[#ef4444]",
    中危: "bg-[#ffedd5] text-[#9a3412] border-[#f97316]",
    提醒: "bg-[#dcfce7] text-[#166534] border-[#22c55e]",
  };

  return (
    <span className={`inline-flex rounded-full border-2 px-4 py-1 text-[0.9rem] font-bold ${classes[level]}`}>
      {level}
    </span>
  );
}
