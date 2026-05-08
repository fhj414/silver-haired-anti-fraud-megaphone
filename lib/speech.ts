"use client";

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function isWeChatBrowser() {
  return typeof navigator !== "undefined" && /MicroMessenger/i.test(navigator.userAgent);
}

export function stopSpeak() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string) {
  if (!isSpeechSupported()) {
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
