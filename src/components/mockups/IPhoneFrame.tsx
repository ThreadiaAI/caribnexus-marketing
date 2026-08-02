"use client";

export function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: "280px", height: "560px" }}>
      {/* Phone body */}
      <div className="absolute inset-0 bg-[#1C1C1C] rounded-[40px] shadow-2xl border border-[#333]">
        {/* Dynamic Island */}
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-10" />

        {/* Screen */}
        <div className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] rounded-[38px] overflow-hidden bg-white">
          {/* Status bar */}
          <div className="h-[48px] bg-[#075E54] flex items-end justify-between px-6 pb-1">
            <span className="text-[9px] text-white/80 font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-white/80" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v5H2zM6 12h2v10H6zM10 8h2v14h-2zM14 4h2v18h-2zM18 1h2v21h-2z"/></svg>
              <svg className="w-3 h-3 text-white/80" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
              <div className="w-[18px] h-[9px] border border-white/80 rounded-sm relative">
                <div className="absolute inset-[1px] right-[2px] bg-white/80 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="h-[calc(100%-48px)] overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Side button */}
      <div className="absolute right-[-2px] top-[120px] w-[3px] h-[60px] bg-[#333] rounded-r" />
      <div className="absolute left-[-2px] top-[100px] w-[3px] h-[30px] bg-[#333] rounded-l" />
      <div className="absolute left-[-2px] top-[140px] w-[3px] h-[50px] bg-[#333] rounded-l" />
      <div className="absolute left-[-2px] top-[200px] w-[3px] h-[50px] bg-[#333] rounded-l" />
    </div>
  );
}
