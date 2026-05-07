import { NextResponse } from "next/server";
import { scams as fallbackScams, type Scam } from "@/data/scams";
import { getScamFeed } from "@/lib/scams";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_OFFICIAL_SOURCE_URLS = [
  "https://www.gov.cn/lianbo/bumen/202506/content_7028568.htm",
  "https://www.mps.gov.cn/",
  "https://www.samr.gov.cn/",
];

const TARGET_JSON_PATH = "data/scams.remote.json";

export async function GET(request: Request) {
  return refreshScams(request);
}

export async function POST(request: Request) {
  return refreshScams(request);
}

async function refreshScams(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!openRouterKey) {
    return NextResponse.json({ ok: false, error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
  }

  if (!githubToken) {
    return NextResponse.json({ ok: false, error: "Missing GITHUB_TOKEN" }, { status: 500 });
  }

  const officialSources = await fetchOfficialSources();
  const currentFeed = await getScamFeed();
  const nextFeed = await generateScamFeedWithOpenRouter({
    openRouterKey,
    officialSources,
    existingScams: currentFeed.scams.length > 0 ? currentFeed.scams : fallbackScams,
  });

  await writeScamFeedToGitHub({
    githubToken,
    content: JSON.stringify(nextFeed, null, 2) + "\n",
  });

  return NextResponse.json({
    ok: true,
    updatedAt: nextFeed.updatedAt,
    count: nextFeed.scams.length,
    sourceCount: officialSources.length,
    target: TARGET_JSON_PATH,
  });
}

async function fetchOfficialSources() {
  const urls = getOfficialSourceUrls();
  const sources = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            "user-agent": "silver-haired-anti-fraud-megaphone/1.0",
            accept: "text/html,application/json,text/plain;q=0.9,*/*;q=0.8",
          },
        });

        if (!response.ok) {
          return { url, ok: false, title: url, text: `抓取失败：HTTP ${response.status}` };
        }

        const raw = await response.text();
        const title = extractTitle(raw) || url;
        const text = htmlToReadableText(raw).slice(0, 12000);
        return { url, ok: true, title, text };
      } catch (error) {
        return { url, ok: false, title: url, text: `抓取失败：${String(error)}` };
      }
    }),
  );

  return sources.filter((source) => source.text.trim().length > 0);
}

function getOfficialSourceUrls() {
  const configured = process.env.OFFICIAL_SOURCE_URLS;
  if (!configured) return DEFAULT_OFFICIAL_SOURCE_URLS;

  const urls = configured
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);

  return urls.length > 0 ? urls : DEFAULT_OFFICIAL_SOURCE_URLS;
}

async function generateScamFeedWithOpenRouter({
  openRouterKey,
  officialSources,
  existingScams,
}: {
  openRouterKey: string;
  officialSources: Array<{ url: string; title: string; text: string; ok: boolean }>;
  existingScams: Scam[];
}) {
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
  const now = new Date().toISOString();
  const sourceBrief = officialSources
    .map((source, index) => {
      return [
        `【来源 ${index + 1}】${source.title}`,
        `URL: ${source.url}`,
        `抓取状态: ${source.ok ? "成功" : "失败"}`,
        source.text,
      ].join("\n");
    })
    .join("\n\n---\n\n");

  const existingBrief = existingScams
    .slice(0, 12)
    .map((scam) => `${scam.id}｜${scam.title}｜${scam.category}｜${scam.riskLevel}｜${scam.summary}`)
    .join("\n");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${openRouterKey}`,
      "content-type": "application/json",
      "http-referer": process.env.NEXT_PUBLIC_SITE_URL || "https://silver-haired-anti-fraud-megaphone.vercel.app",
      "x-title": "银发防骗小喇叭",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 6000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是反诈内容编辑，只能依据用户提供的官方或可信来源材料整理内容。不要编造新闻、日期、机构名称或链接。输出必须是严格 JSON。",
        },
        {
          role: "user",
          content: buildOpenRouterPrompt({ now, sourceBrief, existingBrief }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${detail.slice(0, 500)}`);
  }

  const completion = await response.json();
  const content = completion?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("OpenRouter response did not include message content");
  }

  const parsed = JSON.parse(content);
  const scams = normalizeGeneratedScams(parsed.scams);

  if (scams.length < 6) {
    throw new Error("OpenRouter generated too few valid scam entries");
  }

  return {
    updatedAt: now,
    sourceNote: "由 Vercel Cron 拉取可信来源，并通过 OpenRouter 整理为适合老人阅读和播报的反诈提醒。内容需以来源材料为准。",
    generatedBy: model,
    sourceUrls: officialSources.map((source) => source.url),
    scams,
  };
}

function buildOpenRouterPrompt({
  now,
  sourceBrief,
  existingBrief,
}: {
  now: string;
  sourceBrief: string;
  existingBrief: string;
}) {
  return `
今天时间：${now}

请根据下方来源材料，整理 8 到 12 条适合老人阅读的最新或高发诈骗提醒。

严格要求：
1. 只能使用来源材料中明确出现或能直接归纳出的诈骗类型，不要编造具体案件。
2. 语言要像对叔叔阿姨说话，清楚、慢、直接。
3. 每条必须包含 id、title、category、riskLevel、summary、fakeWords、howItWorks、elderAdvice、whatToDo、publishDate、sourceName、sourceUrl、tags、audioText。
4. riskLevel 只能是 "高危"、"中危"、"提醒"。
5. howItWorks、elderAdvice、whatToDo、tags 必须是字符串数组。
6. publishDate 优先用来源文章日期；无法确认时用今天日期。
7. sourceUrl 必须来自提供的来源 URL，不要捏造。
8. audioText 要适合语音播报，不超过 120 个汉字。
9. 尽量保留已有 id，除非来源出现了更合适的新主题。

输出 JSON 格式：
{
  "scams": [
    {
      "id": "kebab-case-id",
      "title": "骗局标题",
      "category": "分类",
      "riskLevel": "高危",
      "summary": "一句话简介",
      "fakeWords": "骗子常用话术",
      "howItWorks": ["第一步", "第二步", "第三步"],
      "elderAdvice": ["建议一", "建议二", "建议三"],
      "whatToDo": ["处理一", "处理二", "处理三"],
      "publishDate": "YYYY-MM-DD",
      "sourceName": "来源名称",
      "sourceUrl": "https://...",
      "tags": ["标签"],
      "audioText": "播报文案"
    }
  ]
}

已有主题参考：
${existingBrief}

来源材料：
${sourceBrief}
`;
}

function normalizeGeneratedScams(value: unknown): Scam[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;

      const id = toText(item.id);
      const title = toText(item.title);
      const summary = toText(item.summary);
      const audioText = toText(item.audioText);

      if (!id || !title || !summary || !audioText) return null;

      return {
        id: toKebabId(id || title),
        title,
        category: toText(item.category) || "反诈提醒",
        riskLevel: item.riskLevel === "高危" || item.riskLevel === "中危" || item.riskLevel === "提醒" ? item.riskLevel : "提醒",
        summary,
        fakeWords: toText(item.fakeWords) || "对方会催您马上操作。",
        howItWorks: toTextArray(item.howItWorks, ["先取得信任", "再制造紧急情况", "最后诱导转账或泄露信息"]),
        elderAdvice: toTextArray(item.elderAdvice, ["先停下来", "联系子女核实", "必要时拨打 96110"]),
        whatToDo: toTextArray(item.whatToDo, ["停止转账", "保存证据", "联系银行和警方"]),
        publishDate: normalizeDate(toText(item.publishDate)),
        sourceName: toText(item.sourceName) || "官方反诈提醒",
        sourceUrl: toText(item.sourceUrl) || "#",
        tags: toTextArray(item.tags, ["反诈"]),
        audioText,
      } satisfies Scam;
    })
    .filter((item): item is Scam => Boolean(item));
}

async function writeScamFeedToGitHub({ githubToken, content }: { githubToken: string; content: string }) {
  const repo = process.env.GITHUB_REPO || "fhj414/silver-haired-anti-fraud-megaphone";
  const branch = process.env.GITHUB_BRANCH || "main";
  const endpoint = `https://api.github.com/repos/${repo}/contents/${TARGET_JSON_PATH}`;

  const currentResponse = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, {
    headers: {
      authorization: `Bearer ${githubToken}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
    },
  });

  if (!currentResponse.ok) {
    const detail = await currentResponse.text();
    throw new Error(`Failed to read GitHub content: ${currentResponse.status} ${detail.slice(0, 500)}`);
  }

  const current = await currentResponse.json();
  const updateResponse = await fetch(endpoint, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${githubToken}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `chore: refresh scam feed ${new Date().toISOString().slice(0, 10)}`,
      content: Buffer.from(content, "utf8").toString("base64"),
      sha: current.sha,
      branch,
    }),
  });

  if (!updateResponse.ok) {
    const detail = await updateResponse.text();
    throw new Error(`Failed to update GitHub content: ${updateResponse.status} ${detail.slice(0, 500)}`);
  }
}

function htmlToReadableText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? htmlToReadableText(title) : "";
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toTextArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.map(toText).filter(Boolean);
  return items.length > 0 ? items : fallback;
}

function toKebabId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function normalizeDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Date().toISOString().slice(0, 10);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
