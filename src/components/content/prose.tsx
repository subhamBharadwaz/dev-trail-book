import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm leading-[1.95] text-muted-ink min-[701px]:text-[15px] [&_h2]:mb-[13px] [&_h2]:mt-[34px] [&_h2]:scroll-mt-[30px] [&_h2]:text-xl [&_h2]:font-medium [&_h2]:leading-[1.4] [&_h2]:tracking-[-.55px] [&_h2]:text-ink [&_h2:first-child]:mt-0 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:font-medium [&_h3]:text-ink [&_p]:my-3 [&_a]:text-green [&_a]:underline [&_a]:underline-offset-[3px] [&_strong]:font-medium [&_strong]:text-ink [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-surface-hover [&_:not(pre)>code]:px-[5px] [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[11px] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_th]:border [&_th]:border-line [&_th]:p-3 [&_td]:border [&_td]:border-line [&_td]:p-3">
      {children}
    </div>
  );
}
