"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SpeakerButton } from "@/components/SpeakerButton";
import type { Scam } from "@/data/scams";
import { situations } from "@/data/situations";
import { getHomeAudioText, getScamFullAudio } from "@/lib/pageText";

export function GlobalSpeakerButton() {
  const pathname = usePathname();
  const [remoteScams, setRemoteScams] = useState<Scam[]>([]);
  const text = getCurrentPageText(pathname, remoteScams);

  useEffect(() => {
    let active = true;

    fetch("/api/scams")
      .then((response) => (response.ok ? response.json() : null))
      .then((feed) => {
        if (active && Array.isArray(feed?.scams)) {
          setRemoteScams(feed.scams);
        }
      })
      .catch(() => {
        setRemoteScams([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return <SpeakerButton text={text} />;
}

function getCurrentPageText(pathname: string | null, remoteScams: Scam[]) {
  const topScam = remoteScams[0];

  if (!pathname || pathname === "/") {
    return topScam
      ? `叔叔阿姨请注意，今天重点提醒是：${topScam.audioText} 遇到陌生电话、陌生链接、转账要求，请先停下来，问子女，问社区，或者拨打九六一一零核实。`
      : getHomeAudioText();
  }

  if (pathname.startsWith("/scams/")) {
    const id = pathname.split("/").filter(Boolean)[1];
    const remoteScam = remoteScams.find((item) => item.id === id);
    if (remoteScam) {
      return [
        remoteScam.audioText,
        `骗子常用话术是：${remoteScam.fakeWords}`,
        `骗局过程是：${remoteScam.howItWorks.join("。")}`,
        `您应该这样做：${remoteScam.elderAdvice.join("。")}`,
        `如果已经被骗：${remoteScam.whatToDo.join("。")}`,
      ].join("。");
    }
    return getScamFullAudio(id) || getHomeAudioText();
  }

  if (pathname === "/situations") {
    return "叔叔阿姨，遇到陌生电话、转账、下载软件、共享屏幕、快递理赔、养老投资等情况，请先别急。先停下来，再点开对应情况查看应该怎么做。";
  }

  if (pathname.startsWith("/situations/")) {
    const id = pathname.split("/").filter(Boolean)[1];
    const situation = situations.find((item) => item.id === id);
    if (situation) {
      return `${situation.title}。${situation.urgent} 不能做的是：${situation.cannotDo.join("。")}。应该做的是：${situation.shouldDo.join("。")}。可以拨打：${situation.phones.join("，")}。`;
    }
  }

  if (pathname === "/help") {
    return "如果正在被骗，请马上停止转账。拨打 110，或者拨打 96110。保存聊天记录、电话、短信和转账截图。联系银行尝试止付，并马上联系子女。";
  }

  if (pathname === "/family") {
    return "给爸妈的今日防骗提醒：陌生电话不要轻信，陌生链接不要点，验证码不要告诉任何人。凡是让您转账、下载软件、共享屏幕的事情，都先停下来给子女打电话。";
  }

  const topScams = remoteScams.slice(0, 3).map((scam) => scam.title).join("，") || "冒充公检法诈骗，虚假投资理财诈骗，养老项目投资诈骗";
  return `今天重点关注这些骗局：${topScams}。遇到可疑情况，请先停下来，多核实。`;
}
