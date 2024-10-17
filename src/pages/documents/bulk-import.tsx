import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/shared/button";
import {
  Plus,
  Undo2,
  File,
  Download,
  TriangleAlert,
  X,
  ArrowDownToLine,
  Pencil,
  Check,
} from "lucide-react";
import Upload from "@/assets/Upload.svg";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/shared/table/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CloudUpload } from "lucide-react";
import { useTheme } from "@/components/utilities/ThemeProvider";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "@/components/ui/use-toast";
import api from "@/components/utilities/api";

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}
export function UploadDialog({ required_fields }: any) {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<Record<string, string>[]>();
  const [edit, setEdit] = useState<any>();
  const [enableEdit, setEnableEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorRows, setErrorRows] = useState<Number[]>([]);
  const [fileName, setFileName] = useState("");
  const [next, setNext] = useState(true);
  const [selectRowId, setselectRowId] = useState<any>();
  const [csv, setCsv] = useState<any>();

  const [columns, setColumns] = useState<
    ColumnDef<Record<string, string>, unknown>[]
  >([]);

  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        // Handle the click-away action here
        setEdit(undefined);
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const { data: validation, isLoading } = useQuery(
  //   "get-validation",
  //   () => api.get(`users/bulk/validation`),
  //   {
  //     select: (response) => response.data.data,
  //   }
  // );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableEdit(false);
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile?.name);
      const reader = new FileReader();
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        const csvData = loadEvent.target?.result as string;
        if (csvData) {
          const dataArray = csvToArray(csvData);
          setTableData(dataArray);
          setColumns(generateColumns(dataArray));
        }
      };
      reader.readAsText(selectedFile); // Read file as text
    }
  };

  const validation = required_fields.map((item: any) => {
    return {
      key: "SSN",
      isRequired: true,
      pattern: item.regex, // Alphabetical characters only
      unique: true,
    };
  });
  const validationRules: ValidationRules = {
    SSN: (value: string) => {
      const field = validation.find((f: any) => f.key === "SSN");
      if (field?.isRequired && value?.length === 0) return false;
      if (field?.pattern && !new RegExp(field?.pattern).test(value))
        return false;
      return true;
    },
  };
  // Function to validate a single row based on validation rules
  const validateRow = (
    row: Record<string, string>
  ): { isValid: boolean; invalidFields: string[] } => {
    const invalidFields = Object.keys(validationRules).filter((key) => {
      return !validationRules[key](row[key]);
    });

    return {
      isValid: invalidFields.length === 0,
      invalidFields,
    };
  };

  // Function to parse CSV data and convert it to an array of objects
  const csvToArray = (csvData: string): Record<string, string>[] => {
    // Split CSV data into lines and filter out empty lines
    const lines = csvData.split("\n").filter((line) => line.trim() !== "");

    // Define allowed headers and check for required headers
    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().replace(/^"|"$/g, ""));

    // Add 'No.' header at the beginning of headers array
    headers.unshift("No.");

    // Initialize an incrementing counter for unique IDs
    let counter = 0;
    const errorRows: number[] = [];

    // Map remaining lines into objects based on filtered headers
    const result = lines.slice(1).map((line, index) => {
      const values = line
        .split(",")
        .map((value) => value.trim().replace(/^"|"$/g, ""));
      const obj: Record<string, string> = {};

      // Attach the row number as the first value
      obj["Row Number"] = (index + 1).toString();

      // Attach a unique ID to each object at the start
      obj.id = `row-${Date.now()}-${counter++}`;

      // Attach filtered headers and values to the object
      headers.slice(1).forEach((header, idx) => {
        obj[header] = values[idx] || ""; // Handle case where value might be undefined
      });

      // Validate the row
      const validationResult = validateRow(obj);
      if (!validationResult.isValid) {
        errorRows.push(index + 1); // Use 1-based indexing for error rows
      }

      return obj;
    });

    if (errorRows.length > 0) {
      setError(`Rows with invalid values: ${errorRows.join(", ")}`);
      setErrorRows(errorRows);
    }

    return result;
  };

  const handleMouseLeave = (target: any) => {
    const updatedRow = tableData?.find((item) => item.id === edit.row.id);
    if (updatedRow) {
      updatedRow[edit.header] = target.value;
      setTableData((prevData) =>
        prevData?.map((item) =>
          item.id === edit.row.id ? { ...item, ...updatedRow } : item
        )
      );
      setEdit(undefined);
    }
  };

  const arrayToCsv = (data: Record<string, string>[]): string => {
    if (data.length === 0) return "";

    // Filter out the 'id' key from the headers
    const headers = Object.keys(data[0]).filter((key) => key !== "id");

    // Map each row to a CSV string, omitting the 'id' key
    const csvRows = data.map((row) =>
      headers.map((header) => `"${row[header] || ""}"`).join(",")
    );

    // Join headers and rows into a CSV string
    return `${headers.join(",")}\n${csvRows.join("\n")}`;
  };

  const generateColumns = (
    data: Record<string, string>[]
  ): ColumnDef<Record<string, string>, unknown>[] => {
    if (data.length === 0) return [];

    const headers = Object.keys(data[0]);

    const dynamicColumns = headers.map((header, idx) => ({
      accessorKey: header,
      header: ({ column }: any) => (
        <div className={header === "id" ? "w-0 hidden" : ""}>
          <DataTableColumnHeader column={column} title={header} />
        </div>
      ),

      cell: ({ row }: any) => {
        const value = row.getValue(header);
        let isValid = true;
        // if (enableEdit) {
        isValid = validationRules[header]
          ? validationRules[header](value)
          : true;
        // }
        const cellClassName = isValid
          ? ""
          : "bg-[#DF5F5F] py-3 px-5 rounded-md text-white	";

        return (
          <div
            className={
              header === "id"
                ? "w-0 hidden"
                : "h-11 w-full flex items-center pl-3 mr-1 "
            }
            id={row.original["Row Number"] <= 6 ? "" : row.original.id}
          >
            {!(edit?.header === header && edit.row.id == row.original.id) ? (
              <div
                className={`cell ${cellClassName} flex gap-3 ${
                  header === "SSN" ? "w-[200px]" : "w-auto"
                }`}
                onClick={() => {
                  enableEdit && setEdit({ header: header, row: row.original });
                  enableEdit && setselectRowId(row.original.id);
                }}
              >
                {value || "-"}
                {!isValid && <span className="text-white"> ({"Invalid"})</span>}
              </div>
            ) : (
              <input
                type="text"
                defaultValue={value}
                onMouseLeave={(e) => handleMouseLeave(e.target)}
                className="border-2 border-gre p-2 rounded-md	 outline-none"
              />
            )}
          </div>
        );
      },
    }));

    // Return selection column as the first column, followed by dynamic columns
    return dynamicColumns;
  };
  useEffect(() => {
    tableData && setColumns(generateColumns(tableData));
  }, [edit, enableEdit]);
  useEffect(() => {
    if (edit?.row?.id) {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(edit?.row?.id);
        if (element) {
          element.scrollIntoView({ block: "start" });
        }
      }, 100); // 1000ms = 1 second

      // Clean up the timeout if the effect is re-run or unmounted
      return () => clearTimeout(timeoutId);
    }
  }, [edit?.row?.id, enableEdit, tableData, selectRowId]);

  // Function to validate the entire dataset
  // Function to validate the entire dataset
  const validateData = (data: Record<string, string>[]) => {
    const errorRows: number[] = [];
    const seenValues: Set<string> = new Set();

    data.forEach((row, index) => {
      const validationResult = validateRow(row);

      // Convert the row's values to a unique string to check for duplicates
      const rowValuesString = row["SSN"]; // You can customize this separator if needed

      if (!validationResult.isValid || seenValues.has(rowValuesString)) {
        errorRows.push(index);
      } else {
        seenValues.add(rowValuesString);
      }
    });

    return errorRows;
  };
  useEffect(() => {
    tableData && setErrorRows(validateData(tableData));
  }, [tableData]);

  const csvToBlob = (csvContent: string): Blob => {
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  };

  const downloadCsvFile = (csvContent: string, filename: string) => {
    const blob = csvToBlob(csvContent);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function RenderTable() {
    return (
      <div className="border rounded-md p-4">
        {errorRows.length > 0 && (
          <div className="flex justify-start w-full">
            <div className="flex justify-between  w-full">
              <div className="w-[400px] mr-4">
                <p className="font-24 font-bold w-full text-start">
                  Check Column Values
                </p>
                <p className="font-14 w-full text-start mt-2">
                  Enter the correct values for the highlighted column
                </p>
              </div>

              <Card className="rounded-md bg-[#DF5F5F] flex  mt-4 justify-between px-6 py-3 w-fit">
                <div className="flex">
                  <TriangleAlert color="white" className="h-5 w-5 mr-4" />
                  <p className="font-1 text-white">
                    {" "}
                    {errorRows.map((item) => +item + Number(1)).join(", ")}{" "}
                    row(s) contain(s) invalid or duplicate enteries
                  </p>
                </div>

                {/* <X color="white" className="h-5 w-5 " /> */}
              </Card>
            </div>
          </div>
        )}
        <div className="flex max-md:gap-4 max-md:flex-col justify-between items-center mt-5">
          <p className=" font-22 font-bold">Preview</p>
          <p className="text-muted-foreground font-bold ml-12 flex">
            <File className="mr-2 relative -top-[2px]" /> {fileName}
          </p>

          <div className="flex gap-3">
            <Button
              type="submit"
              className=""
              variant={enableEdit ? "outline" : "default"}
              onClick={() => setEnableEdit(!enableEdit)}
            >
              {enableEdit ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Pencil className="mr-2 h-4 w-4" />
              )}
              {enableEdit ? "Save" : "Edit"}
            </Button>
            <Button
              type="submit"
              className=""
              onClick={() => document.getElementById("fileUpload")?.click()}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Upload Again
            </Button>
          </div>
        </div>
        <div
          className="grid overflow-auto  relative *: h-[500px] "
          ref={divRef}
        >
          {tableData && (
            <DataTable
              data={tableData}
              columns={columns}
              filtersDetail={[]}
              filteringEnabledCol={[]}
              isPagSticky
              errorRows={enableEdit ? errorRows || [] : []}
              rowsPerPage={150}
              hidePage
            />
          )}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (tableData) {
      const csvContent = arrayToCsv(tableData);
      // const blob = csvToBlob(csvContent);
      setCsv(csvContent);
      // downloadCsvFile(csvContent, "tableData.csv"); // Trigger download test
    }
  }, [tableData]);

  function downloadFile(url: string) {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sample Dependent Verification File.csv"); // Set the desired file name
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const { mutate: downloadTemplate } = useMutation(
    () =>
      api.get(`/document-presigned-url`, {
        params: {
          s3_uri:
            "s3://verifies-reconciliation-docs-dev/sample-files/verifies/Sample Dependent Verification File.csv",
        }, // Pass as query param
      }),
    {
      onSuccess: (data: any) => {
        downloadFile(data.data.presigned_url);
        toast({
          title: "Document downloaded successfully.",
          duration: 2000,
          variant: "success",
        });
      },
    }
  );

  function csvToFormData(csvData: string): FormData {
    // Create a Blob from the CSV string
    const blob = new Blob([csvData], { type: "text/csv" });

    // Initialize FormData
    const formData = new FormData();

    // Append the Blob as a file to the FormData object
    formData.append("file", blob, "data.csv");

    return formData;
  }

  const { mutate: bulkUpload } = useMutation(
    ["bulk-upload"],
    () => api.get(`/reconcile-data`, csvToFormData(csv)),
    {
      onSuccess: (res: any) => {
        if (res.data) {
          toast({
            title: res.data,
            duration: 2000,
            variant: "success",
          });
          setOpen(!open);
          queryClient.invalidateQueries("get-docs");
        } else {
          toast({
            title: res.data || "Upload failded.",
            duration: 2000,
            variant: "destructive",
          });
        }
      },
    }
  );

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        open && setTableData(undefined);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full" variant={"outline"}>
          <Download className="mr-2 h-4 w-4 rotate-180" /> Reconcile Data
        </Button>
      </DialogTrigger>
      <DialogContent
        className={
          tableData
            ? "md:max-w-[1440px]   w-11/12  "
            : " md:max-w-[550px] w-11/12  "
        }
      >
        <div className="overflow-auto">
          {!tableData ? (
            <>
              <DialogHeader
                className="mx-auto"
                onClick={() => setTableData(undefined)}
              >
                <DialogTitle className="my-4 font-22 font-bold w-full text-center">
                  Upload
                </DialogTitle>
              </DialogHeader>
              <div
                className="flex flex-col justify-center items-center  h-[325px] md:h-[425px]   w-full mb-2 border border-dashed border-[#94A3B8] mx-auto rounded-sm layout-bg cursor-pointer"
                onClick={() => document.getElementById("fileUpload")?.click()}
              >
                {theme === "light" ? (
                  <img src={Upload} alt="" className="h-12 w-12" />
                ) : (
                  <CloudUpload className="h-12 w-12" />
                )}

                <p className="text-[16px] font-bold text-center text-[#94A3B8] ">
                  Drag & drop files or <br />{" "}
                  <span className="text-center text-foreground underline underline-offset-2">
                    Browse
                  </span>
                </p>
                <p className="font-14 text-muted-foreground mt-4">
                  Supported formates: CSV
                </p>
              </div>
            </>
          ) : (
            <div className="mt-6">
              <RenderTable />
            </div>
          )}
          <DialogFooter>
            {!tableData ? (
              <div className="w-full flex flex-col gap-4 mt-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    downloadTemplate();
                  }}
                >
                  <ArrowDownToLine className="h-4 w-4 mr-2" /> Download Sample
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => document.getElementById("fileUpload")?.click()}
                >
                  Upload File
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={
                  enableEdit || errorRows.length > 0 || tableData.length === 0
                }
                onClick={() => bulkUpload()}
              >
                Submit
              </Button>
            )}

            <input
              type="file"
              id="fileUpload"
              onChange={handleChange}
              accept=".csv"
              style={{ display: "none" }} // Hide the input
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
