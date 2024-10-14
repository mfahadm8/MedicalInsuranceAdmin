import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/shared/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableComparisonFilter } from "./data-table-comparison-filter";

interface Filters {
  title: string;
  accessorKey: string;
  labels: {
    value: string;
    label: string;
  }[];
  hide: boolean;
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: Filters[];
  filteringEnabledCol: string[];
  quotaLeftFilter?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  filteringEnabledCol,
  quotaLeftFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = event.target.value || undefined; // `undefined` removes the filter
    filteringEnabledCol?.forEach((columnId) => {
      table.getColumn(columnId)?.setFilterValue(filterValue);
    });
  };
  return (
    <div className="flex items-center justify-between max-md:w-full">
      <div className="flex flex-1    max-md:flex-col items-start  gap-y-5 md:gap-3 md:gap-y-2   sm:space-x-2">
        {filteringEnabledCol.length > 0 && (
          <Input
            placeholder="Filter tasks..."
            onChange={handleFilterChange}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filters?.map((item, i) => {
          return (
            <div className="flex gap-x-2 w-full" key={i}>
              {table.getColumn(item.accessorKey) && (
                <DataTableFacetedFilter
                  column={table.getColumn(item.accessorKey)}
                  title={item.title}
                  options={item.labels}
                  hidden={item.hide}
                />
              )}
            </div>
          );
        })}

        {quotaLeftFilter && table.getColumn("quotaLeft") && (
          <DataTableComparisonFilter
            table={table}
            column={table.getColumn("quotaLeft")}
            title={"Quota %"}
            options={[
              {
                value: "lessThan",
                label: "lessThan",
              },
              {
                value: "greaterThan",
                label: "greaterThan",
              },
              {
                value: "equals",
                label: "equals",
              },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-[36px] px-2 lg:px-3 border-[#DF5F5F] border text-[#DF5F5F] hover:text-[#DF5F5F] rounded-[32px] hover:bg-muted"
          >
            Reset All
            <Cross2Icon className="ml-2 h-4 w-4 text-[#DF5F5F]" />
          </Button>
        )}
      </div>
    </div>
  );
}
