# 银发防骗小喇叭

一个适合老人使用的防骗提醒网站。页面字大、按钮大、移动端优先，适合子女发给父母、社区宣传、老人收藏到手机桌面。

## 功能列表

- 首页展示今日重点提醒、最新骗局、常见场景、防骗口诀和紧急求助入口
- 骗局数据优先从远程 JSON 拉取，默认每 1 小时刷新一次
- 骗局详情页展示骗子话术、发生过程、老人建议、被骗后处理办法
- 场景页按“陌生电话、转账、下载 App、共享屏幕”等常见情况给出行动建议
- 紧急求助页支持一键拨打 `110` 和 `96110`
- 子女提醒页支持复制提醒文案
- Web Speech API 语音播报，支持停止播报
- 本地收藏骗局，使用 `localStorage` 保存
- 字体大小切换：标准 / 更大 / 超大
- 安静模式开关，默认开启，不做自动播报

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- 浏览器 Web Speech API
- 本地数据文件 `data/scams.ts`

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:3001
```

构建检查：

```bash
npm run build
```

## 远程骗局数据源

项目默认从 GitHub raw 拉取：

```text
https://raw.githubusercontent.com/fhj414/silver-haired-anti-fraud-megaphone/main/data/scams.remote.json
```

也可以在 Vercel 环境变量里配置：

```text
SCAMS_SOURCE_URL=https://你的域名/scams.json
```

远程 JSON 支持两种结构：

```json
{
  "updatedAt": "2026-05-07T00:00:00.000Z",
  "scams": []
}
```

或直接使用数组：

```json
[]
```

远程源不可用时，页面会自动显示内置兜底数据，避免老人看到空页面。

## 如何新增骗局数据

打开 `data/scams.ts`，在 `scams` 数组里新增一条数据，字段保持一致：

```ts
{
  id: "new-scam-id",
  title: "骗局标题",
  category: "骗局分类",
  riskLevel: "高危",
  summary: "一句话简介",
  fakeWords: "骗子常用话术",
  howItWorks: ["第一步", "第二步"],
  elderAdvice: ["不要做什么", "应该怎么核实"],
  whatToDo: ["停止转账", "保存证据", "报警"],
  publishDate: "2026-05-07",
  sourceName: "来源名称",
  sourceUrl: "https://example.com",
  tags: ["标签"],
  audioText: "适合老人听的播报文案"
}
```

新增后，详情页会自动生成对应地址：`/scams/new-scam-id`。

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 新建项目，导入这个仓库。
3. Framework Preset 选择 Next.js。
4. Build Command 使用 `npm run build`。
5. Deploy。

项目没有后端数据库，也不需要额外环境变量。

## 后续可扩展方向

- 增加社区公告栏和地区化反诈提醒
- 增加 PWA 离线缓存和桌面图标
- 增加“收藏骗局”独立页面
- 增加真实来源链接审核和后台录入
- 增加更细的语音速度、音量、方言提示
