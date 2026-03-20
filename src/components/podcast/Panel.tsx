import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

type PanelProps = {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

export function Panel({ title, children, className, actions }: PanelProps) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0F111A]", className)}>
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800/60 bg-[#161925] px-3 py-2">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{title}</h3>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div className="flex-1 overflow-hidden p-2">{children}</div>
    </div>
  );
}
