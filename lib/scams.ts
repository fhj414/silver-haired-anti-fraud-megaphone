import { scams as fallbackScams, type RiskLevel, type Scam } from "@/data/scams";

export type ScamFeed = {
  scams: Scam[];
  sourceUrl: string;
  updatedAt?: string;
  usingFallback: boolean;
};

const DEFAULT_SOURCE_URL =
  "https://raw.githubusercontent.com/fhj414/silver-haired-anti-fraud-megaphone/main/data/scams.remote.json";

const REMOTE_REVALIDATE_SECONDS = 60 * 60;

export async function getScamFeed(): Promise<ScamFeed> {
  const sourceUrl = process.env.SCAMS_SOURCE_URL || DEFAULT_SOURCE_URL;

  try {
    const response = await fetch(sourceUrl, {
      next: { revalidate: REMOTE_REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Scam source returned ${response.status}`);
    }

    const payload = await response.json();
    const normalized = normalizeScams(payload);

    if (normalized.scams.length === 0) {
      throw new Error("Scam source did not include valid scams");
    }

    return {
      scams: sortByDate(normalized.scams),
      sourceUrl,
      updatedAt: normalized.updatedAt,
      usingFallback: false,
    };
  } catch (error) {
    console.error("Falling back to bundled scam data:", error);
    return {
      scams: sortByDate(fallbackScams),
      sourceUrl,
      updatedAt: undefined,
      usingFallback: true,
    };
  }
}

export async function getScams() {
  const feed = await getScamFeed();
  return feed.scams;
}

export async function getScamById(id: string) {
  const scams = await getScams();
  return scams.find((scam) => scam.id === id);
}

export function getScamFullAudioFromScam(scam: Scam) {
  return [
    scam.audioText,
    `骗子常用话术是：${scam.fakeWords}`,
    `骗局过程是：${scam.howItWorks.join("。")}`,
    `您应该这样做：${scam.elderAdvice.join("。")}`,
    `如果已经被骗：${scam.whatToDo.join("。")}`,
  ].join("。");
}

function normalizeScams(payload: unknown): { scams: Scam[]; updatedAt?: string } {
  const record = isRecord(payload) ? payload : {};
  const rawScams = Array.isArray(payload) ? payload : Array.isArray(record.scams) ? record.scams : [];
  const updatedAt = typeof record.updatedAt === "string" ? record.updatedAt : undefined;

  return {
    scams: rawScams.map(normalizeScam).filter((scam): scam is Scam => Boolean(scam)),
    updatedAt,
  };
}

function normalizeScam(value: unknown): Scam | null {
  if (!isRecord(value)) return null;

  const id = asText(value.id);
  const title = asText(value.title);
  const summary = asText(value.summary);
  const audioText = asText(value.audioText);

  if (!id || !title || !summary || !audioText) return null;

  return {
    id,
    title,
    category: asText(value.category) || "反诈提醒",
    riskLevel: asRiskLevel(value.riskLevel),
    summary,
    fakeWords: asText(value.fakeWords) || "对方会制造紧张气氛，催您马上操作。",
    howItWorks: asTextArray(value.howItWorks, ["先取得信任", "再制造紧急情况", "最后诱导转账或泄露信息"]),
    elderAdvice: asTextArray(value.elderAdvice, ["先停下来", "联系子女核实", "必要时拨打 96110"]),
    whatToDo: asTextArray(value.whatToDo, ["停止转账", "保存证据", "联系银行和警方"]),
    publishDate: asText(value.publishDate) || new Date().toISOString().slice(0, 10),
    sourceName: asText(value.sourceName) || "远程反诈提醒",
    sourceUrl: asText(value.sourceUrl) || "#",
    tags: asTextArray(value.tags, ["反诈"]),
    audioText,
  };
}

function sortByDate(scams: Scam[]) {
  return [...scams].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

function asRiskLevel(value: unknown): RiskLevel {
  return value === "高危" || value === "中危" || value === "提醒" ? value : "提醒";
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asTextArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.map(asText).filter(Boolean);
  return items.length > 0 ? items : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
