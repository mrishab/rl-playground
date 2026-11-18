import * as React from "react";
import { cn } from "@/lib/utils";

const INPUT_BASE = cn(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1",
  "text-base md:text-sm shadow-sm placeholder:text-muted-foreground",
  "transition-[border-color,box-shadow,background-color] duration-150 ease-out",
  "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(INPUT_BASE, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
