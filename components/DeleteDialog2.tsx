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
import { ReactNode, useState, useTransition } from "react";

type DeleteDialog2Props = {
  action: () => Promise<unknown>;
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function DeleteDialog2({
  action,
  children,
  title,
  description,
}: DeleteDialog2Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAction = async () => {
    try {
      // Mark the state update as a transition to avoid blocking UI
      startTransition(async () => {
        await action();
        setOpen(false);
      });
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              "This action cannot be undone. This will permanently delete the record."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="bg-destructive hover:bg-destructive/80 cursor-pointer text-white"
            onClick={handleAction}
            disabled={isPending}
          >
            <LoadingTextSwap isLoading={isPending}>Delete</LoadingTextSwap>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
