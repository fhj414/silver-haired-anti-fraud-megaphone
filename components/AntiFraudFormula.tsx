const lines = ["未知链接不点击", "陌生来电不轻信", "个人信息不透露", "转账汇款多核实"];

export function AntiFraudFormula() {
  return (
    <section className="rounded-[1.5rem] bg-[#0f766e] p-5 text-white shadow-lg">
      <p className="text-[0.95rem] font-bold text-[#ccfbf1]">防骗口诀</p>
      <h2 className="mt-1 text-[1.55rem] font-black">三不一多，天天记牢</h2>
      <div className="mt-4 grid gap-3">
        {lines.map((line) => (
          <div className="rounded-[1rem] bg-white/15 px-4 py-3 text-[1.15rem] font-bold" key={line}>
            {line}
          </div>
        ))}
      </div>
    </section>
  );
}
