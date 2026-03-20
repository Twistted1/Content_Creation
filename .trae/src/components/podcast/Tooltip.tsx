import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export function Tooltip({ content, children, position = "top", className }: TooltipProps) {
  const positions = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-[100] w-max rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-100 shadow-xl opacity-0 transition-all duration-200 group-hover:opacity-100",
          positions[position]
        )}
      >
        {content}
      </span>
    </span>
  );
}
