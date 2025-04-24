import { useEffect } from "react";
import { toast } from "sonner";

type useErrorNotificationProps = {
  isError: boolean;
  title: string;
  description?: string;
};

export function useErrorNotification({
  isError,
  title,
  description,
}: useErrorNotificationProps) {
  useEffect(() => {
    if (isError) {
      toast.error(title, {
        description: description,
      });
    }
  }, [isError, title, description]);
}
