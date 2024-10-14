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
        high: "border-transparent text-[#DF5F5F] bg-[#FFEFEF]", // Lighter Red for High priority with darker text
        medium: "border-transparent bg-[#FFD39B] text-[#A65B00]", // Lighter Orange for Medium priority with darker text
        low: "border-transparent text-[#027A48] bg-[#ECFDF3]", // Lighter Green for Low priority with darker text
        outstanding: "border-transparent bg-[#FFEDED] text-[#A60000]", // Lighter Red for Outstanding status with darker text
        inProgress: "border-transparent bg-[#FFE7D9] text-[#A8571D]", // Lighter Orange for In-progress status with darker text
        completed: "border-transparent bg-[#E6FAE8] text-[#318B57]", // Lighter Green for Completed status with darker text
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
