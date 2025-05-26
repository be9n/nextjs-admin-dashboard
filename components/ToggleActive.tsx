import { ApiError } from "@/types/global";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export default function ToggleActive({
  defaultChecked,
  onChange,
}: {
  defaultChecked: boolean;
  onChange: (active: boolean) => Promise<void>;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const [isPending, setIsPending] = useState(false);

  const handleChange = async (active: boolean) => {
    setChecked(active);
    setIsPending(true);

    try {
      await onChange(active);
      toast.success("Status updated successfully");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Something went wrong");
      setChecked(!active);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Switch
      className="data-[state=checked]:bg-green-500 cursor-pointer"
      checked={checked}
      onCheckedChange={handleChange}
      disabled={isPending}
    />
  );
}
