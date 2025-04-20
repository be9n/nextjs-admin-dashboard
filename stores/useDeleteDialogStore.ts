import { create } from 'zustand';

interface DeleteDialogState {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: (() => void) | null;
  openDialog: (onConfirm: () => void) => void;
  closeDialog: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const useDeleteDialogStore = create<DeleteDialogState>((set) => ({
  isOpen: false,
  isLoading: false,
  onConfirm: null,
  openDialog: (onConfirm) => set({ isOpen: true, onConfirm }),
  closeDialog: () => set({ isLoading: false, isOpen: false, onConfirm: null }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useDeleteDialogStore;
