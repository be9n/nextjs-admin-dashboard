import React from "react";
import { Button } from "./ui/button";
import { LoadingTextSwap } from "./LoadingTextSwap";

type FormButtonsProps = {
  onCancel: () => void;
  isSubmitting: boolean;
};

export default function FormButtons({
  isSubmitting,
  onCancel,
}: FormButtonsProps) {
  return (
    <div className="flex gap-2 justify-end mt-4">
      <Button
        type="button"
        onClick={onCancel}
        className="bg-gray-400 hover:bg-gray-400/90 transition-colors cursor-pointer"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
        <LoadingTextSwap isLoading={isSubmitting}>Submit</LoadingTextSwap>
      </Button>
    </div>
  );
}
