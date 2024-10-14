import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
      >
        <span className="text-sm">{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon
            className="ml-2 h-4 w-4"
            onClick={() => column.toggleSorting(false)}
          />
        ) : (
          <ArrowUpIcon
            className="ml-2 h-4 w-4"
            onClick={() => column.toggleSorting(true)}
          />
        )}
      </Button>
    </div>
  );
}
