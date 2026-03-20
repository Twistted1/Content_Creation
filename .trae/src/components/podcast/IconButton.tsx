import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Tooltip } from "./Tooltip";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  tooltipPos?: "top" | "bottom" | "left" | "right";
  active?: boolean;
};

export function IconButton({ label, children, className, tooltipPos = "top", active, ...props }: IconButtonProps) {
  return (
    <Tooltip content={label} position={tooltipPos}>
      <button
        type="button"
        aria-label={label}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md border text-slate-300 transition-colors",
          active
            ? "border-emerald-500/70 bg-emerald-500/20 text-emerald-100"
            : "border-slate-700/80 bg-[#161925] hover:border-violet-500 hover:bg-[#1a1e2d] hover:text-white",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </Tooltip>
  );
}
