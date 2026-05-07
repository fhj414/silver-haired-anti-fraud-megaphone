import { BigButton } from "@/components/BigButton";
import { PageHeader } from "@/components/PageHeader";

const steps = ["马上停止转账和输入密码", "保存聊天记录、电话、短信、转账截图", "联系银行尝试止付", "联系子女或可信任的亲友", "不要删除任何证据"];

export default function HelpPage() {
  return (
    <main className="pb-12">
      <PageHeader title="紧急求助" subtitle="如果正在被骗，请马上停止转账。先求助，钱才更有机会追回。" />
      <div className="safe-container grid gap-6">
        <section className="rounded-[1.5rem] border-4 border-[#b42318] bg-white p-5 shadow-lg">
          <h2 className="text-[1.7rem] font-black text-[#b42318]">马上打电话求助</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <BigButton href="tel:110" variant="danger">
              拨打 110
            </BigButton>
            <BigButton href="tel:96110" variant="secondary">
              拨打 96110
            </BigButton>
          </div>
        </section>

        <section className="safe-card rounded-[1.5rem] p-5">
          <h2 className="text-[1.5rem] font-black text-[#111827]">现在立刻做这些</h2>
          <ol className="mt-4 grid gap-3">
            {steps.map((step, index) => (
              <li className="flex gap-3 rounded-[1rem] bg-[#fff7ed] p-4 text-[1.08rem] font-bold" key={step}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b42318] text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <BigButton href="/" variant="secondary">
          回到首页
        </BigButton>
      </div>
    </main>
  );
}
