import { Button } from "./button";
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

interface ComponentProps {
  children?: React.ReactNode;
  title?: string;
  desc?: string;
  ctaText?: string;
  onClick: () => void;
}
export function ConfirmDialog({
  children,
  title,
  desc,
  ctaText,
  onClick,
}: ComponentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || "Confirm the action"}</DialogTitle>
          <DialogDescription className="pt-1">
            {desc || "Do you really want to delete?"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onClick}>{ctaText || "Delete"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
