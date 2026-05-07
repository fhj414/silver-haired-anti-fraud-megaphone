import { scams } from "@/data/scams";

export function getHomeAudioText() {
  const top = scams[0];
  return `叔叔阿姨请注意，今天重点提醒是：${top.audioText} 遇到陌生电话、陌生链接、转账要求，请先停下来，问子女，问社区，或者拨打九六一一零核实。`;
}

export function getScamFullAudio(id: string) {
  const scam = scams.find((item) => item.id === id);
  if (!scam) return "";

  return [
    scam.audioText,
    `骗子常用话术是：${scam.fakeWords}`,
    `骗局过程是：${scam.howItWorks.join("。")}`,
    `您应该这样做：${scam.elderAdvice.join("。")}`,
    `如果已经被骗：${scam.whatToDo.join("。")}`,
  ].join("。");
}
