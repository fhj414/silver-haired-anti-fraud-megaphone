"use client";

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function stopSpeak() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string) {
  if (!isSpeechSupported()) {
    window.alert("不支持语音播报，请直接阅读文字");
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.88;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}
