import { BigButton } from "@/components/BigButton";

export function EmergencyPanel() {
  return (
    <section className="rounded-[1.5rem] border-4 border-[#b42318] bg-white p-5 shadow-lg">
      <p className="text-[0.9rem] font-bold text-[#b42318]">紧急求助</p>
      <h2 className="mt-2 text-[1.5rem] font-black leading-tight text-[#111827]">如果正在被骗，请马上停止转账</h2>
      <p className="mt-3 text-[1rem] text-[#374151]">不要继续操作手机银行，不要删除聊天记录。先打电话求助。</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <BigButton href="tel:110" variant="danger">
          拨打 110
        </BigButton>
        <BigButton href="tel:96110" variant="secondary">
          拨打 96110
        </BigButton>
      </div>
    </section>
  );
}
