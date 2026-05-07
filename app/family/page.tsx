import { AntiFraudFormula } from "@/components/AntiFraudFormula";
import { CopyButton } from "@/components/CopyButton";
import { PageHeader } from "@/components/PageHeader";

const familyText =
  "爸妈，今天提醒您：陌生电话不要轻信，陌生链接不要点，验证码不要告诉任何人，凡是让您转账、下载 App、共享屏幕的事情，都先停下来给我打电话。遇到可疑情况也可以拨打 96110。";

export default function FamilyPage() {
  return (
    <main className="pb-12">
      <PageHeader title="子女提醒" subtitle="把简单、重复、好记的话发给爸妈，比讲大道理更有用。" />
      <div className="safe-container grid gap-6">
        <section className="safe-card rounded-[1.5rem] p-5">
          <p className="text-[0.95rem] font-bold text-[#b42318]">给爸妈的今日防骗提醒</p>
          <h2 className="mt-2 text-[1.5rem] font-black text-[#111827]">可复制文案</h2>
          <p className="mt-3 rounded-[1rem] bg-[#fff7ed] p-4 text-[1.08rem] font-bold text-[#5f4215]">
            {familyText}
          </p>
          <div className="mt-4">
            <CopyButton text={familyText} label="复制提醒文案" />
          </div>
        </section>

        <section className="safe-card rounded-[1.5rem] p-5">
          <h2 className="text-[1.5rem] font-black text-[#111827]">如何把网站添加到手机桌面</h2>
          <div className="mt-4 grid gap-3">
            <p className="rounded-[1rem] bg-[#f0fdfa] p-4 font-bold">苹果手机：用 Safari 打开网站，点分享按钮，选择“添加到主屏幕”。</p>
            <p className="rounded-[1rem] bg-[#f0fdfa] p-4 font-bold">安卓手机：用浏览器打开网站，点菜单，选择“添加到桌面”或“添加到主屏幕”。</p>
          </div>
        </section>

        <section className="safe-card rounded-[1.5rem] p-5">
          <h2 className="text-[1.5rem] font-black text-[#111827]">如何教爸妈记住“三不一多”</h2>
          <p className="mt-3 text-[1.05rem] text-[#374151]">不要一次讲太多规则。每天重复一句：凡是要钱、要码、要下载、要共享屏幕，都先给家里人打电话。</p>
        </section>

        <AntiFraudFormula />
      </div>
    </main>
  );
}
