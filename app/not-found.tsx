import { BigButton } from "@/components/BigButton";

export default function NotFound() {
  return (
    <main className="safe-container grid min-h-[70vh] place-items-center py-12">
      <section className="safe-card rounded-[1.5rem] p-6 text-center">
        <h1 className="text-[2rem] font-black text-[#111827]">页面没有找到</h1>
        <p className="mt-3 text-[1.05rem] text-[#4b5563]">可能链接写错了。可以先回到首页继续查看防骗提醒。</p>
        <div className="mt-5">
          <BigButton href="/" variant="secondary">
            回到首页
          </BigButton>
        </div>
      </section>
    </main>
  );
}
