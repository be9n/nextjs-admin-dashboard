import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  import useDeleteDialogStore from '@/stores/useDeleteDialogStore';
  import { LoadingTextSwap } from './LoadingTextSwap';
import { Button } from './ui/button';
  
  export default function DeleteDialog() {
    const { isOpen, setIsLoading, isLoading, closeDialog, onConfirm } = useDeleteDialogStore();
  
    const handleConfirm = () => {
      if (onConfirm) {
        setIsLoading(true);
        onConfirm();
      }
    };
  
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the role.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog} disabled={isLoading} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleConfirm} disabled={isLoading}>
              <Button variant="destructive" className="bg-destructive hover:bg-destructive/80 cursor-pointer text-white">
                <LoadingTextSwap isLoading={isLoading}>Delete</LoadingTextSwap>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  