import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingTextSwap } from "./LoadingTextSwap";
import { Button } from "./ui/button";
import { ReactNode, useState } from "react";

type DeleteDialogProps = {
  action: () => Promise<unknown>;
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function DeleteDialog({
  action,
  children,
  title,
  description,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    try {
      setIsLoading(true);
      await action();
      setOpen(false);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              "This action cannot be undone. This will permanently delete the record."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="bg-destructive hover:bg-destructive/80 cursor-pointer text-white"
            onClick={handleAction}
            disabled={isLoading}
          >
            <LoadingTextSwap isLoading={isLoading}>Delete</LoadingTextSwap>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
