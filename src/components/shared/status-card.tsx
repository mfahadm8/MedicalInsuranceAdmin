import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "green" | "yellow" | "orange" | "red";
}

export const ColorArr: { [key: string]: string } = {
  green: "#55D497",
  yellow: "rgba(222, 171, 18, 0.80)",
  orange: "#FF9603",
  red: "#FF3B30",
};

const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  ({ status, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "flex items-center justify-between p-4 rounded-lg shadow-md relative",
          className
        )}
        style={{
          borderLeftWidth: "6px",
          borderColor: ColorArr[status],
        }}
        {...props}
      >
        {props.children}
      </Card>
    );
  }
);
StatusCard.displayName = "StatusCard";

export { StatusCard };
