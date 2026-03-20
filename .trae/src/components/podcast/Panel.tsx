import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col rounded-xl border border-slate-700/60 bg-[#0F111A] shadow-xl backdrop-blur-sm", className)}>
      <div className="flex shrink-0 items-center justify-between border-b border-slate-700/50 bg-[#161925]/80 px-4 py-2.5 rounded-t-xl">
        <div className="flex flex-col">
          <h2 className="text-[12px] font-extrabold tracking-widest text-slate-300 uppercase">{title}</h2>
          {subtitle && <p className="text-[10px] font-medium tracking-wide text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3">{children}</div>
    </div>
  );
}
