import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
interface Filters {
  title: string;
  accessorKey: string;
  labels: {
    value: string;
    label: string;
  }[];
  hide: boolean;
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filtersDetail: Filters[];
  filteringEnabledCol: string[];
  setRows?: (data: any) => void;
  setResetRowSelectionFn?: (data: any) => void;
  isLoading?: boolean;
  rowsPerPage?: number;
  isPagSticky?: boolean;
  isDataEmpty?: () => JSX.Element;
  errorRows?: Number[];
  quotaLeftFilter?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filtersDetail,
  filteringEnabledCol,
  setRows,
  setResetRowSelectionFn,
  isLoading,
  rowsPerPage,
  isPagSticky,
  errorRows,
  quotaLeftFilter,
  isDataEmpty,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    setRows &&
      setRows(table.getSelectedRowModel().rows.map((row) => row.original));
  }, [rowSelection]);
  const resetRowSelection = () => {
    table.resetRowSelection();
  };
  // UseEffect to store the resetRowSelection function in the parent
  React.useEffect(() => {
    setResetRowSelectionFn && setResetRowSelectionFn(() => resetRowSelection);
  }, [rowSelection]);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-end pb-2">
        <DataTableToolbar
          table={table}
          filters={filtersDetail}
          filteringEnabledCol={filteringEnabledCol}
          quotaLeftFilter={quotaLeftFilter}
        />
      </div>

      <div className="rounded-md border relative">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="py-2 px-5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${idx % 2 === 0 ? "layout-bg" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        errorRows &&
                          errorRows?.length > 0 &&
                          errorRows?.includes(Number(row.id))
                          ? " bg-[#FFEFEF]"
                          : "",
                        !errorRows && "p-5"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? (
                    <IconLoader2 className="m-auto my-20 h-14 w-14 animate-spin" />
                  ) : isDataEmpty ? (
                    isDataEmpty()
                  ) : (
                    "No results."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div
          className={
            isPagSticky
              ? "border-t py-8 px-3  table-pagination-sticky"
              : "border-t py-8 px-3"
          }
        >
          <DataTablePagination
            table={table}
            rowsPerPage={rowsPerPage}
            isPagSticky={isPagSticky}
          />
        </div>
      </div>
    </div>
  );
}
