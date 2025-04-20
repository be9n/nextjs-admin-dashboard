import {
  AlertDialog,
  AlertDialogAction,
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
import { ReactNode } from "react";

type DeleteDialog2Props = {
  action: () => void;
  isLoading: boolean;
  children: ReactNode;
};

export default function DeleteDialog2({
  isLoading,
  action,
  children,
}: DeleteDialog2Props) {
  return (
    <AlertDialog open={isLoading ? true : undefined}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the role.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={action} disabled={isLoading}>
            <Button
              variant="destructive"
              className="bg-destructive hover:bg-destructive/80 cursor-pointer text-white"
            >
              <LoadingTextSwap isLoading={isLoading}>Delete</LoadingTextSwap>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
