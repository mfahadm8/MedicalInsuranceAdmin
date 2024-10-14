import React from "react";
import { Card } from "../ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "./button";
import { Plus } from "lucide-react";

interface Props {
  onClick: () => void; // Function to be called when the button is clicked
  variantBtn?: any; // Optional; the variant of the button, defaults to "default"
  btnText?: string; // Optional; text to be displayed on the button, defaults to "Add New"
  desc?: string; // Optional; a description or additional text
  className?: string; // Optional; additional CSS classes for styling
}
function EmptyWrapper({
  onClick,
  variantBtn = "default",
  btnText = "Add New",
  desc,
  className,
}: Props) {
  return (
    <Card className={`rounded-md  pt-5 ${className}`}>
      <div className="mx-auto flex flex-col items-center gap-3">
        <p className="text-muted-foreground font-14">{desc}</p>
        <Button
          variant={variantBtn || "default"}
          className="mb-5"
          onClick={() => onClick()}
        >
          <Plus className="h-4 w-4 mr-2" /> {btnText}
        </Button>
      </div>
      <Separator />
      <div className="flex justify-between px-4  items-center py-4">
        <p className="text-muted-foreground">0 row(s)</p>
        <div className="flex gap-3  pointer-events-none">
          <Button variant={"outline"} className="opacity-40">
            Previous{" "}
          </Button>

          <Button variant={"outline"} className="opacity-40">
            Next{" "}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default EmptyWrapper;
