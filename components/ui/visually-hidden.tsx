"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const VisuallyHidden = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        margin: "-1px",
      }}
      {...props}
    >
      {children}
    </span>
  );
};

VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden }; 