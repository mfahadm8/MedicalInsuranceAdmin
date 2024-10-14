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
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Rejected", value: "Rejected" },
    { label: "Expired", value: "Expired" },
    { label: "Archived", value: "Archived" },
  ];

  const { data: docTypes } = useQuery(
    "get-docTypes",
    () => api.get(`/documents/document-types`),
    {
      refetchOnMount: false, // Prevent refetching when remounting
      staleTime: 600000, // 10 minutes in milliseconds
      cacheTime: 600000, // 10 minutes in milliseconds

      select: (response) => response.data.data,
      onSuccess: (data) => {},
    }
  );

  const [filtersDetail, setFiltersDetail] = React.useState<Label[]>([
    {
      title: "Document Type",
      accessorKey: "documentType",
      labels: docTypes
        ? docTypes.map((item: any) => {
            return { label: item?.name, value: item?.name };
          })
        : [],
    },
    {
      title: "Status",
      accessorKey: "status",
      labels: statusOptions,
    },
  ]);
  React.useEffect(() => {
    setFiltersDetail([
      {
        title: "Document Type",
        accessorKey: "documentType",
        labels: docTypes
          ? docTypes.map((item: any) => {
              return { label: item?.name, value: item?.name };
            })
          : [],
      },
      {
        title: "Status",
        accessorKey: "status",
        labels: statusOptions,
      },
    ]);
  }, [docTypes]);
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
