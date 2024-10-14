import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DialogClose } from "@radix-ui/react-dialog";

// const camelCaseToNormal = (str: string) => {
//   return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
// };

function camelCaseToNormal(text: any) {
  return text
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters (if camelCase)
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

export const DocumentModal = ({ rowData, setOpen, open, setRowData }: any) => {
  //   const [open, setOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const renderFieldsData = (fieldsData: any) => {
    if (typeof fieldsData === "string") {
      return <p className="pt-2 pb-2  ">{fieldsData}</p>;
    }

    if (Array.isArray(fieldsData)) {
      return (
        <ul className="list-disc my-3 ">
          {fieldsData.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    return (
      <div>
        {Object.entries(fieldsData).map(([key, value]) => (
          <div key={key} className="pb-2">
            <div className="grid grid-cols-3 gap-4">
              <span className="font-bold whitespace-nowrap text-muted-foreground">
                {camelCaseToNormal(key)}
              </span>
            </div>
            {typeof value === "object" && !Array.isArray(value) ? (
              <div className="ml-6">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="grid grid-cols-3 gap-4 my-4">
                    <span className="font-bold whitespace-nowrap text-muted-foreground">
                      {camelCaseToNormal(subKey)}
                    </span>
                    <span className="col-span-2">{subValue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ml-6">{renderFieldsData(value)}</div>
            )}
            <hr />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* <Button onClick={() => setOpen(true)}>View Details</Button> */}

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setRowData();
        }}
      >
        <DialogContent className=" bg-white rounded-lg shadow-lg p-10 max-w-[900px] w-full">
          <DialogHeader className="sticky top-0 bg-white z-10 max-w-[50vw] w-full">
            <DialogTitle className="text-2xl    font-semibold mb-5 sticky top-3">
              Dependent Details
            </DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] overflow-scroll max-w-[900px] w-full ">
            <ScrollArea className="relative bg-white max-w-[900px] w-full">
              {/* Row fields */}
              <div className="grid grid-cols-3 gap-4 pb-2 pt-2">
                <span className="font-bold whitespace-nowrap text-muted-foreground">
                  First Name
                </span>
                <span className="col-span-2 rounded-full pt-2">
                  {rowData.first_name}
                </span>
              </div>
              <hr className="border-gray-300 my-4" />

              <div className="grid grid-cols-3 gap-4 pb-2 pt-2">
                <span className="font-bold whitespace-nowrap text-muted-foreground">
                  Last Name
                </span>
                <span className="col-span-2 rounded-full pt-2">
                  {rowData.last_name}
                </span>
              </div>
              <hr className="border-gray-300 my-2" />

              <div className="grid grid-cols-3 gap-4 pb-2 pt-2">
                <span className="font-bold whitespace-nowrap text-muted-foreground">
                  Phone Number
                </span>
                <span className="col-span-2 rounded-full pt-2 ">
                  {rowData.phone_number}
                </span>
              </div>
              <hr className="border-gray-300 my-4" />

              <div className="grid grid-cols-3 gap-4 pb-2 pt-2">
                <span className="font-bold whitespace-nowrap text-muted-foreground">
                  SSN
                </span>
                <span className="col-span-2 rounded-full pt-2">
                  {rowData.ssn}
                </span>
              </div>
              <hr className="border-gray-300 my-4" />

              <div className="grid grid-cols-3 gap-4 pb-2 pt-2">
                <span className="font-bold whitespace-nowrap text-muted-foreground">
                  Date of Creation
                </span>
                <span className="col-span-2 rounded-full pt-2">
                  {formatDate(rowData.date_of_creation)}
                </span>
              </div>

              <hr className="border-gray-300 my-4" />
              <div className="grid grid-cols-3 gap-4 pb-2 pt-2">
                <span className="font-bold whitespace-nowrap text-muted-foreground">
                  Relationship
                </span>
                <span className="col-span-2 rounded-full pt-2">
                  {rowData.relationship}
                </span>
              </div>
              <hr className="border-gray-300 my-4" />

              <DialogTitle className="text-xl font-semibold mb-5">
                {`Documents submitted for ${rowData.relationship}`}
              </DialogTitle>
              {/* Documents Section */}
              {Object.entries(rowData.documents)?.length > 0
                ? Object.entries(rowData.documents).map(
                    ([docType, docList]) => (
                      <div key={docType} className="p-4">
                        <div className="grid grid-cols-3 gap-4 pb-2">
                          <span className="font-bold text-lg whitespace-nowrap text-muted-foreground">
                            {camelCaseToNormal(docType)}
                          </span>
                          <span className="col-span-2">
                            {docList.map((doc: any) => (
                              <div key={doc.document_name} className="pb-2">
                                <p
                                  className="underline cursor-pointer text-blue-500 pb-5 hover:text-blue-700 mb-3"
                                  onClick={() =>
                                    window.open(doc.document_url, "_blank")
                                  }
                                >
                                  {doc.document_name}
                                </p>
                                {doc.fields_data &&
                                  renderFieldsData(doc.fields_data)}
                              </div>
                            ))}
                          </span>
                        </div>
                        <hr className="border-gray-300 my-2" />
                      </div>
                    )
                  )
                : "No documents submitted"}
            </ScrollArea>
          </div>

          <DialogClose className="text-end">
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};
