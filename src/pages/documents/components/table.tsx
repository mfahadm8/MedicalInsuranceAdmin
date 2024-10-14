import React from "react";
import { DataTable } from "@/components/shared/table/data-table";
import { useUniqueOptions } from "@/components/shared/table/filters-labels-generator";
import { ColumnDef } from "@tanstack/react-table";
import { Document } from "../type";
import api from "@/components/utilities/api";
import { useQuery } from "react-query";

interface Label {
  title: string;
  accessorKey: string;
  labels: { label: string; value: string }[];
}
export default function Tasks({
  filteredData,
  columns,
  setRows,
  setResetRowSelectionFn,
  isLoading,
}: {
  filteredData: Document[];
  columns: ColumnDef<Document, unknown>[];
  setRows: (data: any) => void;
  setResetRowSelectionFn: (data: any) => void;
  isLoading: boolean;
}) {
  const documentStatuses = [
    { label: "No Documents", value: "No Documents" },
    { label: "Invalid", value: "Invalid" },
    { label: "Incomplete", value: "Incomplete" },
    { label: "Complete", value: "Complete" },
    { label: "Partially Complete", value: "Partially Complete" },
  ];

  const [filtersDetail, setFiltersDetail] = React.useState<Label[]>([
    {
      title: "Document Status",
      accessorKey: "aggregated_doc_status",
      labels: documentStatuses,
    },
    {
      title: "Relationship",
      accessorKey: "relationship",
      labels: useUniqueOptions(filteredData, "relationship"),
    },
  ]);

  const filteringEnabledCol: [] = [];
  console.log(filtersDetail);
  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        data={filteredData}
        columns={columns}
        filtersDetail={filtersDetail}
        filteringEnabledCol={filteringEnabledCol}
        setRows={setRows}
        setResetRowSelectionFn={setResetRowSelectionFn}
        isLoading={isLoading}
      />
    </div>
  );
}
