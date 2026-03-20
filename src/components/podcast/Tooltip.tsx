import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const positions = {
    top: "-top-8 left-1/2 -translate-x-1/2",
    bottom: "-bottom-8 left-1/2 -translate-x-1/2",
    left: "top-1/2 -left-2 -translate-x-full -translate-y-1/2",
    right: "top-1/2 -right-2 translate-x-full -translate-y-1/2",
  };

  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <AnimatePresence>
        <div
          className={`absolute ${positions[position]} z-50 hidden whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg group-hover:block`}
        >
          {content}
        </div>
      </AnimatePresence>
    </div>
  );
}
