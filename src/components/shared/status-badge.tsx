import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3.5 py-1 font-15 font-normal whitespace-nowrap	 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        high: "border-transparent bg-[#FF3B30] text-white", // Red for High priority
        medium: "border-transparent bg-[#FF9603] text-white", // Orange for Medium priority
        low: "border-transparent bg-[#55D497] text-white", // Green for Low priority
        outstanding: "border-transparent bg-[#FFEDED] text-[#FF0000]", // Red for Outstanding status
        inProgress: "border-transparent bg-[#FFF4EC] text-[#ED7D31]", // Orange for In-progress status
        completed: "border-transparent bg-[#ECFFEE] text-[#55D497]", // Green for Completed status
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function StatusBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { StatusBadge, badgeVariants };
