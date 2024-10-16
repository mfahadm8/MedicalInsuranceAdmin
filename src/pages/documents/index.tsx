import React, { useEffect } from "react";
import { Layout } from "@/components/shared/layout";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/ui/card";
import SearchField from "@/components/shared/search";
import ThemeSwitch from "@/components/shared/theme-switch";
import { UserNav } from "@/components/shared/user-nav";
import DataTable from "./components/table";
import {
  ClipboardList,
  Clipboard,
  ChevronDown,
  ChevronUp,
  ClipboardX,
  RefreshCw,
  X,
  Check,
  ClipboardCheck,
  SquareArrowOutUpRight,
  Link,
} from "lucide-react";
import { Share } from "lucide-react";
import { Plus } from "lucide-react";
import { Download, Boxes } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "@/components/utilities/api";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import Actions from "@/assets/Actions.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2 } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CSVLink } from "react-csv";
import { StatusCard, ColorArr } from "@/components/shared/status-card";
import { PriorityBadge } from "@/components/shared/priority-badge";
// import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyWrapper from "@/components/shared/empty-wrapper";
import { useUniqueOptions } from "@/components/shared/table/filters-labels-generator";
import { Document, CardType } from "./type";
import { formatDate } from "@/components/utilities/date-formatter";
import { useAuth } from "@/components/utilities/AuthProvider";
import Logo from "@/assets/NavLogo.svg";
import { DocumentModal } from "./modal";
import { UploadDialog } from "./bulk-import";

import { StatusBadge } from "./status-badge";
const headers = [
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Relationship", key: "relationship" },
  { label: "SSN", key: "ssn" },
  { label: "Employee SSN", key: "employee_ssn" },
  { label: "Phone Number", key: "phone_number" },
  { label: "Benefit", key: "benefit" },
  { label: "Serial", key: "serial" },
  { label: "Dependent Type", key: "dependent_type" },
  { label: "Reconciliation ID", key: "reconciliation_id" },
  { label: "Coverage Level", key: "coverage_level" },
  { label: "Start Date", key: "start_date" },
  { label: "Date of Birth", key: "dob" },

  { label: "Date of Creation", key: "date_of_creation" },
];

function downloadFile(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  // "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/TEIDE.JPG/440px-TEIDE.JPG";
  link.setAttribute("download", fileName); // Set the desired file name
  link.setAttribute("target", "_blank");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { auth } = useAuth();
  // const [tab, setTab] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [hide, setHide] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState<Document[]>([]);
  const [filterTab, setFilterTab] = React.useState("all");
  const [rowData, setRowData] = React.useState<any>();
  const [rows, setRows] = React.useState<Document[]>();
  const [open, setOpen] = React.useState(true);

  const [resetRowSelectionFn, setResetRowSelectionFn] = React.useState<
    () => void
  >(() => {});
  const resetRowSelection = () => {
    resetRowSelectionFn();
  };

  const onTabChange = (value: string) => {
    setFilterTab(value);
    if (value === "all") {
      setFilteredData(documents);
    } else if (value === "awaiting") {
      setFilteredData(
        documents.filter(
          (item: any) => item.aggregated_doc_status === "No Documents"
        )
      );
    } else if (value === "incomplete") {
      setFilteredData(
        documents.filter(
          (item: any) =>
            item.aggregated_doc_status === "Partially Complete" ||
            item.aggregated_doc_status === "Incomplete"
        )
      );
    } else if (value === "completed") {
      setFilteredData(
        documents.filter(
          (item: any) => item.aggregated_doc_status === "Complete"
        )
      );
    }
  };

  // /documents/summary
  const { data: documents } = useQuery(
    "get-docs",
    () => api.get("/all-dependents-info"),
    {
      refetchOnMount: true, // Prevent refetching when remounting
      // staleTime: 600000, // 10 minutes in milliseconds
      // cacheTime: 600000, // 10 minutes in milliseconds
      enabled: true,
      select: (response) => response.data.data,
      onSuccess: (data) => {
        setFilteredData(data);
      },
    }
  );

  const { data: documentsSummary, isFetching: isLoading } = useQuery(
    "get-summary",
    () => api.get("/summary"),
    {
      refetchOnMount: true, // Prevent refetching when remounting
      enabled: true,
      select: (response) => response.data,
    }
  );
  const { data: validationsData } = useQuery(
    "get-validations",
    () => api.get("/required-fields"),
    {
      refetchOnMount: true, // Prevent refetching when remounting
      enabled: true,
      select: (response) => response.data,
    }
  );
  console.log(validationsData);

  useEffect(() => {
    if (documents) {
      setFilteredData(documents);
    }
  }, []);
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    setFilterValue(event.target.value);
    const newFilteredData = documents.filter(
      (doc: Document) =>
        doc?.first_name?.toLowerCase()?.includes(value) ||
        doc?.relationship?.toLowerCase()?.includes(value) ||
        doc?.ssn?.toString()?.includes(value)
    );

    setFilteredData(newFilteredData);
  };
  const { mutate: downloadDoc } = useMutation(
    (url: string) =>
      api.get(`/document-presigned-url`, {
        params: { s3_uri: url }, // Pass as query param
      }),
    {
      onSuccess: (data: any) => {
        downloadFile(data.data.presigned_url, data.data.file_name);
        toast({
          title: "Document downloaded successfully.",
          duration: 2000,
          variant: "success",
        });
      },
    }
  );

  const toTitleCase = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  const columns: ColumnDef<Document, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "first_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("first_name")}</div>,
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
    },
    {
      accessorKey: "relationship",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Relationship" />
      ),
      cell: ({ row }) => <div>{row.getValue("relationship")}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "phone_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone Number" />
      ),
      cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
    },
    {
      accessorKey: "ssn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SSN" />
      ),
      cell: ({ row }) => <div>{row.getValue("ssn")}</div>,
    },
    {
      accessorKey: "date_of_creation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date of Creation" />
      ),
      cell: ({ row }) => (
        <div>
          {row.getValue("date_of_creation")
            ? formatDate(row.getValue("date_of_creation"))
            : "-"}
        </div>
      ),
    },

    {
      accessorKey: "aggregated_doc_status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title=" Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("aggregated_doc_status") as string;
        // const status = "Partially Complete";
        return (
          <span className="00">
            <PriorityBadge
              className="whitespace-nowrap"
              variant={
                status == "Invalid"
                  ? "high"
                  : status == "Complete"
                  ? "low"
                  : status == "Partially Complete"
                  ? "medium"
                  : status == "Incomplete"
                  ? "high"
                  : "secondary"
              }
            >
              {status}
            </PriorityBadge>
          </span>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "documents",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Documents" />
      ),
      cell: ({ row }) => {
        const documents = row.original?.documents || {};
        return (
          <div className="flex flex-wrap gap-2">
            {Object.entries(documents).map(([docType, docList]) =>
              docList.map((doc: any) => (
                <StatusBadge
                  key={doc.document_name}
                  // className="px-2 py-1 bg-gray-200 rounded-full cursor-pointer whitespace-nowrap"
                  // onClick={() => window.open(doc.document_url, "_blank")}
                  variant={
                    doc.status == "Invalid"
                      ? "high"
                      : doc.status == "Complete"
                      ? "low"
                      : doc.status == "Partially Complete"
                      ? "medium"
                      : doc.status == "Incomplete"
                      ? "medium"
                      : "secondary"
                  }
                >
                  <div className="flex justify-between items-center cursor-pointer">
                    <p>{toTitleCase(docType)}</p>
                    <SquareArrowOutUpRight
                      className="w-4 h-4 ml-4"
                      onClick={() => downloadDoc(doc.document_url)}
                    />
                  </div>
                </StatusBadge>
              ))
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => (
        <div className="flex gap-6 cursor-pointer justify-center">
          <img
            src={Actions}
            alt=""
            width={32}
            height={32}
            onClick={() => {
              setRowData(row.original);
              setOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const cards: CardType[] = [
    {
      title: "Fully Documented Dependents",
      value: documentsSummary?.complete_documents,
      icon: <ClipboardCheck size={36} />,
      status: "green",
      desc: "Dependents with all required documents verified.",
    },

    {
      title: "Incomplete Documentation",
      value: documentsSummary?.pending_dependents,
      icon: <ClipboardList size={36} />,
      status: "orange",
      desc: "Dependents with incomplete or incorrect documents.",
    },

    {
      title: "Awaiting Submission",
      value: documentsSummary?.pending_documents,
      icon: <ClipboardX size={36} />,
      status: "red",
      desc: "Dependents yet to start the documentation process.",
    },
  ];

  console.log(documentsSummary);

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <img src={Logo} alt="" width={240} className="mt-2" />
        <p className="font-semibold text-xl">
          {/* {userDetails?.org[0].name || ""} */}
        </p>
        <div className="ml-auto flex items-center space-x-4 relative">
          {/* <ThemeSwitch /> */}
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body className="layout-bg dashboard">
        <div>
          {!hide && (
            <div className="grid gap-4 max-lg:grid-cols-1 lg:grid-cols-3">
              {cards.map((item) => {
                return (
                  <StatusCard className="card-wrapper" status={item.status}>
                    <div className="icon-wrapper">{item.icon}</div>
                    <div className="w-full  pl-6 flex flex-col justify-between">
                      <div
                        className="font-30 font-bold"
                        style={{ color: ColorArr[item.status] }}
                      >
                        {item.value || 0}
                      </div>
                      <p className="font-18 font-semibold">{item.title}</p>
                      <p>{item.desc}</p>
                    </div>
                  </StatusCard>
                );
              })}
            </div>
          )}

          <div className=" flex items-center mt-6">
            <div className="w-full border-dashed border-2"></div>
            <Button
              variant="outline"
              className="mx-5"
              onClick={() => setHide(!hide)}
            >
              {!hide ? (
                <ChevronUp className="mr-2 h-5 w-5" />
              ) : (
                <ChevronDown className="mr-2 h-5 w-5" />
              )}{" "}
              {hide ? "Show Summary" : "Hide Summary"}
            </Button>
            <div className="w-full border-dashed border-2"></div>
          </div>

          <Card className="bg-card p-6  mt-6 rounded-xl">
            <div className="mb-2 gap-4 flex-wrap sm:flex items-start justify-between space-y-2  ">
              <div className="">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Reconciled Data{" "}
                </h1>
                {/* <p className="text-sm text-muted-foreground mt-1 whitespace-nowrap">
                  List of documents in this organisations
                </p> */}
              </div>
              <div className="max-md:block hidden w-full pt-4">
                <Popover>
                  <PopoverTrigger className="w-full">
                    <Button variant="outline" className="w-full">
                      {" "}
                      View more{" "}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex  max-md:flex-col max-md:justify-end items-center gap-4 max-md:pt-5  ">
                      {/* <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {}}
                      >
                        {" "}
                        <Download className="mr-2 h-4 w-4 rotate-90" />{" "}
                        Reconcile Data
                      </Button> */}
                      <UploadDialog />

                      <Button className="w-full" onClick={() => {}}>
                        {" "}
                        <Download className="mr-2 h-4 w-4" /> Export Complete
                        Data
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex max-md:flex-col   max-md:justify-end items-center gap-4 max-md:pt-5 max-md:hidden  ">
                <SearchField
                  placeholder="Search..."
                  value={filterValue}
                  onChange={(event) => handleFilterChange(event)}
                  className="h-10 w-[150px] lg:w-[250px]"
                />

                {validationsData && (
                  <UploadDialog
                    required_fields={validationsData?.required_fields}
                  />
                )}
                <CSVLink
                  data={rows || filteredData}
                  headers={headers}
                  filename={`dependent-info.csv`}
                >
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Exported successfully.",
                        duration: 2000,
                        variant: "success",
                      });
                    }}
                  >
                    {" "}
                    <Download className="mr-2 h-4 w-4" />
                    {rows && rows.length > 0
                      ? "Export Selected Rows"
                      : "Export Complete Data"}
                  </Button>
                </CSVLink>
              </div>
            </div>
            <div className="relative max-md:mt-4">
              <Tabs
                orientation="vertical"
                defaultValue="all"
                className="space-y-4 w-full mt-6 md:absoldute"
                value={filterTab}
                onValueChange={onTabChange}
              >
                <div className="">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>

                    <TabsTrigger value="incomplete" className="">
                      Incomplete Docs
                    </TabsTrigger>
                    <TabsTrigger value="awaiting" className="">
                      Awaiting Submission
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="">
                      Completed
                    </TabsTrigger>
                  </TabsList>

                  {/* <TabsList className="md:hidden mt-3">
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                  </TabsList> */}
                </div>
              </Tabs>

              <div className="grid  mt-5">
                {filteredData?.length > 0 || documents ? (
                  <DataTable
                    filteredData={filteredData}
                    columns={columns}
                    setRows={setRows}
                    setResetRowSelectionFn={setResetRowSelectionFn}
                    isLoading={isLoading}
                  />
                ) : (
                  <EmptyWrapper
                    desc="Your document list is empty, create by adding new."
                    className="mt-10"
                    onClick={() => {}}
                  />
                )}
              </div>
            </div>
          </Card>
          {rowData && open && (
            <DocumentModal
              setRowData={() => setRowData(undefined)}
              rowData={rowData}
              open={open}
              setOpen={setOpen}
            />
          )}
        </div>
      </Layout.Body>
    </Layout>
  );
}
